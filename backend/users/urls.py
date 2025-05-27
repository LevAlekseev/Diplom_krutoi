from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import ProfileView, MyTokenObtainPairView, ClassStudentListView

app_name = 'users'

# API v1
router_v1 = DefaultRouter()
router_v1.register(r'courses', views.CourseViewSet, basename='course')
router_v1.register(r'my-courses', views.MyCoursesViewSet, basename='my-courses')
router_v1.register(r'tests', views.TestViewSet, basename='test')
router_v1.register(r'my-results', views.TestResultViewSet, basename='my-results')
router_v1.register(r'my-achievements', views.AchievementViewSet, basename='my-achievements')

urlpatterns = [
    path('', include(router_v1.urls)),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('courses/<int:pk>/enroll/', views.EnrollCourseView.as_view(), name='enroll-course'),
    path('tests/<int:pk>/pass/', views.PassTestView.as_view(), name='pass-test'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('classes/<int:class_id>/students/', ClassStudentListView.as_view(), name='class-students'),
]
