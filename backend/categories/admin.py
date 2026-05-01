from django.contrib import admin
from django.utils.html import format_html
from .models import Category
from unfold.admin import ModelAdmin

@admin.register(Category) 
class CategoryAdmin(ModelAdmin): 
    list_display = ["image_preview","name", "parent"]
    prepopulated_fields = {"slug": ("name",)}
    ordering = ["-parent__name"]
    search_fields = ["name"]

    @admin.display(description="Category Image")
    def image_preview(self, obj): 
        
        if obj.category_image:
            return format_html(
                '<img src="{}" class="w-10 h-10 object-cover rounded border border-gray-200 shadow-sm" />', 
                obj.category_image.url
            )
        # Agar photo nahi hai toh ek dash '-' dikha dein
        return format_html('<span class="text-gray-300">{}</span>',"-")