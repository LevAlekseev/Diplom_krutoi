from rest_framework import viewsets, status, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError, PermissionDenied
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Course, Test, Question, Answer, TestResult, Achievement, UserAchievement, UserAnswer
from .serializers import (
    RegisterSerializer, CourseSerializer, CourseSubscribeSerializer,
    TestSerializer, TestResultSerializer, AchievementSerializer,
    TestCreateSerializer, UserSerializer, ProfileSerializer
)
from .api_config import StandardResultsSetPagination, CourseFilter, TestFilter

User = get_user_model()

class BaseAPIView(APIView):
    """Базовый класс для API представлений с общей функциональностью"""
    permission_classes = [IsAuthenticated]

    def handle_exception(self, exc):
        if isinstance(exc, ValidationError):
            return Response({'error': str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        if isinstance(exc, PermissionDenied):
            return Response({'error': str(exc)}, status=status.HTTP_403_FORBIDDEN)
        return super().handle_exception(exc)

# Регистрация
class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

# Профиль
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = ProfileSerializer(request.user)
        return Response(serializer.data)

# Курсы
class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = CourseFilter
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'title']

    def get_queryset(self):
        if self.request.user.role == 'teacher':
            return Course.objects.filter(teacher=self.request.user)
        return Course.objects.all()

    def perform_create(self, serializer):
        if self.request.user.role != 'teacher':
            raise PermissionDenied('Только преподаватели могут создавать курсы')
        serializer.save(teacher=self.request.user)

class MyCoursesViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'title']

    def get_queryset(self):
        return Course.objects.filter(enrolled_courses__student=self.request.user)

# Тесты
class TestViewSet(viewsets.ModelViewSet):
    serializer_class = TestSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = TestFilter
    search_fields = ['title']
    ordering_fields = ['created_at', 'title']

    def get_queryset(self):
        course_id = self.request.query_params.get('course_id')
        queryset = Test.objects.all()
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        return queryset

    def perform_create(self, serializer):
        if self.request.user.role != 'teacher':
            raise PermissionDenied('Только преподаватели могут создавать тесты')
        serializer.save()

class TestResultViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TestResultSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [OrderingFilter]
    ordering_fields = ['completed_at', 'score_awarded']

    def get_queryset(self):
        return TestResult.objects.filter(student=self.request.user)

class AchievementViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AchievementSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return Achievement.objects.filter(
            userachievement__user=self.request.user
        )

# Дополнительные представления
class EnrollCourseView(BaseAPIView):
    def post(self, request, pk):
        course = get_object_or_404(Course, pk=pk)
        
        if request.user.role != 'student':
            raise PermissionDenied('Только студенты могут записываться на курсы')
        
        if course.students.filter(id=request.user.id).exists():
            raise ValidationError('Вы уже записаны на этот курс')
        
        course.students.add(request.user)
        return Response({'message': 'Успешно записаны на курс'})

class PassTestView(BaseAPIView):
    def post(self, request, pk):
        test = get_object_or_404(Test, pk=pk)
        data = request.data
        mode = data.get("mode")
        answers = data.get("answers", {})
        time_spent = data.get("time_spent_seconds", 0)

        if TestResult.objects.filter(student=request.user, test=test).exists():
            raise ValidationError('Вы уже проходили этот тест')

        if not mode or mode not in ['fast', 'slow', 'normal']:
            raise ValidationError('Неверный режим прохождения теста')

        base_time = test.time_limit_minutes or 10
        total_questions = test.questions.count()
        correct = 0
        for q_id, a_value in answers.items():
            try:
                question = Question.objects.get(pk=q_id)
                if question.type == 'text':
                    correct_answer = question.answers.filter(is_correct=True).first()
                    if correct_answer and str(a_value).strip().lower() == correct_answer.text.strip().lower():
                        correct += 1
                else:
                    answer = Answer.objects.get(pk=a_value)
                    if answer.is_correct:
                        correct += 1
            except (Answer.DoesNotExist, Question.DoesNotExist):
                continue

        score = int((correct / total_questions) * test.points) if total_questions else 0
        result = TestResult.objects.create(
            test=test,
            student=request.user,
            time_spent_seconds=time_spent,
            correct_answers=correct,
            mode=mode,
            score_awarded=score,
            coins_awarded=test.coins
        )

        for q_id, a_value in answers.items():
            try:
                question = Question.objects.get(pk=q_id)
                if question.type == 'text':
                    UserAnswer.objects.create(
                        testresult=result,
                        question=question,
                        answer_text=a_value or ""
                    )
                else:
                    UserAnswer.objects.create(
                        testresult=result,
                        question=question,
                        answer_id=a_value
                    )
            except Question.DoesNotExist:
                continue

        return Response({
            "score": correct,
            "total": total_questions,
            "points": score,
            "coins": test.coins,
            "time": time_spent
        })
