from django.db import models
from base.models import BaseModel
from django.contrib.auth.models import User
from products.models import ProductVariant
from decimal import Decimal
from django.forms import model_to_dict
# Create your models here.

class Coupon(BaseModel): 
    coupon_code = models.CharField(max_length=10,unique=True)
    is_active = models.BooleanField(default=True)

    discount_percentage = models.IntegerField(
        help_text="enter discount % like 10 for 10% off" 
    )

    max_discount_amount = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True,
        help_text="Maximum discount amount allowed (e.g. Up to Rs. 1500)"
    )

    valid_from = models.DateTimeField(null=True,blank=True)
    valid_to = models.DateTimeField(null=True,blank=True)

    is_auto_apply = models. BooleanField(default=False)

    min_quantity = models.PositiveIntegerField(default=0)
    min_amount = models.DecimalField(max_digits=10,decimal_places=2,null=True, blank=True, default=0)

    max_uses = models.PositiveIntegerField(
        null=True, blank=True, 
        help_text="Total number of times this coupon can be used globally"
    )
    used_count = models.PositiveIntegerField(default=0, help_text="How many times it has already been used")

    used_by = models.ManyToManyField(User,blank=True,related_name="used_coupons")

    def __str__(self):
        return self.coupon_code
 

class Cart(BaseModel): 

    user = models.ForeignKey( 
        User, on_delete=models.CASCADE, related_name="carts", null=True, blank=True
    )
    coupon = models.ForeignKey(
        Coupon, on_delete=models.SET_NULL, related_name="coupon", null=True, blank=True
    )

    @property
    def total_item(self) : 
        return sum(item.quantity for item in self.cart_items.all())
    
    @property
    def subtotal(self) : 
        return sum(item.total_price() for item in self.cart_items.all())

    @property
    def mrp_total(self) : 
        return sum(item.total_mrp_price() for item in self.cart_items.all())
    
    @property
    def discount_on_mrp(self) : 
        return self.mrp_total - self.subtotal

    @property
    def discount_amount(self) :  
        
        if not self.coupon : 
            return Decimal(0)

        if self.coupon.used_by.filter(id=self.user.id).exists() : 
            return Decimal(0)

        if self.coupon.min_quantity > 0 and self.total_item < self.coupon.min_quantity : 
            return Decimal(0)
        
        if self.coupon.min_amount > 0 and self.subtotal < self.coupon.min_amount : 
            return Decimal(0)

        calculated_discount = (self.subtotal * self.coupon.discount_percentage) / 100

        if self.coupon.max_discount_amount and calculated_discount > self.coupon.max_discount_amount : 
            return self.coupon.max_discount_amount
            
        return calculated_discount

    @property
    def shipping_cost(self) :  
        if self.subtotal > 10000 : 
            return Decimal(0)
        return Decimal(50)

    @property
    def total_price(self) : 
        total = self.mrp_total - self.discount_on_mrp - self.discount_amount + self.shipping_cost
        return max(total, Decimal(0))
    
    def __str__(self):
        return f"Cart of {self.user.username if self.user else 'Guest'} - {self.total_item} items"
 


class CartItems(BaseModel):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="cart_items")
    # product = models.ForeignKey(Product,on_delete=models.SET_NULL,null=True,blank=True)
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def total_mrp_price(self) : 
        if self.variant.mrp : 
            return self.variant.mrp * self.quantity
        return self.variant.price * self.quantity

    def total_price(self) : 
        return self.variant.price * self.quantity

    def __str__(self):
        return f"{self.variant} - {self.quantity}"
    
