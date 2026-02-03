from django.contrib import admin
from .models import ApprovalFlow, WorkflowStep, RequestWorkFlow


class WorkflowStepInline(admin.TabularInline):
    model = WorkflowStep
    extra = 1


@admin.register(ApprovalFlow)
class ApprovalFlowAdmin(admin.ModelAdmin):

    list_display = ('name', 'request_type', 'is_active')
    inlines = [WorkflowStepInline]


admin.site.register(RequestWorkFlow)
