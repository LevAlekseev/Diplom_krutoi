from rest_framework.pagination import PageNumberPagination
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters import rest_framework as filters
from .models import Course, Test

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class CourseFilter(filters.FilterSet):
    title = filters.CharFilter(lookup_expr='icontains')
    teacher = filters.CharFilter(field_name='teacher__username', lookup_expr='icontains')
    
    class Meta:
        model = Course
        fields = ['title', 'teacher']

class TestFilter(filters.FilterSet):
    title = filters.CharFilter(lookup_expr='icontains')
    course = filters.NumberFilter()
    
    class Meta:
        model = Test
        fields = ['title', 'course']

API_SETTINGS = {
    'DEFAULT_PAGINATION_CLASS': 'users.api_config.StandardResultsSetPagination',
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_SEARCH_FIELDS': ['title', 'description'],
    'DEFAULT_ORDERING_FIELDS': ['created_at', 'title'],
} 