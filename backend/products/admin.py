from django.contrib import admin, messages
from django.utils.html import format_html
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, redirect, render
from django.db import transaction
import csv
from django.db.models import Sum
import uuid
import json
# 🌟 UNFOLD IMPORTS
from unfold.admin import ModelAdmin, TabularInline, StackedInline, BaseStackedInline
from unfold.contrib.filters.admin import (
    ChoicesDropdownFilter,
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
    Review,
)

from base.utils import format_inr
from django.urls import path, reverse
from import_export.admin import ImportExportModelAdmin
from unfold.contrib.import_export.forms import ExportForm, ImportForm,SelectableFieldsExportForm
from import_export import resources, fields
from import_export.widgets import ForeignKeyWidget, ManyToManyWidget
from .models import Product, Brand
from categories.models import Category # Aapki category app se
from django import forms
from django.utils.safestring import mark_safe
from nested_admin import NestedModelAdmin,NestedStackedInline,NestedTabularInline

from decimal import Decimal # 🌟 Ise import zaroor karein sabse upar
from django.contrib.admin import helpers

# --- HELPER FUNCTIONS ---
def clean_decimal(val):
    try:
        # Agar text hai, toh usko Decimal banao. Khali hai toh 0 banao.
        return Decimal(str(val).strip() or '0')
    except:
        return Decimal('0')

def clean_int(val):
    try:
        return int(str(val).strip() or '0')
    except:
        return 0


# ===================================================================
# 1. INLINES (Product ke andar dikhne wale sub-forms)
# ===================================================================


class VariantAttributeValueInline(TabularInline):  # Changed to Tabular for cleaner look
    model = VariantAttributeValue
    ordering_field = "index"
    autocomplete_fields = ["attribute"]
    hide_ordering_field = True
    tab = True
    show_change_link = True

    def get_extra(self, request, obj=None, **kwargs):
        if obj:
            return 0 # 'obj' hai matlab Edit Form khula hai
        return 1 # 'obj' nahi hai matlab Add Form khula hai


class ProductImageInline(StackedInline):  # Changed to Tabular
    model = ProductImage
    tab = True
    show_change_link = True
    readonly_fields = ["image_preview"]
    ordering_field = "order"
    hide_ordering_field = True
    autocomplete_fields = ["variant"]

    def get_extra(self, request, obj=None, **kwargs):
        if obj:
            return 0 # 'obj' hai matlab Edit Form khula hai
        return 2 # 'obj' nahi hai matlab Add Form khula hai

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
    extra = 1
    show_change_link = True
    # tab = True
    inlines = [VariantAttributeValueInline, ProductImageInline]


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


@admin.register(VariantAttributeValue)
class VariantAttributeValueAdmin(ModelAdmin):
    list_display = ["variant","attribute", "value"]
    exclude = ["index"]
    list_display_links = ["attribute"]
    search_fields = ["variant__product__title","attribute__name","value"]


@admin.register(Brand)
class BrandAdmin(ModelAdmin):
    list_display = ["brand_display", "slug"]
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ["name"]

    def brand_display(self, obj):
        # Agar brand ki image upload hui hai (Note: apne field ka naam check karein, agar 'logo' hai toh obj.logo use karein)
        if obj.image: 
            return format_html(
                '<div class="flex items-center gap-3">'
                '<img src="{}" class="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700 shadow-sm" alt="{}" />'
                '<span class="font-medium text-gray-900 dark:text-white">{}</span>'
                '</div>',
                obj.image.url, obj.name, obj.name
            )
        
        # Agar image nahi hai, toh Brand ke naam ka pehla akshar (Letter) avatar me dikhayenge
        first_letter = obj.name[0].upper() if obj.name else "?"
        return format_html(
            '<div class="flex items-center gap-3">'
            '<div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 font-bold border border-gray-200 dark:border-gray-700">{}</div>'
            '<span class="font-medium text-gray-900 dark:text-white">{}</span>'
            '</div>',
            first_letter, obj.name 
        )
    
    brand_display.short_description = 'Brand Name' # Column ka Heading
    brand_display.admin_order_field = 'name' # Sorting ke liye field


    # @admin.display(description="Brand Image")
    # def brand_preview(self, obj): 
        
    #     if obj.image:
    #         return format_html(
    #             '<img src="{}" class="w-10 h-10 object-cover rounded border border-gray-200 shadow-sm" />', 
    #             obj.image.url
    #         )
    #     # Agar photo nahi hai toh ek dash '-' dikha dein
    #     return format_html('<span class="text-gray-300">{}</span>',"-")

    # def brand_preview(self,obj):
    #     if obj.image:
    #         return format_html(
    #             '<img src="{}" class="w-10 h-10 object-cover rounded border border-gray-200 shadow-sm" />', 
    #             obj.image.url
    #         )
    #     # Agar photo nahi hai toh ek dash '-' dikha dein
    #     return format_html('<span class="text-gray-300">{}</span>',"-")


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


    def save_related(self, request, form, formsets, change):
        super().save_related(request, form, formsets, change)

        variant = form.instance

        if not variant.sku : 
            product_code = str(variant.product.title)[:4].upper().replace(" ","")

            attr_codes = []
            for attr in variant.attribute_values.all() : 
                value_str=str(attr.value).upper().replace(" ","")
                attr_codes.append(value_str)

            short_id = str(variant.uid).replace("-", "")[:6].upper()
            
            if attr_codes : 
                attribute_str = "-".join(attr_codes)
                new_sku = f"{product_code}-{attribute_str}-V{short_id}"
            else : 
                new_sku = f"{product_code}-BASE-{short_id}"

            variant.sku = new_sku
            variant.save()
                

    inlines = [VariantAttributeValueInline, ProductImageInline]
    # prepopulated_fields = {"sku": ("product__title",)}
    autocomplete_fields = ["product"]
    ordering = ["-created_at"]
    search_fields = ["product__title", "sku"]
    list_filter = [
        ("product__primary_category", AutocompleteSelectMultipleFilter),
        ("is_default", BooleanRadioFilter),
    ]
    # list_filter = ["product__primary_category__name", "is_default"]
    list_filter_submit = True  # 🎨 Moves filters to a slide-out drawer

    list_display_links = ["variant_name", "product__title"]

    list_display = [
        "image_preview",
        "variant_name",
        "get_category",
        "price",
        "stock_qty",
        "stock_status",
        "is_default",
        "variant_actions",
    ]

    exclude = ["order","discount_percent"]
    
    list_editable = ["price", "stock_qty", "is_default"]
    actions = [make_out_of_stock, apply_discount, export_variants_to_csv]

    @admin.display(description='Quick Actions')
    def variant_actions(self, obj):
        duplicate_url = reverse('admin:products_variant_duplicate', args=[obj.uid])
        
        # Tailwind Button (Unfold Style)
        return format_html(
            '''
            <a href="{}" class="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-colors border border-indigo-200 dark:border-indigo-800" onclick="return confirm('Are you sure you want to duplicate this product?');">
                <svg class="w-3 h-3 inline-block mr-1 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                Clone
            </a>
            ''',
            duplicate_url
        )

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

    def get_urls(self):
        urls = super().get_urls() 
        custom_urls = [
            # Naya URL Duplicate function ke liye
            path('<path:object_id>/duplicate/', self.admin_site.admin_view(self.duplicate_variant), name='products_variant_duplicate'),
        ]
        return custom_urls + urls

    def duplicate_variant(self,request,object_id) :
        original = get_object_or_404(ProductVariant, uid=object_id) 

        try : 
            
            with transaction.atomic() : 
                new_variant = ProductVariant.objects.get(uid=object_id)
                new_variant.pk = None
                new_variant.uid = uuid.uuid4()
                new_variant.product = original.product
                new_variant.sku = f"{original.sku}-copy-{str(uuid.uuid4())[:6]}"
                new_variant.is_default = False # Copy hamesha Draft (Inactive) mode me banegi taaki galti se live na ho
                new_variant.save() 


                for attr_val in original.attribute_values.all() : 
                    VariantAttributeValue.objects.create(
                        variant=new_variant,
                        attribute=attr_val.attribute,
                        value=attr_val.value
                    )

                for img in original.images.all() : 
                    ProductImage.objects.create(
                        variant=new_variant,
                        image=img.image,
                        is_main=img.is_main
                    )

                    
            messages.success(request, f"🎉 Product '{original.sku}' successfully duplicated as Draft!")

        except Exception as e : 
            messages.error(request, f"❌ Duplicate Failed : {str(e)}")
  
        return redirect('admin:products_productvariant_changelist')




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
        # export_order = fields



@admin.register(Product)
class ProductAdmin(ModelAdmin, ImportExportModelAdmin):

    resource_classes = [ProductResource]
    
    # 🌟 Unfold ke premium CSS styles apply karne ke liye
    # import_form_class = ImportForm
    # export_form_class = ExportForm
    import_form_class = ImportForm
    export_form_class = SelectableFieldsExportForm


    warn_unsaved_form = True
    change_form_show_cancel_button = True
    # compressed_fields = True # 🎨 Makes the form more compact and readable
    list_filter_submit = True  # 🎨 Slide-out drawer for filters

    # inlines = [SpecificationGroupInline, ProductVariantInline]
    inlines = [SpecificationGroupInline] 

    def response_add(self, request, obj, post_url_continue=None):
        """
        Jaise hi naya Product save hoga, ye function trigger hoga
        """
        # Default response le lo pehle
        response = super().response_add(request, obj, post_url_continue)
        
        # Agar user ne normal "Save" dabaya hai (Save & Continue waghera nahi)
        if "_continue" not in request.POST and "_addanother" not in request.POST:
            # Variant Add page ka URL nikalo
            variant_add_url = reverse('admin:products_productvariant_add')
            
            # 🌟 AUTO-SELECT MAGIC: URL ke aage '?product=uid' laga do. 
            # Django khud samajh jayega aur dropdown mein us product ko select kar dega!
            return HttpResponseRedirect(f"{variant_add_url}?product={obj.uid}")
            
        return response

    # def get_urls(self):
    #     urls = super().get_urls()
    #     custom_urls = [
    #         # 🌟 HIJACK: "Add Product" click karte hi humara custom view chalega
    #         path('add/', self.admin_site.admin_view(self.custom_full_product_add), name='products_product_add'),
    #     ]
    #     return custom_urls + urls

    # def get_urls(self):
    #     urls = super().get_urls()
    #     custom_urls = [
    #         path('add/', self.admin_site.admin_view(self.custom_full_product_add), name='products_product_add'),
    #         # 🌟 NAYA URL: Edit mode ke liye
    #         path('<path:object_id>/change/', self.admin_site.admin_view(self.custom_full_product_edit), name='products_product_change'),
    #     ]
    #     return custom_urls + urls

    # def custom_full_product_add(self, request):
    #     if request.method == "POST":
    #         try:
    #             # 🛡️ Atomic Transaction: Ek error aayi toh poora data wapas (No garbage data)
    #             with transaction.atomic():
                    
    #                 # ==========================================
    #                 # 1. BASE PRODUCT SAVE KARO
    #                 # ==========================================
    #                 raw_brand = request.POST.get('brand')
    #                 raw_primary_cat = request.POST.get('primary_category')

    #                 # UUID Empty String Fix (Blank strings ko None banao)
    #                 brand_id = raw_brand if raw_brand and raw_brand.strip() else None
    #                 primary_category_id = raw_primary_cat if raw_primary_cat and raw_primary_cat.strip() else None
                    
    #                 product = Product.objects.create(
    #                     title=request.POST.get('title'),
    #                     slug=request.POST.get('slug'),
    #                     description=request.POST.get('description', ''),
    #                     brand_id=brand_id,
    #                     primary_category_id=primary_category_id,
    #                     is_active=request.POST.get('is_active') == 'on'
    #                 )

    #                 # ManyToMany Categories (Khali string filter karo)
    #                 raw_categories = request.POST.getlist('categories')
    #                 clean_categories = [cid for cid in raw_categories if cid.strip()]
    #                 if clean_categories:
    #                     product.categories.set(clean_categories)

    #                 # ==========================================
    #                 # 2. SPECIFICATION GROUPS & ITEMS
    #                 # ==========================================
    #                 total_spec_groups = int(request.POST.get('total_spec_groups', 0))
    #                 for g in range(total_spec_groups):
    #                     group_name = request.POST.get(f'spec_group_{g}_name')
    #                     if not group_name: continue
                        
    #                     group = SpecificationGroup.objects.create(product=product, name=group_name)
                        
    #                     total_items = int(request.POST.get(f'spec_group_{g}_total_items', 0))
    #                     for i in range(total_items):
    #                         item_name = request.POST.get(f'spec_group_{g}_item_{i}_name')
    #                         item_value = request.POST.get(f'spec_group_{g}_item_{i}_value')
    #                         if item_name and item_value:
    #                             SpecificationItem.objects.create(group=group, name=item_name, value=item_value)

    #                 # ==========================================
    #                 # 3. VARIANTS, ATTRIBUTES & IMAGES
    #                 # ==========================================
    #                 total_variants = int(request.POST.get('total_variants', 0))
    #                 for v in range(total_variants):
    #                     sku = request.POST.get(f'variant_{v}_sku')
    #                     if not sku: continue

    #                     # 🌟 FIX: String ko number me convert kiya ja raha hai
    #                     variant = ProductVariant.objects.create(
    #                         product=product,
    #                         sku=sku,
    #                         cost_price=clean_decimal(request.POST.get(f'variant_{v}_cost_price')),
    #                         mrp=clean_decimal(request.POST.get(f'variant_{v}_mrp')),
    #                         price=clean_decimal(request.POST.get(f'variant_{v}_price')),
    #                         stock_qty=clean_int(request.POST.get(f'variant_{v}_stock')),
    #                         is_default=request.POST.get(f'variant_{v}_is_default') == 'on'
    #                     )

    #                     # A. Variant Attributes (Color, Size etc)
    #                     # total_attrs = int(request.POST.get(f'variant_{v}_total_attrs', 0))
    #                     # for a in range(total_attrs):
    #                     #     attr_id = request.POST.get(f'variant_{v}_attr_{a}_id')
    #                     #     attr_val = request.POST.get(f'variant_{v}_attr_{a}_value')
    #                     #     if attr_id and attr_val:
    #                     #         VariantAttributeValue.objects.create(
    #                     #             variant=variant,
    #                     #             attribute_id=attr_id,
    #                     #             value=attr_val
    #                     #         )

    #                     # A. Variant Attributes (Strict Dropdown Selection)
    #                     # total_attrs = int(request.POST.get(f'variant_{v}_total_attrs', 0))
    #                     # for a in range(total_attrs):
    #                     #     attr_id = request.POST.get(f'variant_{v}_attr_{a}_id')
    #                     #     attr_val = request.POST.get(f'variant_{v}_attr_{a}_value')
                            
    #                     #     if attr_id and attr_val:
    #                     #         VariantAttributeValue.objects.create(
    #                     #             variant=variant,
    #                     #             attribute_id=attr_id, # ID use karni hai yahan
    #                     #             value=attr_val.strip()
    #                     #         )

    #                     # A. Variant Attributes (With Dynamic Add Logic)
    #                     total_attrs = int(request.POST.get(f'variant_{v}_total_attrs', 0))
    #                     for a in range(total_attrs):
    #                         attr_id_or_new = request.POST.get(f'variant_{v}_attr_{a}_id')
    #                         attr_val = request.POST.get(f'variant_{v}_attr_{a}_value')
                            
    #                         if attr_id_or_new and attr_val:
    #                             # 🌟 MAGIC LOGIC: Agar ID ke aage 'NEW::' laga hai, matlab ye naya banana hai
    #                             if attr_id_or_new.startswith('NEW::'):
    #                                 new_attr_name = attr_id_or_new.replace('NEW::', '').strip()
                                    
    #                                 # DataBase me check karo ya naya bana do
    #                                 attribute_obj, created = ProductAttribute.objects.get_or_create(
    #                                     name__iexact=new_attr_name,
    #                                     defaults={'name': new_attr_name.title()}
    #                                 )
    #                             else:
    #                                 # Agar naya nahi hai, toh purani UUID (uid) se database se fetch karo
    #                                 attribute_obj = ProductAttribute.objects.get(uid=attr_id_or_new)

    #                             # Ab final entry create karo
    #                             VariantAttributeValue.objects.create(
    #                                 variant=variant,
    #                                 attribute=attribute_obj, # Object pass kar rahe hain ID nahi
    #                                 value=attr_val.strip()
    #                             )

    #                     # B. Variant Images
    #                     # images = request.FILES.getlist(f'variant_{v}_images')
    #                     # for idx, img in enumerate(images):
    #                     #     ProductImage.objects.create(
    #                     #         variant=variant, 
    #                     #         image=img, 
    #                     #         is_main=(idx == 0)
    #                     #     )

    #                     # B. Variant Images (Ek-ek karke uthao aur Main Image check karo)
    #                     total_images = int(request.POST.get(f'variant_{v}_total_images', 0))
    #                     main_image_idx = str(request.POST.get(f'variant_{v}_main_image', '0'))

    #                     for img_idx in range(total_images):
    #                         # Naye format me file ka naam: variant_0_image_0, variant_0_image_1
    #                         img = request.FILES.get(f'variant_{v}_image_{img_idx}')
    #                         if img:
    #                             is_main = (str(img_idx) == main_image_idx)
    #                             ProductImage.objects.create(
    #                                 variant=variant, 
    #                                 image=img, 
    #                                 is_main=is_main
    #                             )

    #             messages.success(request, f"🎉 Success! '{product.title}' successfully added with all details.")
    #             return redirect('admin:products_product_changelist')

    #         except Exception as e:
    #             # Agar fail hua toh user ko exact error dikhegi
    #             messages.error(request, f"❌ Error saving product: {str(e)}")

    #     # ==========================================
    #     # GET REQUEST: Form UI Render karo
    #     # ==========================================
    #     context = dict(
    #         self.admin_site.each_context(request),
    #         title="Add Master Product",
    #         brands=Brand.objects.all(),
    #         categories=Category.objects.all(),
    #         attributes=ProductAttribute.objects.all().order_by('index'),
    #     )
    #     return render(request, "admin/custom_full_product_add.html", context)


    # # 🌟 NAYA METHOD: Edit karne ke liye
    # def custom_full_product_edit(self, request, object_id):
    #     product = get_object_or_404(Product, uid=object_id)

    #     if request.method == "POST":
    #         try:
    #             with transaction.atomic():
    #                 # ==========================================
    #                 # 1. BASE PRODUCT UPDATE
    #                 # ==========================================
    #                 raw_brand = request.POST.get('brand')
    #                 raw_primary_cat = request.POST.get('primary_category')
                    
    #                 product.title = request.POST.get('title')
    #                 product.slug = request.POST.get('slug')
    #                 product.description = request.POST.get('description', '')
    #                 product.brand_id = raw_brand if raw_brand and raw_brand.strip() else None
    #                 product.primary_category_id = raw_primary_cat if raw_primary_cat and raw_primary_cat.strip() else None
    #                 product.is_active = request.POST.get('is_active') == 'on'
    #                 product.save()

    #                 clean_categories = [cid for cid in request.POST.getlist('categories') if cid.strip()]
    #                 product.categories.set(clean_categories)

    #                 # 🗑️ DELETED IMAGES LOGIC
    #                 deleted_images = request.POST.getlist('deleted_images')
    #                 if deleted_images:
    #                     ProductImage.objects.filter(id__in=deleted_images).delete()

    #                 # ==========================================
    #                 # 2. SPECIFICATIONS (Aasan rasta: Purane delete karo, naye banao)
    #                 # ==========================================
    #                 product.spec_groups.all().delete()
    #                 total_spec_groups = int(request.POST.get('total_spec_groups', 0))
    #                 for g in range(total_spec_groups):
    #                     group_name = request.POST.get(f'spec_group_{g}_name')
    #                     if not group_name: continue
    #                     group = SpecificationGroup.objects.create(product=product, name=group_name)
    #                     total_items = int(request.POST.get(f'spec_group_{g}_total_items', 0))
    #                     for i in range(total_items):
    #                         item_name = request.POST.get(f'spec_group_{g}_item_{i}_name')
    #                         item_value = request.POST.get(f'spec_group_{g}_item_{i}_value')
    #                         if item_name and item_value:
    #                             SpecificationItem.objects.create(group=group, name=item_name, value=item_value)

    #                 # ==========================================
    #                 # 3. VARIANTS (Smart Tracking)
    #                 # ==========================================
    #                 total_variants = int(request.POST.get('total_variants', 0))
    #                 submitted_variant_uids = [] # Track karenge kya kya form se aaya

    #                 for v in range(total_variants):
    #                     v_uid = request.POST.get(f'variant_{v}_uid') # Hidden tracking ID
    #                     sku = request.POST.get(f'variant_{v}_sku')
    #                     if not sku: continue

    #                     if v_uid:
    #                         # 🔄 UPDATE EXISTING
    #                         variant = ProductVariant.objects.get(uid=v_uid)
    #                         variant.sku = sku
    #                         variant.cost_price = clean_decimal(request.POST.get(f'variant_{v}_cost_price'))
    #                         variant.mrp = clean_decimal(request.POST.get(f'variant_{v}_mrp'))
    #                         variant.price = clean_decimal(request.POST.get(f'variant_{v}_price'))
    #                         variant.stock_qty = clean_int(request.POST.get(f'variant_{v}_stock'))
    #                         variant.is_default = request.POST.get(f'variant_{v}_is_default') == 'on'
    #                         variant.save()
    #                     else:
    #                         # ➕ CREATE NEW
    #                         variant = ProductVariant.objects.create(
    #                             product=product, sku=sku,
    #                             cost_price=clean_decimal(request.POST.get(f'variant_{v}_cost_price')),
    #                             mrp=clean_decimal(request.POST.get(f'variant_{v}_mrp')),
    #                             price=clean_decimal(request.POST.get(f'variant_{v}_price')),
    #                             stock_qty=clean_int(request.POST.get(f'variant_{v}_stock')),
    #                             is_default=request.POST.get(f'variant_{v}_is_default') == 'on'
    #                         )
                        
    #                     submitted_variant_uids.append(variant.uid)

    #                     # ATTRIBUTES: Purane delete karo, form wale naye save karo
    #                     variant.attribute_values.all().delete()
    #                     total_attrs = int(request.POST.get(f'variant_{v}_total_attrs', 0))
    #                     for a in range(total_attrs):
    #                         attr_id_or_new = request.POST.get(f'variant_{v}_attr_{a}_id')
    #                         attr_val = request.POST.get(f'variant_{v}_attr_{a}_value')
                            
    #                         if attr_id_or_new and attr_val:
    #                             if attr_id_or_new.startswith('NEW::'):
    #                                 new_attr_name = attr_id_or_new.replace('NEW::', '').strip()
    #                                 attribute_obj, _ = ProductAttribute.objects.get_or_create(name__iexact=new_attr_name, defaults={'name': new_attr_name.title()})
    #                             else:
    #                                 attribute_obj = ProductAttribute.objects.get(uid=attr_id_or_new)
    #                             VariantAttributeValue.objects.create(variant=variant, attribute=attribute_obj, value=attr_val.strip())

    #                     # IMAGES: Nayi images append hongi
    #                     total_images = int(request.POST.get(f'variant_{v}_total_images', 0))
    #                     for img_idx in range(total_images):
    #                         img = request.FILES.get(f'variant_{v}_image_{img_idx}')
    #                         if img:
    #                             ProductImage.objects.create(variant=variant, image=img, is_main=False)

    #                 # 🗑️ DELETE LOGIC: Jo variants form mein nahi bheje gaye (user ne Remove daba diya tha), unko uda do
    #                 ProductVariant.objects.filter(product=product).exclude(uid__in=submitted_variant_uids).delete()

    #             messages.success(request, f"🎉 Product '{product.title}' updated successfully!")
    #             return redirect('admin:products_product_changelist')

    #         except Exception as e:
    #             messages.error(request, f"❌ Validation Error: {str(e)}")

    #     # GET Request: Send Existing Data to Template
        
    #     # === 1. SPECS JSON BUILDER ===
    #     specs_data = []
    #     for group in product.spec_groups.all():
    #         specs_data.append({
    #             'name': group.name,
    #             'items': [{'name': item.name, 'value': item.value} for item in group.spec_items.all()]
    #         })

    #     # === 2. VARIANTS JSON BUILDER (Added Images) ===
    #     variants_data = []
    #     for var in product.variants.all():
    #         variants_data.append({
    #             'uid': str(var.uid),
    #             'sku': var.sku,
    #             'price': str(var.price),
    #             'mrp': str(var.mrp),
    #             'cost_price': str(var.cost_price),
    #             'stock_qty': var.stock_qty,
    #             'is_default': var.is_default,
    #             'attributes': [{'id': str(a.attribute.uid), 'val': a.value} for a in var.attribute_values.all()],
    #             # 🌟 Images list added
    #             'images': [{'id': img.id, 'url': img.image.url if img.image else '', 'is_main': img.is_main} for img in var.images.all()]
    #         })

    #     context = dict(
    #         self.admin_site.each_context(request), title=f"Edit: {product.title}",
    #         product=product, 
    #         variants_json=json.dumps(variants_data),
    #         specs_json=json.dumps(specs_data), # 🌟 Naya variable
    #         brands=Brand.objects.all(), categories=Category.objects.all(),
    #         attributes=ProductAttribute.objects.all().order_by('index'),
    #     )
    #     return render(request, "admin/custom_full_product_add.html", context)



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
        # "is_active_status",
        "view_live_link",
        "product_actions",
    ]

    list_display_links = ["title"]
    list_display_links = ["title","slug"]
    search_fields = ["title", "slug", "brand__name", "primary_category__name"]
    prepopulated_fields = {"slug": ("title",)}
    autocomplete_fields = ["primary_category", "brand"]
    filter_horizontal = ("categories",)
    list_editable = ["is_active"]

    ordering = ["-created_at"]

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

    @admin.display(description='Store View')
    def view_live_link(self, obj):
        # Note: Jab aapka React frontend live hoga, toh localhost:3000 ki jagah asli domain aayega
        frontend_url = f"http://localhost:5173/product/{obj.slug}"
        
        return format_html(
            '''
            <a href="{}" target="_blank" class="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-md text-[11px] font-bold uppercase text-nowrap tracking-wider transition-colors border border-gray-200 dark:border-gray-700">
                <svg class="w-3 h-3 inline-block mr-1 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                View Live
            </a>
            ''',
            frontend_url
        )

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
        total_stock = obj.variants.aggregate(total=Sum('stock_qty'))['total'] or 0
        
        # Color logic
        if total_stock == 0:
            color = "bg-red-100 text-red-700 border-red-200"
            text = "Out of Stock"
        elif total_stock <= 5:
            color = "bg-orange-100 text-orange-700 border-orange-200"
            text = f"Low Stock ({total_stock})"
        else:
            color = "bg-green-100 text-green-700 border-green-200"
            text = f"In Stock ({total_stock})"
            
        return format_html(
            '<span class="px-2 py-1 text-nowrap rounded-md text-xs font-bold border {}">{}</span>',
            color, text
        )
        # total = sum(variant.stock_qty for variant in obj.variants.all())
        # return format_html(
        #     '<span class="font-bold {} ">{} Units </span>',
        #     (
        #         "text-green-600 dark:text-green-400"
        #         if total > 5
        #         else "text-red-600 dark:text-red-400"
        #     ),
        #     total,
        # )

    # @admin.display(description="Status")
    # def is_active_status(self, obj):
    #     if obj.is_active:
    #         return format_html(
    #             '<span class="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 px-2 py-1 rounded-md text-xs font-semibold">Active</span>',
    #             ''
    #         )
    #     return format_html(
    #         '<span class="bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100 px-2 py-1 rounded-md text-xs font-semibold">Inactive</span>',
    #         ''
    #     )

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

    @admin.action(description="🎉 Apply Dynamic Discount (Enter %%)")
    def apply_dynamic_discount(self, request, queryset):
        # Step 2: Agar user ne percentage daal kar form submit kar diya hai
        if 'apply_discount' in request.POST:
            try:
                discount_pct = Decimal(request.POST.get('discount_percentage', '0'))
                
                if discount_pct > 0 and discount_pct < 100:
                    with transaction.atomic():
                        total_updated = 0
                        for product in queryset:
                            for variant in product.variants.all():
                                discount_amount = variant.price * (discount_pct / Decimal('100'))
                                variant.price = variant.price - discount_amount
                                variant.save()
                                total_updated += 1
                                
                    messages.success(request, f"🎉 Successfully applied {discount_pct}% discount to {queryset.count()} products ({total_updated} variants).")
                else:
                    messages.error(request, "❌ Discount 1% se 99% ke beech hona chahiye.")
            except Exception as e:
                messages.error(request, f"Error: {str(e)}")
                
            return HttpResponseRedirect(request.get_full_path())

        # Step 1: Agar sirf action select kiya hai, toh usko form dikhao
        context = dict(
            self.admin_site.each_context(request),
            title="Apply Discount to Selected Products",
            queryset=queryset,
            action_checkbox_name=helpers.ACTION_CHECKBOX_NAME, # Django's built-in hidden field
        )
        return render(request, "admin/dynamic_discount_form.html", context)
    
    actions = [make_active, make_inactive,apply_dynamic_discount]

    @admin.display(description='Quick Actions')
    def product_actions(self, obj):
        duplicate_url = reverse('admin:products_product_duplicate', args=[obj.uid])
        
        # Tailwind Button (Unfold Style)
        return format_html(
            '''
            <a href="{}" class="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-colors border border-indigo-200 dark:border-indigo-800" onclick="return confirm('Are you sure you want to duplicate this product?');">
                <svg class="w-3 h-3 inline-block mr-1 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                Clone
            </a>
            ''',
            duplicate_url
        )

    list_per_page = 10

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            # Naya URL Duplicate function ke liye
            path('<path:object_id>/duplicate/', self.admin_site.admin_view(self.duplicate_product), name='products_product_duplicate'),
        ]
        return custom_urls + urls
    
    def duplicate_product(self,request,object_id) :
        original = get_object_or_404(Product, uid=object_id)

        try : 
            
            with transaction.atomic() : 
                new_product = Product.objects.get(uid=object_id)
                new_product.pk = None
                new_product.uid = uuid.uuid4()
                new_product.title = f"{original.title} (Copy)"
                new_product.slug = f"{original.slug}-copy-{str(uuid.uuid4())[:6]}"
                new_product.is_active = False # Copy hamesha Draft (Inactive) mode me banegi taaki galti se live na ho
                new_product.save()

                new_product.categories.set(original.categories.all())

                for spec_group in original.spec_groups.all() : 
                    new_spec_group = SpecificationGroup.objects.create(product=new_product, name=spec_group.name)
                    
                    for item in spec_group.spec_items.all() : 
                        SpecificationItem.objects.create(group=new_spec_group, name=item.name, value=item.value)

                for variant in original.variants.all() : 
                    new_variant = ProductVariant.objects.get(uid=variant.uid)
                    new_variant.pk = None
                    new_variant.uid = uuid.uuid4()
                    new_variant.product = new_product

                    new_variant.sku = f"{variant.sku}-copy-{str(uuid.uuid4())[:4]}"
                    new_variant.save()

                    for attr_val in variant.attribute_values.all() : 
                        VariantAttributeValue.objects.create(
                            variant=new_variant,
                            attribute=attr_val.attribute,
                            value=attr_val.value
                        )

                    for img in variant.images.all() : 
                        ProductImage.objects.create(
                            variant=new_variant,
                            image=img.image,
                            is_main=img.is_main
                        )

                    
            messages.success(request, f"🎉 Product '{original.title}' successfully duplicated as Draft!")

        except Exception as e : 
            messages.error(request, f"❌ Duplicate Failed : {str(e)}")
  
        return redirect('admin:products_product_changelist')


    class Media:
        # Ye custom JS file native admin page par load ho jayegi
        js = ('js/ai_description.js',)

@admin.register(SpecificationItem)
class SpecificationItemAdmin(ModelAdmin):
    list_display = ["group", "name", "get_value"]

    def get_value(self,obj) : 
        return obj.value[:80] + ("..." if len(obj.value) > 80 else "") 
    
    get_value.admin_order_field = "value"
    get_value.short_description = "value" 

    ordering = ["group"]

    paginator = InfinitePaginator
    show_full_result_count = False
    list_filter_submit = True


@admin.register(SpecificationGroup)
class SpecificationGroupAdmin(ModelAdmin):
    list_display = ["name","product"]

    ordering = ["product"]

    list_filter = [
        ("product",AutocompleteSelectMultipleFilter),
    ]
    
    search_fields = ["name","product"] 

    paginator = InfinitePaginator
    show_full_result_count = False
    list_filter_submit = True



@admin.register(Review)
class ReviewAdmin(ModelAdmin):
    # 1. Table me kya kya columns dikhane hain
    list_display = ('get_product_name', 'user', 'rating_stars', 'short_comment', 'created_at')
    
    # 2. Right side filter panel
    list_filter = [('rating',ChoicesDropdownFilter), 'created_at']
    
    # 3. Search box kin fields me search karega
    # (Dhyan do: User aur Product foreign keys hain, isliye double underscore __ lagaya hai)
    search_fields = ('user__username', 'user__first_name', 'product__title', 'comment')
    
    # 4. In fields ko admin panel me edit nahi kiya ja sakta
    readonly_fields = ('created_at',)

    show_full_result_count = False
    list_filter_submit = True
    
    # 5. Ek page par kitne reviews dikhane hain
    list_per_page = 20

    # --- CUSTOM COLUMNS FUNCTIONS ---

    # Visual Stars dikhane ke liye function
    def rating_stars(self, obj):
        # 5 star hai toh 5 star emojis return karega
        return '⭐' * obj.rating
    rating_stars.short_description = 'Rating' # Column ka heading
    rating_stars.admin_order_field = 'rating'

    # Comment agar bahut bada hai toh table me fit karne ke liye chhota karna
    def short_comment(self, obj):
        if obj.comment:
            return obj.comment[:50] + '...' if len(obj.comment) > 50 else obj.comment
        return '-'
    short_comment.short_description = 'Comment Snippet'

    # Product ka naam cleanly dikhane ke liye (Apne Product model ke field ke hisaab se adjust kar lena)
    def get_product_name(self, obj):
        return obj.product.title # Agar field ka naam 'product_name' hai to obj.product.product_name likhna
    get_product_name.short_description = 'Product'
    get_product_name.admin_order_field = 'product__title' 
