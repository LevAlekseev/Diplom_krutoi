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

from .models import Course, Test, Question, Answer, TestResult, Achievement, UserAchievement
from .serializers import (
    RegisterSerializer, CourseSerializer, CourseSubscribeSerializer,
    TestSerializer, TestResultSerializer, AchievementSerializer,
    TestCreateSerializer, UserSerializer
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
class ProfileView(BaseAPIView):
    def get(self, request):
        serializer = UserSerializer(request.user)
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
        return self.request.user.enrolled_courses.all()

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

        if TestResult.objects.filter(student=request.user, test=test).exists():
            raise ValidationError('Вы уже проходили этот тест')

        if not mode or mode not in ['fast', 'slow', 'normal']:
            raise ValidationError('Неверный режим прохождения теста')

        base_time = test.time_limit_minutes * 60
        multiplier = {"fast": 1.2, "slow": 0.8, "normal": 1.0}[mode]
        time_limit = int(base_time * {"fast": 0.8, "slow": 1.2, "normal": 1.0}[mode])

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

        result = TestResult.objects.create(
            test=test,
            student=request.user,
            time_spent_seconds=time_limit,
            correct_answers=correct,
            mode=mode,
            score_awarded=score,
            coins_awarded=coins
        )

        # Проверка достижений
        passed_count = TestResult.objects.filter(student=request.user).count()
        for achievement in Achievement.objects.filter(test_count_required__lte=passed_count):
            UserAchievement.objects.get_or_create(user=request.user, achievement=achievement)

        return Response({
            "correct": correct,
            "total": total,
            "score_awarded": score,
            "coins_awarded": coins,
            "message": "Тест успешно пройден"
        })
