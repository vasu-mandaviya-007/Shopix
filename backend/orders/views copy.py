import json
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
from xhtml2pdf import pisa


from orders.serializers import OrderSerializer

stripe.api_key = settings.STRIPE_SECRET_KEY

from django.utils import timezone
from datetime import timedelta
from django.db.models import Sum, Count,F
from django.db.models.functions import TruncDate

from django.http import JsonResponse
from products.models import ProductVariant # 👈 Apne app ke hisaab se change karein

def dashboard_api(request) : 
    days = int(request.GET.get("days",7))
    today = timezone.now().date()
    start_date = today - timedelta(days=days)

    revenue_data = Order.objects.filter(is_paid=True, created_at__date__gte=start_date).aggregate(Sum('total_amount'))
    total_revenue = revenue_data['total_amount__sum'] or 0
    total_orders = Order.objects.filter(created_at__date__gte=start_date).count()
    
    daily_sales = Order.objects.filter(is_paid=True, created_at__date__gte=start_date) \
        .annotate(date=TruncDate('created_at')).values('date').annotate(total=Sum('total_amount'))
    
    sales_dict = {item['date']: item['total'] for item in daily_sales}
    sales_dates = []
    sales_amounts = []
    
    for i in range(days-1, -1, -1):
        target_date = today - timedelta(days=i)
        sales_dates.append(target_date.strftime("%d %b"))
        sales_amounts.append(float(sales_dict.get(target_date, 0)))

    top_products_query = OrderItem.objects.filter(
        order__is_paid=True, 
        order__created_at__date__gte=start_date
    ).values('product__product__title').annotate(
        revenue=Sum(F('price') * F('quantity')) 
    ).order_by('-revenue')[:5]
    
    top_products = [{"title": p['product__product__title'], "revenue": float(p['revenue'])} for p in top_products_query]

    return JsonResponse({
        "total_revenue": total_revenue,
        "total_orders": total_orders,
        "sales_dates": sales_dates,
        "sales_amounts": sales_amounts,
        "top_products": top_products
    })

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
            discount_applied = cart.discount_amount if cart.coupon else 0

            # 1. Parent Order Create Karein (Yahan discount details save hongi)
            order = Order.objects.create(
                user=request.user,
                email=user_email,
                full_name=data.get("full_name"),
                phone=data.get("phone"),
                address_line=data.get("address_line"),
                city=data.get("city"),
                state=data.get("state"),
                landmark=data.get("landmark"),
                postal_code=data.get("pincode"),
                total_amount=cart.total_price,  # Yeh final amount hoga discount ke baad
                coupon_used=coupon_code_used,
                discount_amount=discount_applied,
            )

            # 2. Items Process Karein (Bina discount math ke)
            for item in cart.cart_items.all():

                # Product ki exact selling price (e.g. ₹50,000)
                selling_price = float(item.variant.price)

                # Image URL set karein
                image_url = request.build_absolute_uri(
                    item.variant.images.all().first().image.url
                )

                line_items.append(
                    {
                        "price_data": {
                            "currency": "inr",
                            "product_data": {
                                "name": item.variant.product.title,
                                "images": [image_url],
                            },
                            # Stripe ko exact base price bhejein
                            "unit_amount": int(selling_price * 100),
                        },
                        "quantity": item.quantity,
                    }
                )

                # OrderItem me product ki exact price save karein
                OrderItem.objects.create(
                    order=order,
                    product=item.variant,
                    price=selling_price,
                    quantity=item.quantity,
                    original_price=item.variant.mrp,
                )

            # 3. Stripe Checkout Session Configuration
            checkout_kwargs = {
                "payment_method_types": ["card"],
                "line_items": line_items,
                "mode": "payment",
                "metadata": {
                    "user_id": request.user.id,
                    "order_id": order.uid,
                },  # Use order.id if uid is not an attribute
                "success_url": f"{settings.FRONTEND_URL}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}",
                "cancel_url": f"{settings.FRONTEND_URL}/cart",
            }

            # 4. STRIPE COUPON LOGIC (Magic Happens Here)
            if cart.coupon and cart.discount_amount > 0:
                # Stripe par on-the-fly coupon create karein
                stripe_coupon = stripe.Coupon.create(
                    amount_off=int(
                        float(cart.discount_amount) * 100
                    ),  # Amount in paise
                    currency="inr",
                    duration="once",
                    name=f"Discount: {cart.coupon.coupon_code}",
                )
                # Session kwargs me discount append kar dein
                checkout_kwargs["discounts"] = [{"coupon": stripe_coupon.id}]

            # Session Generate Karein
            session = stripe.checkout.Session.create(**checkout_kwargs)

            # Transaction ID save karein
            order.transaction_id = session.id
            order.save()

            return JsonResponse({"checkout_url": session.url})

        except Exception as e:
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

    # 🌟 flush=True lagaya hai taaki logs Render par turant dikhein
    print(f"🔔 WEBHOOK RECEIVED: {event['type']}", flush=True)

    # Dot notation use karna zyada safe hai
    event_type = str(event.type).strip()

    # ✅ payment completed event
    if event_type == "checkout.session.completed":

        # 🌟 FIX: Brackets [] ki jagah Dot (.) notation
        session = event.data.object

        try:
            print("✅ Complete Working (Inside Session Block)", flush=True)

            # 🌟 FIX: Safe Metadata Extraction
            metadata = (
                session.metadata
                if hasattr(session, "metadata") and session.metadata
                else {}
            )
            print(f"✅ Metadata Working: {metadata}", flush=True)

            user_id = getattr(metadata, "user_id", None)
            order_id = getattr(metadata, "order_id", None)

            print(f"Order ID: {order_id} | User ID: {user_id}", flush=True)

            if order_id:
                try:
                    order = Order.objects.get(uid=order_id)
                    order.status = "Paid"
                    order.is_paid = True

                    payment_intent_id = getattr(session, "payment_intent", None)
                    if payment_intent_id:
                        order.transaction_id = payment_intent_id
                        print(
                            f"✅ Payment Intent saved: {payment_intent_id}", flush=True
                        )

                    order.save()
                    print("✅ Order Placed Successfully", flush=True)

                    user_instance = None
                    if user_id:
                        try:
                            # 🌟 User model logic
                            user_instance = User.objects.get(id=int(user_id))
                            cart = Cart.objects.filter(user=user_instance).first()

                            if cart:
                                if cart.coupon:
                                    cart.coupon.used_by.add(
                                        user_instance
                                    )  # User instance hi chahiye yahan

                                cart.cart_items.all().delete()
                                cart.coupon = None
                                cart.save()
                                print("🛒 Cart and Coupon cleared", flush=True)

                        except Exception as cart_err:
                            print(f"⚠️ Cart Update Error: {cart_err}", flush=True)

                except Order.DoesNotExist:
                    print(f"❌ Order {order_id} not found in DB", flush=True)
                    return JsonResponse({"status": "Order not found"}, status=404)

        except Exception as e:
            print(f"💥 CRITICAL ERROR in webhook: {e}", flush=True)
            # Tell Stripe what exactly broke
            return JsonResponse({"error": str(e)}, status=500)

    elif event_type == "charge.refunded":
        # 🌟 FIX: Dot notation
        charge = event.data.object
        payment_intent = getattr(charge, "payment_intent", None)

        if payment_intent:
            try:
                # Transaction ID se order dhoondein
                order = Order.objects.get(transaction_id=payment_intent)
                order.refund_status = "Completed"
                order.save()
                print(f"✅ Order {order.uid} marked as REFUND COMPLETED!", flush=True)
            except Order.DoesNotExist:
                print(f"⚠️ Refund event aagaya par Order match nahi hua", flush=True)
    else:
        print(f"⚠️ Unhandled event type ignored: '{event_type}'", flush=True)

    # 🌟 FIX: Akhir mein JsonResponse use kiya hai taaki safe rahe
    return JsonResponse({"status": "success"}, status=200)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def cancel_order(request, order_id):

    try:

        order = Order.objects.get(uid=order_id, user=request.user)

        forbidden_statuses = ["Shipped", "Delivered", "Cancelled"]

        if order.status in forbidden_statuses:
            return Response(
                {
                    "success": False,
                    "error": f"Order cannot be Cancelled. It is already {order.status}.",
                },
                status=400,
            )

        if order.is_paid and order.transaction_id:

            try:

                # Stripe Refund API call
                refund = stripe.Refund.create(payment_intent=order.transaction_id)

                # Refund processing state me daal do (Webhook isko baad me 'Completed' karega)
                # Agar aapne models.py me refund_status field banaya hai toh:
                if hasattr(order, "refund_status"):
                    if refund.status == "succeeded":
                        # Agar test mode me turant success ho gaya, toh sidha Completed mark karo
                        order.refund_status = "Completed"
                    else:
                        # Agar bank time le raha hai, tabhi Processing me dalo (Webhook handle karega)
                        order.refund_status = "Processing"

            except stripe.error.StripeError as e:
                # Agar Stripe me koi error aayi (jaise balance kam hona ya invalid id)
                return Response({"error": f"Refund failed: {str(e)}"}, status=500)

        order.status = "Cancelled"
        order.save()

        # NOTE: Agar aap inventory manage kar rahe hain,
        # toh yahan product ka stock wapas badha (increment) sakte hain.

        return Response(
            {
                "message": "Order has been cancelled and refund initiated (if applicable)."
            },
            status=200,
        )

    except Order.DoesNotExist:
        return Response({"success": False, "error": "Order Not Found."}, status=404)

    except Exception as e:
        return Response(
            {"success": False, "error": "Failed To Cancel Order"}, status=500
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def return_order(request, order_id):
    try:
        # 1. Fetch Order (Security: User can only return their own order)
        order = Order.objects.get(uid=order_id, user=request.user)

        # 2. Rule 1: Status Check (Very Important)
        if order.status != "Delivered":
            return Response(
                {
                    "error": f"Only delivered orders can be returned. Current status is {order.status}."
                },
                status=400,
            )

        # 3. Rule 2: Stripe Refund Logic
        # Asli company mein refund tab hota hai jab delivery boy item wapas le aata hai.
        # Par abhi project ke liye hum turant refund initiate kar rahe hain taaki UI test ho sake.
        if order.transaction_id:

            try:

                refund = stripe.Refund.create(payment_intent=order.transaction_id)

                if hasattr(order, "refund_status"):
                    if refund.status == "succeeded":
                        # Agar test mode me turant success ho gaya, toh sidha Completed mark karo
                        order.refund_status = "Completed"
                    else:
                        # Agar bank time le raha hai, tabhi Processing me dalo (Webhook handle karega)
                        order.refund_status = "Processing"

            except stripe.error.StripeError as e:
                return Response({"error": f"Refund failed: {str(e)}"}, status=500)

        # 4. Update status to match React UI state (isReturned)
        order.status = "Returned"
        order.save()

        # NOTE: Yahan aap inventory/stock update ka logic bhi laga sakte hain if needed.

        return Response(
            {"message": "Return has been initiated successfully."}, status=200
        )

    except Order.DoesNotExist:
        return Response({"error": "Order not found."}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


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

    order = get_object_or_404(Order, uid=order_id, user=request.user)

    total_mrp = 0
    for item in order.items.all():
        mrp = item.original_price if item.original_price else item.price
        total_mrp += mrp * item.quantity

    mrp_discount = total_mrp - order.subtotal()

    template = get_template("invoice.html")

    context = {"order": order, "total_mrp": total_mrp, "mrp_discount": mrp_discount}

    html = template.render(context)
    response = HttpResponse(content_type="application/pdf")

    response["Content-Disposition"] = (
        f'attachment; filename="Shopix_Invoice_{order.uid}.pdf'
    )

    pisa_status = pisa.CreatePDF(html, dest=response)

    if pisa_status.err:
        return HttpResponse(
            "We had some errors generating your PDF <pre>" + html + "</pre>", status=500
        )

    return response
