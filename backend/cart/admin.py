from django.contrib import admin
from .models import Cart,CartItems,Coupon

 
admin.site.register(Cart)
admin.site.register(CartItems)

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ["coupon_code", "is_active", "discount_percentage", "min_amount"]
