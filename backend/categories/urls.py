from django.urls import path, include
from .views import categories_list,get_sub_categories,create_category

urlpatterns = [ 

    path("", categories_list, name="categories"),  
    path("sub-categories/<str:slug>", get_sub_categories), 
    path("admin/create-category/",create_category) 
 
]
 