from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.validators import UniqueValidator
from .models import Course, Test, Question, Answer, TestResult, Achievement, CustomUser, Enrollment
from rest_framework import serializers

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'patronymic','last_name', 'role', 'school_class')
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
                 'first_name', 'last_name')
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
        extra_kwargs = {'id': {'read_only': True}}

class TestCreateSerializer(serializers.ModelSerializer):
    questions = QuestionCreateSerializer(many=True)
    course_id = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(),
        source='course'
    )

    class Meta:
        model = Test
        fields = ['title', 'course_id', 'deadline', 'time_limit_minutes', 'points', 'coins', 'questions']
        extra_kwargs = {'id': {'read_only': True}}

    def validate(self, data):
        if data.get('time_limit_minutes', 0) <= 0:
            raise serializers.ValidationError("Время на выполнение теста должно быть положительным числом")
        if data.get('coins', 0) < 0:
            raise serializers.ValidationError("Количество монет не может быть отрицательным")
        if not data.get('questions'):
            raise serializers.ValidationError("Тест должен содержать хотя бы один вопрос")
        return data

    def create(self, validated_data):
        questions_data = validated_data.pop('questions')
        # Автоматический расчет points: 10 базовых + 10 за каждый вопрос
        validated_data['points'] = 10 + (len(questions_data) * 10)
        test = Test.objects.create(**validated_data)
        
        # Получаем максимальный ID вопроса из базы данных
        max_question_id = Question.objects.all().order_by('-id').first()
        next_question_id = (max_question_id.id + 1) if max_question_id else 1
        
        for question_data in questions_data:
            answers_data = question_data.pop('answers')
            if not answers_data:
                raise serializers.ValidationError("Вопрос должен содержать хотя бы один ответ")
            
            # Создаем вопрос с новым ID
            question = Question.objects.create(
                id=next_question_id,
                test=test, 
                **question_data
            )
            next_question_id += 1
            
            correct_answers = 0
            for answer_data in answers_data:
                if answer_data.get('is_correct'):
                    correct_answers += 1
                Answer.objects.create(question=question, **answer_data)
            
            if correct_answers == 0:
                raise serializers.ValidationError("Вопрос должен иметь хотя бы один правильный ответ")
        
        return test

class SchoolClassShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = User.teacher_classes.rel.model
        fields = ['id', 'name']

class ProfileSerializer(serializers.ModelSerializer):
    coins = serializers.SerializerMethodField()
    points = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    diary = serializers.SerializerMethodField()
    top = serializers.SerializerMethodField()
    teacher_classes = SchoolClassShortSerializer(many=True, read_only=True)
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'school_class',
            'coins', 'points', 'rating', 'diary', 'top', 'shop_items', 'teacher_classes', 'avatar_url'
        ]

    def get_avatar_url(self, obj):
        return obj.avatar_url or '/avatar-teacher.png'

    def get_coins(self, obj):
        return sum(r.coins_awarded for r in obj.test_results.all())

    def get_points(self, obj):
        return sum(r.score_awarded for r in obj.test_results.all())

    def get_rating(self, obj):
        classmates = CustomUser.objects.filter(school_class=obj.school_class)
        classmates_points = [(u.id, sum(r.score_awarded for r in u.test_results.all())) for u in classmates]
        classmates_points.sort(key=lambda x: x[1], reverse=True)
        for idx, (uid, _) in enumerate(classmates_points, 1):
            if uid == obj.id:
                return f"{idx} / {len(classmates_points)}"
        return f"- / {len(classmates_points)}"

    def get_diary(self, obj):
        diary = []
        enrollments = Enrollment.objects.filter(student=obj)
        for enroll in enrollments:
            course = enroll.course
            tests = Test.objects.filter(course=course)
            grades = []
            for test in tests:
                result = TestResult.objects.filter(test=test, student=obj).order_by('-completed_at').first()
                if result:
                    grades.append(result.grade)
            diary.append({
                'subject': course.title,
                'grades': grades  # все оценки по всем тестам предмета
            })
        return diary

    def get_top(self, obj):
        classmates = CustomUser.objects.filter(school_class=obj.school_class)
        classmates_points = [
            {
                'rank': idx+1,
                'name': f"{u.first_name} {u.last_name}",
                'points': sum(r.score_awarded for r in u.test_results.all())
            }
            for idx, u in enumerate(sorted(classmates, key=lambda u: sum(r.score_awarded for r in u.test_results.all()), reverse=True))
        ]
        return classmates_points[:10]  # топ-10