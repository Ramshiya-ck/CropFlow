from rest_framework import serializers
from .models import Request, RequestDocument, RequestHistory, Asset


class AssetSerializer(serializers.ModelSerializer):
    assigned_to_email = serializers.EmailField(source="assigned_to.email", read_only=True)

    class Meta:
        model = Asset
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at"]



class RequestHistorySerializer(serializers.ModelSerializer):

    action_by_email = serializers.EmailField(
        source="action_by.email",
        read_only=True
    )

    class Meta:
        model = RequestHistory
        fields = [
            "id",
            "action",
            "comment",
            "action_by_email",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class RequestDocumentSerializer(serializers.ModelSerializer):

    class Meta:
        model = RequestDocument
        fields = ["id", "file", "uploaded_at"]
        read_only_fields = ["id", "uploaded_at"]


class RequestSerializer(serializers.ModelSerializer):

    history = RequestHistorySerializer(many=True, read_only=True)
    documents = RequestDocumentSerializer(many=True, read_only=True)
    created_by_email = serializers.EmailField(
        source="created_by.email",
        read_only=True,
    )
    current_step_role = serializers.SerializerMethodField()
    current_step_order = serializers.SerializerMethodField()

    class Meta:
        model = Request
        fields = "__all__"
        read_only_fields = ["id", "created_by", "status", "current_step_role", "current_step_order"]

    def get_current_step_role(self, obj):
        try:
            workflow = obj.workflow
            if workflow and workflow.current_step:
                return workflow.current_step.role_name
        except Exception:
            pass
        return None

    def get_current_step_order(self, obj):
        try:
            workflow = obj.workflow
            if workflow and workflow.current_step:
                return workflow.current_step.step_order
        except Exception:
            pass
        return None


class MyRequestDocumentSerializer(serializers.ModelSerializer):
    """
    Used for the employee "Uploaded Bills" list page.
    Adds request context next to each document row.
    """
    request_id = serializers.IntegerField(source="request.id", read_only=True)
    request_title = serializers.CharField(source="request.title", read_only=True)
    request_status = serializers.CharField(source="request.status", read_only=True)

    class Meta:
        model = RequestDocument
        fields = ["id", "request_id", "request_title", "request_status", "file", "uploaded_at"]
        read_only_fields = ["id", "uploaded_at"]


class MyRequestHistorySerializer(serializers.ModelSerializer):
    """
    Used for the employee "History" list page (across all their requests).
    """
    request_id = serializers.IntegerField(source="request.id", read_only=True)
    request_title = serializers.CharField(source="request.title", read_only=True)
    request_status = serializers.CharField(source="request.status", read_only=True)

    action_by_email = serializers.EmailField(
        source="action_by.email",
        read_only=True,
    )

    class Meta:
        model = RequestHistory
        fields = [
            "id",
            "request_id",
            "request_title",
            "request_status",
            "action",
            "comment",
            "action_by_email",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]
