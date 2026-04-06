from rest_framework import filters, serializers
from cart.models import Cart, CartItems, Coupon
from products.serializers import ProductVariantSerializer, VariantAttributeValueSerializer
from products.models import ProductVariant

class CouponSerializer(serializers.ModelSerializer) : 
    
    class Meta : 
        model = Coupon
        fields = ["coupon_code","discount_percentage"]

class CartVariantSerializer(serializers.ModelSerializer) :

    product_name = serializers.CharField(source="product.title")
    price = serializers.CharField()
    product_slug = serializers.CharField(source="product.slug")
    attribute_values = VariantAttributeValueSerializer(many=True)
    image = serializers.SerializerMethodField()

    class Meta : 
        model = ProductVariant
        fields = ["uid","product_name","price","mrp","product_slug","discount_percent","image","attribute_values","stock_qty"]

    def get_image(self, obj) :
        request = self.context.get("request")
        main_image = obj.images.filter(is_main=True).first()
        if main_image:
            return request.build_absolute_uri(main_image.image.url)
        elif obj.images.exists():
            return request.build_absolute_uri(obj.images.first().image.url)
        return None

        

class CartItemsSerializer(serializers.ModelSerializer) :

    # product_price = serializers.SerializerMethodField()
    
    sub_total = serializers.SerializerMethodField()
    product = CartVariantSerializer(source="variant",read_only=True)

    class Meta : 
        model = CartItems
        fields = ["uid","product","quantity","sub_total"]

    # def get_product_price(self, obj) : 
    #     return obj.get_product_price()
    
    def get_sub_total(self, obj) : 
        return obj.total_price()


class CartSerializer(serializers.ModelSerializer) : 

    cart_items = CartItemsSerializer(many=True, read_only=True)
    # coupon_code = serializers.CharField(source="coupon.coupon_code",read_only=True)
    coupon = CouponSerializer()

    subtotal = serializers.ReadOnlyField()
    mrp_total = serializers.ReadOnlyField()
    discount_on_mrp = serializers.ReadOnlyField()
    shipping_cost = serializers.ReadOnlyField()
    discount_amount = serializers.ReadOnlyField()
    total_price = serializers.ReadOnlyField()

    class Meta :
        model = Cart
        # fields = '__all__'
        exclude = ["user","created_at","updated_at"]


