from rest_framework import serializers
from .models import ApprovalFlow, WorkflowStep, RequestWorkFlow

class WorkflowStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkflowStep
        fields = ['id', 'flow', 'step_order', 'role_name', 'is_final']
        read_only_fields = ['flow'] # We will inject flow within the view

class ApprovalFlowSerializer(serializers.ModelSerializer):
    steps = WorkflowStepSerializer(many=True, read_only=True)

    class Meta:
        model = ApprovalFlow
        fields = ['id', 'name', 'request_type', 'is_active', 'created_at', 'updated_at', 'steps']
