from django.urls import path
from .views import RegisterView, ProfileView
from .views import CourseListCreateView
from .views import EnrollCourseView, MyCoursesView

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('courses/', CourseListCreateView.as_view(), name='course-list-create'),
    path('courses/<int:pk>/enroll/', EnrollCourseView.as_view(), name='course-enroll'),
    path('my-courses/', MyCoursesView.as_view(), name='my-courses'),

]
