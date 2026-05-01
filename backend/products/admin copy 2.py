from django.contrib import admin, messages
from django.utils.html import format_html
from django.http import HttpResponse
import csv

# 🌟 UNFOLD IMPORTS
from unfold.admin import ModelAdmin, TabularInline, StackedInline, BaseStackedInline
from unfold.contrib.filters.admin import (
    AutocompleteSelectFilter,
    AutocompleteSelectMultipleFilter,
    BooleanRadioFilter,
)
from unfold.paginator import InfinitePaginator

# 🌟 MODELS IMPORTS
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
from base.utils import format_inr
from django.urls import reverse
from import_export.admin import ImportExportModelAdmin
from unfold.contrib.import_export.forms import ExportForm, ImportForm,SelectableFieldsExportForm
from import_export import resources, fields
from import_export.widgets import ForeignKeyWidget, ManyToManyWidget
from .models import Product, Brand
from categories.models import Category # Aapki category app se


from django.urls import path
from django.shortcuts import render, redirect
from django.db import transaction


# ===================================================================
# 1. INLINES (Product ke andar dikhne wale sub-forms)
# ===================================================================


class VariantAttributeValueInline(StackedInline):  # Changed to Tabular for cleaner look
    model = VariantAttributeValue
    tab = True
    show_change_link = True
    extra = 1


class ProductImageInline(StackedInline):  # Changed to Tabular
    model = ProductImage
    extra = 1
    tab = True
    show_change_link = True
    readonly_fields = ["image_preview"]
    autocomplete_fields = ["variant"]

    def image_preview(self, obj):
        if obj.image:
            # 🎨 Tailwind CSS for image previews
            return format_html(
                '<img src="{}" class="w-16 h-16 object-cover rounded border border-gray-200 shadow-sm" />',
                obj.image.url,
            )
        return "-"

    image_preview.short_description = "Preview"


class SpecificationItemInline(TabularInline):
    model = SpecificationItem
    extra = 1


class SpecificationGroupInline(TabularInline):
    model = SpecificationGroup
    extra = 1
    tab = True
    inlines = [SpecificationItemInline]
    show_change_link = True


class ProductVariantInline(StackedInline):
    model = ProductVariant
    extra = 0
    inlines = [VariantAttributeValueInline, ProductImageInline]
    tab = True
    show_change_link = True


# ===================================================================
# 2. ACTIONS (Bulk updates & Exports)
# ===================================================================


@admin.action(description="🚨 Mark selected as Out of Stock")
def make_out_of_stock(modeladmin, request, queryset):
    updated_count = queryset.update(stock_qty=0)
    modeladmin.message_user(
        request,
        f"Successfully marked {updated_count} variants as out of stock.",
        messages.SUCCESS,
    )


@admin.action(description="💰 Apply 10%% Discount to selected")
def apply_discount(modeladmin, request, queryset):
    for variant in queryset:
        variant.price = float(variant.price) * 0.90
        variant.save()
    modeladmin.message_user(
        request,
        f"Successfully discounted {queryset.count()} variants.",
        messages.SUCCESS,
    )


@admin.action(description="📥 Export Selected Variants to CSV")
def export_variants_to_csv(modeladmin, request, queryset):
    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = (
        'attachment; filename="product_variants_export.csv"'
    )
    writer = csv.writer(response)
    writer.writerow(
        ["Variant ID", "Product Title", "SKU", "Price", "MRP", "Stock Qty", "Category"]
    )

    for variant in queryset:
        category_name = (
            variant.product.primary_category.name
            if variant.product.primary_category
            else "N/A"
        )
        writer.writerow(
            [
                variant.uid,
                variant.product.title,
                variant.sku,
                variant.price,
                variant.mrp,
                variant.stock_qty,
                category_name,
            ]
        )
    return response


# ===================================================================
# 3. MODEL ADMINS (Main Pages)
# ===================================================================


@admin.register(ProductAttribute)
class ProductAttributeAdmin(ModelAdmin):
    list_display = ["uid", "name"]
    list_display_links = ["name"]
    search_fields = ["name"]


@admin.register(Brand)
class BrandAdmin(ModelAdmin):
    list_display = ["name", "slug"]
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ["name"]


@admin.register(ProductImage)
class ProductImageAdmin(ModelAdmin):
    list_display = ["image_preview", "variant"]
    autocomplete_fields = ["variant"]
    list_filter_submit = True

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" class="w-12 h-12 object-cover rounded shadow-sm" />',
                obj.image.url,
            )
        return "-"

    image_preview.short_description = "Image"


@admin.register(ProductVariant)
class ProductVariantAdmin(ModelAdmin):
    inlines = [VariantAttributeValueInline, ProductImageInline]
    search_fields = ["product__title", "sku"]
    list_filter = [
        ("product__primary_category", AutocompleteSelectMultipleFilter),
        ("is_default", BooleanRadioFilter),
    ]
    # list_filter = ["product__primary_category__name", "is_default"]
    list_filter_submit = True  # 🎨 Moves filters to a slide-out drawer
    list_display = [
        "image_preview",
        "variant_name",
        "get_category",
        "price",
        "stock_qty",
        "stock_status",
        "is_default",
    ]
    list_editable = ["price", "stock_qty", "is_default"]
    actions = [make_out_of_stock, apply_discount, export_variants_to_csv]

    @admin.display(description="Photo")
    def image_preview(self, obj):
        # Variant se judi hui pehli image nikalte hain
        first_image = obj.images.first()

        # Agar image hai, toh usko 40x40 ke chote box me dikhayein (Tailwind style)
        if first_image and first_image.image:
            return format_html(
                '<img src="{}" class="w-12 h-12 object-cover rounded border border-gray-200 shadow-sm" />',
                first_image.image.url,
            )
        # Agar photo nahi hai toh ek dash '-' dikha dein
        return format_html('<span class="text-gray-300">-</span>','')

    @admin.display(description="Inventory Health")
    def stock_status(self, obj):
        # Agar galti se kisi product mein stock null/khali reh gaya ho
        if obj.stock_qty is None:
            return format_html(
                '<span class="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-xs font-semibold">{}</span>',
                "N/A",
            )

        if obj.stock_qty <= 0:
            # 🌟 Fix: Text ko as an argument '{}' mein pass kiya
            return format_html(
                '<span class="bg-red-100 text-red-800 px-2 py-1 rounded-md text-xs font-semibold">{}</span>',
                "🚨 Out of Stock",
            )

        elif obj.stock_qty < 10:
            # Yeh pehle bhi theek tha kyunki isme obj.stock_qty pass ho raha tha
            return format_html(
                '<span class="bg-orange-100 text-orange-800 px-2 py-1 rounded-md text-xs whitespace-nowrap font-semibold">⚠️ Low Stock ({})</span>',
                obj.stock_qty,
            )

        # 🌟 Fix: Text ko as an argument '{}' mein pass kiya
        return format_html(
            '<span class="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-semibold">{}</span>',
            "✅ Healthy",
        )

    def variant_name(self, obj):
        values = obj.attribute_values.all()
        attr_values = " / ".join([v.value for v in values])
        title = (
            obj.product.title[:40] + "..."
            if len(obj.product.title) > 40
            else obj.product.title
        )
        return f"{title} — ({attr_values})" if attr_values else title

    variant_name.admin_order_field = "product__title"
    stock_status.admin_order_field = "stock_qty"
    variant_name.short_description = "Variant Details"

    def get_category(self, obj):
        return (
            obj.product.primary_category.name if obj.product.primary_category else "-"
        )

    get_category.short_description = "Category"
    get_category.admin_order_field = "product__primary_category__name"


# 1. Resource banayein (Ye batata hai Excel me kya-kya columns aayenge)
# class ProductResource(resources.ModelResource):
#     class Meta:
#         model = Product
#         fields = ('uid', 'title', 'slug','description','is_active',) # Jo fields excel me chahiye
#         export_order = fields
#         # exclude = ('id', 'uid', 'created_at', 'updated_at')

class ProductResource(resources.ModelResource):
    # 1. Brand: Excel me naam likho, ye auto ID nikal lega
    brand = fields.Field(
        column_name='brand',
        attribute='brand',
        widget=ForeignKeyWidget(Brand, field='name')
    )
    
    # 2. Primary Category: Name se link karega
    primary_category = fields.Field(
        column_name='primary_category',
        attribute='primary_category',
        widget=ForeignKeyWidget(Category, field='name') 
    )
    
    # 3. Categories (M2M): Multiple categories ko handle karega (Pipe '|' se separate karke)
    categories = fields.Field(
        column_name='categories',
        attribute='categories',
        widget=ManyToManyWidget(Category, field='name', separator='|')
    )

    class Meta:
        model = Product
        # 🌟 import_id_fields: 'slug' rakhne se agar same slug wala product 
        # pehle se hoga toh wo update ho jayega, duplicate nahi banega!
        import_id_fields = ('slug',) 
        
        # Ye wahi fields hain jo aapko Excel file me columns banane hain
        fields = (
            'title', 
            'slug', 
            'brand', 
            'primary_category', 
            'categories', 
            'description', 
            'is_active',
            # 'meta_title', 'meta_description', 'meta_keywords' # Agar SEO add kiya hai toh unhe yahan uncomment karein
        )
        export_order = fields



@admin.register(Product)
class ProductAdmin(ModelAdmin,ImportExportModelAdmin):

    resource_classes = [ProductResource]
    
    # 🌟 Unfold ke premium CSS styles apply karne ke liye
    import_form_class = ImportForm
    export_form_class = ExportForm
    # import_form_class = ImportForm
    # export_form_class = SelectableFieldsExportForm


    warn_unsaved_form = True
    change_form_show_cancel_button = True
    # compressed_fields = True # 🎨 Makes the form more compact and readable
    list_filter_submit = True  # 🎨 Slide-out drawer for filters

    inlines = [SpecificationGroupInline, ProductVariantInline]

    list_filter = [
        ("brand", AutocompleteSelectFilter),
        ("primary_category", AutocompleteSelectMultipleFilter),
        "is_active", 
    ]

    list_display = [
        "get_image",
        "title",
        "get_category_name",
        "brand",
        "get_default_price",
        "get_total_stock",
        "total_variants",
        "is_active",
        "is_active_status",
    ]

    list_display_links = ["title"]
    # list_display_links = ["title","slug"]
    search_fields = ["title", "slug", "brand__name", "primary_category__name"]
    prepopulated_fields = {"slug": ("title",)}
    autocomplete_fields = ["primary_category", "brand"]
    filter_horizontal = ("categories",)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        # Ek hi baar me saare variants aur unki images memory me le aao
        return qs.prefetch_related('variants__images')

    # 🌟 STEP 2: Optimized Image function
    @admin.display(description="Image")
    def get_image(self, obj):
        variants = obj.variants.all()
        default_variant = next((v for v in variants if v.is_default), None)
        
        if default_variant:
            images = default_variant.images.all() 
            
            # 🌟 NAYA SAFETY CHECK: Check karo ki images list khali na ho, AUR pehli image me actual file ho
            if images and images[0].image: 
                url = reverse("admin:products_product_change", args=[obj.uid]) 
                
                return format_html(
                    '<a href="{}">'
                    '<img src="{}" class="w-12 h-12 object-cover rounded border border-gray-200 dark:border-border-dark! shadow-sm" alt="Product Image" />'
                    '</a>',
                    url,
                    images[0].image.url,
                )
                
        # Ek aur choti mistake theek ki: format_html me extra '' comma hata diya
        return format_html('<span class="text-gray-300">-</span>','')


    @admin.display(description="Total Variants")
    def total_variants(self, obj):
        count = obj.variants.count()
        if count == 0:
            return format_html('<span class="text-gray-400">No Variants</span>','')
        # return format_html('<span class="bg-blue-100 dark:bg-[#0E1424] text-blue-800 px-2 py-1 rounded-md text-xs font-semibold">{} Variants</span>', count)
        return format_html(
            '<span class="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-white px-2 py-1 rounded-md text-xs font-semibold">{} Variants</span>',
            count,
        )

    @admin.display(description="Total Stock")
    def get_total_stock(self, obj):
        total = sum(variant.stock_qty for variant in obj.variants.all())
        return format_html(
            '<span class="font-bold {} ">{} Units </span>',
            (
                "text-green-600 dark:text-green-400"
                if total > 5
                else "text-red-600 dark:text-red-400"
            ),
            total,
        )

    @admin.display(description="Status")
    def is_active_status(self, obj):
        if obj.is_active:
            return format_html(
                '<span class="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 px-2 py-1 rounded-md text-xs font-semibold">Active</span>',
                ''
            )
        return format_html(
            '<span class="bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100 px-2 py-1 rounded-md text-xs font-semibold">Inactive</span>',
            ''
        )

    # Method 2: Sirf 'Default' variant ki price dikhana list me
    @admin.display(description="Price")
    def get_default_price(self, obj):
        default_variant = obj.variants.filter(is_default=True).first()
        if default_variant:
            return f"{format_inr(default_variant.price)}"
        return "No Price"
    get_default_price.admin_order_field = "variants__price"
    
    @admin.display(description="Category")
    def get_category_name(self, obj):
        return obj.primary_category.name if obj.primary_category else "-"

    ordering = ["-is_active"]

    get_category_name.admin_order_field = "primary_category__name"

    # 🎨 Grouping fields into beautiful sections
    fieldsets = (
        (
            "Basic Information",
            {
                "fields": ("title", "slug", "brand", "primary_category", "categories"),
                "description": "The core details identifying this product.",
                # "classes": ("tab",), # Makes it a tab if supported, otherwise normal section
            },
        ),
        (
            "Product Details",
            {
                "fields": ("description",),
                # "classes": ("tab",),
            },
        ), 
        (
            "SEO & Visibility",
            {
                "fields": ("is_active",),
                "classes": ("collapse",),
                "description": "Settings for search engines and site visibility.",
            },
        ),
    )

    # Custom Actions
    # actions = ["make_active", "make_inactive"]

    @admin.action(description="🟢 Mark selected products as ACTIVE")
    def make_active(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f"{updated} products marked as Active.", level='SUCCESS')

    @admin.action(description="🔴 Mark selected products as DRAFT")
    def make_inactive(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f"{updated} products marked as Inactive.", level='WARNING')
    
    actions = [make_active, make_inactive]

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            # Naye product ke button par click karte hi ye URL hit hoga
            path('add/', self.admin_site.admin_view(self.custom_add_product_view), name='products_product_add'),
        ]
        return custom_urls + urls

    def custom_add_product_view(self, request):
        if request.method == "POST":
            try:
                with transaction.atomic():
                    # 1. BASE PRODUCT SAVE KARO (Added Description)
                    brand_id = request.POST.get('brand')
                    primary_category_id = request.POST.get('primary_category')
                    
                    product = Product.objects.create(
                        title=request.POST.get('title'),
                        slug=request.POST.get('slug'),
                        description=request.POST.get('description', ''), # ✅ Nayi Field
                        brand_id=brand_id if brand_id else None,
                        primary_category_id=primary_category_id if primary_category_id else None,
                        is_active=request.POST.get('is_active') == 'on'
                    )

                    # 2. VARIANTS AUR IMAGES SAVE KARO
                    total_variants = int(request.POST.get('total_variants', 0))
                    
                    for i in range(total_variants):
                        sku = request.POST.get(f'variant_{i}_sku')
                        if not sku:
                            continue 

                        # Variant Create (Added MRP & Cost Price)
                        variant = ProductVariant.objects.create(
                            product=product,
                            sku=sku,
                            cost_price=request.POST.get(f'variant_{i}_cost_price', 0), # ✅ Nayi Field
                            price=request.POST.get(f'variant_{i}_price', 0),
                            mrp=request.POST.get(f'variant_{i}_mrp', 0), # ✅ Nayi Field
                            stock_qty=request.POST.get(f'variant_{i}_stock', 0),
                            is_default=request.POST.get(f'variant_{i}_is_default') == 'on'
                        )
                        # Note: 'discount_percent' aapke model ke save() method se auto-calculate ho jayega!

                        # Images Create
                        images = request.FILES.getlist(f'variant_{i}_images')
                        for idx, img in enumerate(images):
                            ProductImage.objects.create(
                                variant=variant,
                                image=img,
                                is_main=(idx == 0)
                            )

                messages.success(request, f"Successfully created: {product.title}")
                return redirect('admin:products_product_changelist')

            except Exception as e:
                messages.error(request, f"Error: {str(e)}")

        context = dict(
            self.admin_site.each_context(request),
            title="Create Complete Product",
            brands=Brand.objects.all(),
            categories=Category.objects.all(),
        )
        return render(request, "admin/custom_product_add.html", context)
    
@admin.register(SpecificationItem)
class SpecificationItemAdmin(ModelAdmin):
    list_display = ["group", "name", "value"]
    paginator = InfinitePaginator
    show_full_result_count = False
    list_filter_submit = True
