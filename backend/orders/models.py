from base.models import BaseModel
from django.db import models
from django.contrib.auth.models import User
from products.models import ProductVariant
from django.utils import timezone


class Address(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    addressType = models.CharField(
        max_length=20, choices=[("Home", "Home"), ("Work", "Work")], default="Home"
    )
    full_name = models.CharField(max_length=100)
    phone = models.DecimalField(max_digits=15, decimal_places=0)
    alternative_phone = models.DecimalField(
        max_digits=15, decimal_places=0, null=True, blank=True
    )
    address_line = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=20)
    landmark = models.CharField(max_length=100, null=True, blank=True)
    country = models.CharField(max_length=100, default="INDIA")
    is_default = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.full_name} - {self.address_line}"


class Order(BaseModel): 

    # Contact Info
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    email = models.EmailField()

    # Shipping Address
    full_name = models.CharField(max_length=100)
    address_line = models.TextField(max_length=255, null=True, blank=True)
    phone = models.DecimalField(max_digits=15, decimal_places=0, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=100, null=True, blank=True)
    landmark = models.CharField(max_length=100, null=True, blank=True)
    postal_code = models.CharField(max_length=20, null=True, blank=True)

    # Payment Info
    coupon_used = models.CharField(max_length=50, blank=True, null=True)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    is_paid = models.BooleanField(default=False)
    refund_status = models.CharField(
        default="Pending",
        choices=[
            ("Pending", "Pending"),
            ("Completed", "Completed"),
        ],
    )
    transaction_id = models.CharField(max_length=100, null=True, blank=True)
    payment_method = models.CharField(max_length=50, default="Stripe")
    status = models.CharField(
        max_length=20,
        default="Pending",
        choices=[
            ("Pending", "Pending (Payment Awaited)"),
            ("Paid", "Paid (Order Confirmed)"),
            ("Processing", "Processing"),
            ("Shipped", "Shipped"),
            ("Out for Delivery", "Out for Delivery"),
            ("Delivered", "Delivered"),
            ("Cancelled", "Cancelled"),
            ("Returned", "Returned"),
        ],
    )
    delivered_at = models.DateTimeField(null=True, blank=True)

    # Django ka default save method override karein (Auto-update trick)
    def save(self, *args, **kwargs):
        # Check: Agar status 'Delivered' ho gaya hai aur date abhi tak set nahi hai
        if self.status == "Delivered" and not self.delivered_at:
            self.delivered_at = timezone.now()  # Aaj ki date aur time save kar do

        # Optional: Agar by chance admin ne galti se Delivered karke wapas Shipped kar diya
        elif self.status != "Delivered" and self.status != "Returned":
            self.delivered_at = None

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Order {self.uid} - {self.email}"

    def subtotal(self):
        return self.total_amount + self.discount_amount


class OrderItem(BaseModel):

    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(ProductVariant, on_delete=models.SET_NULL, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    quantity = models.PositiveIntegerField(default=1)


    @property
    def total_price(self):
        if self.price is None or self.quantity is None:
            return 0
        return self.price * self.quantity

    def __str__(self):
        return f"{self.product} - {self.quantity}"
