from rest_framework import generics, status, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.validators import UniqueValidator
from django.contrib.auth import get_user_model
from django.utils import timezone

from .models import Course, Test, Question, Answer, TestResult, Achievement, UserAchievement
from .serializers import (
    RegisterSerializer, CourseSerializer, CourseSubscribeSerializer,
    TestSerializer, TestResultSerializer, AchievementSerializer,
    TestCreateSerializer
)

User = get_user_model()

# Регистрация
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

# Профиль
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "patronymic": user.patronymic,
        })

# Курсы
class CourseListCreateView(generics.ListCreateAPIView):
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'teacher':
            return Course.objects.filter(teacher=self.request.user)
        return Course.objects.all()

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)

class EnrollCourseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            course = Course.objects.get(pk=pk)
        except Course.DoesNotExist:
            return Response({'error': 'Course not found'}, status=404)

        if request.user.role != 'student':
            return Response({'error': 'Only students can enroll'}, status=403)

        course.students.add(request.user)
        return Response({'message': 'Enrolled successfully'})

class MyCoursesView(generics.ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.enrolled_courses.all()

# Тесты
class TestListView(generics.ListAPIView):
    serializer_class = TestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        course_id = self.request.query_params.get('course_id')
        queryset = Test.objects.all()
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        return queryset

class TestDetailView(generics.RetrieveAPIView):
    queryset = Test.objects.all()
    serializer_class = TestSerializer
    permission_classes = [IsAuthenticated]

class TestCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != 'teacher':
            return Response({'error': 'Only teachers can create tests.'}, status=403)

        serializer = TestCreateSerializer(data=request.data)
        if serializer.is_valid():
            test_data = serializer.validated_data
            questions_data = test_data.pop('questions')

            test = Test.objects.create(**test_data)

            for q_data in questions_data:
                answers = q_data.pop('answers')
                question = Question.objects.create(test=test, **q_data)
                for ans in answers:
                    Answer.objects.create(question=question, **ans)

            return Response({'message': 'Test created successfully'})
        return Response(serializer.errors, status=400)

# Прохождение теста
class PassTestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        user = request.user
        data = request.data
        mode = data.get("mode")
        answers = data.get("answers", {})

        try:
            test = Test.objects.get(pk=pk)
        except Test.DoesNotExist:
            return Response({"error": "Тест не найден"}, status=404)

        if TestResult.objects.filter(student=user, test=test).exists():
            return Response({"error": "Вы уже проходили этот тест"}, status=400)

        base_time = test.time_limit_minutes * 60
        multiplier = {"fast": 1.2, "slow": 0.8, "normal": 1.0}.get(mode, 1.0)
        time_limit = int(base_time * {"fast": 0.8, "slow": 1.2, "normal": 1.0}.get(mode, 1.0))

        correct = 0
        for q_id, a_id in answers.items():
            try:
                answer = Answer.objects.get(pk=a_id)
                if answer.is_correct:
                    correct += 1
            except Answer.DoesNotExist:
                continue

        total = test.questions.count()
        score = int(test.points * multiplier * (correct / total))
        coins = int(test.coins * multiplier * (correct / total))

        TestResult.objects.create(
            test=test, student=user,
            time_spent_seconds=time_limit,
            correct_answers=correct,
            mode=mode,
            score_awarded=score,
            coins_awarded=coins
        )

        passed_count = TestResult.objects.filter(student=user).count()
        for achievement in Achievement.objects.filter(test_count_required__lte=passed_count):
            UserAchievement.objects.get_or_create(user=user, achievement=achievement)

        return Response({
            "correct": correct,
            "total": total,
            "score_awarded": score,
            "coins_awarded": coins,
            "message": "Тест пройден"
        })

# Результаты и достижения
class MyTestResultsView(generics.ListAPIView):
    serializer_class = TestResultSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TestResult.objects.filter(student=self.request.user)

class MyAchievementsView(generics.ListAPIView):
    serializer_class = AchievementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.user_achievements.values_list('achievement', flat=True)
