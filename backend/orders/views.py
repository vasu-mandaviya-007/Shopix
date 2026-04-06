from django.shortcuts import get_object_or_404, render
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from cart.models import Cart, CartItems
from cart.serializers import CartSerializer
from django.db import transaction
from .models import Order, OrderItem
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Address
from .serializers import AddressSerializer
import stripe
from django.conf import settings

from orders.serializers import OrderSerializer
from products.models import ProductVariant

stripe.api_key = settings.STRIPE_SECRET_KEY


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


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_payment_intent(request):
    # _get_cart is your existing helper function
    cart, _ = Cart.objects.get_or_create(user=request.user)

    if not cart.cart_items.exists():
        return Response({"error": "Cart is empty"}, status=400)

    # Stripe needs amount in cents
    amount = int(cart.total_price * 100)

    try:
        intent = stripe.PaymentIntent.create(
            amount=amount, currency="usd", metadata={"user_id": request.user.id}
        )
        return Response({"clientSecret": intent["client_secret"]})
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=400)


# Create your views here.
@api_view(["POST"])
def get_orders(request):
    return Response({"message": "All Orders"})


# @api_view(["POST"])
# def get_orders_by_side(request):

#     session_id = request.data.get("session_id")
#     orders = Order.objects.filter(session_id=session_id)

#     if orders.exists():
#         return Response(
#             {"message": "All Orders", "orders": OrderSerializer(orders, many=True).data}
#         )

#     return Response({"message": "All Orders"})


@api_view(["POST"])
def create_order(request):

    cart = Cart.objects.get(user=request.user)

    data = request.data

    try:

        with transaction.atomic():

            order = Order.objects.create(
                user=request.user,
                email=data.get("email"),
                full_name=data.get("full_name"),
                address=data.get("address"),
                city=data.get("city"),
                postal_code=data.get("postal_code"),
                total_amount=cart.total_price,
            )

            for item in cart.cart_items.all():
                OrderItem.objects.create(
                    order=order,
                    variant=item.variant,
                    price=item.variant.price,
                    quantity=item.quantity,
                )

            return Response(
                {
                    "success": True,
                    "message": "All Orders",
                    "cart": CartSerializer(cart).data,
                }
            )

    except Exception as e:
        return Response(
            {"success": False, "error": str(e), "cart": CartSerializer(cart).data}
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def finalize_order(request):

    cart = Cart.objects.get(user=request.user)

    address_id = request.data.get("address_id")
    transaction_id = request.data.get("transaction_id")

    # Fetch the exact address the user selected
    address = get_object_or_404(Address, uid=address_id, user=request.user)

    with transaction.atomic():
        # 1. Create Order with Address Snapshot
        order = Order.objects.create(
            user=request.user,
            full_name=address.full_name,
            address=address.address_line,
            city=address.city,
            postal_code=address.pincode,
            total_amount=cart.total_price,
            is_paid=True,
            transaction_id=transaction_id,
            payment_method="Stripe",
        )

        # 2. Move Items
        for item in cart.cart_items.all():
            OrderItem.objects.create(
                order=order,
                variant=item.variant,
                price=item.variant.price,
                quantity=item.quantity,
            )
            # Deduct inventory
            item.variant.stock_qty -= item.quantity
            item.variant.save()

        # 3. Clear Cart
        cart.delete()

        return Response({"message": "Order Successful!", "order_id": order.uid})


# ========================================================================
# 2. Stripe Order Section
# ========================================================================

from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json


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
        return JsonResponse(
            {"status": "invalid payload"}, status=400
        )  # invalid payload
    except stripe.error.SignatureVerificationError:
        return JsonResponse(
            {"status": "invalid signature"}, status=400
        )  # invalid signature


    print(f"🔔 WEBHOOK RECEIVED: {event['type']}")
    
    # ✅ payment completed event
    if event["type"] == "checkout.session.completed":

        session = event["data"]["object"]
        session_id = session.get("id")

        try:

            # Check if we already processed this exact payment
            # if Order.objects.filter(transaction_id=session_id).exists():
            #     print("Order already exists. Ignoring duplicate webhook.")
            #     return JsonResponse({"status": "already processed"}, status=200)

            metadata = session.get("metadata", {})

            user_id = metadata.get("user_id")
            order_id = metadata.get("order_id")
            print("No order id", order_id)

            if order_id:

                try:

                    order = Order.objects.get(uid=order_id)
                    order.status = "Paid"
                    order.is_paid = True
                    # order.transaction_id = session_id
                    order.save()

                    print("✅ Order Placed Successfully ")

                    user_instance = None
                    if user_id:
                        try:
                            user_instance = User.objects.get(id=int(user_id))
                            cart = Cart.objects.filter(user=user_instance).first()
                            if cart:

                                if cart.coupon:
                                    cart.coupon.used_by.add(user_id)

                                cart.cart_items.all().delete()
                                cart.coupon = None
                                cart.save()

                        except User.DoesNotExist:
                            print(f"User with ID {user_id} not found.")

                except Order.DoesNotExist:
                    return JsonResponse({"status": "Order not found"}, status=404)

        except Exception as e:

            print(f"CRITICAL ERROR in webhook: {e}")

            # Tell Stripe: "Something broke, please try again later!"
            return JsonResponse({"error": "Failed to create order"}, status=500)

    elif event["type"] == "charge.refunded":
        charge = event["data"]["object"]
        payment_intent = charge.get("payment_intent")

        if payment_intent:
            try:
                # Transaction ID se order dhoondein
                order = Order.objects.get(transaction_id=payment_intent)
                order.refund_status = "Completed"
                order.save()

                print(f"✅ Order {order.uid} marked as REFUND COMPLETED!")
            except Order.DoesNotExist:
                pass

    return HttpResponse(status=200)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def get_order_details_by_sid(request, sid):

    try:

        order = Order.objects.get(transaction_id=sid, user=request.user)

        return Response({"success": "true", "order": OrderSerializer(order).data})

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


@api_view(["POST"])
@permission_classes([IsAuthenticated])  # Sirf logged-in user apne orders dekh paye
def get_my_orders(request):

    try:

        # 1. Logged-in user ke saare orders nikal lo (nawalest se oldest)
        # prefetch_related: Isse N+1 query problem solve hoti hai, db calls kam hote hain
        orders = (
            Order.objects.filter(
                user=request.user,
            )
            .exclude(status="Pending")
            .order_by("-created_at")
        )

        # 2. Data ko Serializer mein daalo
        serializer = OrderSerializer(orders, many=True, context={"request": request})

        # 3. React ko bhej do!
        return Response(serializer.data, status=200)

    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=500)


from django.template.loader import get_template
from xhtml2pdf import pisa


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
                # Checkout session se 'payment_intent' nikalna padta hai refund ke liye
                session = stripe.checkout.Session.retrieve(order.transaction_id)
                payment_intent = session.payment_intent

                if payment_intent:
                    # Stripe Refund API call
                    refund = stripe.Refund.create(payment_intent=payment_intent)

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
                session = stripe.checkout.Session.retrieve(order.transaction_id)
                payment_intent = session.payment_intent

                if payment_intent:
                    # Stripe Refund call
                    refund = stripe.Refund.create(payment_intent=payment_intent)

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
