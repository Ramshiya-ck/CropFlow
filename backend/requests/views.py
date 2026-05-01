from django.shortcuts import get_object_or_404

from rest_framework import generics, permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Request, RequestHistory, Asset
from .serializers import RequestSerializer, MyRequestDocumentSerializer, MyRequestHistorySerializer, AssetSerializer

from workflows.models import ApprovalFlow, WorkflowStep, RequestWorkFlow
from workflows.services import approve_request, reject_request

from rest_framework import viewsets, mixins
from rest_framework.parsers import MultiPartParser, FormParser
from .models import RequestDocument
from .serializers import RequestSerializer, RequestDocumentSerializer
from .permissions import IsEmployee, IsManager, IsRequestOwner, IsDocumentOwnerOrAdmin
from accounts.permissions import IsAdmin



class CreateRequestAPIView(generics.CreateAPIView):

    serializer_class = RequestSerializer
    permission_classes = [permissions.IsAuthenticated, IsEmployee]


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


class UploadRequestDocumentAPIView(APIView):

    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticated, IsRequestOwner]
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
    permission_classes = [permissions.IsAuthenticated, IsEmployee]
    serializer_class = RequestSerializer
    def get_queryset(self):
        return Request.objects.filter(created_by=self.request.user)
    
class RequestDetailAPIView(generics.RetrieveAPIView):
    """
    Allow:
    - Request owner (employee)
    - Approvers for the current workflow step (manager/admin/IT depending on roles)
    - Superusers
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = RequestSerializer
    queryset = Request.objects.all()

    def get_object(self):
        obj = super().get_object()
        user = self.request.user

        if user.is_superuser or obj.created_by == user:
            return obj

        # Allow approvers based on current workflow step role.
        # Request has a OneToOne relation named `workflow` (see workflows/models.py).
        try:
            wf = obj.workflow
        except Exception:
            wf = None

        step = getattr(wf, "current_step", None) if wf else None
        step_role = getattr(step, "role_name", None) if step else None

        # IT Admins can always view request details.
        if user.has_role("IT Admin") or user.has_role("it"):
            return obj

        if step_role and user.has_role(step_role):
            return obj

        from rest_framework.exceptions import PermissionDenied

        raise PermissionDenied("You do not have permission to view this request.")

class EmpolyeeDashboardAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsEmployee]


    def get(self, request):
        user = request.user

        qs = (
            Request.objects
            .filter(created_by=user)
            .order_by("-created_at")[:5]
        )

        serializer = RequestSerializer(qs, many=True)
        return Response(serializer.data)
    
    
# manager actions

class ManagerPendingApprovalsAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        # Get all role names for the current user
        user_roles = user.roles.values_list('role__name', flat=True)

        if not user_roles:
            return Response(
                {"message": "You do not have any approver roles."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Normalize roles
        user_roles_norm = {str(r).strip().lower() for r in user_roles if r}

        workflows = RequestWorkFlow.objects.select_related(
            "request",
            "current_step",
            "request__created_by",
            "request__created_by__manager"
        ).filter(
            request__status__in=['pending', 'in_review']
        )

        requests = []

        for wf in workflows:

            # Skip if no step
            if not wf.current_step:
                continue

            # Normalize step role
            step_role = str(wf.current_step.role_name).strip().lower()

            # 🔥 Manager Step Logic
            if step_role == 'manager' and 'manager' in user_roles_norm:

                employee = wf.request.created_by

                # Ensure employee exists
                if not employee:
                    continue

                # 🔑 FIX: Use manager_id for comparison
                if employee.manager_id == user.id:
                    requests.append(wf.request)

                # Optional fallback (unchanged behavior)
                elif employee.manager is None:
                    requests.append(wf.request)

            # 🔥 Other Roles (HR, Finance, IT)
            elif step_role in user_roles_norm:
                requests.append(wf.request)

        serializer = RequestSerializer(requests, many=True)
        return Response(serializer.data)

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

class ManagerPendingApprovalsAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        
        # Get all role names for the current user
        user_roles = user.roles.values_list('role__name', flat=True)
        
        if not user_roles:
            return Response(
                {"message": "You do not have any approver roles."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Case-insensitive match for step role names.
        user_roles_norm = {str(r).strip().lower() for r in user_roles if r}

        workflows = RequestWorkFlow.objects.select_related(
            "request",
            "current_step",
        ).filter(
            request__status__in=['pending','in_review']
        )

        # Filter in Python to avoid DB collation/casing issues with __in.
        requests = []
        for wf in workflows:
            if not wf.current_step:
                continue
            
            step_role = str(wf.current_step.role_name).strip().lower()
            
            # If the step is for a "manager", enforce direct manager relationship
            if step_role == 'manager':
                if wf.request.created_by.manager == user:
                    requests.append(wf.request)
                # Fallback: if user has explicit manager role and requester has no manager, allow
                elif wf.request.created_by.manager is None and 'manager' in user_roles_norm:
                    requests.append(wf.request)
            
            # Otherwise, use standard role-based access
            elif step_role in user_roles_norm:
                requests.append(wf.request)

        serializer = RequestSerializer(requests, many=True)
        return Response(serializer.data)


class RequestDocumentListAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, request_id):
        req = get_object_or_404(Request, pk=request_id)
        
        if not (request.user.is_superuser or request.user.has_role("IT Admin") or request.user.has_role("it") or req.created_by == request.user):
            return Response(
                {"detail": "You do not have permission to view these documents."},
                status=status.HTTP_403_FORBIDDEN
            )
            
        docs = req.documents.all()
        serializer = RequestDocumentSerializer(docs, many=True)
        return Response(serializer.data)


class AdminDashboardStatsAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get(self, request):
        from accounts.models import User
        total_users = User.objects.count()
        total_requests = Request.objects.count()
        pending_requests = Request.objects.filter(status='pending').count()
        approved_requests = Request.objects.filter(status='approved').count()
        rejected_requests = Request.objects.filter(status='rejected').count()

        dept_breakdown = {}
        for dept in ['HR', 'FINANCE', 'IT', 'GENERAL']:
            dept_breakdown[dept] = Request.objects.filter(department=dept).count()

        type_breakdown = {}
        types = Request.objects.values_list('request_type', flat=True).distinct()
        for t in types:
            type_breakdown[t] = Request.objects.filter(request_type=t).count()

        return Response({
            "total_users": total_users,
            "total": total_requests,
            "pending": pending_requests,
            "approved": approved_requests,
            "rejected": rejected_requests,
            "department_breakdown": dept_breakdown,
            "type_breakdown": type_breakdown,
        })


class ManagerDashboardStatsAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        
        # 1. Awaiting Decision (Pending for this manager)
        # Get all role names for the current user
        user_roles = user.roles.values_list('role__name', flat=True)
        user_roles_norm = {str(r).strip().lower() for r in user_roles if r}

        workflows = RequestWorkFlow.objects.select_related(
            "request",
            "current_step",
            "request__created_by"
        ).filter(
            request__status__in=['pending', 'in_review']
        )

        pending_count = 0
        for wf in workflows:
            if not wf.current_step:
                continue
            
            step_role = str(wf.current_step.role_name).strip().lower()
            
            # If the step is for a "manager", enforce direct manager relationship
            if step_role == 'manager':
                if wf.request.created_by.manager == user:
                    pending_count += 1
                elif wf.request.created_by.manager is None and 'manager' in user_roles_norm:
                    pending_count += 1
            
            # Otherwise, use standard role-based access
            elif step_role in user_roles_norm:
                pending_count += 1

        # 2. Team Submissions
        team_submissions_count = Request.objects.filter(created_by__manager=user).count()

        # 3. Monthly Rejections (from team)
        from django.utils import timezone
        first_day_of_month = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        monthly_rejections_count = Request.objects.filter(
            created_by__manager=user, 
            status='rejected',
            updated_at__gte=first_day_of_month
        ).count()

        return Response({
            "pending_count": pending_count,
            "team_submissions_count": team_submissions_count,
            "monthly_rejections_count": monthly_rejections_count,
        })


class RequestDocumentDeleteAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        doc = get_object_or_404(RequestDocument, pk=pk)
        
        # Checking request.created_by as the uploader because only the request owner can upload documents
        if not (request.user.is_superuser or request.user.has_role("IT Admin") or request.user.has_role("it") or doc.request.created_by == request.user):
            return Response(
                {"detail": "You do not have permission to delete this document."},
                status=status.HTTP_403_FORBIDDEN
            )
            
        doc.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class MyDocumentsAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsEmployee]

    def get(self, request):
        docs = (
            RequestDocument.objects
            .filter(request__created_by=request.user)
            .select_related("request")
            .order_by("-uploaded_at")
        )
        serializer = MyRequestDocumentSerializer(docs, many=True)
        return Response(serializer.data)


class MyHistoryAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsEmployee]

    def get(self, request):
        history = (
            RequestHistory.objects
            .filter(request__created_by=request.user)
            .select_related("request", "action_by")
            .order_by("-created_at")
        )
        serializer = MyRequestHistorySerializer(history, many=True)
        return Response(serializer.data)


# Department Dashboards

class DepartmentDashboardAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, department):
        # department should be HR, FINANCE, or IT
        dept = department.upper()
        if dept not in ['HR', 'FINANCE', 'IT']:
            return Response({"error": "Invalid department"}, status=400)
        
        # Verify user has a role related to this department
        user_roles = request.user.roles.values_list('role__name', flat=True)
        if dept.lower() not in [r.lower() for r in user_roles] and not request.user.is_superuser:
            return Response({"error": "Unauthorized access to this dashboard"}, status=403)

        # Only show requests that are currently assigned to this department's
        # workflow step. This prevents HR users from seeing Finance-step items
        # and then hitting a 403 on approve/reject.
        workflows = (
            RequestWorkFlow.objects
            .select_related("request", "current_step")
            .filter(
                current_step__isnull=False,
                request__status__in=["pending", "in_review"],
            )
            .order_by("-request__created_at")
        )

        dept_role = dept.lower()
        requests = [
            wf.request
            for wf in workflows
            if str(wf.current_step.role_name).strip().lower() == dept_role
        ]
        
        # Specialized data
        data = {
            "requests": RequestSerializer(requests, many=True).data,
        }

        if dept == 'IT':
            assets = Asset.objects.all()
            data["assets"] = AssetSerializer(assets, many=True).data
        
        if dept == 'HR':
            from accounts.models import User
            employees = User.objects.all().order_by("name")
            # Minimal employee info
            data["employees"] = [
                {"id": e.id, "name": e.name, "email": e.email}
                for e in employees
            ]

        return Response(data)

class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.has_role("it"):
            return Asset.objects.all()
        return Asset.objects.filter(assigned_to=user)


class AdminRequestViewSet(viewsets.ModelViewSet):
    queryset = Request.objects.all()
    serializer_class = RequestSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def perform_destroy(self, instance):
        # Additional cleanup if needed (documents, history)
        instance.delete()
