import json
from django.views.decorators.cache import cache_page
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from cart.models import Cart
from .models import Order, OrderItem
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Address 
from .serializers import AddressSerializer
import stripe
from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.template.loader import get_template
from django.db import utils
from xhtml2pdf import pisa


from orders.serializers import OrderSerializer
from products.models import ProductImage

stripe.api_key = settings.STRIPE_SECRET_KEY

from django.utils import timezone
from datetime import timedelta,datetime
from django.db.models import Sum, Count,F,Q
from django.db.models.functions import TruncDate

from django.http import JsonResponse
from products.models import ProductVariant # 👈 Apne app ke hisaab se change karein

from .utils import generate_order_invoice_pdf
from django.contrib.admin.views.decorators import staff_member_required

from django.db import transaction


@staff_member_required # Sirf admin/staff hi download kar paye
def dashboard_invoice_api(request, order_uid):
    # 1. Order aur uske items DB se fetch karein
    order = Order.objects.get(uid=order_uid)
    
    response = generate_order_invoice_pdf(order)
    
    # 2. Error Handling
    if response is None:
        return HttpResponse('Error generating PDF', status=500)
    
    return response

@cache_page(60 * 5)
def dashboard_api(request): 
    start_date_str = request.GET.get('start_date')
    end_date_str = request.GET.get('end_date')
    filter_days = int(request.GET.get('days', 7))
    
    base_orders = Order.objects.all()
    base_items = OrderItem.objects.all()

    # 🔥 CUSTOM DATE RANGE LOGIC
    if start_date_str and end_date_str:
        try:
            # String ko Date me convert karein
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
            
            # Timezone trap se bachne ke liye Local Time lagayein
            local_tz = timezone.get_current_timezone()
            start_datetime = timezone.make_aware(datetime.combine(start_date, datetime.min.time()), local_tz)
            end_datetime = timezone.make_aware(datetime.combine(end_date, datetime.max.time()), local_tz)

            base_orders = base_orders.filter(created_at__gte=start_datetime, created_at__lte=end_datetime)
            base_items = base_items.filter(order__created_at__gte=start_datetime, order__created_at__lte=end_datetime)
        except ValueError:
            pass # Agar date format galat ho toh code crash na ho

    elif filter_days == 1:

        local_now = timezone.localtime(timezone.now())        
        today_date = local_now.replace(hour=0, minute=0, second=0, microsecond=0)

        print(today_date)
        base_orders = base_orders.filter(created_at__date=today_date)
        base_items = base_items.filter(order__created_at__date=today_date)
    elif filter_days > 1:
        local_now = timezone.localtime(timezone.now())
        start_date = local_now.date() - timedelta(days=filter_days)
        base_orders = base_orders.filter(created_at__date__gte=start_date)
        base_items = base_items.filter(order__created_at__date__gte=start_date)

    valid_orders = base_orders.filter(is_paid=True).exclude(
        Q(status__icontains='cancel') | Q(status__icontains='return')
    )
    valid_items = base_items.filter(order__is_paid=True).exclude(
        Q(order__status__icontains='cancel') | Q(order__status__icontains='return')
    )

    # 1. Revenue & Profit
    profit_aggregation = valid_items.filter(order__is_paid=True).aggregate(
        total_revenue=Sum(F('price') * F('quantity')), 
        total_cost=Sum(F('cost_price') * F('quantity'))
    )
    total_revenue = profit_aggregation['total_revenue'] or 0
    net_profit = total_revenue - (profit_aggregation['total_cost'] or 0)
    
    # 2. Loss & Orders Count
    loss_aggregation = base_orders.filter(
        Q(status__icontains='cancel') | Q(status__icontains='return')
    ).aggregate(total_loss_amount=Sum('total_amount'))
    total_loss = loss_aggregation['total_loss_amount'] or 0
    total_orders_count = valid_orders.exclude(status="Pending").count()

    # 🚀 NAYE METRICS YAHAN HAIN 🚀
    
    # 3. Average Order Value (AOV)
    aov = (total_revenue / total_orders_count) if total_orders_count > 0 else 0
    
    # 4. Pending / To-Ship Orders
    # pending_orders = base_orders.filter(Q(status__icontains='paid') | Q(status__icontains='processing')).count()
    pending_orders = base_orders.filter(
        Q(status__icontains='paid') | Q(status__icontains='processing'),
        is_paid=True,
    ).count()
    
    # 5. Return Rate Percentage (%)
    gross_paid_orders = base_orders.filter(is_paid=True).count()
    returned_orders_count = base_orders.filter(Q(status__icontains='cancel') | Q(status__icontains='return')).count()
    return_rate = (returned_orders_count / gross_paid_orders * 100) if gross_paid_orders > 0 else 0
    
    # 6. Active Customers (Ye global rahega, days filter ka ispe asar nahi hoga)
    active_customers = User.objects.filter(is_active=True, is_staff=False).count()

    # --- Graph Logic ---
    daily_sales_query = valid_orders.annotate(
        sale_date=TruncDate('created_at')
    ).values('sale_date').annotate(daily_total=Sum('total_amount')).order_by('sale_date')
    
    sales_dates, sales_amounts = [], []
    daily_sales_map = {item['sale_date']: item['daily_total'] for item in daily_sales_query}

    if start_date_str and end_date_str:
        # Custom dates ke beech ke saare din graph pe dikhayein
        delta = end_date - start_date
        for i in range(delta.days + 1):
            target_date = start_date + timedelta(days=i)
            sales_dates.append(target_date.strftime("%d %b"))
            sales_amounts.append(float(daily_sales_map.get(target_date, 0)))
            
    elif filter_days > 0:
        local_today_date = timezone.localtime(timezone.now()).date()
        for i in range(filter_days - 1, -1, -1):
            target_date = local_today_date - timedelta(days=i)
            sales_dates.append(target_date.strftime("%d %b"))
            sales_amounts.append(float(daily_sales_map.get(target_date, 0)))
    else:
        for item in daily_sales_query:
            sales_dates.append(item['sale_date'].strftime("%d %b %y"))
            sales_amounts.append(float(item['daily_total']))

    # --- Top Products ---
    top_products_query = valid_items.filter(order__is_paid=True).values(
        'product__uid', 'product__product__uid', 'product__product__title',
    ).annotate(product_revenue=Sum(F('price') * F('quantity'))).order_by('-product_revenue')[:5]

    top_variant_ids = [item['product__uid'] for item in top_products_query]
    main_images = ProductImage.objects.filter(variant_id__in=top_variant_ids, is_main=True)
    image_dict = {img.variant_id: img.image.url for img in main_images if img.image}

    top_products_list = [
        {
            "uid": row['product__product__uid'],
            "title": f"{row['product__product__title']}",
            "revenue": float(row['product_revenue']),
            "image": image_dict.get(row['product__uid'], "") 
        } for row in top_products_query
    ]

    # --- Top States ---
    top_states_query = base_orders.filter(is_paid=True).values('state').annotate(state_total=Sum('total_amount')).order_by('-state_total')[:5]
    top_states_list = [{"state_name": row['state'] or "Unknown", "total_sales": float(row['state_total'])} for row in top_states_query]

    # ⏱️ FEATURE 3: LIVE ACTIVITY FEED LOGIC
    activities = []
    
    # 1. Recent Orders (Naye aur Cancelled)
    recent_orders = Order.objects.all().order_by('-created_at')[:4]
    for o in recent_orders:
        if 'cancel' in o.status.lower() or 'return' in o.status.lower():
            activities.append({
                "message": f"Order #{o.uid} was {o.status.lower()}",
                "timestamp": o.created_at,
                "icon": "cancel",
                "css_class": "bg-rose-100 text-rose-600 dark:bg-rose-500/10! dark:text-rose-400!"
            })
        else:
            activities.append({
                "message": f"New order #{o.uid} placed for ₹{o.total_amount}",
                "timestamp": o.created_at,
                "icon": "shopping_cart",
                "css_class": "bg-blue-100 text-blue-600 dark:bg-blue-500/10! dark:text-blue-400!"
            })
            
    # 2. New Users Registration
    recent_users = User.objects.filter(is_staff=False).order_by('-date_joined')[:2]
    for u in recent_users:
        activities.append({
            "message": f"New customer '{u.first_name or u.username}' registered",
            "timestamp": u.date_joined,
            "icon": "person_add",
            "css_class": "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10! dark:text-emerald-400!"
        })
        
    # 3. Low Stock Alerts
    low_stocks = ProductVariant.objects.filter(stock_qty__lt=5).order_by('stock_qty')[:2]
    for ls in low_stocks:
        activities.append({
            "message": f"Stock alert: '{ls.product.title[:15]}...' is below 5",
            # Stock alert ko humesha top pe rakhne ke liye current time de rahe hain
            "timestamp": timezone.now(), 
            "icon": "warning",
            "css_class": "bg-orange-100 text-orange-600 dark:bg-orange-500/10! dark:text-orange-400!"
        })
        
    # Sabko Time ke hisaab se sort karein (Sabse naya sabse upar)
    activities.sort(key=lambda x: x['timestamp'], reverse=True)
    
    # JSON ke liye DateTime ko string me convert karein
    formatted_activities = []
    for act in activities[:6]: # Sirf top 6 dikhayenge
        formatted_activities.append({
            "message": act["message"],
            "time_iso": act["timestamp"].isoformat(), # Isko JS '2 mins ago' me badlega
            "icon": act["icon"],
            "css_class": act["css_class"]
        })

    # ✅ NAYE KEYS ADD KAR DIYE HAIN
    return JsonResponse({
        "total_revenue": total_revenue, 
        "net_profit": net_profit, 
        "total_orders": total_orders_count,
        "total_loss": total_loss,
        "aov": aov,
        "pending_orders": pending_orders,
        "return_rate": return_rate,
        "active_customers": active_customers,
        "sales_dates": sales_dates, 
        "sales_amounts": sales_amounts,
        "top_products": top_products_list,
        "top_states": top_states_list,
        "activities": formatted_activities,
    })

@csrf_exempt
def update_order_status(request, order_id):
    if request.method == 'POST':
        data = json.loads(request.body)
        order = Order.objects.get(uid=order_id)
        order.status = data.get('status')
        order.save()
        return JsonResponse({"status": "success"})

def get_product_price(request, product_id):
    try:
        product = ProductVariant.objects.get(uid=product_id)
        return JsonResponse({
            "price": product.price, # Ya jo bhi aapki price field ka naam ho
            "original_price": getattr(product, 'original_price', product.price) 
        })
    except ProductVariant.DoesNotExist:
        return JsonResponse({"error": "Not found"}, status=404)


# ========================================================================
# 1. Address Section
# ========================================================================


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def get_addresses(request):

    try:

        addresses = Address.objects.filter(user=request.user)
        return Response(
            {
                "success": "true",
                "addresses": AddressSerializer(addresses, many=True).data,
            }
        )

    except Exception as e:
        print(e)
        return Response(
            {
                "success": "false",
                "error": str(e),
                "message": "Failed to fetch addresses",
            },
            status=500,
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_address(request):
    try:

        serializer = AddressSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response({"success": "true", "address": serializer.data})
        else:
            return Response(
                {"success": "false", "errors": serializer.errors}, status=400
            )

    except Exception as e:
        print("address error : ", e)
        return Response(
            {"success": "false", "error": str(e), "message": "Failed to add address"},
            status=500,
        )


@api_view(["PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def manage_address_details(request, address_uid):

    try:

        address = get_object_or_404(Address, uid=address_uid, user=request.user)

        if request.method == "PUT":
            serializer = AddressSerializer(address, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({"success": True, "address": serializer.data})
            return Response(serializer.errors, status=400)

        elif request.method == "DELETE":

            address.delete()
            return Response({"success": True, "message": "Address Deleted"}, status=200)

    except Exception as e:
        print(e)
        return Response(
            {"success": "false", "error": str(e), "message": "Address Not Found"},
            status=500,
        )


# ========================================================================
# 2. Stripe Order Section
# ========================================================================

@api_view(["POST"])
@permission_classes([IsAuthenticated])  
def get_my_orders(request):

    try:

        orders = (
            Order.objects.filter(
                user=request.user,
            )
            .exclude(status="Pending")
            .order_by("-created_at")
        )

        serializer = OrderSerializer(orders, many=True, context={"request": request})

        return Response(serializer.data, status=200)

    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=500)


# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def create_checkout_session(request):
#     if request.method == "POST":
#         try:
#             # Agar frontend JSON bhej raha hai
#             data = request.data if request.data else json.loads(request.body)
#             user_email = data.get("email", request.user.email)

#             cart = Cart.objects.filter(user=request.user).first()

#             if not cart or not cart.cart_items.exists():
#                 return Response({"error": "Cart is Empty"}, status=400)

#             line_items = []

#             # Coupon details nikal lo
#             coupon_code_used = cart.coupon.coupon_code if cart.coupon else None
#             discount_applied = cart.discount_amount if cart.coupon else 0

#             # 1. Parent Order Create Karein (Yahan discount details save hongi)
#             order = Order.objects.create(
#                 user=request.user,
#                 email=user_email,
#                 full_name=data.get("full_name"),
#                 phone=data.get("phone"),
#                 address_line=data.get("address_line"),
#                 city=data.get("city"),
#                 state=data.get("state"),
#                 landmark=data.get("landmark"),
#                 postal_code=data.get("pincode"),
#                 total_amount=cart.total_price,  # Yeh final amount hoga discount ke baad
#                 coupon_used=coupon_code_used,
#                 discount_amount=discount_applied,
#             )

#             # 2. Items Process Karein (Bina discount math ke)
#             for item in cart.cart_items.all():

#                 # Product ki exact selling price (e.g. ₹50,000)
#                 selling_price = float(item.variant.price)

#                 # Image URL set karein
#                 image_url = request.build_absolute_uri(
#                     item.variant.images.all().first().image.url
#                 )

#                 line_items.append(
#                     {
#                         "price_data": {
#                             "currency": "inr",
#                             "product_data": {
#                                 "name": item.variant.product.title,
#                                 "images": [image_url],
#                             },
#                             # Stripe ko exact base price bhejein
#                             "unit_amount": int(selling_price * 100),
#                         },
#                         "quantity": item.quantity,
#                     }
#                 )

#                 # OrderItem me product ki exact price save karein
#                 OrderItem.objects.create(
#                     order=order,
#                     cost_price=item.variant.cost_price,
#                     product=item.variant,
#                     price=selling_price,
#                     quantity=item.quantity,
#                     original_price=item.variant.mrp,
#                 )

#             # 3. Stripe Checkout Session Configuration
#             checkout_kwargs = {
#                 "payment_method_types": ["card"],
#                 "line_items": line_items,
#                 "mode": "payment",
#                 "metadata": {
#                     "user_id": request.user.id,
#                     "order_id": order.uid,
#                 },  # Use order.id if uid is not an attribute
#                 "success_url": f"{settings.FRONTEND_URL}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}",
#                 "cancel_url": f"{settings.FRONTEND_URL}/cart",
#             }

#             # 4. STRIPE COUPON LOGIC (Magic Happens Here)
#             if cart.coupon and cart.discount_amount > 0:
#                 # Stripe par on-the-fly coupon create karein
#                 stripe_coupon = stripe.Coupon.create(
#                     amount_off=int(
#                         float(cart.discount_amount) * 100
#                     ),  # Amount in paise
#                     currency="inr",
#                     duration="once",
#                     name=f"Discount: {cart.coupon.coupon_code}",
#                 )
#                 # Session kwargs me discount append kar dein
#                 checkout_kwargs["discounts"] = [{"coupon": stripe_coupon.id}]

#             # Session Generate Karein
#             session = stripe.checkout.Session.create(**checkout_kwargs)

#             # Transaction ID save karein
#             order.transaction_id = session.id
#             order.save()

#             return JsonResponse({"checkout_url": session.url})

#         except Exception as e:
#             print(e)
#             return JsonResponse({"error": str(e)}, status=500)


# @csrf_exempt
# def stripe_webhook(request):
#     payload = request.body
#     sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")
#     endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

#     try:
#         event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
#     except ValueError:
#         return JsonResponse({"status": "invalid payload"}, status=400)
#     except stripe.error.SignatureVerificationError:
#         return JsonResponse({"status": "invalid signature"}, status=400)

#     # 🌟 flush=True lagaya hai taaki logs Render par turant dikhein
#     print(f"🔔 WEBHOOK RECEIVED: {event['type']}", flush=True)

#     # Dot notation use karna zyada safe hai
#     event_type = str(event.type).strip()

#     # ✅ payment completed event
#     if event_type == "checkout.session.completed":

#         # 🌟 FIX: Brackets [] ki jagah Dot (.) notation
#         session = event.data.object

#         try:
#             print("✅ Complete Working (Inside Session Block)", flush=True)

#             # 🌟 FIX: Safe Metadata Extraction
#             metadata = (
#                 session.metadata
#                 if hasattr(session, "metadata") and session.metadata
#                 else {}
#             )
#             print(f"✅ Metadata Working: {metadata}", flush=True)

#             user_id = getattr(metadata, "user_id", None)
#             order_id = getattr(metadata, "order_id", None)

#             print(f"Order ID: {order_id} | User ID: {user_id}", flush=True)

#             if order_id:
#                 try:
#                     order = Order.objects.get(uid=order_id)
#                     order.status = "Paid"
#                     order.is_paid = True

#                     payment_intent_id = getattr(session, "payment_intent", None)
#                     if payment_intent_id:
#                         order.transaction_id = payment_intent_id
#                         print(
#                             f"✅ Payment Intent saved: {payment_intent_id}", flush=True
#                         )

#                     order.save()
#                     print("✅ Order Placed Successfully", flush=True)

#                     user_instance = None
#                     if user_id:
#                         try:
#                             # 🌟 User model logic
#                             user_instance = User.objects.get(id=int(user_id))
#                             cart = Cart.objects.filter(user=user_instance).first()

#                             if cart:
#                                 if cart.coupon:
#                                     cart.coupon.used_by.add(
#                                         user_instance
#                                     )  # User instance hi chahiye yahan

#                                 cart.cart_items.all().delete()
#                                 cart.coupon = None
#                                 cart.save()
#                                 print("🛒 Cart and Coupon cleared", flush=True)

#                         except Exception as cart_err:
#                             print(f"⚠️ Cart Update Error: {cart_err}", flush=True)

#                 except Order.DoesNotExist:
#                     print(f"❌ Order {order_id} not found in DB", flush=True)
#                     return JsonResponse({"status": "Order not found"}, status=404)

#         except Exception as e:
#             print(f"💥 CRITICAL ERROR in webhook: {e}", flush=True)
#             # Tell Stripe what exactly broke
#             return JsonResponse({"error": str(e)}, status=500)

#     elif event_type == "charge.refunded":
#         # 🌟 FIX: Dot notation
#         charge = event.data.object
#         payment_intent = getattr(charge, "payment_intent", None)

#         if payment_intent:
#             try:
#                 # Transaction ID se order dhoondein
#                 order = Order.objects.get(transaction_id=payment_intent)
#                 order.refund_status = "Completed"
#                 order.save()
#                 print(f"✅ Order {order.uid} marked as REFUND COMPLETED!", flush=True)
#             except Order.DoesNotExist:
#                 print(f"⚠️ Refund event aagaya par Order match nahi hua", flush=True)
#     else:
#         print(f"⚠️ Unhandled event type ignored: '{event_type}'", flush=True)

#     # 🌟 FIX: Akhir mein JsonResponse use kiya hai taaki safe rahe
#     return JsonResponse({"status": "success"}, status=200)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_checkout_session(request):
    if request.method == "POST": 
        try:
            # Agar frontend JSON bhej raha hai
            data = request.data if request.data else json.loads(request.body)
            user_email = data.get("email", request.user.email)

            cart = Cart.objects.filter(user=request.user).first()

            if not cart or not cart.cart_items.exists():
                return Response({"error": "Cart is Empty"}, status=400)

            line_items = []

            # Coupon details nikal lo
            coupon_code_used = cart.coupon.coupon_code if cart.coupon else None
            discount_applied = float(cart.discount_amount) if cart.coupon else 0.0

            # 🌟 NEW: Extract Tax and Shipping from Frontend request (Default 0 if not sent)

            shipping_cost = cart.shipping_cost

            final_total_amount = float(cart.total_price)

            product_total = final_total_amount - float(shipping_cost)

            gst_rate = 0.18
            base_price = product_total / (1 + gst_rate)
            tax_amount = round(product_total - base_price, 2)
            print("Working")
            with transaction.atomic() :
                # 1. Parent Order Create Karein
                order = Order.objects.create(
                    user=request.user,
                    email=user_email,

                    full_name=data.get("full_name"), 
                    phone=str(data.get("phone")),     
                    address_line=data.get("address_line"),
                    city=data.get("city"),
                    state=data.get("state"),
                    landmark=data.get("landmark"),
                    postal_code=data.get("pincode"),

                    tax_amount=tax_amount,
                    shipping_cost=shipping_cost,
                    total_amount=final_total_amount,  

                    coupon_used=coupon_code_used,
                    discount_amount=discount_applied,
                )
                print("Working")


                # 2. Items Process Karein
                for item in cart.cart_items.all():
                    selling_price = float(item.variant.price)
                    image_url = request.build_absolute_uri(
                        item.variant.images.all().first().image.url
                    )

                    # Add to Stripe Line Items
                    line_items.append({
                        "price_data": {
                            "currency": "inr",
                            "product_data": {
                                "name": item.variant.product.title, # Ya .name jo bhi aapka model ho
                                "images": [image_url],
                            },
                            "unit_amount": int(selling_price * 100),
                        },
                        "quantity": item.quantity,
                    })

                    # 🌟 OrderItem me product_name aur sku explicit save kiya
                    OrderItem.objects.create(
                        order=order,
                        product=item.variant,
                        product_name=item.variant.product.title, # 🌟 Snapshot of Name
                        sku=item.variant.sku,                    # 🌟 Snapshot of SKU
                        cost_price=item.variant.cost_price,
                        price=selling_price,
                        quantity=item.quantity,
                        original_price=item.variant.mrp,
                    )
            

            # 🌟 3. STRIPE MAGIC: Add Tax & Shipping to Stripe Checkout Bill
            if shipping_cost > 0:
                line_items.append({
                    "price_data": {
                        "currency": "inr",
                        "product_data": {"name": "Shipping Fee"},
                        "unit_amount": int(shipping_cost * 100),
                    },
                    "quantity": 1,
                })

            # if tax_amount > 0:
            #     line_items.append({
            #         "price_data": {
            #             "currency": "inr",
            #             "product_data": {"name": "Tax (GST)"},
            #             "unit_amount": int(tax_amount * 100),
            #         },
            #         "quantity": 1,
            #     })

            # 4. Stripe Checkout Session Configuration
            checkout_kwargs = {
                "payment_method_types": ["card"],
                "line_items": line_items,
                "mode": "payment",
                "metadata": {
                    "user_id": request.user.id,
                    "order_id": str(order.uid),
                },
                # "success_url": f"{settings.FRONTEND_URL}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}",
                "success_url": f"http://localhost:5173/checkout/success?session_id={{CHECKOUT_SESSION_ID}}",
                "cancel_url": f"{settings.FRONTEND_URL}/cart",
            }

            # 5. STRIPE COUPON LOGIC
            if cart.coupon and discount_applied > 0:
                stripe_coupon = stripe.Coupon.create(
                    amount_off=int(discount_applied * 100), 
                    currency="inr",
                    duration="once",
                    name=f"Discount: {cart.coupon.coupon_code}",
                )
                checkout_kwargs["discounts"] = [{"coupon": stripe_coupon.id}]

            # Session Generate Karein
            session = stripe.checkout.Session.create(**checkout_kwargs)

            # Transaction ID save karein
            order.transaction_id = session.id
            order.save()

            return JsonResponse({"checkout_url": session.url})

        except Exception as e:
            print(f"Checkout Error: {e}")
            return JsonResponse({"error": str(e)}, status=500)



@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except ValueError:
        return JsonResponse({"status": "invalid payload"}, status=400)
    except stripe.error.SignatureVerificationError:
        return JsonResponse({"status": "invalid signature"}, status=400)

    print(f"🔔 WEBHOOK RECEIVED: {event['type']}", flush=True)

    event_type = str(event.type).strip()

    # -----------------------------------------------------------
    # ✅ EVENT 1: PAYMENT SUCCESSFUL
    # -----------------------------------------------------------
    if event_type == "checkout.session.completed":
        session = event.data.object

        try:
            print("✅ Complete Working (Inside Session Block)", flush=True)
            
            # Safe Metadata Extraction
            metadata = session.metadata if hasattr(session, "metadata") and session.metadata else {}
            
            user_id = getattr(metadata, "user_id", None)
            order_id = getattr(metadata, "order_id", None)

            print(f"Order ID: {order_id} | User ID: {user_id}", flush=True)

            if order_id:
                try:
                    order = Order.objects.get(uid=order_id)
                    
                    # 🌟 MODEL UPDATE: Order confirm ho gaya
                    order.status = "Paid" 
                    order.is_paid = True

                    payment_intent_id = getattr(session, "payment_intent", None)
                    if payment_intent_id:
                        order.transaction_id = payment_intent_id
                        print(f"✅ Payment Intent saved: {payment_intent_id}", flush=True)

                    order.save()
                    print("✅ Order Placed Successfully", flush=True)

                    # 🌟 TODO (Future): Yahan OrderItems ki quantity ko ProductVariant ke stock se minus (deduct) karne ka logic aayega

                    if user_id:
                        try:
                            user_instance = User.objects.get(id=int(user_id))
                            cart = Cart.objects.filter(user=user_instance).first()

                            if cart:
                                if cart.coupon:
                                    # 🌟 NAYA: Global Count ko safely +1 karo
                                    cart.coupon.used_count = F('used_count') + 1
                                    cart.coupon.save() # F() chalane ke baad save zaroori hai
                                    
                                    # PURANA (Sahi wala): User ki history me coupon add karo
                                    cart.coupon.used_by.add(user_instance)

                                # Cart items clear aur coupon detach karo
                                cart.cart_items.all().delete()
                                cart.coupon = None
                                cart.save()
                                print("🛒 Cart cleared and Coupon limits updated!", flush=True)

                        except Exception as cart_err:
                            print(f"⚠️ Cart Update Error: {cart_err}", flush=True)

                except Order.DoesNotExist:
                    print(f"❌ Order {order_id} not found in DB", flush=True)
                    return JsonResponse({"status": "Order not found"}, status=404)

        except Exception as e:
            print(f"💥 CRITICAL ERROR in webhook: {e}", flush=True)
            return JsonResponse({"error": str(e)}, status=500)

    # -----------------------------------------------------------
    # 💸 EVENT 2: PAYMENT REFUNDED
    # -----------------------------------------------------------
    elif event_type == "charge.refunded":
        charge = event.data.object
        payment_intent = getattr(charge, "payment_intent", None)

        if payment_intent:
            try:
                order = Order.objects.get(transaction_id=payment_intent)
                
                order.refund_status = "Completed"
                
                # 🌟 THE BUG FIX: 
                # Agar order pehle se 'Cancelled' hai, toh usko 'Cancelled' hi rehne do.
                # Main status sirf tab change karo agar wo 'Returned' tha.
                if order.status == "Returned":
                    order.status = "Refunded"  
                
                order.save()
                
                print(f"✅ Order {order.uid} marked as REFUND COMPLETED!", flush=True)
            except Order.DoesNotExist:
                print(f"⚠️ Refund event aagaya par Order match nahi hua", flush=True)

    # -----------------------------------------------------------
    # ❌ EVENT 3: CHECKOUT EXPIRED / PAYMENT FAILED
    # -----------------------------------------------------------
    elif event_type == "checkout.session.expired":
        session = event.data.object
        metadata = session.metadata if hasattr(session, "metadata") and session.metadata else {}
        order_id = metadata.get("order_id")

        if order_id:
            try:
                order = Order.objects.get(uid=order_id)
                # Agar abhi tak Paid nahi hua hai, toh isko Failed mark kardo
                if not order.is_paid:
                    order.status = "Failed" # 🌟 NEW: Failed status use kiya
                    order.save()
                    print(f"❌ Order {order.uid} marked as FAILED (Session Expired)", flush=True)
            except Order.DoesNotExist:
                pass

    else:
        print(f"ℹ️ Unhandled event type ignored: '{event_type}'", flush=True)

    return JsonResponse({"status": "success"}, status=200)



# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def cancel_order(request, order_id):

#     try:

#         order = Order.objects.get(uid=order_id, user=request.user)

#         forbidden_statuses = ["Shipped", "Delivered", "Cancelled"]

#         if order.status in forbidden_statuses:
#             return Response(
#                 {
#                     "success": False,
#                     "error": f"Order cannot be Cancelled. It is already {order.status}.",
#                 },
#                 status=400,
#             )

#         if order.is_paid and order.transaction_id:

#             try:

#                 # Stripe Refund API call
#                 refund = stripe.Refund.create(payment_intent=order.transaction_id)

#                 # Refund processing state me daal do (Webhook isko baad me 'Completed' karega)
#                 # Agar aapne models.py me refund_status field banaya hai toh:
#                 if hasattr(order, "refund_status"):
#                     if refund.status == "succeeded":
#                         # Agar test mode me turant success ho gaya, toh sidha Completed mark karo
#                         order.refund_status = "Completed"
#                     else:
#                         # Agar bank time le raha hai, tabhi Processing me dalo (Webhook handle karega)
#                         order.refund_status = "Processing"

#             except stripe.error.StripeError as e:
#                 # Agar Stripe me koi error aayi (jaise balance kam hona ya invalid id)
#                 return Response({"error": f"Refund failed: {str(e)}"}, status=500)

#         order.status = "Cancelled"
#         order.save()

#         # NOTE: Agar aap inventory manage kar rahe hain,
#         # toh yahan product ka stock wapas badha (increment) sakte hain.

#         return Response(
#             {
#                 "message": "Order has been cancelled and refund initiated (if applicable)."
#             },
#             status=200,
#         )

#     except Order.DoesNotExist:
#         return Response({"success": False, "error": "Order Not Found."}, status=404)

#     except Exception as e:
#         return Response(
#             {"success": False, "error": "Failed To Cancel Order"}, status=500
#         )


# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def return_order(request, order_id):
#     try:
#         # 1. Fetch Order (Security: User can only return their own order)
#         order = Order.objects.get(uid=order_id, user=request.user)

#         # 2. Rule 1: Status Check (Very Important)
#         if order.status != "Delivered":
#             return Response(
#                 {
#                     "error": f"Only delivered orders can be returned. Current status is {order.status}."
#                 },
#                 status=400,
#             )

#         # 3. Rule 2: Stripe Refund Logic
#         # Asli company mein refund tab hota hai jab delivery boy item wapas le aata hai.
#         # Par abhi project ke liye hum turant refund initiate kar rahe hain taaki UI test ho sake.
#         if order.transaction_id:

#             try:

#                 refund = stripe.Refund.create(payment_intent=order.transaction_id)

#                 if hasattr(order, "refund_status"):
#                     if refund.status == "succeeded":
#                         # Agar test mode me turant success ho gaya, toh sidha Completed mark karo
#                         order.refund_status = "Completed"
#                     else:
#                         # Agar bank time le raha hai, tabhi Processing me dalo (Webhook handle karega)
#                         order.refund_status = "Processing"

#             except stripe.error.StripeError as e:
#                 return Response({"error": f"Refund failed: {str(e)}"}, status=500)

#         # 4. Update status to match React UI state (isReturned)
#         order.status = "Returned"
#         order.save()

#         # NOTE: Yahan aap inventory/stock update ka logic bhi laga sakte hain if needed.

#         return Response(
#             {"message": "Return has been initiated successfully."}, status=200
#         )

#     except Order.DoesNotExist:
#         return Response({"error": "Order not found."}, status=404)
#     except Exception as e:
#         return Response({"error": str(e)}, status=500)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def cancel_order(request, order_id):
    try:
        order = Order.objects.get(uid=order_id, user=request.user)

        # 🌟 FIX 1: Naye enterprise statuses add kiye jinhe cancel nahi kiya ja sakta
        forbidden_statuses = ["Shipped", "Out for Delivery", "Delivered", "Cancelled", "Returned", "Refunded", "Failed"]

        if order.status in forbidden_statuses:
            return Response(
                {
                    "success": False,
                    "error": f"Order cannot be Cancelled. It is already {order.status}.",
                },
                status=400,
            )

        # Stripe Refund Logic
        if order.is_paid and order.transaction_id:
            try:
                # Stripe Refund API call
                refund = stripe.Refund.create(payment_intent=order.transaction_id)

                # 🌟 FIX 2: Strict choices use ki hain ("Pending" ya "Completed")
                if refund.status == "succeeded":
                    order.refund_status = "Completed"
                else:
                    # Agar bank time le raha hai toh Pending rahega, Webhook isko baad me sambhal lega
                    order.refund_status = "Pending" 

            except stripe.error.StripeError as e:
                # Agar Stripe me error aayi toh order cancel bhi nahi hoga
                return Response({"success": False, "error": f"Refund failed: {str(e)}"}, status=500)

        # 🌟 Status change
        order.status = "Cancelled"
        order.save()

        # NOTE: Agar aap inventory manage kar rahe hain,
        # toh yahan product ka stock wapas badha (increment) sakte hain.

        return Response(
            {   
                "success": True,
                "message": "Order has been cancelled and refund initiated (if applicable)."
            },
            status=200,
        )

    except Order.DoesNotExist:
        return Response({"success": False, "error": "Order Not Found."}, status=404)
    except Exception as e:
        return Response({"success": False, "error": "Failed To Cancel Order"}, status=500)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def return_order(request, order_id):
    try:
        # Fetch Order (Security: User can only return their own order)
        order = Order.objects.get(uid=order_id, user=request.user)

        # Rule 1: Status Check (Very Important)
        if order.status != "Delivered":
            return Response(
                {   
                    "success": False,
                    "error": f"Only delivered orders can be returned. Current status is {order.status}."
                },
                status=400,
            )

        # Rule 2: Stripe Refund Logic
        # 🌟 FIX 3: order.is_paid check add kiya for safety
        if order.is_paid and order.transaction_id:
            try:
                refund = stripe.Refund.create(payment_intent=order.transaction_id)

                if refund.status == "succeeded":
                    order.refund_status = "Completed"
                else:
                    order.refund_status = "Pending"

            except stripe.error.StripeError as e:
                return Response({"success": False, "error": f"Refund failed: {str(e)}"}, status=500)

        # Update status to match React UI state (isReturned)
        order.status = "Returned"
        order.save()

        # NOTE: Yahan aap inventory/stock update ka logic bhi laga sakte hain if needed.

        return Response(
            {"success": True, "message": "Return has been initiated successfully."}, status=200
        )

    except Order.DoesNotExist:
        return Response({"success": False, "error": "Order not found."}, status=404)
    except Exception as e:
        return Response({"success": False, "error": str(e)}, status=500)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def get_order_success_details(request, sid):

    try:

        session = stripe.checkout.Session.retrieve(sid)

        metadata = getattr(session, "metadata", None)
        order_id = getattr(metadata, "order_id", None)

        if not order_id:
            return Response(
                {"success": "false", "error": "Order ID missing in Stripe Session"},
                status=400,
            )

        order = Order.objects.get(uid=order_id, user=request.user)

        return Response({"success": "true", "order": OrderSerializer(order).data})

    except stripe.error.StripeError as e:
        print("Stripe Error : ", e)
        return Response({"error": "Invalid Session ID: " + str(e)}, status=400)
    except Order.DoesNotExist:
        return Response({"error": "Order not found for this session"}, status=404)
    except Exception as e:
        print("Order Error : ", e)
        return Response({"success": "false", "error": str(e)}, status=500)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_order_details(request, order_id):

    try:

        order = Order.objects.get(uid=order_id, user=request.user)

        return Response({"success": "true", "order": OrderSerializer(order).data})

    except Exception as e:

        print("Order Error : ", e)
        return Response({"success": "false", "error": str(e)}, status=500)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def download_invoice_pdf(request, order_id):

    order = get_object_or_404(Order.objects.prefetch_related("items"),uid=order_id, user=request.user)

    response = generate_order_invoice_pdf(order)

    if response is None:
        return HttpResponse(
            "We had some errors generating your PDF.", status=500
        )

    return response
