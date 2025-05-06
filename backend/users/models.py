from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Ученик'),
        ('teacher', 'Учитель'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    def __str__(self):
        return f"{self.username} ({self.role})"


from django.conf import settings


class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    teacher = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='courses')
    students = models.ManyToManyField(CustomUser, related_name='enrolled_courses', blank=True)

    def __str__(self):
        return self.title
