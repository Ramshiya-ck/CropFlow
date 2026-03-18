from django.urls import path
from .views import (
    CreateRequestAPIView, ApproveRequestAPIView, RejectRequestAPIView, 
    UploadRequestDocumentAPIView, RequestsListAPIView, RequestDetailAPIView, 
    EmpolyeeDashboardAPIView, ManagerPendingApprovalsAPIView, 
    RequestDocumentListAPIView
)

urlpatterns = [
    path('my/', RequestsListAPIView.as_view()),
    path('<int:request_id>/documents/', RequestDocumentListAPIView.as_view()),
    path('create/', CreateRequestAPIView.as_view()),
    path("<int:pk>/upload/", UploadRequestDocumentAPIView.as_view()),
    path("<int:pk>/", RequestDetailAPIView.as_view()),
    path("index/", EmpolyeeDashboardAPIView.as_view()),

# Manager Actions
    path('approve/<int:pk>/', ApproveRequestAPIView.as_view()),
    path('reject/<int:pk>/', RejectRequestAPIView.as_view()),
    path('pending-for-me/',ManagerPendingApprovalsAPIView.as_view())
]
