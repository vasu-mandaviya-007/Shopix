from rest_framework import serializers
from .models import (
    Product,
    ProductVariant,
    ProductImage,
)  # Assuming you have an Image model
from products.models import (
    SpecificationGroup,
    SpecificationItem,
    VariantAttributeValue,
    Brand,
)
from categories.serializers import CategorySerializer
from django.forms.models import model_to_dict


# 1. Serializer for Images (if you need image URLs)
class ImageSerializer(serializers.ModelSerializer):

    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage  # Replace with your actual Image model name
        fields = "__all__"

    def get_image(self, obj):
        return obj.image.url
        


class VariantAttributeValueSerializer(serializers.ModelSerializer):
    attribute_name = serializers.CharField(source="attribute.name")

    class Meta:
        model = VariantAttributeValue
        fields = ["uid", "attribute_name", "value"]


class SpecificationItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpecificationItem
        fields = "__all__"


class SpecificationGroupSerializer(serializers.ModelSerializer):
    spec_items = SpecificationItemSerializer(many=True)
 
    class Meta:
        model = SpecificationGroup
        fields = "__all__"


# 2. Serializer for the Variant details
class ProductVariantSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)  # Nested images
    attribute_values = VariantAttributeValueSerializer(many=True)
    # discount_percent = serializers.ReadOnlyField()

    class Meta:
        model = ProductVariant
        fields = "__all__"

    def get_price(self, obj):
        return obj.get_price()


# 3. Brand Serialzer
class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ["uid", "name", "slug"]


class ProductListSerializer(serializers.ModelSerializer):

    product_id = serializers.CharField(source="product.uid", read_only=True)
    product_slug = serializers.CharField(source="product.slug", read_only=True)
    product_name = serializers.CharField(source="product.title", read_only=True)
    brand = serializers.CharField(source="product.brand.name", read_only=True)
    primary_category = serializers.CharField(
        source="product.primary_category.name", read_only=True
    )
    images = ImageSerializer(many=True, read_only=True)  # Nested images
    attribute_values = VariantAttributeValueSerializer(many=True)
    discount_percent = serializers.ReadOnlyField()

    class Meta:
        model = ProductVariant
        fields = [
            "uid",
            "product_id",
            "product_slug",
            "product_name",
            "brand",
            "primary_category",
            # "specifications",
            "images",
            "attribute_values",
            "discount_percent",
            "price",
            "mrp", 
            "stock_qty",
            "is_default",
            "created_at",
        ]


# 4. Main Product Serializer
class ProductSerializer(serializers.ModelSerializer):
    # This field calls the method 'get_display_variant' below
    display_variant = serializers.SerializerMethodField()
    category_path = serializers.SerializerMethodField()
    # primary_category = serializers.StringRelatedField()
    brand = serializers.StringRelatedField()
    primary_category = serializers.SerializerMethodField()
    specifications = SpecificationGroupSerializer(many=True, source="spec_groups.all")

    class Meta:
        model = Product
        fields = "__all__"

    def get_primary_category(self, obj):
        return obj.primary_category.name

    def get_category_path(self, obj):
        path = []
        category = obj.primary_category

        while category:
            path.insert(0, category)
            category = category.parent

        return CategorySerializer(path, many=True).data

    # The logic you had in your View moves here!
    def get_display_variant(self, obj):
        # obj is the current Product instance
        variants = obj.variants.all()

        display_variant = None
        for v in variants:
            if v.is_default:
                display_variant = v
                break

        if not display_variant and variants:
            display_variant = variants[0]

        # Return the serialized data of the found variant
        if display_variant:
            return ProductVariantSerializer(display_variant, context=self.context).data
        return None
