from rest_framework import serializers
from .models import Request, RequestHistory


class RequestSerializer(serializers.ModelSerializer):

    class Meta:
        model = Request
        fields = '__all__'
        read_only_fields = ['id', 'created_by', 'status']
