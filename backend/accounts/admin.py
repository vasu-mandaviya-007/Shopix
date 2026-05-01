from django.contrib import admin
from accounts.models import Profile,EmailOTP
from unfold.admin import ModelAdmin
from django.contrib.auth.models import User
from django.utils.html import format_html
from orders.models import Order
from django.db.models import Sum
from unfold.decorators import action
from base.utils import format_inr
from django.urls import reverse
from django.db.models import Sum
from import_export import resources,fields
from import_export.admin import ImportExportModelAdmin
from unfold.contrib.import_export.forms import ExportForm,ImportForm,SelectableFieldsExportForm

# Register your models here.

@admin.register(Profile)
class ProfileAdmin(ModelAdmin):
    list_display = ["user","phone_number","profile_pic"]
 
# 🌟 Unfold Imports
from unfold.admin import ModelAdmin, StackedInline,TabularInline


class UserOrderInline(TabularInline) : 
    model = Order
    extra = 0 
    tab = True
    readonly_fields = ["order_link","get_items_summary","total_amount","status","created_at"]
    fields = ["order_link","get_items_summary","total_amount","status","created_at"]
    can_delete = False         

    

    def order_link(self, obj):
        if obj.pk:
            # Ye automatically aapke order page ka sahi URL bana lega
            url = reverse('admin:orders_order_change', args=[obj.pk])
            # Tailwind blue color jaisa ek sundar link return karega
            return format_html('<a href="{}" class="font-semibold text-blue-600 dark:text-blue-500 hover:underline dark:hover:text-blue-400 ">{}</a>', url, obj.uid)
        return "-"
    order_link.short_description = "Order ID" # Column ka naam
    

    def get_items_summary(self, obj):
        # NOTE: Agar Order model me OrderItem ka related_name 'items' hai toh ye use karein
        # Varna obj.orderitem_set.count() use karein
        try:
            item_count = obj.items.count() # Total items gino
            
            # (Optional) Pehle item ka naam bhi dikha sakte hain:
            # first_item = obj.items.first()
            # return f"{item_count} Items (e.g., {first_item.product.name})"
            
            return f"{item_count} Item(s)"
        except:
            return "N/A"
    get_items_summary.short_description = "Order Summary"

    def has_add_permission(self, request,obj):
        return False

# ===================================================================
# 1. PROFILE INLINE (User page ke andar Profile ka form)
# ===================================================================
class ProfileInline(StackedInline): 
    model = Profile
    tab = True
    can_delete = False  # Admin galti se profile delete na kar de 
    verbose_name_plural = 'Customer Profile Details'

# ===================================================================
# 2. CUSTOM USER ADMIN (The CRM Dashboard)
# ===================================================================

# 🚨 MAGIC: Pehle default boring User ko admin se hatao
admin.site.unregister(User)


class UserResource(resources.ModelResource) : 
    phone = fields.Field(column_name="Phone Number")
    total_orders = fields.Field(column_name="Total Orders")
    total_spent = fields.Field(column_name="Total Spent")

    class Meta:
        model = User
        # Excel sheet me kaunse columns dikhane hain
        fields = (
            'id', 'email', 'first_name', 'last_name', 
            'phone', 'total_orders', 'total_spent', # <-- Inhe add kiya
            'is_active', 'date_joined'
        )
        # Columns ka order kya hoga (Left to Right)
        export_order = ('id', 'email', 'first_name', 'last_name', 'phone', 'total_orders', 'total_spent', 'is_active', 'date_joined')

    def dehydrate_phone(self,user) : 
        try : 
            return user.profile.phone if user.profile.phone else "N/A"
        except : 
            return "N/A"

    def dehydrate_total_orders(self,user) : 
        return user.orders.count() 

    def dehydrate_total_spent(self,user) : 
        total = user.orders.filter(status="Delivered").aggregate(Sum("total_amount"))["total_amount__sum"]
        return total if total else 0
    
 

# 🚨 Phir apna naya Unfold wala User register karo
@admin.register(User) 
class CustomUserAdmin(ModelAdmin,ImportExportModelAdmin):

    resource_classes = [UserResource]

    import_form_class = ImportForm
    export_form_class = SelectableFieldsExportForm

    # Profile ko User ke andar ghusa diya
    inlines = [ProfileInline,UserOrderInline]  
    
    # Dashboard Table Columns
    list_display = [
        "get_name", 
        # "email", 
        "get_phone", 
        "is_active_badge", 
        "total_orders",
        "total_spent",
        "last_login",
        "date_joined",
    ]
    
    # Right Side Drawer Filters
    list_filter_submit = True
    list_filter = ["is_active", "date_joined"]
    
    # 🔍 Search Bar (User ke naam ke sath-sath Profile ke phone number se bhi search ho sakega!)
    search_fields = ["username", "email", "first_name", "profile__phone"]
    readonly_fields = ['date_joined', 'last_login']
    
    ordering = ("-date_joined",)
 
    fieldsets = (
        ("Account Credentials", {
            "fields": ("email", "first_name", "last_name")
        }),
        ("Account Status", {
            "fields": ("is_active", "is_staff", "date_joined", "last_login")
        }),
    )

    def total_orders(self, obj):
        return obj.orders.count() # Django ka default reverse relation
    total_orders.short_description = "Total Orders"

    def total_spent(self, obj): 
        # NOTE: Agar aapke order status ka naam 'Delivered' ki jagah kuch aur hai, toh use yahan change kar lena.
        # Aur agar amount field ka naam 'total_amount' nahi hai, toh wo bhi adjust kar lena.
        total = obj.orders.filter(status='Delivered').aggregate(Sum('total_amount'))['total_amount__sum']
        
        if total:
            return format_inr(total)
        return "₹ 0"
    total_spent.short_description = "Total Spent (LTV)"


    # ===================================================================
    # 3. CUSTOM METHODS FOR BADGES & UI
    # ===================================================================

    # '<div class="flex items-center gap-3">'
    # '<img src="{}" class="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700 shadow-sm" alt="{}" />'
    # '<span class="font-medium text-gray-900 dark:text-white">{}</span>'
    # '</div>',
    # obj.image.url, obj.name, obj.name

    @admin.display(description="Name") 
    def get_name(self, obj):
        # Agar profile hai aur usme image hai toh dikhao, warna default icon
        if hasattr(obj, 'profile') and obj.profile.profile_pic:
            return format_html(
                '<div class="flex items-center gap-3">'
                '<img src="{}" class="w-10 h-10 rounded-full object-cover border border-gray-200" />'
                '<span class="font-medium text-gray-900 dark:text-white">{}</span>'
                '</div>',
                obj.profile.profile_pic.url,obj.email or obj.username
            )
            
        return format_html(
            '<div class="flex items-center gap-3">'
            '<span class="material-symbols-outlined text-gray-400" style="font-size: 40px;">account_circle</span>'
            '<span class="font-medium text-gray-900 dark:text-white">{}</span>'
            '</div>',
            obj.email or obj.username
        )

    @admin.display(description="Phone", ordering="profile__phone_number")
    def get_phone(self, obj):
        # User model me phone nahi hota, isliye profile se nikal rahe hain
        if hasattr(obj, 'profile') and obj.profile.phone_number:
            return obj.profile.phone_number
        return "N/A"

    @admin.display(description="Status", ordering="is_active")
    def is_active_badge(self, obj):
        if obj.is_active:
            return format_html(
                '<span class="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-2 py-1 rounded-md text-xs font-semibold">'
                '<span class="material-symbols-outlined" style="font-size: 14px; font-variation-settings: \'FILL\' 1;">check_circle</span> Active'
                '</span>',''
            )
        return format_html(
            '<span class="inline-flex items-center gap-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 px-2 py-1 rounded-md text-xs font-semibold">'
            '<span class="material-symbols-outlined" style="font-size: 14px; font-variation-settings: \'FILL\' 1;">block</span> Blocked'
            '</span>',''
        )
    

    
    @admin.action(description="🚫 Block selected users")  
    def block_users(self, request, queryset):
        updated_count = queryset.update(is_active=False)
        self.message_user(request, f"{updated_count} users have been blocked.")
    
    @admin.action(description="✅ Activate selected users")   
    def activate_users(self, request, queryset): 
        updated_count = queryset.update(is_active=True)
        self.message_user(request, f"{updated_count} users have been activated.")

    # @admin.action(description="📊 Export Selected Customers to CSV")
    
    actions = [block_users, activate_users]
    
    

@admin.register(EmailOTP)
class EmailOTPAdmin(ModelAdmin) : 
    pass

