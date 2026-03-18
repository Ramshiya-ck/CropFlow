from rest_framework import viewsets, mixins
from rest_framework.permissions import BasePermission
from django.shortcuts import get_object_or_404
from .models import ApprovalFlow, WorkflowStep
from .serializers import ApprovalFlowSerializer, WorkflowStepSerializer

class IsAdminOrIT(BasePermission):
    """
    Permission class to allow only superusers or IT Admins.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.is_superuser or request.user.has_role("IT Admin") or request.user.has_role("Super Admin")

class ApprovalFlowViewSet(viewsets.ModelViewSet):
    queryset = ApprovalFlow.objects.all()
    serializer_class = ApprovalFlowSerializer
    permission_classes = [IsAdminOrIT]

class WorkflowStepViewSet(mixins.CreateModelMixin, mixins.DestroyModelMixin, viewsets.GenericViewSet):
    queryset = WorkflowStep.objects.all()
    serializer_class = WorkflowStepSerializer
    permission_classes = [IsAdminOrIT]

    def perform_create(self, serializer):
        flow_id = self.kwargs.get('flow_id')
        flow = get_object_or_404(ApprovalFlow, id=flow_id)
        serializer.save(flow=flow)
