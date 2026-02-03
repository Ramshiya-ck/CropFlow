from django.db import transaction
from requests.models import Request, RequestHistory
from accounts.models import UserRole


def approve_request(user, request_obj):

    with transaction.atomic():

        # Lock DB row
        locked_request = (
            Request.objects
            .select_for_update()
            .get(id=request_obj.id)
        )

        workflow = locked_request.workflow
        step = workflow.current_step

        # Role validation
        if not UserRole.objects.filter(user=user, role__name=step.role_name).exists():
            raise PermissionError("User not allowed to approve")

        # Move step
        next_step = (
            workflow.flow.steps
            .filter(step_order__gt=step.step_order)
            .order_by('step_order')
            .first()
        )

        if next_step:
            workflow.current_step = next_step
            workflow.save()

            locked_request.status = 'in_review'
            locked_request.save()

            action = "APPROVED_STEP"

        else:
            locked_request.status = 'approved'
            locked_request.save()

            action = "FINAL_APPROVED"

        # Audit history
        RequestHistory.objects.create(
            request=locked_request,
            action_by=user,
            action=action,
            comment="Approved"
        )

        return locked_request


def reject_request(user, request_obj, comment=""):

    with transaction.atomic():

        locked_request = (
            Request.objects
            .select_for_update()
            .get(id=request_obj.id)
        )

        workflow = locked_request.workflow
        step = workflow.current_step

        if not UserRole.objects.filter(user=user, role__name=step.role_name).exists():
            raise PermissionError("User not allowed to reject")

        locked_request.status = 'rejected'
        locked_request.save()

        RequestHistory.objects.create(
            request=locked_request,
            action_by=user,
            action="REJECTED",
            comment=comment
        )

        return locked_request
