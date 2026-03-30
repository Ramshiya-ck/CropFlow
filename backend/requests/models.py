from django.db import models
from django.conf import settings


class Request(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('in_review', 'In Review'),
    ]
    DEPARTMENT_CHOICES = [
        ('HR', 'HR'),
        ('FINANCE', 'Finance'),
        ('IT', 'IT'),
        ('GENERAL', 'General'),
    ]
    title = models.CharField(max_length=255)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='requests')
    request_type = models.CharField(max_length=100)
    department = models.CharField(
        max_length=20, choices=DEPARTMENT_CHOICES, default='GENERAL'
    )
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    data = models.JSONField() # dynamic 
    

    def __str__(self):
        return f"{self.department} - {self.request_type} - {self.title}"

class Asset(models.Model):
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('assigned', 'Assigned'),
        ('maintenance', 'Maintenance'),
    ]
    name = models.CharField(max_length=255)
    asset_type = models.CharField(max_length=100) # e.g. Laptop, Software, Monitor
    serial_number = models.CharField(max_length=255, unique=True, null=True, blank=True)
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assets'
    )
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='available'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.asset_type}) - {self.status}"

class RequestDocument(models.Model):

    request = models.ForeignKey(
        Request,
        on_delete=models.CASCADE,
        related_name="documents"
    )

    file = models.FileField(upload_to="request_docs/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Doc for Request {self.request.id}"



class RequestHistory(models.Model):
    request = models.ForeignKey(Request, on_delete=models.CASCADE, related_name='history')
    action_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True)
    action = models.CharField(max_length=100)
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Request {self.request.id} - {self.action} by {self.action_by.email if self.action_by else 'System'}"


