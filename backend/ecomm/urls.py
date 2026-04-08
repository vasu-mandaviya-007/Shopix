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

# 1. Default admin index ko save kar lo
original_index = admin.site.index

# 2. Apna custom function banao
def custom_admin_index(request, extra_context=None):
    extra_context = extra_context or {}
    
    # Aaj ki date nikalo
    today = timezone.now().date()
    
    # Logic 1: Aaj ke total orders
    orders_today = Order.objects.filter(created_at__date=today)
    
    # Logic 2: Aaj ki total sales (Sirf paid orders ka sum)
    sales_today = orders_today.filter(is_paid=True).aggregate(Sum('total_amount'))['total_amount__sum'] or 0
    
    # Logic 3: Out of stock items
    out_of_stock_count = ProductVariant.objects.filter(stock_qty__lte=0).count()

    # Data ko context me daal do taaki HTML me use kar sakein
    extra_context["sales_today"] = sales_today
    extra_context["orders_today"] = orders_today.count()
    extra_context["out_of_stock"] = out_of_stock_count

    # Ab wapas default admin page render kar do (apne naye data ke saath)
    return original_index(request, extra_context)

# 3. Django ko bolo ki ab se humara function use kare
admin.site.index = custom_admin_index
# urls.py me 'admin.site.index = custom_admin_index' ke theek niche ye likh dein:
admin.site.index_template = "admin/custom_dashboard.html"

urlpatterns = [
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
