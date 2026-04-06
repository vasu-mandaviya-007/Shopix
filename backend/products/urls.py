from django.urls import path, include
from .views import (
    get_homepage_data,
    get_product_detail,
    get_related_products,
    get_product_listing,
    # get_all_products,
    get_product_by_category,
    scrape_and_create_variant,
    product_dropdown_list,
    scrape_and_create_product,
    add_product_data,
    add_brand, 
    get_banner_data,
    get_deals_of_the_day
)

app_name = "products" 
 
urlpatterns = [
    # path("", get_all_products),
    path("homepage/", get_homepage_data),

    # Home page data URLs
    path("banners/", get_banner_data),
    path("deals-of-the-day/", get_deals_of_the_day),


    path("<str:slug>/", get_product_detail),
    path('detail/<slug:slug>/related/', get_related_products, name='related-products'),

    path("",get_product_listing),
    path("category/<str:slug>", get_product_listing, name="categories"),
    # path("category/<str:slug>", get_product_by_category, name="categories"),
    # path('search/', search, name='search'),

    # path("", get_product_listing), 
    # path("/slug", get_product_listing),


    # Scape Product URLs
    path("admin/products/dropdown/", product_dropdown_list),
    path("admin/add-product-data/", add_product_data),
    path("admin/add-brand/", add_brand),
    path("admin/scrape-variant/", scrape_and_create_variant),
    path("admin/scrape-product/", scrape_and_create_product),
]
