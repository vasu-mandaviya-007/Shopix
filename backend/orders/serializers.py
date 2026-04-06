from rest_framework import serializers
from orders.models import Address
from orders.models import Order, OrderItem
from products.serializers import ProductListSerializer
from products.serializers import VariantAttributeValueSerializer


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = "__all__"
        read_only_fields = ["user"]

 
class OrderItemSerializer(serializers.ModelSerializer):

    product_name = serializers.CharField(source="product.product.title", read_only=True)
    product_image = serializers.SerializerMethodField()
    product = ProductListSerializer(read_only=True)
    attribute_values = VariantAttributeValueSerializer(source="product.attribute_values", many=True, read_only=True)
    # total_price = serializers.ReadOnlyField()
    # product_image = serializers.CharField(source="product.image")

    class Meta:
        model = OrderItem
        fields = [
            "price",
            "product",
            "quantity",
            "product_name",
            "product_image",
            "original_price",
            "attribute_values",
            "total_price",
            "product",
        ]

    def get_product_image(self, obj):
        try : 

            image = obj.product.images.filter(is_main=True).first()

            if not image:
                image = obj.product.images.first() 

            if image:
                return image.image.url
        except Exception as e:  
            return ""


class OrderSerializer(serializers.ModelSerializer):

    items = OrderItemSerializer(many=True, read_only=True)
    subtotal = serializers.ReadOnlyField()
    # date = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(format="%d %b %Y, %I:%M %p")
    delivered_at = serializers.DateTimeField(format="%d %b %Y, %I:%M %p")

    class Meta:
        model = Order
        fields = "__all__"

    # def get_date(self, obj):
    #     # React ko "May 25, 2024" format chahiye
    #     return obj.created_at.strftime("%B %d, %Y")

