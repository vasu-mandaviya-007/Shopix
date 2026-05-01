from django.contrib import admin, messages
from django.utils.html import format_html
from django.db.models import Sum

# 🌟 nested_admin hata kar Unfold imports lagaye
from unfold.admin import ModelAdmin, TabularInline
from unfold.contrib.filters.admin import (
    BooleanRadioFilter,
    DropdownFilter,
    RangeDateTimeFilter,
    MultipleChoicesDropdownFilter,
    ChoicesCheckboxFilter,
    BooleanRadioFilter,
)
from unfold.decorators import action

from django.templatetags.static import static
from .models import Order, OrderItem, Address

from django.http import HttpResponse
from django.shortcuts import get_object_or_404, redirect
from django.contrib import messages
from django.contrib.admin.helpers import ActionForm
from django import forms
from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.contrib import messages
from django.contrib.admin import helpers

from django.core.mail import send_mail
from django.conf import settings
import threading  # 🚀 Iska jadoo main niche bataunga
from django import forms
import stripe
from .utils import generate_order_invoice_pdf
import csv

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
# @admin.register(OrderItem)
# class OrderItemAdmin(ModelAdmin) :
#     list_display = ["product","price","original_price","quantity","total_price"]


# @admin.register(Address)
# class AddressAdmin(ModelAdmin):  # 🌟 Changed to Unfold's ModelAdmin
#     list_display = ["user", "address_line", "city", "state", "pincode", "country"]
#     search_fields = ["user__email", "address_line", "city", "state", "pincode", "country"]
#     list_filter = [("user",AutocompleteSelectFilter)]
#     list_filter_submit = True
#     readonly_fields = ("country",)


class CityDropdownFilter(DropdownFilter):
    title = "City"  # Filter ke upar kya naam dikhega
    parameter_name = "city"  # URL mein kya aayega (jaise ?city=Delhi)

    def lookups(self, request, model_admin):
        # Database se saari UNIQUE cities nikal lo.
        # Iska fayda ye hai ki dropdown me wahi city dikhegi jiska koi order hoga.
        cities = model_admin.model.objects.values_list("city", flat=True).distinct()

        # (value, label) ka format return karna hota hai
        return [(city, city) for city in cities if city]

    def queryset(self, request, queryset):
        # Jab admin koi city select karega, toh ye filter apply hoga
        if self.value():
            return queryset.filter(city=self.value())
        return queryset


class StateDropdownFilter(DropdownFilter):
    title = "State"  # Filter ke upar kya naam dikhega
    parameter_name = "state"  # URL mein kya aayega (jaise ?state=Delhi)

    def lookups(self, request, model_admin):
        # Database se saari UNIQUE states nikal lo.
        # Iska fayda ye hai ki dropdown me wahi state dikhegi jiska koi order hoga.
        states = model_admin.model.objects.values_list("state", flat=True).distinct()

        # (value, label) ka format return karna hota hai
        return [(state, state) for state in states if state]

    def queryset(self, request, queryset):
        # Jab admin koi state select karega, toh ye filter apply hoga
        if self.value():
            return queryset.filter(state=self.value())
        return queryset


@admin.register(Address)
class AddressAdmin(ModelAdmin):
    list_display = [
        "get_customer",
        "formatted_address",
        "city",
        "pincode",
        "default_badge",
        "google_maps_link",
    ]
    list_display_links = ["get_customer"]
    list_filter_submit = True

    # Delivery zone aur status ke hisab se filters
    list_filter = [
        StateDropdownFilter, 
        ("is_default",BooleanRadioFilter),  
        CityDropdownFilter]

    search_fields = [
        "user__email",
        "user__first_name",
        "phone",
        "pincode",
        "city",
        "address_line",
    ]

    # --- CUSTOM COLUMNS ---

    def get_customer(self, obj):
        # Customer ka naam aur contact detail
        try:
            return format_html(
                "<b>{}</b> <br><span style='color:gray; font-size:12px;'>{}</span>",
                obj.user.first_name,
                obj.user.email,
            )
        except:
            return "Guest"

    get_customer.short_description = "Customer Details"

    def formatted_address(self, obj):
        # Lamba address ek clean tarike se dikhane ke liye
        # Note: 'address_line' ki jagah aap 'address_line_1' ya jo bhi aapka field hai wo use karein
        try:
            return format_html(
                "<span style='font-size: 13px;'>{}</span>", obj.address_line
            )
        except:
            return "-"

    formatted_address.short_description = "Street Address"

    def default_badge(self, obj):
        # Agar ye customer ka primary address hai
        try:
            if obj.is_default:
                return format_html(
                    '<span class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold border border-blue-300">⭐ Default</span>',
                    "",
                )
            return "-"
        except:
            return "-"

    default_badge.short_description = "Status"

    def google_maps_link(self, obj):
        """🌟 RESUME FEATURE: One-Click Google Maps Link"""
        try:
            # Pura address mila kar ek Google map search query banana
            full_address = f"{obj.address_line}, {obj.city}, {obj.state}, {obj.pincode}"
            # URL friendly banane ke liye spaces ko '+' se replace karna
            query = full_address.replace(" ", "+").replace(",", "")
            url = f"https://www.google.com/maps/search/?api=1&query={query}"

            return format_html(
                '<a href="{}" target="_blank" class="text-blue-600 hover:text-blue-800 font-bold transition-all">'
                "📍 View on Map</a>",
                url,
            )
        except:
            return "N/A"

    google_maps_link.short_description = "Location"


# 1. Form update karein
class OrderItemForm(forms.ModelForm):
    class Meta:
        model = OrderItem
        # exclude = ("cost_price","product_name")  # Admin ko cost price nahi dikhani, wo hum backend me handle karenge
        fields = ["product", "price", "quantity", "original_price"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Naya order banate time (jab ID nahi hoti)
        if not self.instance.pk:
            for field in ["price", "original_price", "total_price"]:
                if field in self.fields:
                    self.fields[field].required = False
                    # 🚨 MAGIC: Admin type nahi kar payega, par JS value daal payegi!
                    self.fields[field].widget.attrs["readonly"] = True
                    self.fields[field].widget.attrs[
                        "style"
                    ] = "background-color: #f3f4f6; pointer-events: none;"


# 2. Inline se readonly_fields HATA dein naye order ke liye
class OrderItemInline(TabularInline):
    model = OrderItem
    form = OrderItemForm
    extra = 1
    can_delete = False
    tab = True
    readonly_fields = ["product", "price", "quantity", "original_price", "total_price"]

    def has_add_permission(self, request, obj):
        return False

    # def get_readonly_fields(self, request, obj=None):
    #     if obj:
    #         # Purana order dekhte time sab lock
    #         return ("product", "quantity", "price","original_price","cost_price","total_price")
    #     # 🚨 Naya banate time ab hum yahan se price lock nahi karenge,
    #     # wo upar Form me HTML se lock ho chuka hai.
    #     return ()


from django.contrib.admin import SimpleListFilter


# 🌟 NAYA: Custom Filter Grouping
class OrderStatusGroupFilter(SimpleListFilter):
    title = "Order Status"
    parameter_name = (
        "status"  # Ye wahi parameter hai jo hamare HTML tabs me use ho raha hai
    )

    def lookups(self, request, model_admin):
        # Ye right-side default admin filter sidebar ko bhi clean kar dega
        return [
            ("Pending", "Pending (Unpaid)"),
            ("Paid", "Paid (To Pack)"),
            ("Delivered", "Delivered (Completed)"),
            ("Cancelled", "Cancelled & Failed"),
            ("Returned", "Returns & Refunds"),
        ]

    def queryset(self, request, queryset):
        # 🌟 THE MAGIC FIX: Yahan hum groups combine kar rahe hain
        if self.value() == "Pending":
            return queryset.filter(status="Pending")
        elif self.value() == "Paid":
            return queryset.filter(status="Paid")
        elif self.value() == "Delivered":
            return queryset.filter(status="Delivered")
        elif self.value() == "Cancelled":
            return queryset.filter(status__in=["Cancelled", "Failed"])  # Dono aayenge
        elif self.value() == "Returned":
            return queryset.filter(status__in=["Returned", "Refunded"])  # Dono aayenge
        return queryset


from django.template.response import TemplateResponse


@admin.register(Order)
class OrderAdmin(ModelAdmin):  # 🌟 Changed to Unfold's ModelAdmin

    compressed_fields = True
    list_filter_submit = True
    warn_unsaved_form = True
    change_form_show_cancel_button = True
    inlines = [OrderItemInline]

    class Media:
        js = ("js/admin_order.js",)

    # ===================================================================
    # --- DASHBOARD LAYOUT ---
    # ===================================================================

    list_display = [
        "get_customer",
        "get_total_items",
        "total_amount",
        "payment_status_badge",
        "order_status_badge",
        "created_at",
    ]
    list_filter = [
        ("status", MultipleChoicesDropdownFilter),
        # OrderStatusGroupFilter,
        ("is_paid", BooleanRadioFilter),
        ("created_at", RangeDateTimeFilter),
        ("refund_status", ChoicesCheckboxFilter),
    ]
    search_fields = ("uid", "user__email", "user__first_name", "transaction_id")
    ordering = ("-created_at",)
    # date_hierarchy = "created_at"

    # ===================================================================
    # --- VIP BUTTONS (Both in Row and Inside Order) ---
    # ===================================================================

    actions = ["mark_as_shipped", "mark_as_delivered", "update_status_popup"]

    actions_list = ["export_sales_report"]
    actions_row = ["download_invoice_admin", "issue_full_refund"]
    actions_detail = ["download_invoice_admin", "issue_full_refund"]

    def update_status_popup(self, request, queryset):
        # Agar user ne 'Apply' daba diya hai
        if "apply" in request.POST:
            new_status = request.POST.get("new_status")
            if new_status:
                count = queryset.update(status=new_status)
                self.message_user(
                    request,
                    f"Successfully updated {count} orders to {new_status}.",
                    messages.SUCCESS,
                )
            return HttpResponseRedirect(request.get_full_path())

        # Ye context popup ke liye zaroori hai
        context = {
            **self.admin_site.each_context(request),
            "orders": queryset,
            "title": "Quick Status Update",
            "action_checkbox_name": helpers.ACTION_CHECKBOX_NAME,
            "opts": self.model._meta,
        }

        # Hamara naya minimalist popup template
        return TemplateResponse(request, "admin/order_status_popup.html", context)

    update_status_popup.short_description = "🔄 Update Selected Orders Status"

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

    # ===================================================================
    # 🧠 SMART FORM LOGIC (For Manual Order Creation)
    # ===================================================================

    def get_readonly_fields(self, request, obj=None):
        if obj:
            # Agar purana order hai (obj exist karta hai), toh ye sab readonly kar do
            return (
                "uid",
                "user",
                "full_name",
                "email",
                "phone",
                "address_line",
                "city",
                "state",
                "postal_code",
                "landmark",
                "transaction_id",
                "payment_method",
                "created_at",
                "tax_amount",
                "total_amount",
                "shipping_cost",
                "discount_amount",
                "coupon_used",
            )
        else:
            # Agar NAYA order ban raha hai, toh sirf ID aur Date readonly rakho
            # Total amount hum auto-calculate karenge baad me
            return (
                "uid",
                "transaction_id",
                "payment_method",
                "refund_status",
                "delivered_at",
                "created_at",
                "total_amount",
            )

    fieldsets = (
        ("Customer Details", {"fields": ("user", "full_name", "email", "phone")}),
        (
            "Shipping Address",
            {"fields": ("address_line", "city", "state", "postal_code", "landmark")},
        ),
        (
            "Logistics & Tracking (Editable)",
            {"fields": ("courier_name", "tracking_number", "delivered_at")},
        ),
        (
            "Financials (Protected)",
            {
                "fields": (
                    "total_amount",
                    "tax_amount",
                    "shipping_cost",
                    "discount_amount",
                    "coupon_used",
                )
            },
        ),
        (
            "Payment & Status",
            {
                "fields": (
                    "status",
                    "is_paid",
                    "payment_method",
                    "transaction_id",
                    "refund_status",
                )
            },
        ),
    )

    def save_model(self, request, obj, form, change):
        # Agar naya order ban raha hai aur total_amount khali/null hai
        if not getattr(obj, "total_amount", None):
            obj.total_amount = 0  # Temporarily 0 set kar do taaki error na aaye

        # Ab normal tarike se Order save hone do
        super().save_model(request, obj, form, change)

    def save_formset(self, request, form, formset, change):
        # Pehle inlines (Products) ko database me save hone do
        instances = formset.save(commit=False)

        for obj in formset.deleted_objects:
            obj.delete()

        for instance in instances:

            if not instance.price:
                instance.price = instance.product.price

            if not instance.cost_price:
                # Agar variant linked hai toh uska cost utha lo
                if hasattr(instance, "variant") and instance.variant:
                    instance.cost_price = instance.variant.cost_price
                else:
                    instance.cost_price = 0  # Default fallback

            instance.save()

        formset.save_m2m()

        # Ab main Order ka total calculate karke update karo
        if formset.model == OrderItem:
            order = form.instance
            total = sum(item.price * item.quantity for item in order.items.all())
            order.total_amount = total
            order.save()

        # return super().save_formset(request, form, formset, change)

    # ===================================================================
    # 🎨 CUSTOM BUTTONS (Unfold Actions)
    # ===================================================================

    @action(
        description=format_html(
            '<span class="inline-flex items-center gap-2"><img src="{}" class="w-4 h-4 object-contain" alt="logo" /> Download Invoice</span>',
            static("icons/docs-file.svg"),
        )
    )
    def download_invoice_admin(self, request, object_id):
        # 1. Order get karna (Yahan user=request.user HATA diya hai taaki admin koi bhi order dekh sake)
        order = get_object_or_404(
            Order.objects.prefetch_related("items"), uid=object_id
        )

        response = generate_order_invoice_pdf(order)

        # 5. Error Handling
        if response is None:
            self.message_user(request, "Error generating PDF ", messages.ERROR)
            return redirect(request.META.get("HTTP_REFERER", "/admin/"))

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

    # @action(description="Export Sales Report (CSV)")
    # def export_sales_report(self, request):
    #     response = HttpResponse(content_type='text/csv')
    #     # Download hone wali file ka professional naam
    #     response['Content-Disposition'] = 'attachment; filename="shopix_financial_report.csv"'

    #     writer = csv.writer(response)

    #     # 1. Extensive Column Headers (Strict Professional English)
    #     writer.writerow([
    #         'Order UID', 'Order Date', 'Customer Name', 'Email', 'Phone',
    #         'City', 'State', 'Payment Method', 'Transaction ID', 'Payment Status',
    #         'Order Status', 'Total Items', 'Subtotal', 'Discount Amount',
    #         'Coupon Used', 'Final Total', 'Delivered Date'
    #     ])

    #     # 2. Performance Optimized Query (N+1 Query fix using annotate)
    #     # Assuming BaseModel has a 'created_at' field
    #     orders = Order.objects.annotate(
    #         export_total_items=Sum('items__quantity')
    #     ).order_by('-created_at')

    #     # 3. Data Population Loop
    #     for order in orders:
    #         # Safe Date Handling
    #         created_str = order.created_at.strftime('%Y-%m-%d %H:%M') if order.created_at else 'N/A'
    #         delivered_str = order.delivered_at.strftime('%Y-%m-%d %H:%M') if order.delivered_at else 'Not Delivered'

    #         writer.writerow([
    #             str(order.uid),                         # BaseModel's unique ID
    #             created_str,                            # Order placement date
    #             order.full_name,                        # Shipping Name
    #             order.email,
    #             order.phone or 'N/A',
    #             order.city or 'N/A',
    #             order.state or 'N/A',
    #             order.payment_method,
    #             order.transaction_id or 'N/A',
    #             'Paid' if order.is_paid else 'Unpaid',  # Clean boolean conversion
    #             order.status,
    #             order.export_total_items or 0,          # Fetching from optimized annotate
    #             order.subtotal(),                       # Calling your model method
    #             order.discount_amount,
    #             order.coupon_used or 'None',
    #             order.total_amount,
    #             delivered_str                           # Delivery tracking timestamp
    #         ])

    #     return response

    @action(description="Export Sales Report (CSV)")
    def export_sales_report(self, request):
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = (
            'attachment; filename="shopix_financial_report.csv"'
        )
        writer = csv.writer(response)

        # 🌟 NEW: Headers me Tax, Shipping aur Tracking add kiya
        writer.writerow(
            [
                "Order UID",
                "Date",
                "Customer Name",
                "Phone",
                "City",
                "State",
                "Payment Status",
                "Order Status",
                "Total Items",
                "Base Amount",
                "Tax (GST)",
                "Shipping Fee",
                "Discount",
                "Final Paid Amount",
                "Courier",
                "Tracking No.",
            ]
        )

        orders = Order.objects.annotate(
            export_total_items=Sum("items__quantity")
        ).order_by("-created_at")

        for order in orders:
            # 🧮 Reverse Calculate Base Amount for CSV
            base_amount = (
                float(order.total_amount)
                - float(order.tax_amount)
                - float(order.shipping_cost)
            )

            writer.writerow(
                [
                    str(order.uid),
                    (
                        order.created_at.strftime("%Y-%m-%d %H:%M")
                        if order.created_at
                        else "N/A"
                    ),
                    order.full_name,
                    order.phone or "N/A",
                    order.city or "N/A",
                    order.state or "N/A",
                    "Paid" if order.is_paid else "Unpaid",
                    order.status,
                    order.export_total_items or 0,
                    round(base_amount, 2),  # Base value without tax
                    order.tax_amount,  # 🌟 New
                    order.shipping_cost,  # 🌟 New
                    order.discount_amount,
                    order.total_amount,  # Grand Total
                    order.courier_name or "Pending",  # 🌟 New
                    order.tracking_number or "N/A",  # 🌟 New
                ]
            )

        return response

    # ===================================================================
    # 🌈 VISUAL BADGES (SVG Icons & Tailwind)
    # ===================================================================

    # @admin.display(description="Total Items", ordering="total_item")
    # def total_item(self, obj):
    #     count = obj.items.count()
    #     return count

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        # Database se order laate time hi uske items ki 'quantity' ka Sum kar lo
        # 'items' aapke Order model me OrderItem ka related_name hai (agar related_name kuch aur hai toh change kar lena)
        return qs.annotate(total_items_count=Sum("items__quantity"))

    # 3. 🎨 VISUAL UI: Items ko ek sundar badge me dikhana
    @admin.display(description="Items", ordering="total_items_count")
    def get_total_items(self, obj):
        # Agar order me items hain toh count dikhao, warna 0
        count = obj.total_items_count or 0

        # Ek chota sa Tailwind Badge (Pill shape) return kar rahe hain
        return format_html(
            '<span class="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold px-2.5 py-0.5 rounded-full text-xs border border-gray-200 dark:border-gray-700">{}</span>',
            count,
        )

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
        status = str(obj.status).lower()

        # 1. Default fallback configuration (Agar koi status match na kare)
        icon_name = "paid.png"
        color_classes = "border-gray-300 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
        img_class = "w-4 h-4"

        # 2. Configuration Dictionary: Tuple of keywords -> (Icon Name, Tailwind Colors, Image Size)
        status_configs = {
            ("pending", "processing"): (
                "pending.svg",
                "border-yellow-300 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100",
                "w-4 h-4 ",
            ),
            ("shipped", "out for delivery"): (
                "delivery-truck.png",
                "border-blue-300 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100",
                "w-4 h-4 ",
            ),
            ("delivered", "completed"): (
                "delivered.svg",
                "border-emerald-300 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100",
                "w-4 h-4 ",
            ),
            ("cancel",): (
                "cancelled.svg",
                "border-red-300 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100",
                "w-4 h-4 ",
            ),
            ("return",): (
                "return.svg",
                "border-purple-200 bg-purple-50 text-purple-700 dark:bg-red-900 dark:text-red-100",
                "w-4 h-4 ",
            ),
        }

        # 3. Smart loop to find the matching status
        for keywords, config in status_configs.items():
            # Agar keyword status string mein mil jata hai
            if any(keyword in status for keyword in keywords):
                icon_name, color_classes, img_class = config
                break

        # 4. Final HTML render (Sirf ek baar likha!)
        return format_html(
            '<span class="inline-flex items-center justify-center gap-2 border px-2 py-1 rounded-md text-xs font-semibold {}">'
            '<img src="{}" class="{}" alt="status icon"/> {}'
            "</span>",
            color_classes,
            static(f"icons/{icon_name}"),
            img_class,
            obj.status,
        )

    change_list_template = "admin/custom_order_list.html"

    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}

        # 🌟 Update counts mapping with new statuses
        extra_context["count_all"] = Order.objects.count()
        extra_context["count_pending"] = Order.objects.filter(status="Pending").count()

        # 🌟 Naye Counts Add Kiye
        extra_context["count_paid"] = Order.objects.filter(status="Paid").count()
        extra_context["count_delivered"] = Order.objects.filter(
            status="Delivered"
        ).count()

        # Cancelled me hum Failed ko bhi jod sakte hain admin convenience ke liye
        extra_context["count_cancelled"] = Order.objects.filter(
            status__in=["Cancelled", "Failed"]
        ).count()

        # Returns me Refunded ko bhi jod sakte hain
        extra_context["count_returned"] = Order.objects.filter(
            status__in=["Returned", "Refunded"]
        ).count()

        return super().changelist_view(request, extra_context=extra_context)


from django.urls import reverse_lazy

# ... aapke purane imports ...


def order_tabs_callback(request):
    """
    Live database se orders count karke Unfold tabs generate karega.
    """
    # 1. Fetching Live Counts
    total_orders = Order.objects.count()
    pending_count = Order.objects.filter(status="Pending").count()
    completed_count = Order.objects.filter(status="Delivered").count()
    cancelled_count = Order.objects.filter(status="Cancelled").count()
    refunded_count = Order.objects.filter(status="Returned").count()

    base_url = reverse_lazy("admin:orders_order_changelist")

    # URL me check karna ki abhi kaunsa tab khula hai
    current_status = request.GET.get("status")

    return [
        {
            # App_label aur Model_name lowercase me (ensure app name is 'orders')
            "models": ["orders.order"],
            "items": [
                {
                    "title": f"All ({total_orders})",
                    "link": base_url,
                    "is_active": not current_status,  # Agar koi status nahi hai toh All active
                },
                {
                    "title": f"Pending ({pending_count})",
                    "link": f"{base_url}?status=Pending",
                    "is_active": current_status == "Pending",
                },
                {
                    "title": f"Completed ({completed_count})",
                    "link": f"{base_url}?status=Delivered",
                    "is_active": current_status == "Delivered",
                },
                {
                    "title": f"Cancelled ({cancelled_count})",
                    "link": f"{base_url}?status=Cancelled",
                    "is_active": current_status == "Cancelled",
                },
                {
                    "title": f"Refunded ({refunded_count})",
                    "link": f"{base_url}?status=Returned",
                    "is_active": current_status == "Returned",
                },
            ],
        }
    ]
