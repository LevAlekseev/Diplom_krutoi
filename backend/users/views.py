from django.shortcuts import render
from rest_framework import generics
from .serializers import RegisterSerializer
from .serializers import CourseSerializer
from django.contrib.auth import get_user_model
from .models import Course
from rest_framework.permissions import IsAuthenticated


User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role
        })

class CourseListCreateView(generics.ListCreateAPIView):
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'teacher':
            return Course.objects.filter(teacher=user)
        return Course.objects.all()

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, status
from .models import Course
from .serializers import CourseSubscribeSerializer, CourseSerializer

class EnrollCourseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            course = Course.objects.get(pk=pk)
        except Course.DoesNotExist:
            return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)

        if request.user.role != 'student':
            return Response({'error': 'Only students can enroll'}, status=status.HTTP_403_FORBIDDEN)

        course.students.add(request.user)
        return Response({'message': 'Enrolled successfully'}, status=status.HTTP_200_OK)


class MyCoursesView(generics.ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.enrolled_courses.all()


from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Course

class EnrollCourseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        user = request.user
        if user.role != 'student':
            return Response({'detail': 'Только студенты могут записываться на курс.'}, status=status.HTTP_403_FORBIDDEN)

        try:
            course = Course.objects.get(pk=pk)
        except Course.DoesNotExist:
            return Response({'detail': 'Курс не найден.'}, status=status.HTTP_404_NOT_FOUND)

        course.students.add(user)
        return Response({'detail': 'Вы успешно записались на курс.'}, status=status.HTTP_200_OK)
