from django.contrib import admin
import nested_admin
from .models import Order, OrderItem
import nested_admin

# Register your models here.
# admin.site.register(OrderItem)


class OrderItemInline(nested_admin.NestedTabularInline):
    model = OrderItem
    extra = 0  # Faltu empty rows nahi dikhayega
    # Store owner galti se price ya quantity change na kar de isliye inko readonly kar sakte hain
    readonly_fields = ("product", "quantity", "price", "total_price")


@admin.register(Order)
class OrderAdmin(nested_admin.NestedModelAdmin):

    list_display = (
        "uid",
        "user",
        "get_total_amount",
        "status",
        "is_paid",
        "created_at",
    )

    # Right side mein Filters
    list_filter = ("status", "is_paid", "created_at", "refund_status")

    # Search bar (Upar)
    # user__email ka matlab hai wo User table ke andar jaakar email search karega
    search_fields = ("uid", "user__email", "user__first_name", "transaction_id")

    # Date ke hisaab se upar ek breadcrumb navigation aayega
    date_hierarchy = "created_at"

    # Order ke andar uske products (items) dikhane ke liye
    inlines = [OrderItemInline]

    # Security: Kuch fields ko 'Read Only' kar do taaki admin galti se change na kar de
    readonly_fields = ("uid", "transaction_id", "delivered_at", "created_at")

    # Default sorting: Sabse naye order sabse upar dikhenge
    ordering = ("-created_at",)

    # Optional: Amount ko format karke dikhane ke liye (eg: ₹5,000)
    # def get_total_amount(self, obj):
    #     return f"₹ {obj.total_amount}"

    # get_total_amount.short_description = "Total Amount"

    # Admin panel ko aur sundar banane ke liye sections (Fieldsets)
    # fieldsets = (
    #     (
    #         "Order Information",
    #         {"fields": ("uid", "user", "status", "created_at", "delivered_at")},
    #     ),
    #     (
    #         "Payment Details",
    #         {"fields": ("total_amount", "is_paid", "transaction_id", "refund_status")},
    #     ),
    #     (
    #         "Shipping Address",
    #         {
    #             # Agar aapne address model isme link kiya hai toh uske fields yahan daal sakte hain
    #             "fields": ("address_line",),
    #             "classes": (
    #                 "collapse",
    #             ),  # Isey by default band rakhega, click karne par khulega
    #         },
    #     ),
    # )
    list_display = ["uid", "user__email", "total_amount", "is_paid", "status"]
