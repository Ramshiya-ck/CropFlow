from django.contrib import admin
from .models import User, Role, UserRole


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("email", "name", "manager", "is_active", "is_staff")
    search_fields = ("email", "name")
    list_filter = ("is_active",)


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(UserRole)
class UserRoleAdmin(admin.ModelAdmin):
    list_display = ("user", "role")
