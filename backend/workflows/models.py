from django.db import models
from requests.models import Request



class ApprovalFlow(models.Model):
    name = models.CharField(max_length=255)
    request_type = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.request_type}"
    

class WorkflowStep(models.Model):

    flow = models.ForeignKey(
        ApprovalFlow,
        on_delete=models.CASCADE,
        related_name='steps'
    )

    step_order = models.PositiveIntegerField()

    role_name = models.CharField(max_length=50)

    is_final = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.flow.name} - Step {self.step_order}"
    

class RequestWorkFlow(models.Model):
    request = models.OneToOneField(Request,on_delete=models.CASCADE,related_name='workflow')
    flow = models.ForeignKey(ApprovalFlow,on_delete=models.CASCADE)
    current_step = models.ForeignKey(
        WorkflowStep,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    started_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Request #{self.request.id} - {self.flow.name}"