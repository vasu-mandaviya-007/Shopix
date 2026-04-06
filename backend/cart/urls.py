from django.urls import path

# from .views import add_to_cart, cart_page, remove_from_cart, update_quantity,remove_coupon
from .views import (
    get_cart,
    add_to_cart,
    remove_from_cart,
    update_quantity,
    merge_cart,
    clear_cart,
    apply_coupon,
    remove_coupon,
)

urlpatterns = [
    path("", get_cart),
    path("add-to-cart/", add_to_cart),
    path("remove-from-cart/", remove_from_cart),
    path("update-quantity/", update_quantity),
    path("merge-cart/", merge_cart),
    path("clear-cart/", clear_cart),
    path("apply-coupon/", apply_coupon),
    path("remove-coupon/", remove_coupon),
    # path("remove/<uuid:product_id>/", remove_from_cart, name="remove-from-cart"),
]
