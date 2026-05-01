import logging
from django.db import transaction
from requests.models import Request, RequestHistory
from accounts.models import UserRole

logger = logging.getLogger(__name__)

def approve_request(user, request_obj):
    """
    Moves the request through its workflow steps.
    - Validates user role against current step.
    - Transitions to next step if available.
    - Marks as 'approved' only after the final step.
    """
    with transaction.atomic():
        # Lock DB row for consistency
        locked_request = Request.objects.select_for_update().get(id=request_obj.id)
        
        try:
            workflow = locked_request.workflow
        except Request.workflow.RelatedObjectDoesNotExist:
            logger.error(f"Request {locked_request.id} has no associated workflow.")
            raise ValueError("No workflow found for this request")

        current_step = workflow.current_step
        if not current_step:
            logger.warning(f"Request {locked_request.id} is in an orphan state (no current step).")
            raise ValueError("Workflow has no active step")

        # 1. Role Authorization Check
        role_name = current_step.role_name
        # Use existing has_role logic for clean validation
        if not user.has_role(role_name):
            logger.warning(f"User {user.email} attempted to approve Step '{role_name}' without proper role.")
            raise PermissionError(f"Unauthorized: Required role is {role_name}")

        logger.info(f"Approving Step: {current_step.step_order} ({role_name}) for Request {locked_request.id}")

        # 2. Find Next Step
        next_step = (
            workflow.flow.steps
            .filter(step_order__gt=current_step.step_order)
            .order_by('step_order')
            .first()
        )

        history_action = "STEP_APPROVED"
        comment = f"Approved at step {current_step.step_order} ({role_name})"

        if next_step:
            # Transition to next step
            logger.info(f"Transitioning Request {locked_request.id} from Step {current_step.step_order} to Step {next_step.step_order} ({next_step.role_name})")
            workflow.current_step = next_step
            workflow.save()
            
            # Status remains 'in_review' for intermediate steps
            locked_request.status = 'in_review'
            locked_request.save()
        else:
            # Final step reached
            logger.info(f"Final Step {current_step.step_order} reached for Request {locked_request.id}. Marking as APPROVED.")
            locked_request.status = 'approved'
            locked_request.save()
            
            history_action = "FINAL_APPROVED"
            comment = "Workflow completed successfully"

        # 3. Record Audit History
        RequestHistory.objects.create(
            request=locked_request,
            action_by=user,
            action=history_action,
            comment=comment
        )

        return locked_request


def reject_request(user, request_obj, comment=""):
    """
    Terminates the workflow and marks the request as rejected.
    """
    with transaction.atomic():
        locked_request = Request.objects.select_for_update().get(id=request_obj.id)
        
        try:
            workflow = locked_request.workflow
        except Request.workflow.RelatedObjectDoesNotExist:
            raise ValueError("No workflow found for this request")

        current_step = workflow.current_step
        if not current_step:
            raise ValueError("Workflow has no active step")

        # 1. Role Authorization Check
        if not user.has_role(current_step.role_name):
            raise PermissionError(f"Unauthorized: Required role is {current_step.role_name}")

        # 2. Update Status
        logger.info(f"Rejecting Request {locked_request.id} at Step {current_step.step_order} ({current_step.role_name})")
        locked_request.status = 'rejected'
        locked_request.save()

        # 3. Record Audit History
        RequestHistory.objects.create(
            request=locked_request,
            action_by=user,
            action="REJECTED",
            comment=comment or f"Rejected at step {current_step.step_order} ({current_step.role_name})"
        )

        return locked_request
