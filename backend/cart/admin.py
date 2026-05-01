from django.contrib import admin
from django.contrib import messages
from django.utils.html import format_html
from django.utils import timezone
from datetime import timedelta
from unfold.admin import ModelAdmin, TabularInline
from unfold.decorators import display
from .models import Cart, CartItems, Coupon, Wishlist
from unfold.contrib.filters.admin import DropdownFilter

# @admin.register(Cart)
# class CartAdmin(ModelAdmin):
#     list_display = ["user","coupon","total_item","subtotal","mrp_total","discount_on_mrp","discount_amount","shipping_cost","total_price"] 



@admin.register(Wishlist)
class WishlistAdmin(ModelAdmin): # 🌟 3. Yahan ModelAdmin use kiya (admin.ModelAdmin ki jagah)
    list_display = ('id', 'user_email', 'get_variant_name', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'user__email', 'variant__product__title')
    ordering = ('-created_at',)
    
    # Performance Optimization
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'variant', 'variant__product')

    # Unfold style me custom columns
    @display(description='User Email')
    def user_email(self, obj):
        return obj.user.email

    @display(description='Wishlisted Item')
    def get_variant_name(self, obj):
        return obj.variant.variant_name

@admin.register(Coupon)
class CouponAdmin(ModelAdmin):
    list_display = [
        'coupon_code', 'discount_badge', 'get_max_discount', 
        'usage_stats', 'is_auto_apply', 'status_badge'
    ]
    search_fields = ['coupon_code']
    list_filter = ['is_active', 'is_auto_apply']
    
    # ManyToMany field ko sundar dikhane ke liye
    filter_horizontal = ['used_by'] 

    fieldsets = (
        ("Coupon Identity", {
            "fields": ("coupon_code", "is_active", "is_auto_apply")
        }),
        ("Discount Details", {
            "fields": ("discount_percentage", "max_discount_amount")
        }),
        ("Conditions & Limits", {
            "fields": ("min_quantity", "min_amount", "max_uses", "used_count")
        }),
        ("Validity & Users", {
            "fields": ("valid_from", "valid_to", "used_by")
        }),
    )

    def discount_badge(self, obj):
        return format_html(f'<span style="font-weight: bold; color: #2563eb;">{obj.discount_percentage}% OFF</span>',"")
    discount_badge.short_description = "Discount"

    def get_max_discount(self, obj):
        return f"Up to ₹{obj.max_discount_amount}" if obj.max_discount_amount else "No Limit"
    get_max_discount.short_description = "Max Cap"

    def usage_stats(self, obj):
        max_u = obj.max_uses if obj.max_uses else '∞'
        # Agar limit reach ho gayi hai toh red color me dikhao
        if obj.max_uses and obj.used_count >= obj.max_uses:
            return format_html(f'<span style="color: red; font-weight: bold;">{obj.used_count} / {max_u} (Full)</span>')
        return f"{obj.used_count} / {max_u}"
    usage_stats.short_description = "Uses"

    def status_badge(self, obj):
        if not obj.is_valid_now:
            # Agar expire ho gaya hai toh Red badge
            if obj.valid_to and timezone.now() > obj.valid_to:
                return format_html('<span class="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold border border-red-300">Expired</span>',"")
            return format_html('<span class="bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs font-bold border border-gray-300">Inactive</span>',"")
            
        return format_html('<span class="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold border border-green-300">Active</span>',"")


class CartItemInline(TabularInline):
    model = CartItems
    extra = 0
    can_delete = False
    
    # Admin cart items change na kare
    readonly_fields = ['variant', 'quantity', 'get_item_mrp', 'get_item_total']
    fields = ['variant', 'quantity', 'get_item_mrp', 'get_item_total']

    def has_add_permission(self, request, obj):
        return False

    def get_item_mrp(self, obj):
        return f"₹ {obj.total_mrp_price()}"
    get_item_mrp.short_description = "Total MRP"

    def get_item_total(self, obj):
        return f"₹ {obj.total_price()}"
    get_item_total.short_description = "Selling Price"


@admin.register(Cart)
class CartAdmin(ModelAdmin):
    list_display = [
        'cart_id_display', 'get_customer', 'total_item', 
        'get_subtotal', 'get_discount', 'get_final_price', 'cart_status'
    ]
    search_fields = ['user__email', 'user__first_name', 'coupon__coupon_code']
    
    # Assuming aapke BaseModel me created_at aur updated_at hain
    # list_filter = [('coupon',DropdownFilter)] 
    
    inlines = [CartItemInline]
    actions = ['delete_empty_carts'] 
 
    readonly_fields = ['user', 'coupon']

    # --- CUSTOM COLUMNS ---

    def cart_id_display(self, obj):
        return f"CART-#{obj.uid}"
    cart_id_display.short_description = "ID"

    def get_customer(self, obj):
        if obj.user:
            return format_html("<b>{}</b> <br><span style='color:gray; font-size:12px;'>{}</span>", obj.user.first_name, obj.user.email)
        return format_html("<span style='color:gray;'>Guest User</span>","")
    get_customer.short_description = "Customer"

    def total_items_badge(self, obj):
        return obj.total_item
    total_items_badge.short_description = "Items"

    def get_subtotal(self, obj):
        return f"₹ {obj.subtotal}"
    get_subtotal.short_description = "Subtotal"

    def get_discount(self, obj):
        if obj.discount_amount > 0:
            return format_html("<span style='color: #16a34a; font-weight: bold;'>- ₹ {}</span> <br><small>{}</small>", obj.discount_amount, obj.coupon.coupon_code if obj.coupon else "")
        return "-"
    get_discount.short_description = "Discount"

    def get_final_price(self, obj):
        return format_html("<span style='font-size: 14px; font-weight: bold;'>₹ {}</span>", obj.total_price)
    get_final_price.short_description = "Payable"

    def cart_status(self, obj):
        # Using the property you defined
        if obj.total_item == 0:
            return format_html('<span class="bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs font-bold border border-gray-300">Empty</span>','')
            
        # 🌟 Abandoned Cart Logic (Checks if cart hasn't been touched in 24 hours)
        try:
            # Assuming 'updated_at' is from your BaseModel
            time_threshold = timezone.now() - timedelta(hours=24)
            if obj.updated_at < time_threshold:
                return format_html('<span class="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold border border-red-300">🚨 Abandoned</span>',"")
        except AttributeError:
            pass # Agar updated_at nahi hai model me toh skip
            
        return format_html('<span class="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold border border-green-300">🟢 Active</span>',"")
    cart_status.short_description = "Status"

    # --- ACTIONS ---

    @admin.action(description="🧹 Clean up empty carts")
    def delete_empty_carts(self, request, queryset):
        count = 0
        for cart in queryset:
            if cart.total_item == 0:
                cart.delete()
                count += 1
        self.message_user(request, f"Successfully deleted {count} empty cart(s).", messages.SUCCESS)


@admin.register(CartItems)
class CartItemsAdmin(ModelAdmin):
    list_display = ["cart","variant","quantity","total_price"]
 
