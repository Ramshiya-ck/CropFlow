from rest_framework.permissions import BasePermission

class HasRole(BasePermission):

    def has_permission(self, request, view):
        required_roles = getattr(view, "required_roles", [])

        if not required_roles:
            return True

        user_roles = request.user.roles.values_list(
            "role__name", flat=True
        )

        return any(role in user_roles for role in required_roles)
