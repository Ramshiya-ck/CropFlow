from django.contrib import admin
from .models import Request, RequestHistory


class RequestHistoryInline(admin.TabularInline):
    model = RequestHistory
    extra = 0


@admin.register(Request)
class RequestAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'request_type',
        'created_by',
        'status',
        'created_at'
    )

    inlines = [RequestHistoryInline]

    list_filter = ('status', 'request_type')

