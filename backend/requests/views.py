from django.shortcuts import get_object_or_404

from rest_framework import generics, permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Request, RequestHistory
from .serializers import RequestSerializer

from workflows.models import ApprovalFlow, WorkflowStep, RequestWorkFlow
from workflows.services import approve_request, reject_request

from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from .models import RequestDocument



class CreateRequestAPIView(generics.CreateAPIView):

    serializer_class = RequestSerializer
    permission_classes = [permissions.IsAuthenticated]


    def perform_create(self, serializer):

        request_obj = serializer.save(
            created_by=self.request.user,
            status='pending'
        )

        RequestHistory.objects.create(
            request=request_obj,
            action_by=self.request.user,
            action='CREATED',
            comment='Request submitted'
        )

        flow = ApprovalFlow.objects.filter(
            request_type=request_obj.request_type,
            is_active=True
        ).first()

        if not flow:
            raise ValidationError("No workflow configured for this request type")

        first_step = flow.steps.order_by('step_order').first()

        if not first_step:
            raise ValidationError("Workflow has no steps configured")

        RequestWorkFlow.objects.create(
            request=request_obj,
            flow=flow,
            current_step=first_step
        )


class ApproveRequestAPIView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):

        req = get_object_or_404(Request, pk=pk)

        try:
            approve_request(request.user, req)
            return Response(
                {"detail": "Approved successfully"},
                status=status.HTTP_200_OK
            )

        except PermissionError:
            return Response(
                {"detail": "Not allowed to approve"},
                status=status.HTTP_403_FORBIDDEN
            )


class RejectRequestAPIView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):

        req = get_object_or_404(Request, pk=pk)
        comment = request.data.get("comment", "")

        try:
            reject_request(request.user, req, comment)

            return Response(
                {"detail": "Rejected successfully"},
                status=status.HTTP_200_OK
            )

        except PermissionError:
            return Response(
                {"detail": "Not allowed to reject"},
                status=status.HTTP_403_FORBIDDEN
            )



class UploadRequestDocumentAPIView(APIView):

    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, pk):

        req = get_object_or_404(Request, pk=pk)

        file = request.FILES.get("file")

        if not file:
            return Response({"error": "No file uploaded"}, status=400)

        doc = RequestDocument.objects.create(
            request=req,
            file=file
        )

        return Response(
            {"id": doc.id, "file": doc.file.url},
            status=201
        )

class RequestsListAPIView(generics.ListAPIView):
    serializer_class = RequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Request.objects.filter(created_by=self.request.user)