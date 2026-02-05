from rest_framework import serializers
from .models import Request, RequestDocument, RequestHistory



class RequestSerializer(serializers.ModelSerializer):

    class Meta:
        model = Request
        fields = '__all__'
        read_only_fields = ['id', 'created_by', 'status']




class RequestDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequestDocument
        fields = ["id", "file", "uploaded_at"]
