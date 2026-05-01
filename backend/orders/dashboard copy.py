from django.db.models import Sum,Count,Prefetch, F, Q
from django.contrib.auth.models import User
from .models import Order
from django.db.models.functions import TruncDate
import json
from datetime import timedelta
from django.utils import timezone

from products.models import ProductVariant
from base.utils import format_inr

def custom_dashboard_callback(request, context):

    # --- 1. KPI CARDS DATA (Purana wala same rahega) ---
    # 1. Calculate Total Revenue
    revenue_data = Order.objects.filter(is_paid=True).aggregate(Sum("total_amount"))
    total_revenue = revenue_data["total_amount__sum"] or 0

    # 2. Calculate Total Orders 
    total_orders = Order.objects.count()

    # 3. Active Customer
    active_customers = User.objects.filter(is_active=True, is_staff=False).count()

    cancelled_orders = Order.objects.filter(status="Cancelled").count()


    # --- 📈 2. SALES GRAPH DATA (Last 7 Days) ---
    today = timezone.now().date()
    seven_days_ago = today - timedelta(days=6)

    daily_sales_query = Order.objects.filter(
        is_paid=True,
        created_at__date__gte=seven_days_ago
    ).annotate(
        date=TruncDate('created_at')
    ).values('date').annotate(
        daily_total=Sum('total_amount')
    )

    # Isko ek dictionary me daal diya taaki dhoondhne me aasaani ho
    sales_dict = {item['date']: item['daily_total'] for item in daily_sales_query}

    sales_dates = []
    sales_amounts = []

    for i in range(6,-1,-1) : 
        target_date = today - timedelta(days=i)
        sales_dates.append(target_date.strftime("%d %b"))
        sales_amounts.append(float(sales_dict.get(target_date, 0)))

    # --- 🍩 3. ORDER STATUS DATA ---
    status_counts = Order.objects.values('status').annotate(count=Count('uid'))
    status_labels = [item['status'] for item in status_counts]
    status_data = [item['count'] for item in status_counts]


    # --- 🛒 4. Recent Orders (Last 5 orders) ---
    recent_orders = Order.objects.order_by("-created_at")[:5]

    low_stock_products = ProductVariant.objects.filter(stock_qty__lt=5).select_related(
        'product'
    ).prefetch_related(
        "images"
    ).order_by("stock_qty")[:6]

    print(low_stock_products) 

 
    context.update(
        {
            "kpi": [
                {
                    "title": "💰  Total Revenue",
                    "icon" : "",
                    "metric": format_inr(total_revenue),  # Automatically comma lagayega jaise ₹10,500.00
                    "footer": "Based on paid orders",
                },
                {
                    "title": "📦 Total Orders",
                    "icon" : "",
                    "metric": str(total_orders),
                    "footer": "All time orders",
                },
                {
                    "title": "👥 Active Customers",
                    "icon" : "",
                    "metric": str(active_customers),
                    "footer": "Registered active users",
                },
                {
                    "title": "Cancelled Order",
                    "icon" : """<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16"><g fill="none"><path fill="url(#SVGsnLKuclu)" d="M14 11.5v-6l-6-1l-6 1v6A2.5 2.5 0 0 0 4.5 14h7a2.5 2.5 0 0 0 2.5-2.5"/><path fill="url(#SVGiKRiGrgs)" d="M14 11.5v-6l-6-1l-6 1v6A2.5 2.5 0 0 0 4.5 14h7a2.5 2.5 0 0 0 2.5-2.5"/><path fill="url(#SVGQ6eZxbxt)" fill-opacity="0.3" d="M14 11.5v-6l-6-1l-6 1v6A2.5 2.5 0 0 0 4.5 14h7a2.5 2.5 0 0 0 2.5-2.5"/><path fill="url(#SVGcmZJ0daa)" d="M14 4.5A2.5 2.5 0 0 0 11.5 2h-7A2.5 2.5 0 0 0 2 4.5V6h12z"/><path fill="url(#SVGcMyDreJk)" d="M16 11.5a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0"/><path fill="url(#SVGrH9wycoR)" fill-rule="evenodd" d="M9.646 9.646a.5.5 0 0 1 .708 0l1.146 1.147l1.146-1.147a.5.5 0 0 1 .708.708L12.207 11.5l1.147 1.146a.5.5 0 0 1-.708.708L11.5 12.207l-1.146 1.147a.5.5 0 0 1-.708-.708l1.147-1.146l-1.147-1.146a.5.5 0 0 1 0-.708" clip-rule="evenodd"/><defs><linearGradient id="SVGsnLKuclu" x1="6.286" x2="9.327" y1="4.5" y2="13.987" gradientUnits="userSpaceOnUse"><stop stop-color="#b3e0ff"/><stop offset="1" stop-color="#8cd0ff"/></linearGradient><linearGradient id="SVGiKRiGrgs" x1="9.286" x2="11.025" y1="8.386" y2="16.154" gradientUnits="userSpaceOnUse"><stop stop-color="#dcf8ff" stop-opacity="0"/><stop offset="1" stop-color="#ff6ce8" stop-opacity="0.7"/></linearGradient><linearGradient id="SVGcmZJ0daa" x1="2.482" x2="4.026" y1="2" y2="8.725" gradientUnits="userSpaceOnUse"><stop stop-color="#0094f0"/><stop offset="1" stop-color="#2764e7"/></linearGradient><linearGradient id="SVGcMyDreJk" x1="8.406" x2="14.313" y1="7.563" y2="16.281" gradientUnits="userSpaceOnUse"><stop stop-color="#f83f54"/><stop offset="1" stop-color="#ca2134"/></linearGradient><linearGradient id="SVGrH9wycoR" x1="9.977" x2="11.771" y1="11.652" y2="13.518" gradientUnits="userSpaceOnUse"><stop stop-color="#fdfdfd"/><stop offset="1" stop-color="#fecbe6"/></linearGradient><radialGradient id="SVGQ6eZxbxt" cx="0" cy="0" r="1" gradientTransform="rotate(88.796 -.559 12.407)scale(6.79696 6.61452)" gradientUnits="userSpaceOnUse"><stop offset=".497" stop-color="#4a43cb"/><stop offset="1" stop-color="#4a43cb" stop-opacity="0"/></radialGradient></defs></g></svg>""",
                    "metric": str(cancelled_orders),
                    "footer": "",
                },
            ],
            "sales_dates" : json.dumps(sales_dates),
            "sales_amounts" : json.dumps(sales_amounts), 
            "status_labels" : json.dumps(status_labels),
            "status_data" : json.dumps(status_data),
            "recent_orders" : recent_orders,
            "low_stock_products" : low_stock_products,
        }
    )

    return context
