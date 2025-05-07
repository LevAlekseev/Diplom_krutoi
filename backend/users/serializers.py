from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.validators import UniqueValidator
from .models import Course, Test, Question, Answer, TestResult, Achievement

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'middle_name', 'role')
        read_only_fields = ('id', 'role')

# Регистрация
class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    username = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(min_length=8, write_only=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    middle_name = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'role', 
                 'first_name', 'last_name', 'middle_name')
        read_only_fields = ('id',)

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Пароль должен содержать минимум 8 символов")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data['role'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            middle_name=validated_data.get('middle_name', '')
        )
        return user

# Курсы
class CourseSerializer(serializers.ModelSerializer):
    teacher = serializers.StringRelatedField()

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'teacher']

class CourseSubscribeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'title', 'description']

# Ответы (получение)
class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'text', 'is_correct']

# Вопросы (получение)
class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'type', 'answers']

# Тест (получение)
class TestSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    course = serializers.StringRelatedField()

    class Meta:
        model = Test
        fields = ['id', 'title', 'deadline', 'time_limit_minutes', 'points', 'coins', 'course', 'questions']

# Результаты теста
class TestResultSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)
    test = TestSerializer(read_only=True)
    mode_display = serializers.CharField(source='get_mode_display', read_only=True)

    class Meta:
        model = TestResult
        fields = ['id', 'test', 'student', 'completed_at', 'time_spent_seconds', 
                 'correct_answers', 'mode', 'mode_display', 'score_awarded', 'coins_awarded']
        read_only_fields = ['id', 'student', 'completed_at', 'score_awarded', 'coins_awarded']

    def validate(self, data):
        if data.get('time_spent_seconds', 0) < 0:
            raise serializers.ValidationError("Время выполнения не может быть отрицательным")
        if data.get('correct_answers', 0) < 0:
            raise serializers.ValidationError("Количество правильных ответов не может быть отрицательным")
        return data

# Достижения
class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ['id', 'name', 'description', 'test_count_required']

# Создание теста (вложенные сериализаторы)
class AnswerCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['text', 'is_correct']

class QuestionCreateSerializer(serializers.ModelSerializer):
    answers = AnswerCreateSerializer(many=True)

    class Meta:
        model = Question
        fields = ['text', 'type', 'answers']

class TestCreateSerializer(serializers.ModelSerializer):
    questions = QuestionCreateSerializer(many=True)

    class Meta:
        model = Test
        fields = ['title', 'course', 'deadline', 'time_limit_minutes', 'points', 'coins', 'questions']

    def validate(self, data):
        if data.get('time_limit_minutes', 0) <= 0:
            raise serializers.ValidationError("Время на выполнение теста должно быть положительным числом")
        if data.get('points', 0) <= 0:
            raise serializers.ValidationError("Количество баллов должно быть положительным числом")
        if data.get('coins', 0) < 0:
            raise serializers.ValidationError("Количество монет не может быть отрицательным")
        if not data.get('questions'):
            raise serializers.ValidationError("Тест должен содержать хотя бы один вопрос")
        return data

    def create(self, validated_data):
        questions_data = validated_data.pop('questions')
        test = Test.objects.create(**validated_data)
        
        for question_data in questions_data:
            answers_data = question_data.pop('answers')
            if not answers_data:
                raise serializers.ValidationError("Вопрос должен содержать хотя бы один ответ")
            
            question = Question.objects.create(test=test, **question_data)
            correct_answers = 0
            
            for answer_data in answers_data:
                if answer_data.get('is_correct'):
                    correct_answers += 1
                Answer.objects.create(question=question, **answer_data)
            
            if correct_answers == 0:
                raise serializers.ValidationError("Вопрос должен иметь хотя бы один правильный ответ")
        
        return test
