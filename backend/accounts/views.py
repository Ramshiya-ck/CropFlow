from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .permissions import IsAdmin
from .models import User, Feature, RolePermission, Role, UserRole
from .serializers import (
    RegisterSerializer, UserSerializer, FeatureSerializer, 
    RolePermissionSerializer, CustomTokenSerializer
)
from rest_framework_simplejwt.views import TokenObtainPairView


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenSerializer


class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]


class UserUpdateView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def perform_update(self, serializer):
        role_name = self.request.data.get("role")
        user = serializer.save()
        if role_name:
            role, _ = Role.objects.get_or_create(name=role_name.lower())
            UserRole.objects.filter(user=user).delete() # Simple case: one role
            UserRole.objects.create(user=user, role=role)


class FeatureListView(generics.ListCreateAPIView):
    queryset = Feature.objects.all()
    serializer_class = FeatureSerializer
    permission_classes = [IsAuthenticated, IsAdmin]


class RolePermissionListView(generics.ListAPIView):
    queryset = RolePermission.objects.all()
    serializer_class = RolePermissionSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_queryset(self):
        # Ensure RolePermission rows exist for all role/feature pairs so
        # the admin panel can show newly added features immediately.
        roles = list(Role.objects.all())
        features = list(Feature.objects.all())

        if roles and features:
            role_ids = [r.id for r in roles]
            feature_ids = [f.id for f in features]

            existing_pairs = set(
                RolePermission.objects.filter(role__in=role_ids, feature__in=feature_ids)
                .values_list("role_id", "feature_id")
            )

            default_access = {
                "admin": None,  # special-case: enable all
                "employee": {"Create Request", "Status Tracking", "Request History", "Uploaded Bills"},
                "manager": {"Approve Workflow", "Team Request", "Request Detail"},
                "it": {"Asset Provisioning", "Device Assignment", "Software Request", "Security Checks"},
                "hr": {"Leave Approval", "Employee History", "Policy Checks", "Final Clearance"},
            }

            to_create = []
            for role in roles:
                rn = (role.name or "").lower()
                for feature in features:
                    key = (role.id, feature.id)
                    if key in existing_pairs:
                        continue

                    if rn == "admin":
                        can_access = True
                    else:
                        allowed = default_access.get(rn, set())
                        can_access = feature.name in allowed

                    to_create.append(
                        RolePermission(role=role, feature=feature, can_access=can_access)
                    )

            if to_create:
                RolePermission.objects.bulk_create(to_create)

        role_name = self.request.query_params.get("role")
        if role_name:
            return self.queryset.filter(role__name__iexact=role_name)
        return self.queryset


class RolePermissionUpdateView(generics.UpdateAPIView):
    queryset = RolePermission.objects.all()
    serializer_class = RolePermissionSerializer
    permission_classes = [IsAuthenticated, IsAdmin]


class MyPermissionsView(generics.ListAPIView):
    serializer_class = RolePermissionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_role_ids = list(self.request.user.roles.values_list("role", flat=True))

        # If new features/roles were added after existing users were created,
        # RolePermission rows may be missing. Create missing rows using defaults
        # so the frontend can show correct menus immediately.
        role_names = list(
            Role.objects.filter(id__in=user_role_ids).values_list("name", flat=True)
        )
        role_names_lower = {r.lower() for r in role_names if r}

        features = list(Feature.objects.all())

        existing_pairs = set(
            RolePermission.objects.filter(role__in=user_role_ids, feature__in=features)
            .values_list("role_id", "feature_id")
        )

        default_access = {
            "admin": None,  # special-case: enable all
            "employee": {"Create Request", "Status Tracking", "Request History", "Uploaded Bills"},
            "manager": {"Approve Workflow", "Team Request", "Request Detail"},
            "it": {"Asset Provisioning", "Device Assignment", "Software Request", "Security Checks"},
            "hr": {"Leave Approval", "Employee History", "Policy Checks", "Final Clearance"},
        }

        to_create = []
        for role in Role.objects.filter(id__in=user_role_ids):
            rn = role.name.lower() if role.name else ""
            for feature in features:
                key = (role.id, feature.id)
                if key in existing_pairs:
                    continue

                if rn == "admin":
                    can_access = True
                else:
                    allowed = default_access.get(rn, set())
                    can_access = feature.name in allowed

                to_create.append(
                    RolePermission(role=role, feature=feature, can_access=can_access)
                )

        if to_create:
            RolePermission.objects.bulk_create(to_create)

        return RolePermission.objects.filter(role__in=user_role_ids, can_access=True)