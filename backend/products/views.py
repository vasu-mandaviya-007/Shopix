from django.shortcuts import render, get_object_or_404
from .models import Product
from categories.models import Category
from django.forms.models import model_to_dict
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from rest_framework import status
from products.serializers import (
    ProductVariant,
    ProductSerializer,
    ProductListSerializer,
    BrandSerializer,
    ProductVariantSerializer,
)
from products.models import SpecificationItem
from categories.serializers import CategorySerializer
from django.views.decorators.cache import cache_page
from rest_framework.pagination import PageNumberPagination

def build_category_path(category):
    path = []
    while category:
        path.insert(0, category)
        category = category.parent
    return path
 

@api_view(["GET"])
@cache_page(60 * 60)  # Cache for 1 hour
def get_banner_data(request):

    automated_banners = []

    top_categories = Category.objects.all()

    for index, category in enumerate(top_categories):

        if len(automated_banners) >= 5:
            break

        top_product = (
            ProductVariant.objects.filter(
                product__primary_category=category, price__isnull=False
            )
            .order_by("-price")
            .first()
        )

        if not top_product:
            top_product = ProductVariant.objects.filter(
                product__primary_category=category
            ).first()

        if top_product:

            discount_percent = 0

            if top_product.price and top_product.mrp:
                discount_percent = int(
                    ((top_product.mrp - top_product.price) / top_product.mrp) * 100
                )

            if discount_percent > 0:
                banner_title = f"Up to {discount_percent}% Off on {category.name}"
                banner_tag = "Trending Deal"
            else:
                banner_title = f"Premium {category.name} Collection"
                banner_tag = "New Arrival"

            banner_data = {
                "id": f"auto_banner_{category.uid}",
                "tag": banner_tag,
                "category": category.name,
                "title": banner_title,
                "subtitle": f"Featuring {top_product.product.title}. Upgrade your lifestyle today.",
                "product_image": (
                    request.build_absolute_uri(top_product.images.first().image.url)
                    if top_product.images.exists()
                    else None
                ),
                "price": top_product.price or top_product.price,
                "mrp": top_product.price,
                "cta_link": f"/products/{category.slug}",
            }
            automated_banners.append(banner_data)

    return Response({"banners": automated_banners})


@api_view(["GET"])
@cache_page(60 * 60)  # Cache for 1 hour
def get_deals_of_the_day(request):

    deals = (
        ProductVariant.objects.select_related("product")
        .prefetch_related("images")
        .filter(stock_qty__gt=0, discount_percent__gt=0)
        .order_by("product__primary_category", "-discount_percent")
        .distinct("product__primary_category")[:10]
    )

    deals_data = ProductListSerializer(deals, many=True, context={"request": request}).data

    return Response({"deals_of_the_day": deals_data})


@api_view(["GET"])
def get_homepage_data(request):

    trending_products = (
        ProductVariant.objects.select_related("product", "product__primary_category")
        .prefetch_related("images")
        .filter(stock_qty__gt=0)
        .order_by("product", "price")
        .distinct("product")[:12]
    )

    paginator = PageNumberPagination()

    paginator.page_size = 4

    result_page = paginator.paginate_queryset(trending_products, request)

    trending_data = ProductListSerializer(
        result_page, many=True, context={"request": request}
    )

    return Response(
        {
            "trending_products": paginator.get_paginated_response(trending_data.data).data
        }
    )


@api_view(["GET"])
def get_related_products(request, slug):
    try:
        # 1. Current product dhundo jise user dekh raha hai
        current_product = Product.objects.get(slug=slug)

        # 2. Current product ki categories nikaalo
        categories = current_product.categories.all()

        # 3. Same category ke baaki products nikaalo, par current product ko EXCLUDE kar do
        # 'distinct()' lagana zaruri hai taaki duplicate products na aayein
        related_products = (
            ProductVariant.objects.filter(
                product__primary_category__in=categories,
                stock_qty__gt=0,  # Sirf in-stock products dikhao (agar aapke model me ye field hai)
            )
            .exclude(product__uid=current_product.uid)
            .distinct()
            .order_by("?")[:4]
        )
        # .order_by('?') ka matlab hai random products dikhana, ya aap '-created_at' bhi use kar sakte hain naye products dikhane ke liye.

        # 4. JSON me convert karo
        # Yahan apna ProductListSerializer use karein jo aapne pehle banaya tha
        serializer = ProductListSerializer(
            related_products, many=True, context={"request": request}
        )

        return Response(serializer.data)

    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)


@api_view(["GET"])
def get_product_detail(request, slug):

    product = get_object_or_404(Product, slug=slug)

    # Get all variants for this product
    variants = product.variants.filter(stock_qty__gt=0)

    category_path = []
    if product.primary_category:
        path = build_category_path(product.primary_category)
        category_path = CategorySerializer(path, many=True).data

    context = {
        "product": ProductSerializer(product, context={"request": request}).data,
        "category_path": category_path,
        "variants": ProductVariantSerializer(
            variants, many=True, context={"request": request}
        ).data,
    }

    return Response(context)


def search(req):
    return render(req, "product/search_result.html")


def get_leaf_categories(category):
    children = Category.objects.filter(parent=category)

    if not children.exists():
        return [category]

    leaves = []
    for child in children:
        leaves.extend(get_leaf_categories(child))
    return leaves


ALLOWED_CATEGORY_FILTERS = {
    # 📱 1. PHONES & WEARABLES
    "Smartphones": [
        "RAM",
        "Color",
        "Internal Storage",
        "Processor Brand",
        "Battery Capacity",
        "Network Type",
        "Screen Size",
        "Primary Camera",
        "Operating System",
    ],
    "Tablets & eReaders": [
        "RAM",
        "Internal Storage",
        "Screen Size",
        "Connectivity",
        "Operating System",
    ],
    "Wearables": [
        "Dial Shape",
        "Display Type",
        "Compatible OS",
        "Strap Material",
        "Water Resistant",
    ],
    "Mobile Accessories": [
        "Accessory Type",
        "Compatible Brand",
        "Cable Length",
        "Capacity",
    ],
    # 💻 2. COMPUTERS & TABLETS
    "Laptops": [
        "Processor Brand",
        "Processor Name",
        "RAM",
        "Storage Capacity",
        "Graphics Memory",
        "Operating System",
        "Screen Size",
        "Touchscreen",
        "Weight",
    ],
    "Desktops & Monitors": [
        "Processor",
        "RAM",
        "Storage",
        "Screen Size",
        "Resolution",
        "Refresh Rate",
        "Panel Type",
    ],
    "Computer Peripherals": [
        "Connectivity",
        "Keyboard Type",
        "Mouse Type",
        "Interface",
    ],
    "Storage Devices": ["Storage Capacity", "Storage Type", "Interface"],
    "Networking & Printers": [
        "Router Type",
        "Wireless Speed",
        "Printer Type",
        "Print Output",
    ],
    "PC Components": [
        "Component Type",
        "Chipset",
        "Memory Size",
        "Socket Type",
        "Form Factor",
    ],
    # 📺 3. TV & VIDEO
    "Televisions": [
        "Screen Size",
        "Resolution",
        "Smart TV",
        "Display Technology",
        "Refresh Rate",
    ],
    "Projectors": ["Maximum Resolution", "Brightness", "Connectivity"],
    "Streaming Devices": ["Resolution", "Connectivity", "Voice Assistant"],
    # 🎧 4. AUDIO & SOUND
    "Headphones & Earphones": [
        "Type",
        "Connectivity",
        "Microphone",
        "Noise Cancellation",
        "Play Time",
    ],
    "Speakers & Soundbars": [
        "Configuration",
        "Power Output",
        "Connectivity",
        "Battery Life",
    ],
    # 🏠 5. HOME APPLIANCES
    "Air Conditioners": [
        "Capacity (Tons)",
        "Energy Rating",
        "Condenser Coil",
        "Type",
    ],
    "Refrigerators": [
        "Capacity (Liters)",
        "Energy Rating",
        "Compressor Type",
        "Defrosting Type",
    ],
    "Washing Machines": [
        "Washing Capacity",
        "Function Type",
        "Load Type",
        "Energy Rating",
    ],
    "Air Treatment": ["Coverage Area", "Filter Type", "Type"],
    "Cleaning & Garment Care": ["Type", "Power Consumption", "Dust Capacity"],
    # 🍳 6. KITCHEN APPLIANCES
    "Cooking Gadgets": [
        "Capacity",
        "Type",
        "Power Consumption",
        "Control Type",
    ],
    "Food Preparation": ["Power", "Number of Jars", "Functions"],
    "Beverage Makers": ["Type", "Capacity", "Purification Technology"],
    # ✂️ 7. PERSONAL CARE & GROOMING
    "Men's Grooming": ["Type", "Run Time", "Charging Time", "Water Resistant"],
    "Women's Care": ["Type", "Heat Settings", "Attachment Types"],
    "Health & Wellness": ["Type", "Display Type", "Measurement Range"],
    # 📷 8. CAMERAS & ACCESSORIES
    "Cameras": [
        "Camera Type",
        "Sensor Type",
        "Effective Pixels",
        "Video Resolution",
    ],
    "Action & Drones": ["Video Resolution", "Battery Life", "Flight Time"],
    "Photography Gear": ["Type", "Mount Type", "Maximum Load"],
    # 🎮 9. GAMING
    "Gaming Consoles": ["Console Type", "Storage Capacity", "Included Games"],
    "Games": ["Platform", "Genre", "Publisher", "Edition"],
    "Gaming Accessories": [
        "Accessory Type",
        "Compatible Platform",
        "Connectivity",
    ],
}


class ProductPagination(PageNumberPagination):
    page_size = 8
    page_size_query_param = "page_size"
    max_page_size = 50


from django.db.models import Count
from django.db.models import Q


@api_view(["GET"])
def get_product_listing(request, slug=None):

    if not slug or slug == "all":
        current_category = None
        category_name = "All Products"
        child_cat = Category.objects.filter(parent__isnull=True)
        categories_to_fetch = Category.objects.filter(parent__isnull=False)

    else:

        current_category = Category.objects.get(slug=slug)
        category_name = current_category.name
        child_cat = current_category.children.all()

        def get_child_cateogry(cat):
            children = Category.objects.filter(parent=cat)
            if not children.exists():
                return [cat]
            leaves = []
            for child in children:
                leaves.extend(get_child_cateogry(child))
            return leaves

        categories_to_fetch = [current_category] + list(
            get_child_cateogry(current_category)
        )

    products = (
        ProductVariant.objects.select_related("product", "product__primary_category")
        .prefetch_related("images")
        .filter(stock_qty__gt=0, product__primary_category__in=categories_to_fetch)
    ).order_by("price")

    # GENERATE DYNAMIC FILTER

    inferred_category_name = None

    # Agar user kisi direct category page (slug) par nahi hai, par usne kuch Search (q) kiya hai
    search_query = request.GET.get("q", "").strip()

    if search_query:
        products = products.filter(
            Q(product__title__icontains=search_query)
            | Q(product__primary_category__name__icontains=search_query)
            | Q(product__brand__name__icontains=search_query)
            | Q(product__spec_groups__spec_items__value__icontains=search_query)
            | Q(product__description__icontains=search_query)
        ).distinct()

    if not current_category and search_query:
        # Search results mein sabse zyada kis category ke products aaye hain, wo nikalo
        dominant_category = (
            products.values("product__primary_category__name")  # Category ka naam pakdo
            .annotate(
                cat_count=Count("uid")
            )  # Gino ki us category ke kitne products hain
            .order_by("-cat_count")  # Sabse zyada wale ko top par rakho
            .first()  # Sirf pehla (dominant) utha lo
        )

        if dominant_category:
            # Hamein pata chal gaya ki user actually kya dhundh raha hai! (e.g., 'Smartphones')
            inferred_category_name = dominant_category[
                "product__primary_category__name"
            ]

    base_products = Product.objects.filter(
        categories__in=categories_to_fetch
    ).distinct()

    dynamic_filters = {}
    spec_items = []

    category_for_filters = None

    if current_category:
        if current_category.parent and current_category.parent.parent is not None:
            category_for_filters = current_category.parent.name
        else:
            category_for_filters = current_category.name

    elif inferred_category_name:
        category_for_filters = inferred_category_name

    print(inferred_category_name)

    if category_for_filters:

        allowed_filters = ALLOWED_CATEGORY_FILTERS.get(category_for_filters, [])

        if allowed_filters:

            spec_items = (
                SpecificationItem.objects.filter(
                    group__product__in=products.values("product"),
                    name__in=allowed_filters,
                )
                .values("name", "value")
                .distinct()
            )

    for item in spec_items:
        key = item["name"]
        val = item["value"]
        if key not in dynamic_filters:
            dynamic_filters[key] = [val]
        else:
            dynamic_filters[key].append(val)

    brands = (
        base_products.filter(brand__isnull=False)
        .values_list("brand__name", flat=True)
        .distinct()
    )

    available_filters = []

    if brands:
        available_filters.append({"filterName": "Brand", "options": list(brands)})

    for key, values in dynamic_filters.items():
        available_filters.append({"filterName": key, "options": list(values)})

    # Apple Filter

    raw_brands = request.GET.get("Brand")  # Gets the string: "Apple,Google"
    if raw_brands:
        # Splits the string at the comma into a real Python list: ['Apple', 'Google']
        brands_selected = [b.strip() for b in raw_brands.split(",")]
        products = products.filter(product__brand__name__in=brands_selected)
        print(brands_selected)

    ignore_keys = ["Brand", "min_price", "max_price", "q", "page", "sort"]

    for key, value in request.GET.items():
        if key not in ignore_keys:
            value_list = value.split(",")
            print(value_list)
            products = products.filter(
                product__spec_groups__spec_items__name=key,
                product__spec_groups__spec_items__value__in=value_list,
            )

    # products = list(products) * 4

    paginator = ProductPagination()
    paginated_query_set = paginator.paginate_queryset(products, request)

    serializer = ProductListSerializer(
        paginated_query_set, many=True, context={"request": request}
    )

    breadcrumbs = []
    if current_category:
        parent = current_category.parent
        while parent:
            breadcrumbs.insert(0, {"name": parent.name, "slug": parent.slug})
            parent = parent.parent

    return Response(
        {
            "IsParent": False,
            "message": "Success",
            "filters": available_filters,
            "category": CategorySerializer(current_category).data,
            "category_name": category_name,
            "sub_category": CategorySerializer(child_cat, many=True).data,
            "categories_to_fetch": CategorySerializer(
                categories_to_fetch, many=True
            ).data,
            "breadcrumbs": breadcrumbs,
            "products": serializer.data,
            "pagination": {
                "count": paginator.page.paginator.count,
                "next": paginator.get_next_link(),
                "previous": paginator.get_previous_link(),
                "current_page": paginator.page.number,
                "total_pages": paginator.page.paginator.num_pages,
                "has_next": paginator.page.has_next(),
                "has_previous": paginator.page.has_previous(),
            },
        } 
    )
    # pass


@api_view(["GET"])
def get_product_by_category(request, slug):

    try:
        # category = Category.objects.get(slug=slug, parent__isnull=False)
        category = Category.objects.get(slug=slug)

        if category.parent is None:

            child_categories = []

            fatched_category = Category.objects.filter(parent=category)

            for f in fatched_category:
                child_categories.append(f)

            response_data = {}

            # child_categories = Category.objects.filter(parent=category)

            for child in child_categories:
                leaf_categories = get_leaf_categories(child)

                products = (
                    ProductVariant.objects.select_related(
                        "product", "product__primary_category"
                    )
                    .prefetch_related("images")
                    .filter(
                        stock_qty__gt=0, product__primary_category__in=leaf_categories
                    )
                ).order_by("-created_at")

                serializer = ProductListSerializer(
                    products, many=True, context={"request": request}
                )

                response_data[child.slug] = serializer.data

            child_cat = category.children.all()
            return Response(
                {
                    "IsParent": True,
                    "sub_category": CategorySerializer(
                        child_cat, many=True, context={"request": request}
                    ).data,
                    "category": CategorySerializer(category).data,
                    "products": response_data,
                }
            )

        all_categories = [category]

        # Helper function to grab all descendants
        def get_all_children(cat):
            children = cat.children.all()
            for child in children:
                all_categories.append(child)
                get_all_children(child)

        get_all_children(category)

        base_products = Product.objects.filter(categories__in=all_categories).distinct()

        dynamic_filters = {}

        spec_items = (
            SpecificationItem.objects.filter(
                group__product__in=base_products,
                name__in=ALLOWED_CATEGORY_FILTERS.get(category.name, []),
            )
            .values("name", "value")
            .distinct()
        )

        for item in spec_items:
            key = item["name"]
            val = item["value"]
            if key not in dynamic_filters:
                dynamic_filters[key] = [val]
            else:
                dynamic_filters[key].append(val)

        brands = (
            base_products.filter(brand__isnull=False)
            .values_list("brand__name", flat=True)
            .distinct()
        )

        available_filters = []

        if brands:
            available_filters.append({"filterName": "Brand", "options": list(brands)})

        for key, values in dynamic_filters.items():
            available_filters.append({"filterName": key, "options": list(values)})

        sub_categories = category.children.all()

        # A. Logic to fetch products from this category AND its children
        # (e.g., Selecting "Mobiles" should show products from "Samsung" too)

        products_to_return = (
            ProductVariant.objects.select_related(
                "product", "product__primary_category"
            )
            .prefetch_related("images")
            .filter(stock_qty__gt=0, product__categories__in=all_categories)
        ).order_by("-created_at")

        # NEW CODE
        # raw_brands = request.GET.get("Brand")  # Gets the string: "Apple,Google"
        # if raw_brands:
        #     # Splits the string at the comma into a real Python list: ['Apple', 'Google']
        #     brands_selected = [b.strip() for b in raw_brands.split(",")]
        #     products_to_return = products_to_return.filter(
        #         brand__name__in=brands_selected
        #     )
        #     print(brands_selected)

        # ignore_keys = ["Brand", "min_price", "max_price", "page", "sort"]
        # for key, value in request.GET.items():
        #     if key not in ignore_keys:
        #         # If the value has a comma (e.g., "8GB,16GB"), split it into a list
        #         if "," in value:
        #             val_list = [v.strip() for v in value.split(",")]
        #             products_to_return = products_to_return.filter(
        #                 spec_groups__spec_items__name=key,
        #                 spec_groups__spec_items__value__in=val_list,  # Notice the __in here!
        #             )
        #         else:
        #             # Single value selected
        #             products_to_return = products_to_return.filter(
        #                 spec_groups__spec_items__name=key,
        #                 spec_groups__spec_items__value=value,
        #             )

        # default_variant_prefetch = Prefetch(
        #     "variants",
        #     queryset=ProductVariant.objects.filter(is_default=True),
        #     to_attr="default_variant",
        # )

        # products_to_return = products_to_return.prefetch_related(
        #     default_variant_prefetch, "spec_groups__spec_items"
        # ).distinct()

        # product_serializer = ProductSerializer(
        #     products_to_return, many=True, context={"request": request}
        # )

        product_serializer = ProductListSerializer(
            products_to_return, many=True, context={"request": request}
        )

        # B. Logic to build Breadcrumbs (Bottom-up)
        breadcrumbs = []
        parent = category.parent
        while parent:
            breadcrumbs.insert(0, {"name": parent.name, "slug": parent.slug})
            parent = parent.parent

        return Response(
            {
                "category_name": category.name,
                "filters": available_filters,
                "category": CategorySerializer(
                    category, context={"request": request}
                ).data,
                "sub_category": CategorySerializer(
                    sub_categories, context={"request": request}, many=True
                ).data,
                "breadcrumbs": breadcrumbs,
                "products": product_serializer.data,
            }
        )

    except Category.DoesNotExist:
        return Response({"error": "Category not found"}, status=404)


# For Admin

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time
import requests as req
from bs4 import BeautifulSoup
from pathvalidate import sanitize_filename

from django.core.files.base import ContentFile
import uuid
import random
from django.utils.text import slugify
from products.models import (
    Category,
    Product,
    ProductVariant,
    ProductAttribute,
    VariantAttributeValue,
    ProductImage,
    SpecificationGroup,
    SpecificationItem,
    Brand,
)
import re
import cloudinary.uploader


@api_view(["GET"])
def product_dropdown_list(request):
    products = Product.objects.filter(is_active=True).order_by("-uid")

    return Response([{"id": p.uid, "title": p.title} for p in products])


@api_view(["POST"])
def add_brand(request):

    try:

        brand_name = request.data.get("brand")

        if not brand_name:
            return Response({"error": "Brand name required"}, status=400)

        brand_name = brand_name.strip().capitalize()

        # ✅ Proper existence check
        if Brand.objects.filter(name__iexact=brand_name).exists():
            return Response({"error": "Brand already exists"}, status=400)

        slug = slugify(brand_name)

        brand = Brand.objects.create(name=brand_name, slug=slug)

        return Response(
            {
                "message": "Brand added successfully",
                "brand": BrandSerializer(brand).data,
            },
            status=201,
        )

    except Exception as e:

        return Response({"error": "Brand Saved Failed"})


@api_view(["GET"])
def add_product_data(request):

    categories = Category.objects.filter().order_by("-uid")

    all_category = []
    for c in categories:
        all_category.append({"id": c.uid, "name": c.get_full_name()})

    brands = Brand.objects.all()

    return Response(
        {"category": all_category, "brands": BrandSerializer(brands, many=True).data}
    )


def save_variant_images(variant, image_urls):

    for index, url in enumerate(image_urls):

        try:

            upload_result = cloudinary.uploader.upload(url, folder="ecommerce/products")

            public_id = upload_result["public_id"]

            ProductImage.objects.create(
                variant=variant, image=public_id, is_main=(index == 0)
            )

        except Exception as e:
            print("Image failed:", url, e)


@api_view(["POST"])
def scrape_and_create_variant(request):

    product_id = request.data.get("product_id")
    url = request.data.get("url")

    if not product_id or not url:
        return Response(
            {"error": "product_id and url required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    product = Product.objects.get(uid=product_id)

    options = Options()
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("start-maximized")
    # options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option("useAutomationExtension", False)

    driver = webdriver.Chrome(options=options)

    # driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

    # open homepage first
    driver.get("https://www.croma.com/")
    time.sleep(3)

    # open product page
    driver.get(url)
    time.sleep(5)

    # scroll like human
    driver.execute_script("window.scrollTo(0, 600)")
    time.sleep(2)

    # captcha detection
    if "captcha" in driver.page_source.lower():
        input("Solve captcha and press ENTER")

    soup = BeautifulSoup(driver.page_source, "lxml")

    # Scrape Price
    def extract_price(tag):
        if not tag:
            return 0

        text = tag.get_text()

        match = re.search(r"\d+(?:,\d{3})*(?:\.\d+)?", text)

        if match:
            return int(float(match.group().replace(",", "")))

        return 0

    price = extract_price(soup.select_one("#pdp-product-price"))
    mrp = extract_price(soup.select_one("#old-price"))

    # Scrape Attribute
    attributes = {}

    attribute_container = soup.find_all(class_="variant-info-item")

    for a in attribute_container:
        # print(a)
        attr_name = a.find(class_="variant-info-title").text.upper()
        active_value = None

        # loop through options
        for option in a.select(".cp-radio-item"):
            radio = option.find("input")
            label = option.find("label")

            if not label:
                continue

            value_text = label.get_text(strip=True)

            # check active option
            if radio and radio.has_attr("checked"):
                active_value = value_text
                break

        if active_value:
            attributes[attr_name] = active_value

    # Save Images
    fetched_images = soup.select(".swiper-container-vertical .swiper-slide img")

    images = []
    count = 1
    active_image = soup.select(".swiper-container-horizontal .swiper-slide-active img")
    active_image = f"{active_image[0]["src"].split("?")[0]}?tr=w-1000"
    images.append(active_image)
    for image in fetched_images:

        src = image["src"]
        if src:
            if "video_thumbnail" in src or "lazyLoading" in src:
                continue
            else:
                src = f"{src.split("?")[0]}?tr=w-1000"
            images.append(src)

    images = list(dict.fromkeys(images))
    # images = images[:6]

    def run():

        def clean_sku(text):
            text = text.upper()
            text = re.sub(r"[^A-Z0-9]", "", text)
            return text

        def generate_sku(product, attributes: dict):
            base = clean_sku(product.slug or product.title)

            parts = [base]

            # sort for consistency
            for key in sorted(attributes.keys()):
                parts.append(clean_sku(attributes[key]))

            # short unique suffix
            unique = uuid.uuid4().hex[:4].upper()
            parts.append(unique)

            return "-".join(parts)

        variant = ProductVariant.objects.create(
            product=product,
            sku=generate_sku(product, attributes),
            mrp=mrp,
            price=price,
            stock_qty=random.randint(1, 100),
        )

        save_variant_images(variant, images)

        for attr_name, attr_value in attributes.items():

            # Create attribute dynamically
            attribute, _ = ProductAttribute.objects.get_or_create(name=attr_name)

            # Attach attribute value to variant
            VariantAttributeValue.objects.create(
                variant=variant, attribute=attribute, value=attr_value
            )

    run()

    driver.quit()

    return Response({"Message": "Variant Added"})


@api_view(["POST"])
def scrape_and_create_product(request):

    url = request.data.get("url")
    category_id = request.data.get("category_id")
    brand_id = request.data.get("brand_id")
    categories_ids = request.data.get("categories")

    if not url:
        return Response(
            {"error": "url required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    options = Options()
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("start-maximized")
    # options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option("useAutomationExtension", False)

    driver = webdriver.Chrome(options=options)

    # driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

    # open homepage first
    driver.get("https://www.croma.com/")
    time.sleep(3)

    # open product page
    driver.get(url)
    time.sleep(5)

    # scroll like human
    driver.execute_script("window.scrollTo(0, 600)")
    time.sleep(2)

    # captcha detection
    if "captcha" in driver.page_source.lower():
        input("Solve captcha and press ENTER")

    soup = BeautifulSoup(driver.page_source, "lxml")

    def clean_product_name(name: str) -> str:
        # remove anything inside ()
        return re.sub(r"\s*\(.*?\)", "", name).strip()

    raw_name = soup.find(class_="pd-title").text
    product_name = clean_product_name(raw_name)

    # Scrape Price
    def extract_price(tag):
        if not tag:
            return 0

        text = tag.get_text()

        match = re.search(r"\d+(?:,\d{3})*(?:\.\d+)?", text)

        if match:
            return int(float(match.group().replace(",", "")))

        return 0

    price = extract_price(soup.select_one("#pdp-product-price"))
    mrp = extract_price(soup.select_one("#old-price"))

    description_div = soup.select_one("#overview_inner_container")

    if description_div:
        description = description_div.decode_contents()
        print(description)
    else:
        description = ""

    # Scrape Specifications
    specifications = {}

    spec_group = soup.select("#specification_container .cp-specification-info")

    for spec in spec_group:
        group_name = spec.find(class_="title").get_text(strip=True)
        spec_items = {}
        if "Croma" not in group_name:
            for i in spec.find_all(class_="cp-specification-spec-info"):
                spec_key = i.find(class_="cp-specification-spec-title")
                spec_value = i.find(class_="cp-specification-spec-details")

                # ✅ skip empty blocks
                if not spec_key or not spec_value:
                    continue

                spec_items[spec_key.get_text(strip=True)] = spec_value.get_text(
                    strip=True
                )
            if spec_items:
                specifications[group_name] = spec_items

    # Scrape Attribute
    attributes = {}

    attribute_container = soup.find_all(class_="variant-info-item")

    for a in attribute_container:
        # print(a)
        attr_name = a.find(class_="variant-info-title").text.upper()
        active_value = None

        # loop through options
        for option in a.select(".cp-radio-item"):
            radio = option.find("input")
            label = option.find("label")

            if not label:
                continue

            value_text = label.get_text(strip=True)

            # check active option
            if radio and radio.has_attr("checked"):
                active_value = value_text
                break

        if active_value:
            attributes[attr_name] = active_value

    # Save Images
    fetched_images = soup.select(".swiper-container-vertical .swiper-slide img")

    images = []
    count = 1
    active_image = soup.select(".swiper-container-horizontal .swiper-slide-active img")
    active_image = f"{active_image[0]["src"].split("?")[0]}?tr=w-1000"
    images.append(active_image)
    for image in fetched_images:

        src = image["src"]
        if src:
            if "video_thumbnail" in src or "lazyLoading" in src:
                continue
            else:
                src = f"{src.split("?")[0]}?tr=w-1000"
            images.append(src)

    images = list(dict.fromkeys(images))
    images = images[:4]

    def run():

        category = Category.objects.get(uid=category_id)
        categories = Category.objects.filter(uid__in=categories_ids)

        if brand_id:
            brand = Brand.objects.get(uid=brand_id)
        else:
            brand = None

        def clean_sku(text):
            text = text.upper()
            text = re.sub(r"[^A-Z0-9]", "", text)
            return text

        def generate_sku(product, attributes: dict):
            base = clean_sku(product.slug or product.title)

            parts = [base]

            # sort for consistency
            for key in sorted(attributes.keys()):
                parts.append(clean_sku(attributes[key]))

            # short unique suffix
            unique = uuid.uuid4().hex[:4].upper()
            parts.append(unique)

            return "-".join(parts)

        product = Product.objects.create(
            title=product_name,
            primary_category=category,
            slug=slugify(f"{product_name}"),
            brand=brand,
            description=description or "Auto generated product description",
            is_active=True,
        )

        for cat in categories:
            product.categories.add(cat)

        for group_name, items in specifications.items():
            group = SpecificationGroup.objects.create(product=product, name=group_name)

            for key, values in items.items():
                SpecificationItem.objects.create(group=group, name=key, value=values)

        variant = ProductVariant.objects.create(
            product=product,
            sku=generate_sku(product, attributes),
            mrp=mrp,
            price=price,
            stock_qty=random.randint(1, 100),
        )

        save_variant_images(variant, images)

        for attr_name, attr_value in attributes.items():

            # Create attribute dynamically
            attribute, _ = ProductAttribute.objects.get_or_create(name=attr_name)

            # Attach attribute value to variant
            VariantAttributeValue.objects.create(
                variant=variant, attribute=attribute, value=attr_value
            )

    run()

    driver.quit()

    return Response({"Message": "Product Added"})
