from accounts.models import Role, Feature, RolePermission

def seed_data():
    roles = ['admin', 'employee', 'manager', 'finance']
    for role_name in roles:
        Role.objects.get_or_create(name=role_name)

    features = [
        ('Create Request', 'Ability to create new workflow requests'),
        ('Approve Workflow', 'Ability to approve or reject requests'),
        ('View Reports', 'Access to financial and operational reports'),
        ('Manage Users', 'Admin ability to manage user roles and permissions'),
    ]

    for feat_name, feat_desc in features:
        feature, _ = Feature.objects.get_or_create(name=feat_name, description=feat_desc)
        
        # Link to roles (default permissions)
        for role_name in roles:
            role = Role.objects.get(name=role_name)
            can_access = False
            
            if role_name == 'admin':
                can_access = True
            elif role_name == 'employee' and feat_name == 'Create Request':
                can_access = True
            elif role_name == 'manager' and feat_name in ['Approve Workflow', 'Create Request']:
                can_access = True
            elif role_name == 'finance' and feat_name == 'View Reports':
                can_access = True
                
            RolePermission.objects.get_or_create(role=role, feature=feature, defaults={'can_access': can_access})

    print("Seeding complete!")

if __name__ == "__main__":
    import os
    import django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    django.setup()
    seed_data()
