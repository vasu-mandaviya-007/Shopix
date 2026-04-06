from django.contrib import admin
import nested_admin
from products.models import (
    Product,
    ProductVariant,
    ProductAttribute,
    Brand,
    VariantAttributeValue,
    ProductImage,
    SpecificationGroup,
    SpecificationItem,
)
from categories.models import Category
from cart.models import CartItems, Cart, Coupon
from django.utils.html import format_html

# ========================
# 1) PRODUCT ATTRIBUTE ADMIN  (Color, Size, Material etc.)
# ========================


# Register ProductAttribute model in admin
# Example: Color, Size, Fabric etc.
@admin.register(ProductAttribute)
class ProductAttributeAdmin(nested_admin.NestedModelAdmin):
    list_display = [
        "index",
        "name",
    ]  # Show ID and Attribute Name in admin list (Table View)


# ========================
# 2) INLINE TABLE FOR PRODUCT VARIANT ↓
# ========================


# This will allow adding attribute values inside Variant page
# Example → For variant you can add: Color = Red, Size = M, etc.
class VariantAttributeValueInline(nested_admin.NestedTabularInline):
    model = VariantAttributeValue  # Connects VariantAttributeValue table
    extra = 1  # Shows one empty row for adding new entries


# Inline to add multiple images for each single variant
class ProductImageInline(nested_admin.NestedTabularInline):
    model = ProductImage  # Links image table with variant
    extra = 1  # One empty image field by default

    readonly_fields = ["image_preview"]

    def image_preview(self, obj):
        # Check if the object exists and has an image file
        if obj.image:
            return format_html(
                '<img src="{}" style="width: 100px; height: auto; border-radius: 5px; border: 1px solid #ccc;" />',
                obj.image.url,
            )
        return "No Image"


# ========================
# 3) PRODUCT VARIANT ADMIN PAGE
# ========================


class SpecificationItemInline(nested_admin.NestedTabularInline):
    model = SpecificationItem
    extra = 1


class SpecificationGroupInline(nested_admin.NestedTabularInline):
    model = SpecificationGroup
    extra = 1
    inlines = [SpecificationItemInline]


# Here you add different variant combinations of a product
# (Red-M, Red-L, Blue-M etc.)
@admin.register(ProductVariant)
class ProductVariantAdmin(nested_admin.NestedModelAdmin):

    # Show attribute + image upload section inside variant form
    inlines = [VariantAttributeValueInline, ProductImageInline]
    search_fields = ["product__title"]
    list_filter = ["product__primary_category__name"]

    # Columns visible in Variant List Page
    list_display = ["product__title","product__primary_category__name","variant_name", "is_default", "price", "stock_qty"]

    def variant_name(self, obj):
        values = obj.attribute_values.all()
        attr_values = " / ".join([v.value for v in values])

        if attr_values:
            return f"{obj.product.title} ({attr_values})"[:50] + "..."
        return obj.product.title[:50] + "..." 

    variant_name.admin_order_field = "product__title"  # ✅ enable sorting
    variant_name.short_description = "Variant"


# ========================
# 4) SHOW VARIANTS INSIDE PRODUCT PAGE``
# ========================


# This inline shows a list of variants when opening product page
class ProductVariantInline(nested_admin.NestedTabularInline):
    model = ProductVariant  # Connect variant with product
    extra = 1  # One blank variant row by default

    show_change_link = True  # Adds clickable "edit" link -> open full variant form
    inlines = [VariantAttributeValueInline, ProductImageInline]  # <-- IMPORTANT


# ========================
# 5) PRODUCT ADMIN
# ========================


@admin.register(Product)
class ProductAdmin(nested_admin.NestedModelAdmin):
    inlines = [
        SpecificationGroupInline,
        ProductVariantInline,
    ]  # Shows variant table inside product detail page

    # Columns displayed in Product List Page
    list_display = ["title", "primary_category"]
    list_filter = ('primary_category__name',)
    search_fields = ["title"]
    prepopulated_fields = {"slug": ("title",)}


# ========================
# 6) CATEGORY REGISTER
# ========================


# Category basic admin (Men, Women, Electronics, Mobile etc.)
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "parent"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}


admin.site.register(Cart)
admin.site.register(ProductImage)
admin.site.register(CartItems)


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ["coupon_code", "is_active", "discount_percentage", "min_amount"]
