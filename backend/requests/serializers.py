from rest_framework import serializers
from .models import Request, RequestDocument, RequestHistory


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

    class Meta:
        model = Request
        fields = "__all__"
        read_only_fields = ["id", "created_by", "status"]
