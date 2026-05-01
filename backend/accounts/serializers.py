from rest_framework import serializers
from .models import User, Feature, RolePermission, Role, UserRole
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)
    role = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ["id", "email", "name", "password", "role"]

    def create(self, validated_data):
        # Security: Force default role to 'employee' regardless of frontend input
        role_name = "employee"

        user = User.objects.create_user(
            email=validated_data["email"],
            name=validated_data["name"],
            password=validated_data["password"]
        )

        from .models import Role, UserRole
        role, _ = Role.objects.get_or_create(name=role_name)
        UserRole.objects.create(user=user, role=role)

        # Ensure RolePermission rows exist for this role so the admin matrix
        # can show/toggle access immediately (especially for new roles like IT/HR).
        for feature in Feature.objects.all():
            can_access = False
            if role_name == "admin":
                can_access = True
            elif role_name == "employee" and feature.name in [
                "Create Request",
                "Status Tracking",
                "Request History",
                "Uploaded Bills",
            ]:
                can_access = True
            elif role_name == "finance" and feature.name in [
                "View Reports", "Asset Approval", "Travel Approval", 
                "Invoice Review", "Budget Monitoring", "Payment Management"
            ]:
                can_access = True
            elif role_name == "it" and feature.name in [
                "Asset Provisioning", "Device Assignment", 
                "Software Request", "Security Checks"
            ]:
                can_access = True
            elif role_name == "hr" and feature.name in [
                "Leave Approval", "Employee History", 
                "Policy Checks", "Final Clearance"
            ]:
                can_access = True

            RolePermission.objects.get_or_create(
                role=role,
                feature=feature,
                defaults={"can_access": can_access},
            )

        return user


class UserSerializer(serializers.ModelSerializer):
    roles = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "email", "name", "roles", "is_active"]

    def get_roles(self, obj):
        return list(obj.roles.values_list("role__name", flat=True))


class FeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feature
        fields = "__all__"


class RolePermissionSerializer(serializers.ModelSerializer):
    feature_name = serializers.ReadOnlyField(source="feature.name")
    role_name = serializers.ReadOnlyField(source="role.name")

    class Meta:
        model = RolePermission
        fields = ["id", "role", "role_name", "feature", "feature_name", "can_access"]


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ["id", "name"]


class AdminUserSerializer(serializers.ModelSerializer):
    roles = serializers.SerializerMethodField()
    manager_name = serializers.ReadOnlyField(source="manager.name")
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            "id", "email", "name", "roles", "manager", "manager_name",
            "is_active", "is_staff", "is_superuser", "password"
        ]

    def get_roles(self, obj):
        return list(obj.roles.values_list("role__name", flat=True))


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        from django.contrib.auth.models import Group
        model = Group
        fields = ["id", "name"]


class CustomTokenSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):

        data = super().validate(attrs)

        data["user"] = {
            "id": self.user.id,
            "email": self.user.email,
            "name": self.user.name,
            "roles": list(self.user.roles.values_list("role__name", flat=True))
        }

        return data