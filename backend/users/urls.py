from django.urls import path
from .views import (
    RegisterView,
    ProfileView,
    CourseListCreateView,
    EnrollCourseView,
    MyCoursesView,
    TestListView,
    TestDetailView,
    MyTestResultsView,
    MyAchievementsView,
    PassTestView,
    TestCreateView, 
)

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='profile'),

    path('courses/', CourseListCreateView.as_view(), name='course-list-create'),
    path('courses/<int:pk>/enroll/', EnrollCourseView.as_view(), name='course-enroll'),
    path('my-courses/', MyCoursesView.as_view(), name='my-courses'),

    path('tests/', TestListView.as_view(), name='test-list'),              # GET список
    path('tests/create/', TestCreateView.as_view(), name='test-create'),  # POST создание
    path('tests/<int:pk>/', TestDetailView.as_view(), name='test-detail'),
    path('tests/<int:pk>/pass/', PassTestView.as_view(), name='pass-test'),

    path('my-results/', MyTestResultsView.as_view(), name='my-test-results'),
    path('my-achievements/', MyAchievementsView.as_view(), name='my-achievements'),
]
