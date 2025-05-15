from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models
from django.utils import timezone

class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email and not username:
            raise ValueError("У пользователя должен быть email или username")
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(username, email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True, null=True, blank=True)
    username = models.CharField(max_length=150, unique=True, null=True, blank=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    patronymic = models.CharField(max_length=150, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    school_class = models.CharField(max_length=10, choices=[
        ("1А", "1А"), ("1Б", "1Б"), ("1В", "1В"),
        ("2А", "2А"), ("2Б", "2Б"), ("2В", "2В"),
    ], default="1А")

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    objects = CustomUserManager()

    def __str__(self):
        return self.username or self.email

class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    teacher = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='created_courses')

    def __str__(self):
        return self.title

class Test(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='tests')
    title = models.CharField(max_length=255)
    deadline = models.DateTimeField()
    time_limit_minutes = models.PositiveIntegerField()
    points = models.IntegerField()
    coins = models.IntegerField()

    def __str__(self):
        return f"{self.title} ({self.course.title})"

class Question(models.Model):
    TEST_TYPES = [
        ('text', 'Text answer'),
        ('choice', 'Multiple choice'),
    ]

    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    type = models.CharField(max_length=10, choices=TEST_TYPES)

    def __str__(self):
        return self.text

class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.text} ({'✓' if self.is_correct else '✗'})"

class TestResult(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='results')
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='test_results')
    completed_at = models.DateTimeField(auto_now_add=True)
    time_spent_seconds = models.IntegerField()
    correct_answers = models.IntegerField()
    mode = models.CharField(max_length=10, choices=[('normal', 'Normal'), ('fast', 'Fast'), ('slow', 'Slow')])
    score_awarded = models.IntegerField()
    coins_awarded = models.IntegerField()

    def __str__(self):
        return f"{self.student.username} - {self.test.title}"

class Achievement(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    test_count_required = models.PositiveIntegerField()

    def __str__(self):
        return self.name

class UserAchievement(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='user_achievements')
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    date_earned = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} → {self.achievement.name}"

class Enrollment(models.Model):
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    date_joined = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student} -> {self.course}"
