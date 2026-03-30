from django.urls import path
from .views import (
    RegisterView, LoginView, UserListView, UserUpdateView, 
    FeatureListView, RolePermissionListView, RolePermissionUpdateView,
    MyPermissionsView
)
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [

    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("refresh/", TokenRefreshView.as_view()),

    # Admin Dashboard Endpoints
    path("admin/users/", UserListView.as_view()),
    path("admin/users/<int:pk>/", UserUpdateView.as_view()),
    path("admin/features/", FeatureListView.as_view()),
    path("admin/permissions/", RolePermissionListView.as_view()),
    path("admin/permissions/<int:pk>/", RolePermissionUpdateView.as_view()),
    path("my-permissions/", MyPermissionsView.as_view()),
]