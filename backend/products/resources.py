# products/resources.py

from import_export import resources, fields
from import_export.widgets import ForeignKeyWidget, ManyToManyWidget
from .models import Product, ProductVariant, Brand, VariantAttributeValue, ProductAttribute
from categories.models import Category

from import_export import resources, fields
from import_export.widgets import ForeignKeyWidget, ManyToManyWidget
from .models import Product, Brand
from categories.models import Category

class ProductResource(resources.ModelResource):

    brand = fields.Field(
        column_name="brand",
        attribute="brand",
        widget=ForeignKeyWidget(Brand, field="name"),
    )
    primary_category = fields.Field(
        column_name="primary_category",
        attribute="primary_category",
        widget=ForeignKeyWidget(Category, field="name"),
    )
    categories = fields.Field(
        column_name="categories",
        attribute="categories",
        widget=ManyToManyWidget(Category, field="name", separator="|"),
    )

    class Meta:
        model = Product
        # ✅ Explicitly list ONLY what you want — no exclude
        fields = ("slug", "title", "brand", "primary_category", "categories", "is_active")
        export_order = ("slug", "title", "brand", "primary_category", "categories", "is_active")
        import_id_fields = ("slug",)
        skip_unchanged = True
        report_skipped = False

    def get_import_id_fields(self):
        return ["slug"]

    def before_import_row(self, row, **kwargs):
        row.pop("id", None)
        row.pop("uid", None)

class ProductVariantResource(resources.ModelResource):
    product = fields.Field(
        column_name="product",
        attribute="product",
        widget=ForeignKeyWidget(Product, field="slug"),
    )

    class Meta:
        model = ProductVariant
        fields = (
            "id",
            "product",
            "sku",
            "cost_price",
            "price",
            "mrp",
            "stock_qty",
            "is_default",
            "discount_percent",
        )
        export_order = fields
        import_id_fields = ("sku",)  # SKU is unique, use as identifier