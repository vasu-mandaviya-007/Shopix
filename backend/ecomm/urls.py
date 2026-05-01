from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.utils import timezone
from django.db.models import Sum

from orders.models import Order
from products.models import ProductVariant

def health_check(request):
    return JsonResponse({"status": "ok"}, status=200)

admin.site.site_header = "Shopix Admin"
admin.site.site_title = "Shopix Portal"
admin.site.index_title = "Shopix Dashboard"

urlpatterns = [
    path('i18n/', include('django.conf.urls.i18n')),
    path("admin/", admin.site.urls),
    path("", health_check),
    path("ckeditor/", include("ckeditor_uploader.urls")),
    path("api/auth/", include("accounts.urls")),
    path("api/products/", include("products.urls")),
    path("api/categories/", include("categories.urls")),
    path("api/cart/", include("cart.urls")),
    path("api/orders/", include("orders.urls")),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += [
        path("__reload__/", include("django_browser_reload.urls")),
    ]
