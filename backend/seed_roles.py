def seed_data():
    from accounts.models import Role, Feature, RolePermission
    roles = ['admin', 'employee', 'manager', 'finance', 'it', 'hr']
    for role_name in roles:
        Role.objects.get_or_create(name=role_name)

    features = [
        # Employee features
        ('Create Request', 'Ability to create new workflow requests'),
        ('Status Tracking', 'Track request status'),
        ('Request History', 'View request approval timeline'),
        ('Uploaded Bills', 'View uploaded request documents'),

        # HR features
        ('Leave Approval', 'Ability to approve or reject leave requests'),
        ('Employee History', 'View full employment and request history'),
        ('Policy Checks', 'Digital checklist for corporate policies'),
        ('Final Clearance', 'Manage employee exit/clearance workflow'),

        # Finance features
        ('Asset Approval', 'Review and approve asset purchase requests'),
        ('Travel Approval', 'Review and approve travel expense requests'),
        ('Invoice Review', 'Review and flag invoices for payment'),
        ('Budget Monitoring', 'View budget flags and spend analytics'),
        ('Payment Management', 'Update payment status for approved invoices'),

        # IT features
        ('Asset Provisioning', 'Setup and prepare hardware/software for users'),
        ('Device Assignment', 'Link serial numbers to specific users'),
        ('Software Request', 'Manage software license requests'),
        ('Security Checks', 'Security audit and compliance monitoring'),

        # Admin/others
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
            elif role_name == 'employee' and feat_name in [
                'Create Request',
                'Status Tracking',
                'Request History',
                'Uploaded Bills',
            ]:
                can_access = True
            elif role_name == 'manager' and feat_name in [
                'Approve Workflow',
                'Team Request',
                'Request Detail',
            ]:
                can_access = True
            elif role_name == 'finance' and feat_name in [
                'View Reports',
                'Asset Approval',
                'Travel Approval',
                'Invoice Review',
                'Budget Monitoring',
                'Payment Management',
            ]:
                can_access = True
            elif role_name == 'hr' and feat_name in [
                'Leave Approval',
                'Employee History',
                'Policy Checks',
                'Final Clearance',
            ]:
                can_access = True
            elif role_name == 'it' and feat_name in [
                'Asset Provisioning',
                'Device Assignment',
                'Software Request',
                'Security Checks',
            ]:
                can_access = True
                
            RolePermission.objects.get_or_create(role=role, feature=feature, defaults={'can_access': can_access})

    print("Seeding complete!")

if __name__ == "__main__":
    import os
    import django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'corpflow.settings')
    django.setup()
    seed_data()
