from cart.models import Cart,CartItems

def cart_counter(request):
    count = 0

    cart_id = request.session.get("cart_id")

    if cart_id:
        try:
            cart = Cart.objects.get(cart_id=cart_id)
            count = CartItems.objects.filter(cart=cart).count()
        except Cart.DoesNotExist:
            pass

    return {"cart_count": count}
 