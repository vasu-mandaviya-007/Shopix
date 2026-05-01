from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Cart, CartItems, Coupon,Wishlist
from products.models import ProductVariant
from django.forms import model_to_dict
from .serializers import CartSerializer, CartItemsSerializer
from products.serializers import VariantAttributeValueSerializer
from django.shortcuts import get_object_or_404
from rest_framework import status
from datetime import date
from django.utils import timezone
from django.http import Http404
from django.db import transaction
from .serializers import WishlistSerializer


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated]) # Sirf logged-in users ke liye
def wishlist_view(request):
    user = request.user

    # 🌟 1. GET: User ki saari wishlist items fetch karna
    if request.method == 'GET':
        wishlist_items = Wishlist.objects.filter(user=user).order_by('-created_at')
        serializer = WishlistSerializer(wishlist_items, many=True, context={'request': request})
        return Response({'success': True, 'wishlist': serializer.data})

    # 🌟 2. POST: Wishlist me Add ya Remove karna (Toggle)
    elif request.method == 'POST':
        # Ab frontend se 'variant_id' aayega
        variant_id = request.data.get('variant_id') 
        
        if not variant_id:
            return Response({'error': 'Variant ID is required'}, status=400)

        try:
            # Product ki jagah ProductVariant ko find karenge
            variant = ProductVariant.objects.get(uid=variant_id) 
        except ProductVariant.DoesNotExist:
            return Response({'error': 'Variant not found'}, status=404)

        # Toggle Logic
        wishlist_item = Wishlist.objects.filter(user=user, variant=variant).first()
        
        if wishlist_item:
            # Agar pehle se hai, toh remove kar do
            wishlist_item.delete()
            return Response({'success': True, 'message': 'Removed from Wishlist', 'is_in_wishlist': False})
        else:
            # Agar nahi hai, toh add kar do
            Wishlist.objects.create(user=user, variant=variant)
            return Response({'success': True, 'message': 'Added to Wishlist', 'is_in_wishlist': True})


# 🌟 Check Status API
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_wishlist_status(request, variant_id): # Parameter name change kiya
    exists = Wishlist.objects.filter(user=request.user, variant__uid=variant_id).exists()
    return Response({'is_in_wishlist': exists})


def _get_cart(request):
    if request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return cart

    cart_id = request.headers.get("X-Cart-ID")
    if cart_id:
        try:
            cart = Cart.objects.get(uid=cart_id)
            return cart
        except Cart.DoesNotExist:
            return None

    return None


@api_view(["GET"])
# @permission_classes([IsAuthenticated])
def get_cart(request):
    try:

        cart = _get_cart(request)

        if not cart:
            return Response({"cart": {"items": [], "total_price": 0}})

        # items = []

        # for item in cart.cart_items.all():
        #     # print(item.variant.attribute_values.all())
        #     # print(item.total_price())
        #     items.append(
        #         {
        #             "product_name": f"{item.variant.product.title}",
        #             "product_slug": item.variant.product.slug,
        #             "variant_id": item.variant.uid,
        #             "category": item.variant.product.primary_category.name,
        #             "image": request.build_absolute_uri(item.variant.images.first().image.url) or None ,
        #             "attributes" : VariantAttributeValueSerializer(item.variant.attribute_values, many=True).data,
        #             "mrp": item.variant.mrp,
        #             "price": item.variant.price,
        #             "discount_percent": item.variant.discount_percent,
        #             "stock": item.variant.stock_qty,
        #             # "sub_total": item.subtotal,
        #             "quantity": item.quantity,
        #         }
        #     )

        # serializer = CartItemsSerializer(items, many=True, context={"request": request})

        # for d in serializer.data :
        #     print(d["variant"]["product"])

        # return Response({"message": "Cart Items", "data": items})
        return Response(
            {
                "message": "Cart Items",
                "cart": CartSerializer(cart, context={"request": request}).data,
            }
        )

    except Exception as e:
        print(e)
        return Response({"error": "Faild to fetch"})


@api_view(["POST"])
def add_to_cart(request):

    try:

        variant_id = request.data.get("variant_id")

        cart = _get_cart(request)

        if not cart:
            cart = Cart.objects.create()

        try:
            variant = ProductVariant.objects.only("uid", "stock_qty").get(
                uid=variant_id
            )
        except ProductVariant.DoesNotExist:
            return Response({"error": "Product Not Found"}, status=404)

        if variant.stock_qty < 1:
            return Response({"error": "Out Of Stock"}, status=400)

        cart_item, item_created = CartItems.objects.get_or_create(
            cart=cart, variant=variant, defaults={"quantity": 0}
        )

        if not item_created:
            cart_item.quantity += 1
            cart_item.save()
        else:
            cart_item.quantity = 1
            cart_item.save()

        return Response(
            {
                "message": "Added to cart",
                "cart": CartSerializer(cart, context={"request": request}).data,
            }
        )

    except Exception as e:
        print(e)
        return Response({"error": "Failed To Add"})


@api_view(["POST"])
def remove_from_cart(request):

    try:

        variant_id = request.data.get("variant_id")

        cart = _get_cart(request)

        try:
            variant = ProductVariant.objects.only("uid").get(uid=variant_id)
        except ProductVariant.DoesNotExist:
            return Response({"error": "Variant Not Found"}, status=404)

        try:

            cart_item = CartItems.objects.get(cart=cart, variant=variant)
            cart_item.delete()

        except CartItems.DoesNotExist:

            return Response({"error": "Item Not Found"}, status=404)

        return Response(
            {
                "message": "Removed From Cart",
                "cart": CartSerializer(cart, context={"request": request}).data,
            }
        )

    except Exception as e:
        return Response({"error": "Failed To Remove"})


@api_view(["POST"])
def update_quantity(request):

    action = request.data.get("action", "increase")
    variant_id = request.data.get("variant_id")

    cart = _get_cart(request)

    variant = get_object_or_404(ProductVariant, uid=variant_id)

    item = CartItems.objects.get(cart=cart, variant=variant)

    if action == "increase":

        if (variant.stock_qty - item.quantity) < 1:
            return Response({"error": "Out of Stock"}, status=400)

        if not item.quantity < 5:
            return Response(
                {"error": "You Can order only 5 item of this product"}, status=400
            )

        item.quantity += 1

        item.save()

    if action == "decrease":

        if item.quantity <= 1:
            item.delete()
        else:
            item.quantity -= 1
            item.save()

    return Response(
        {
            "message": "Cart Updated",
            "cart": CartSerializer(cart, context={"request": request}).data,
        }
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def merge_cart(request):
    guest_cart_id = request.data.get("cart_id")

    if not guest_cart_id or guest_cart_id == "null":
        return Response({"message": "No Guest Cart to Merge"})

    try:

        with transaction.atomic():

            guest_cart = Cart.objects.filter(uid=guest_cart_id).first()

            if not guest_cart:
                return Response({"message": "Guest Cart Not Found"}, status=404)

            user_cart, _ = Cart.objects.get_or_create(user=request.user)

            if guest_cart.uid == user_cart.uid:
                return Response(
                    {
                        "message": "Already merged",
                        "cart": CartSerializer(user_cart).data,
                    },
                    status=200,
                )

            guest_items = CartItems.objects.filter(cart=guest_cart)

            for item in guest_items:

                existing = user_cart.cart_items.filter(variant=item.variant).first()
                if existing:
                    existing.quantity += item.quantity
                    existing.save()
                    item.delete()
                else:
                    item.cart = user_cart
                    item.save()

            guest_cart.delete()

        return Response(
            {
                "message": "Guest Cart Merged",
                "cart": CartSerializer(
                    user_cart, context={"request": request}
                ).data,  # Yahan context add kiya
            },
            status=200,
        )

    except Exception as e:
        import traceback

        traceback.print_exc()  # Terminal me exact red error dikhayega ki Postgres kyu roya

        # STATUS 500 BEHJNA BOHOT ZAROORI HAI!
        return Response({"error": f"Failed to merge: {str(e)}"}, status=500)


@api_view(["GET"])
def clear_cart(request):
    cart = _get_cart(request)

    if not cart:
        return Response({"error": "Cart Not Found"}, status=404)

    cart.cart_items.all().delete()

    print(cart)

    return Response(
        {
            "message": "Cart Cleared",
            "cart": CartSerializer(cart, context={"request": request}).data,
        }
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def remove_coupon(request):
    try:

        cart_id = request.data.get("cart_id")

        if not cart_id:
            return Response({"error": "Cart id not found"}, status=400)

        cart = Cart.objects.get(user=request.user)

        cart.coupon = None

        cart.save()

        return Response(
            {
                "message": "Coupon Removed.",
                "cart": CartSerializer(cart, context={"request": request}).data,
            }
        )

    except Exception as e:
        print(e)
        return Response({"error": "Cart Not Found"})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def apply_coupon(request):

    try:

        coupon_code = request.data.get("coupon_code")

        cart_id = request.data.get("cart_id")

        cart = Cart.objects.get(uid=cart_id)

        if not coupon_code:
            return Response(
                {"success": False, "error": "Please Enter Coupon Code."},
                status=status.HTTP_200_OK,
            )

        if not cart_id:
            return Response(
                {"success": False, "error": "Cart not found"}, status=status.HTTP_200_OK
            )

        # cart = Cart.objects.get(user=request.user)

        coupon_obj = Coupon.objects.filter(coupon_code=coupon_code).first()

        if cart.coupon:
            return Response(
                {"success": False, "error": "A Coupon is already applied"},
                status=status.HTTP_200_OK,
            )

        if not coupon_obj:
            return Response(
                {"success": False, "error": "Invalid Coupon Code"},
                status=status.HTTP_200_OK,
            )

        if not coupon_obj.is_active:
            print(date.today())
            return Response(
                {"success": False, "error": "Coupon Expired"}, status=status.HTTP_200_OK
            )

        now = timezone.now()

        if coupon_obj.valid_from and now < coupon_obj.valid_from:
            return Response(
                {"success": False, "error": "Coupon not Active Yet"},
                status=status.HTTP_200_OK,
            )

        if coupon_obj.valid_to and now > coupon_obj.valid_to:
            return Response(
                {"success": False, "error": "This Coupon has Expired"},
                status=status.HTTP_200_OK,
            )

        if coupon_obj.used_by.filter(id=request.user.id).exists():
            return Response(
                {"success": False, "error": "You Alredy Used This Coupon"},
                status=status.HTTP_200_OK,
            )

        if cart.total_item < coupon_obj.min_quantity:
            return Response(
                {
                    "success": False,
                    "error": f"Minimun {coupon_obj.min_quantity} items required",
                },
                status=status.HTTP_200_OK,
            )

        if cart.subtotal < coupon_obj.min_amount:
            return Response(
                {
                    "success": False,
                    "error": f"Minimun order Amount Should be ₹{coupon_obj.min_amount}",
                },
                status=status.HTTP_200_OK,
            )

        cart.coupon = coupon_obj

        cart.save()

        return Response(
            {
                "success": True,
                "message": "Coupon Applied.",
                "cart": CartSerializer(cart, context={"request": request}).data,
            }
        )

    except Exception as e:
        print(e)
        return Response({"error": "Cart Not Found"})
