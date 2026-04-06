from django.db import models
from base.models import BaseModel
from cloudinary.models import CloudinaryField

# Create your models here. 

# 1. Category (Standard Recursive Model)
class Category(BaseModel): 
    name = models.CharField(max_length=255)
    # category_image = CloudinaryField("image", blank=True, null=True, folder="ecommerce/category_image")
    category_image = CloudinaryField("image", blank=True, null=True, folder="ecommerce/category_image")

    slug = models.SlugField(unique=True)
    parent = models.ForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True, related_name="children"
    )
    LAYOUT_CHOICES = (
        ("image", "Image Focused"),
        ("spec", "Spec Heavy"),
        ("compact", "Compact"),
    )

    layout = models.CharField(max_length=20, choices=LAYOUT_CHOICES, default="spec")
    filters = models.JSONField(default=list,null=True,blank=True)

    class Meta:
        verbose_name_plural = "Categories"

    def get_category_path(category):
        path = []
        while category:
            path.insert(0, category)
            category = category.parent
        return path

    def get_full_name(self) : 
        full_path = [self.name]
        parent = self.parent
        while parent is not None:
            full_path.append(parent.name)
            parent = parent.parent
        return " > ".join(full_path[::-1])

    def __str__(self):
        # Recursive method to show full path: "Electronics > Laptops > Gaming"
        # return self.name
        full_path = [self.name]
        k = self.parent
        while k is not None:
            full_path.append(k.name)
            k = k.parent
        return " > ".join(full_path[::-1])
