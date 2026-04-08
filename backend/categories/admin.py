from django.contrib import admin
from .models import Category
from unfold.admin import ModelAdmin

@admin.register(Category) 
class CategoryAdmin(ModelAdmin):
    list_display = ["name", "parent"]
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ["name"]