from products.models import Product
# from django.contrib import admin
# from django.utils.html import format_html
# import nested_admin

# # 🌟 Unfold Imports
# from unfold.admin import ModelAdmin, TabularInline, StackedInline
# from unfold.contrib.filters.admin import (
#     AutocompleteSelectFilter,
#     AutocompleteSelectMultipleFilter
# )

# from unfold.paginator import InfinitePaginator

# from products.models import (
#     Product,
#     ProductVariant,
#     ProductAttribute,
#     Brand,
#     VariantAttributeValue,
#     ProductImage, 
#     SpecificationGroup,
#     SpecificationItem,
# )

# # -------------------------------------------------------------------
# # INLINES
# # -------------------------------------------------------------------

# class VariantAttributeValueInline(StackedInline):
#     model = VariantAttributeValue
#     extra = 1

# class ProductImageInline(StackedInline):
#     model = ProductImage
#     extra = 1
#     readonly_fields = ["image_preview"]
#     autocomplete_fields = ["variant"]

#     def image_preview(self, obj):
#         if obj.image:
#             return format_html(
#                 '<img src="{}" style="width: 80px; height: auto; border-radius: 4px; border: 1px solid #ddd;" />',
#                 obj.image.url,
#             )
#         return "-"
#     image_preview.short_description = "Preview"

# class SpecificationItemInline(TabularInline):
#     model = SpecificationItem
#     extra = 1
    

# class SpecificationGroupInline(TabularInline):
#     model = SpecificationGroup
#     extra = 1
#     inlines = [SpecificationItemInline]
#     tab = True


# class ProductVariantInline(TabularInline):
#     model = ProductVariant
#     extra = 1  # Changed to 0 so it doesn't clutter the Product page with empty variant forms initially
#     show_change_link = True
#     inlines = [VariantAttributeValueInline, ProductImageInline]
#     tab = True


# # -------------------------------------------------------------------
# # MODEL ADMINS
# # -------------------------------------------------------------------

# @admin.register(ProductAttribute)
# class ProductAttributeAdmin(ModelAdmin):
#     list_display = ["uid", "name"]
#     list_display_links = ["name"]


# @admin.register(Brand)
# class BrandAdmin(ModelAdmin):
#     list_display = ["name", "slug"]
#     prepopulated_fields = {"slug": ("name",)}
#     search_fields = ["name"]


# @admin.register(ProductImage)
# class ProductImageAdmin(ModelAdmin):
#     list_display = ["variant", "image"]
#     autocomplete_fields = ["variant"]

# from django.contrib import messages

# # 💥 Action 1: Mark as out of stock
# @admin.action(description="Mark selected variants as Out of Stock")
# def make_out_of_stock(modeladmin, request, queryset):
#     # .update() is a super fast database query. It updates all selected items at once!
#     updated_count = queryset.update(stock_qty=0)
    
#     # Show a green success message at the top of the screen
#     modeladmin.message_user(
#         request, 
#         f"Successfully marked {updated_count} variants as out of stock.", 
#         messages.SUCCESS
#     )

# # 💥 Action 2: Apply 10% Discount
# @admin.action(description="Apply 10%% Discount to selected variants")
# def apply_discount(modeladmin, request, queryset):
#     for variant in queryset:
#         # Assuming price is a float or decimal
#         variant.price = float(variant.price) * 0.90 
#         variant.save()
        
#     modeladmin.message_user(
#         request, 
#         f"Successfully discounted {queryset.count()} variants.", 
#         messages.SUCCESS
#     )

# import csv
# from django.http import HttpResponse

# @admin.action(description="📥 Export Selected Variants to CSV")
# def export_variants_to_csv(modeladmin, request, queryset):
#     # 1. Create the HttpResponse object with the appropriate CSV header.
#     response = HttpResponse(content_type='text/csv')
#     response['Content-Disposition'] = 'attachment; filename="product_variants_export.csv"'

#     # 2. Initialize the CSV writer
#     writer = csv.writer(response)
    
#     # 3. Write the Header Row
#     writer.writerow(['Variant ID', 'Product Title', 'SKU', 'Price','MRP', 'Stock Qty', 'Category'])

#     # 4. Loop through the selected items and write their data
#     for variant in queryset:
#         category_name = variant.product.primary_category.name if variant.product.primary_category else "N/A"
        
#         writer.writerow([
#             variant.uid,
#             variant.product.title,
#             variant.sku, # Assuming you have an SKU field
#             variant.price,
#             variant.mrp,
#             variant.stock_qty,
#             category_name
#         ])

#     return response

# @admin.register(ProductVariant)
# class ProductVariantAdmin(ModelAdmin):
#     inlines = [VariantAttributeValueInline, ProductImageInline]
#     search_fields = ["product__title", "sku"] # Assuming you might add SKU later
#     list_filter = ["product__primary_category__name", "is_default"]

#     # Cleaned up list_display (Removed redundant product__title since variant_name handles it)
#     list_display = ["variant_name", "get_category", "price", "stock_qty","stock_status", "is_default"]
#     list_editable = ["price", "stock_qty", "is_default"] # Allows quick editing from the list view
#     actions = [make_out_of_stock, apply_discount,export_variants_to_csv]

#     @admin.display(description="Inventory Health")
#     def stock_status(self, obj):
#         # Agar galti se kisi product mein stock null/khali reh gaya ho
#         if obj.stock_qty is None:
#             return format_html('<span style="color: grey; font-weight: bold;">{}</span>', 'N/A')
            
#         if obj.stock_qty <= 0:
#             # 🌟 Fix: Text ko as an argument '{}' mein pass kiya
#             return format_html('<span style="color: red; font-weight: bold;">{}</span>', '🚨 Out of Stock')
            
#         elif obj.stock_qty < 10:
#             # Yeh pehle bhi theek tha kyunki isme obj.stock_qty pass ho raha tha
#             return format_html('<span style="color: orange; font-weight: bold;">⚠️ Low Stock ({})</span>', obj.stock_qty)
            
#         # 🌟 Fix: Text ko as an argument '{}' mein pass kiya
#         return format_html('<span style="color: green; font-weight: bold;">{}</span>', '✅ Healthy')

#     def variant_name(self, obj):
#         values = obj.attribute_values.all()
#         attr_values = " / ".join([v.value for v in values])
#         title = obj.product.title[:40] + "..." if len(obj.product.title) > 40 else obj.product.title
        
#         if attr_values:
#             return f"{title} — ({attr_values})"
#         return title 

#     variant_name.admin_order_field = "product__title"
#     stock_status.admin_order_field = "stock_qty"
#     variant_name.short_description = "Variant Details"

#     def get_category(self, obj):
#         return obj.product.primary_category.name if obj.product.primary_category else "-"
    
#     get_category.short_description = "Category"
#     get_category.admin_order_field = "product__primary_category__name"


# @admin.register(Product)
# class ProductAdmin(ModelAdmin):

#     warn_unsaved_form = True 
#     change_form_show_cancel_button = True

#     inlines = [SpecificationGroupInline, ProductVariantInline] 
#     list_filter = (
#         # Autocomplete filter
#         ["brand", AutocompleteSelectFilter],
#         ["primary_category",AutocompleteSelectMultipleFilter]
#     )
#     list_display = ["title", "get_category_name","brand"]
#     list_display_links = ["title"] 
#     search_fields = ["title"]
#     prepopulated_fields = {"slug": ("title",)}
#     autocomplete_fields = ["primary_category", "brand"]
#     def get_category_name(self, obj):
#         return obj.primary_category.name
    
#     get_category_name.short_description = "Category"
#     get_category_name.admin_order_field = "primary_category__name"

#     # 🌟 MAGIC: Grouping fields into beautiful sections
#     fieldsets = (
#         # Section 1: The Essentials
#         ("Basic Information", {
#             "fields": ("title", "slug", "brand", "primary_category"),
#             "description": "The core details identifying this product.",
#             "classes": ("wide",),
#         }),
        
#         # Section 2: Details (Assuming you have a description field)
#         ("Product Details", {
#             "fields": ("description",),
#         }),
        
#         # Section 3: Advanced/SEO (Collapsible!)
#         ("SEO & Visibility", {
#             "fields": ("is_active",), # Replace with your actual fields
#             "classes": ("collapse",), # 👈 This makes the section hideable!
#             "description": "Settings for search engines and site visibility."
#         }),
#     )



# @admin.register(SpecificationItem)
# class SpecificationItemAdmin(ModelAdmin):
#     list_display = ["group", "name", "value"]
#     paginator = InfinitePaginator
#     show_full_result_count = False



from orders.models import OrderItem

variants = OrderItem.objects.all()

for variant in variants : 
    variant.cost_price = variant.price - 2000
    variant.save()
    print("cost price updated")


# from datetime import timedelta
# from django.utils import timezone
# from orders.models import Order

# # 6 months ago approx (180 days)
# six_months_ago = timezone.now() - timedelta(days=180)

# # First 5 orders (oldest ya id order ke hisaab se)
# orders = Order.objects.all().order_by('uid')[:5]

# for order in orders:
#     order.created_at = six_months_ago
#     order.save()

# print("Updated successfully ✅")