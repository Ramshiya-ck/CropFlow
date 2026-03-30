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
        user_roles = self.request.user.roles.values_list("role", flat=True)
        return RolePermission.objects.filter(role__in=user_roles, can_access=True)