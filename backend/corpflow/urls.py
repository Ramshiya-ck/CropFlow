from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from requests.views import RequestDocumentDeleteAPIView
from django.urls import include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/requests/', include('requests.urls')),
    path('api/workflows/', include('workflows.urls')),
    path('api/documents/<int:pk>/', RequestDocumentDeleteAPIView.as_view()),

]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
