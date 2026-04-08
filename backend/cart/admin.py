from django.contrib import admin
from .models import Cart, CartItems, Coupon
from unfold.admin import ModelAdmin


@admin.register(Cart)
class CartAdmin(ModelAdmin):
    list_display = ["user","coupon","total_item","subtotal","mrp_total","discount_on_mrp","discount_amount","shipping_cost","total_price"] 

@admin.register(CartItems)
class CartItemsAdmin(ModelAdmin):
    list_display = ["cart","variant","quantity","total_price"]


@admin.register(Coupon)
class CouponAdmin(ModelAdmin):
    list_display = ["coupon_code", "is_active", "discount_percentage", "min_amount"]
