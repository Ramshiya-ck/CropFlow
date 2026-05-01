from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, LoginView, UserListView, UserUpdateView, 
    FeatureListView, RolePermissionListView, RolePermissionUpdateView,
    MyPermissionsView, RoleViewSet, AdminUserViewSet, GroupViewSet
)
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r"admin/roles", RoleViewSet, basename="admin-roles")
router.register(r"admin/users-full", AdminUserViewSet, basename="admin-users-full")
router.register(r"admin/groups", GroupViewSet, basename="admin-groups")

urlpatterns = [
    path("", include(router.urls)),
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("refresh/", TokenRefreshView.as_view()),

    # Admin Dashboard Endpoints (Legacy/Specific)
    path("admin/users/", UserListView.as_view()),
    path("admin/users/<int:pk>/", UserUpdateView.as_view()),
    path("admin/features/", FeatureListView.as_view()),
    path("admin/permissions/", RolePermissionListView.as_view()),
    path("admin/permissions/<int:pk>/", RolePermissionUpdateView.as_view()),
    path("my-permissions/", MyPermissionsView.as_view()),
]