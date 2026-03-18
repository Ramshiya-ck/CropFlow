from rest_framework.permissions import BasePermission


class IsEmployee(BasePermission):
    """
    Allow only employees
    """

    def has_permission(self, request, view):
        return request.user.has_role("Employee")


class IsManager(BasePermission):
    """
    Allow only managers
    """

    def has_permission(self, request, view):
        return request.user.has_role("Manager")


class IsRequestOwner(BasePermission):
    """
    Allow only owner of request
    """

    def has_object_permission(self, request, view, obj):
        return obj.created_by == request.user

class IsRequestOwnerOrAdmin(BasePermission):
    """
    Allow only owner of request or admin
    """
    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser or request.user.has_role("IT Admin"):
            return True
        return obj.created_by == request.user

class IsDocumentOwnerOrAdmin(BasePermission):
    """
    Allow only owner of the related request or admin
    """
    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser or request.user.has_role("IT Admin"):
            return True
        return obj.request.created_by == request.user