from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ApprovalFlowViewSet, WorkflowStepViewSet, AdminWorkFlowViewSet

router = DefaultRouter()
router.register(r'flows', ApprovalFlowViewSet, basename='flow')
router.register(r'admin/instances', AdminWorkFlowViewSet, basename='admin-workflow-instances')

urlpatterns = [
    path('', include(router.urls)),
    path('flows/<int:flow_id>/steps/', WorkflowStepViewSet.as_view({'post': 'create'}), name='step-create'),
    path('steps/<int:pk>/', WorkflowStepViewSet.as_view({'delete': 'destroy'}), name='step-destroy'),
]
