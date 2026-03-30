from rest_framework.permissions import BasePermission

from .models import RolePermission

class HasRole(BasePermission):
    def has_permission(self, request, view):
        required_roles = getattr(view, "required_roles", [])
        if not required_roles:
            return True
        if not request.user or not request.user.is_authenticated:
            return False
        user_roles = request.user.roles.values_list("role__name", flat=True)
        return any(role in user_roles for role in required_roles)


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return (
            request.user.is_superuser or 
            request.user.roles.filter(role__name__iexact="admin").exists()
        )


class HasFeatureAccess(BasePermission):
    def has_permission(self, request, view):
        feature_name = getattr(view, "required_feature", None)
        if not feature_name:
            return True
        if not request.user or not request.user.is_authenticated:
            return False
        
        user_roles = request.user.roles.all()
        return RolePermission.objects.filter(
            role__in=[ur.role for ur in user_roles],
            feature__name=feature_name,
            can_access=True
        ).exists()
