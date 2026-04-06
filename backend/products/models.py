from django.db import models
from django.utils.text import slugify
from django.forms import CharField
from base.models import BaseModel
from ckeditor.fields import RichTextField
from categories.models import Category
from cloudinary.models import CloudinaryField


# 1. Brand Model
class Brand(BaseModel):
    name = models.CharField(unique=True, max_length=100)
    slug = models.SlugField(unique=True)
    image = models.ImageField(upload_to="brand/", null=True, blank=True)

    def __str__(self):
        return self.name 


# 2. Available Product Attributes
class ProductAttribute(BaseModel):
    index = models.IntegerField(unique=True, blank=True, null=True)
    name = models.CharField(max_length=100)  # e.g., "Color", "Size", "Storage"

    def save(self, *args, **kwargs):
        if self.index is None:  # first create -> assign next number
            last = ProductAttribute.objects.order_by("-index").first()
            self.index = (last.index + 1) if last else 1
        super().save(*args, **kwargs)

    class Meta:
        ordering = ["-index"]

    def __str__(self):
        return self.name


class Product(BaseModel):

    primary_category = models.ForeignKey(
        Category, related_name="primary_products", on_delete=models.SET_NULL, null=True
    )

    categories = models.ManyToManyField(Category, related_name="products", default="")

    title = models.CharField(max_length=255)

    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True, blank=True)

    description = RichTextField(null=True, blank=True)

    slug = models.SlugField(unique=True, max_length=255)
    is_active = models.BooleanField(default=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


# 4. Product Variant


class ProductVariant(BaseModel):

    product = models.ForeignKey(
        Product, related_name="variants", on_delete=models.CASCADE
    )
    sku = models.CharField(max_length=255, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    mrp = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.0, blank=True, null=True
    )
    stock_qty = models.PositiveIntegerField(default=0)

    is_default = models.BooleanField(default=False)

    discount_percent = models.PositiveBigIntegerField(default=0)

    def save(self, *args, **kwargs):

        if self.mrp and self.price > 0 and self.mrp > self.price:
            discount_amount = self.mrp - self.price
            discount_percent = (discount_amount / self.mrp) * 100
            self.discount_percent = round(discount_percent)
        else:
            self.discount_percent = 0

        has_default = ProductVariant.objects.filter( 
            product=self.product, is_default=True
        ).exists()

        if not has_default:
            self.is_default = True
        elif self.is_default:
            ProductVariant.objects.filter(product=self.product).update(is_default=False)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.product.title


# 5. Connect Attribute to Variant with a Value
class VariantAttributeValue(BaseModel):
    variant = models.ForeignKey(
        ProductVariant, related_name="attribute_values", on_delete=models.CASCADE
    )
    attribute = models.ForeignKey(
        ProductAttribute, related_name="values", on_delete=models.CASCADE
    )
    value = models.CharField(max_length=255)  # e.g., "Red", "16GB", "XL"

    class Meta:
        # Prevent duplicate attributes for same variant (Can't be Red AND Blue at same time)
        unique_together = ("variant", "attribute")

    def __str__(self):
        return f"{self.attribute.name}: {self.value}"


# 6. Product Image
class ProductImage(models.Model):
    variant = models.ForeignKey(
        ProductVariant, related_name="images", on_delete=models.CASCADE
    )
    image = CloudinaryField("image", blank=True, null=True, folder="ecommerce/products")
    # image = models.ImageField(upload_to="products/")
    is_main = models.BooleanField(default=False)

    def __str__(self):
        return f"Image for {self.variant.sku}"


# 7. Product Specification Group
class SpecificationGroup(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="spec_groups"
    )
    name = models.CharField(max_length=100)
    # General, Connectivity, Display

    def __str__(self):
        return self.name


# 8. Product Specification Item
class SpecificationItem(models.Model):
    group = models.ForeignKey(
        SpecificationGroup, on_delete=models.CASCADE, related_name="spec_items"
    )
    name = models.CharField(max_length=100)
    value = models.CharField(max_length=5000)

    def __str__(self):
        return f"{self.name}: {self.value}"
