from django.db.models import Sum,Count,Prefetch, F, Q
from django.contrib.auth.models import User
from .models import Order,OrderItem
from django.db.models.functions import TruncDate
import json
from datetime import timedelta
from django.utils import timezone

from products.models import ProductVariant
from base.utils import format_inr

def custom_dashboard_callback(request, context):

    # --- 🍩 1. ORDER STATUS DATA (Doughnut chart ke liye) ---
    status_counts = Order.objects.values('status').annotate(count=Count('uid'))
    status_labels = [item['status'] for item in status_counts]
    status_data = [item['count'] for item in status_counts]

    # --- 🛒 2. Recent Orders & Low Stock (Static Data) ---
    recent_orders = Order.objects.order_by("-created_at")[:5]
    
    low_stock_products = ProductVariant.objects.filter(stock_qty__lt=5).select_related(
        'product'
    ).prefetch_related(
        "images"
    ).order_by("stock_qty")[:6]

    context.update(
        {
            "status_labels" : json.dumps(status_labels),
            "status_data" : json.dumps(status_data),
            "recent_orders" : recent_orders,
            "low_stock_products" : low_stock_products,
        }
    )

    return context