from rest_framework import serializers
from .models import User, Feature, RolePermission
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)
    role = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ["id", "email", "name", "password", "role"]

    def create(self, validated_data):
        role_name = validated_data.pop("role", "employee").lower()

        user = User.objects.create_user(
            email=validated_data["email"],
            name=validated_data["name"],
            password=validated_data["password"]
        )

        from .models import Role, UserRole
        role, _ = Role.objects.get_or_create(name=role_name)
        UserRole.objects.create(user=user, role=role)

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

    class Meta:
        model = RolePermission
        fields = ["id", "role", "feature", "feature_name", "can_access"]


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