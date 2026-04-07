from django.db import models
from base.models import BaseModel
from cloudinary.models import CloudinaryField



class Category(BaseModel): 

    name = models.CharField(max_length=255)
    category_image = CloudinaryField("image", blank=True, null=True, folder="ecommerce/category_image")
    slug = models.SlugField(unique=True)
    parent = models.ForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True, related_name="children"
    )

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
        full_path = [self.name]
        k = self.parent
        while k is not None:
            full_path.append(k.name)
            k = k.parent
        return " > ".join(full_path[::-1])
