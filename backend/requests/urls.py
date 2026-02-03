from django.urls import path
from .views import CreateRequestAPIView, ApproveRequestAPIView,RejectRequestAPIView

urlpatterns = [
    path('create/', CreateRequestAPIView.as_view()),
    path('approve/<int:pk>/', ApproveRequestAPIView.as_view()),
    path('reject/<int:pk>/', RejectRequestAPIView.as_view())
]
