from django.contrib import admin, messages
from django.utils.html import format_html

# 🌟 nested_admin hata kar Unfold imports lagaye
from unfold.admin import ModelAdmin, TabularInline
from unfold.contrib.filters.admin import (
    RangeDateFilter,
    RangeDateTimeFilter,
    MultipleChoicesDropdownFilter,
    ChoicesCheckboxFilter,
    BooleanRadioFilter
)
from unfold.decorators import action

from django.templatetags.static import static
from .models import Order, OrderItem, Address

from django.http import HttpResponse
from django.template.loader import get_template
from django.shortcuts import get_object_or_404, redirect
from django.contrib import messages
from xhtml2pdf import pisa

from django.core.mail import send_mail
from django.conf import settings
import threading  # 🚀 Iska jadoo main niche bataunga

import stripe

stripe.api_key = settings.STRIPE_SECRET_KEY


def send_order_update_email(order):
    subject = f"Order Update: Your order #{order.uid} is now {order.status}"

    # Simple text (agar customer ka email HTML support na kare)
    text_message = (
        f"Hi {order.user.first_name},\n\nYour order #{order.uid} is now {order.status}."
    )

    # 🎨 Premium HTML Email (Ye ekdum professional lagega)
    html_message = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <img style="display: block; margin: 0 auto; margin-bottom: 20px;" height="50px" src="https://res.cloudinary.com/dhdzriwzq/image/upload/q_auto/f_auto/v1775754635/shopix_logo_gvl0ea.png" />
        <h2 style="color: #1f2937;">Order Update 📦</h2>
        <p style="color: #4b5563; font-size: 16px;">Hi {order.user.first_name},</p>
        <p style="color: #4b5563; font-size: 16px;">The status of your order <strong>#{order.uid}</strong> has been updated.</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">Current Status</p>
            <h3 style="margin: 5px 0 0 0; color: #2563eb; font-size: 24px;">{order.status}</h3>
        </div>
        
        <p style="color: #4b5563; font-size: 14px;">If you have any questions, simply reply to this email.</p>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 30px;">Thank you for shopping with us!</p>
    </div>
    """

    send_mail(
        subject=subject,
        message=text_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[order.user.email],  # Customer ko bhej rahe hain
        fail_silently=False,
        html_message=html_message,  # HTML wala design attach kar diya
    )


# 🌟 Unfold ModelAdmin apply kiya gaya hai
admin.site.register(OrderItem, ModelAdmin)


@admin.register(Address)
class AddressAdmin(ModelAdmin):  # 🌟 Changed to Unfold's ModelAdmin
    readonly_fields = ("country",)


class OrderItemInline(TabularInline):  # 🌟 Changed to Unfold's TabularInline
    model = OrderItem
    extra = 0  # Faltu empty rows nahi dikhayega
    tab = True
    # Store owner galti se price ya quantity change na kar de isliye inko readonly kar sakte hain
    # readonly_fields = ("product", "quantity", "price", "total_price")
    def get_readonly_fields(self, request, obj=None):
        if obj:
            # Agar purana order hai: Sab lock kar do taaki koi tampering na ho
            return ("product", "quantity", "price", "total_price")
        # Agar naya order ban raha hai: Admin ko product aur qty select karne do!
        # Sirf total_price lock rakho (wo auto-calculate hoga)
        return ("total_price",)


# Order Admin Actions
@admin.action(description="🚚 Mark selected orders as Shipped")
def mark_as_shipped(modeladmin, request, queryset):
    for order in queryset:
        order.status = "Shipped"
        order.save()
        # 🚀 Threading ka Jadoo: Background me email bhejo, admin ko wait mat karao!
        if order.user and order.user.email:
            email_thread = threading.Thread(
                target=send_order_update_email, args=(order,)
            )
            email_thread.start()

    modeladmin.message_user(
        request,
        f"Successfully marked {queryset.count()} orders as Shipped.",
        messages.SUCCESS,
    )


@admin.action(description="📦 Mark selected orders as Delivered")
def mark_as_delivered(modeladmin, request, queryset):
    for order in queryset:
        order.status = "Delivered"
        order.save()

        # 🚀 Threading ka Jadoo: Background me email bhejo, admin ko wait mat karao!
        if order.user and order.user.email:
            email_thread = threading.Thread(
                target=send_order_update_email, args=(order,)
            )
            email_thread.start()

    modeladmin.message_user(
        request,
        f"Successfully marked {queryset.count()} orders as Delivered.",
        messages.SUCCESS,
    )


@admin.register(Order)
class OrderAdmin(ModelAdmin):  # 🌟 Changed to Unfold's ModelAdmin

    # compressed_fields = True
    list_filter_submit = True
    inlines = [OrderItemInline]

    # --- DASHBOARD LAYOUT ---
    list_display = [
        "uid",
        "get_customer",
        "total_item",
        "total_amount",
        "payment_status_badge",
        "order_status_badge",
        "created_at",
    ]
    list_filter = [
        ("status", MultipleChoicesDropdownFilter),
        ("is_paid",BooleanRadioFilter),
        ("created_at", RangeDateTimeFilter),
        ("refund_status",ChoicesCheckboxFilter),
    ]
    search_fields = ("uid", "user__email", "user__first_name", "transaction_id")
    ordering = ("-created_at",)
    date_hierarchy = "created_at"

    # --- VIP BUTTONS (Both in Row and Inside Order) ---
    actions = [mark_as_shipped, mark_as_delivered]
    actions_row = ["download_invoice_admin", "issue_full_refund"]
    actions_detail = ["download_invoice_admin", "issue_full_refund"]

    # Order ke andar uske products (items) dikhane ke liye

    # Security: Kuch fields ko 'Read Only' kar do taaki admin galti se change na kar de
    # readonly_fields = ("uid", "transaction_id", "delivered_at", "created_at")
    def get_readonly_fields(self, request, obj=None):
        if obj:
            # Agar purana order hai (obj exist karta hai), toh ye sab readonly kar do
            return ("uid", "transaction_id", "created_at", "total_amount", "user")
        else:
            # Agar NAYA order ban raha hai, toh sirf ID aur Date readonly rakho
            # Total amount hum auto-calculate karenge baad me
            return ("uid", "transaction_id", "created_at", "total_amount")

    # Default sorting: Sabse naye order sabse upar dikhenge


    # list_display = ["uid", "user__email", "total_amount", "is_paid", "status"]

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

    @admin.display(description="Total Items", ordering="total_item")
    def total_item(self, obj):
        count = obj.items.count()
        return count

    @admin.display(description="Customer", ordering="user__email")
    def get_customer(self, obj):
        return obj.user.email if obj.user else "Guest"

    @admin.display(description="Payment", ordering="is_paid")
    def payment_status_badge(self, obj):
        # 🎨 Safe Tailwind colors (Dark mode supported)
        unpaid_img = static("icons/hourglass.png")
        if obj.is_paid:
            return format_html(
                '<span class="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-2 py-1 rounded-md text-xs font-semibold">{}</span>',
                "✅ Paid",
            )
        return format_html(
            '<span class="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 px-2 py-2 rounded-md text-xs font-semibold">'
            '<img src="{}" class="w-5 h-5 inline-block" /> {}'
            "</span>",
            unpaid_img,
            "Unpaid",
        )

    @admin.display(description="Order Status", ordering="status")
    def order_status_badge(self, obj):
        # Status ke hisaab se alag-alag colors assign karega
        status = str(obj.status).lower()

        # 🕒 Pending / Processing
        if "pending" in status or "processing" in status:
            # Apni pending wali SVG ka naam yahan likhein
            icon_url = static("icons/pending.svg")
            return format_html(
                '<span class="inline-flex items-center justify-center gap-2 border border-yellow-300 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 px-2 py-1 rounded-md text-xs font-semibold">'
                '<img src="{}" class="w-5 h-5" alt="pending icon"/> {}'
                "</span>",
                icon_url,
                obj.status,
            )

        # 🚚 Shipped / Out for Delivery (Aapka exact code)
        elif "shipped" in status or "out for delivery" in status:
            icon_url = static("icons/delivery-truck.png")
            return format_html(
                '<span class="inline-flex items-center justify-center gap-2 border border-blue-300 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded-md text-xs font-semibold">'
                '<img src="{}" class="w-5 h-5" alt="shipped icon"/> {}'
                "</span>",
                icon_url,
                obj.status,
            )

        # 📦 Delivered / Completed
        elif "delivered" in status or "completed" in status:
            icon_url = static("icons/delivered.svg")
            return format_html(
                '<span class="inline-flex items-center justify-center gap-2 border border-emerald-300 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100 px-2 py-1 rounded-md text-xs font-semibold">'
                '<img src="{}" class="w-5 h-5" alt="delivered icon"/> {}'
                "</span>",
                icon_url,
                obj.status,
            )

        # ❌ Cancelled
        elif "cancel" in status:
            icon_url = static("icons/cancelled.svg")
            return format_html(
                '<span class="inline-flex items-center justify-center gap-2 border border-red-300 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 px-2 py-1 rounded-md text-xs font-semibold">'
                '<img src="{}" class="w-5 h-5" alt="cancelled icon"/> {}'
                "</span>",
                icon_url,
                obj.status,
            )
        elif "return" in status:
            icon_url = static("icons/return.svg")
            return format_html(
                '<span class="inline-flex items-center justify-center gap-2 border bg-purple-50 text-purple-700 border-purple-200 dark:bg-red-900 dark:text-red-100 px-2 py-1 rounded-md text-xs font-semibold">'
                '<img src="{}" class="w-5 h-5" alt="cancelled icon"/> {}'
                "</span>",
                icon_url,
                obj.status,
            )

        # ⚪ Default / Any other status
        icon_url = static("icons/paid.png")
        return format_html(
            '<span class="inline-flex items-center justify-center gap-2 border border-gray-300 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-md text-xs font-semibold">'
            '<img src="{}" class="w-4 h-4" alt="status icon"/> {}'
            "</span>",
            icon_url,
            obj.status,
        )

    # 🚨 STEP 1: Unfold ko batana ki har row (line) me ek button chahiye
    

    # 🚨 STEP 2: Custom Admin Button Logic
    @action(
        description=format_html(
            '<span class="inline-flex items-center gap-2"><img src="{}" class="w-4 h-4 object-contain" alt="logo" /> Download Invoice</span>',
            static("icons/docs-file.svg"),
        )
    )
    def download_invoice_admin(self, request, object_id):
        # 1. Order get karna (Yahan user=request.user HATA diya hai taaki admin koi bhi order dekh sake)
        order = get_object_or_404(Order, uid=object_id)

        # 2. Bill Calculations (Aapka exact code)
        total_mrp = 0
        for item in order.items.all():
            mrp = item.original_price if item.original_price else item.price
            total_mrp += mrp * item.quantity

        mrp_discount = total_mrp - order.subtotal()

        # 3. HTML Setup
        template = get_template("invoice.html")
        context = {"order": order, "total_mrp": total_mrp, "mrp_discount": mrp_discount}
        html = template.render(context)

        # 4. PDF Generation
        response = HttpResponse(content_type="application/pdf")
        response["Content-Disposition"] = (
            f'attachment; filename="Shopix_Invoice_{order.uid}.pdf"'
        )

        pisa_status = pisa.CreatePDF(html, dest=response)

        # 5. Error Handling
        if pisa_status.err:
            self.message_user(
                request, "PDF generate karne me koi error aa gayi.", messages.ERROR
            )
            return redirect(request.META.get("HTTP_REFERER", "/admin/"))

        # 🌟 MAGIC: Agar PDF ban gayi, toh seedha response return kar do.
        # Isse browser bina naya page khole us file ko download kar lega!
        return response

    @action(description="Cancel & Refund", icon="currency_rupee")
    def issue_full_refund(self, request, object_id):
        order = get_object_or_404(Order, uid=object_id)

        if "cancel" in order.status.lower() or "refund" in order.status.lower():
            self.message_user(
                request,
                "This order is already cancelled or refunded.",
                messages.WARNING,
            )
            return redirect(request.META.get("HTTP_REFERER", "/admin/"))

        if not order.transaction_id:
            self.message_user(
                request,
                "Error: No Stripe Transaction ID found for this order.",
                messages.ERROR,
            )
            return redirect(request.META.get("HTTP_REFERER", "/admin/"))

        try:

            refund = stripe.Refund.create(payment_intent=order.transaction_id)

            if hasattr(order, "refund_status"):
                if refund.status == "succeeded":
                    # Agar test mode me turant success ho gaya, toh sidha Completed mark karo
                    order.refund_status = "Completed"
                else:
                    # Agar bank time le raha hai, tabhi Processing me dalo (Webhook handle karega)
                    order.refund_status = "Processing"

            if refund.status == "succeeded" or refund.status == "pending":
                order.status = "Cancelled"
                order.save()
                self.message_user(
                    request,
                    f"Successfully refunded {order.total_amount} via Stripe.",
                    messages.SUCCESS,
                )
            else:
                self.message_user(
                    request,
                    "Stripe accepted the request but status is not succeeded.",
                    messages.WARNING,
                )

        except stripe.error.StripeError as e:
            # Agar customer ka bank error de ya Stripe down ho
            self.message_user(
                request, f"Stripe Error: {e.user_message}", messages.ERROR
            )
        except Exception as e:
            # Code me koi aur error aa jaye
            self.message_user(
                request, "System Error: Could not process refund.", messages.ERROR
            )

        return redirect(request.META.get("HTTP_REFERER", "/admin/"))
