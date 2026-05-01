from django.urls import path
from .views import (
    CreateRequestAPIView, ApproveRequestAPIView, RejectRequestAPIView, 
    UploadRequestDocumentAPIView, RequestsListAPIView, RequestDetailAPIView, 
    EmpolyeeDashboardAPIView, ManagerPendingApprovalsAPIView, 
    RequestDocumentListAPIView, MyDocumentsAPIView, MyHistoryAPIView,
    DepartmentDashboardAPIView, AssetViewSet, AdminDashboardStatsAPIView,
    AdminRequestViewSet, ManagerDashboardStatsAPIView
)
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'assets', AssetViewSet, basename='asset')
router.register(r'admin/requests-full', AdminRequestViewSet, basename='admin-requests')

urlpatterns = [
    path('my/', RequestsListAPIView.as_view()),
    path('my-documents/', MyDocumentsAPIView.as_view()),
    path('my-history/', MyHistoryAPIView.as_view()),
    path('<int:request_id>/documents/', RequestDocumentListAPIView.as_view()),
    path('create/', CreateRequestAPIView.as_view()),
    path("<int:pk>/upload/", UploadRequestDocumentAPIView.as_view()),
    path("<int:pk>/", RequestDetailAPIView.as_view()),
    path("index/", EmpolyeeDashboardAPIView.as_view()),

# Manager Actions
    path('approve/<int:pk>/', ApproveRequestAPIView.as_view()),
    path('reject/<int:pk>/', RejectRequestAPIView.as_view()),
    path('pending-for-me/',ManagerPendingApprovalsAPIView.as_view()),
    path('dashboard/<str:department>/', DepartmentDashboardAPIView.as_view()),
    path('admin-stats-dashboard/', AdminDashboardStatsAPIView.as_view()),
    path('manager-stats/', ManagerDashboardStatsAPIView.as_view()),
]

urlpatterns += router.urls
