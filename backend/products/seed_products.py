import random
from django.utils.text import slugify
from products.models import (
    Category, Product, ProductVariant,
    ProductAttribute, VariantAttributeValue,
    ProductImage,
    SpecificationGroup, SpecificationItem,Brand
)
from django.utils import timezone

# -------------------------------
# CONFIG
# -------------------------------
TOTAL_PRODUCTS = 2

PRODUCT_NAMES = [
    "Samsung Smart TV", "LG OLED TV", "Sony Bravia TV",
    "Men Cotton T-Shirt", "Women Kurti", "Denim Jeans",
    "Running Shoes", "Wireless Headphones", "Bluetooth Speaker"
]

IMAGES = [
    "dummy-1.webp",
    "dummy-2.jpg",
    "dummy-3.webp",
    "dummy-4.webp",
    "dummy-5.webp",
    "dummy-6.webp",
    "dummy-7.webp",
]

BRANDS = ["Samsung", "LG", "Sony", "Nike", "Adidas", "Puma"]

brands = []
for name in BRANDS:
    b, _ = Brand.objects.get_or_create(name=name,defaults={"slug": slugify(name)})
    brands.append(b)

COLORS = ["Red", "Blue", "Black", "White"]
SIZES = ["S", "M", "L", "XL"]

TV_SPECS = {
    "General": {
        "Brand": ["Samsung", "LG", "Sony"],
        "Model": ["Series 5", "Series 7", "Series 9"]
    },
    "Connectivity": {
        "HDMI": ["Yes"],
        "USB": ["Yes"]
    },
    "Display": {
        "Display Size": ["43 inch", "50 inch", "55 inch"],
        "Resolution": ["4K", "Full HD"]
    }
}

# -------------------------------
# CREATE ATTRIBUTES
# -------------------------------
color_attr, _ = ProductAttribute.objects.get_or_create(name="Color")
size_attr, _ = ProductAttribute.objects.get_or_create(name="Size")

# -------------------------------
# MAIN GENERATOR
# -------------------------------
def run():
    electronics, _ = Category.objects.get_or_create(name="Electronics", slug="electronics")
    fashion, _ = Category.objects.get_or_create(name="Fashion", slug="fashion")

    for i in range(TOTAL_PRODUCTS):
        category = random.choice([electronics, fashion])

        product = Product.objects.create(
            title=random.choice(PRODUCT_NAMES) + f" {i}",
            slug=slugify(f"{timezone.now()}-{i}"),
            primary_category=category,
            brand=random.choice(brands),
            description="Auto generated product",
            is_active=True
        )

        

        # -------------------------
        # CREATE VARIANTS
        # -------------------------
        # selected_image=random.choice(IMAGES)
        # for color in random.sample(COLORS, 2):
        #     variant = ProductVariant.objects.create(
        #         product=product,
        #         sku=f"SKU-{product.uid}-{color}",
        #         price=random.randint(999, 59999),
        #         discount_price=random.randint(999, 59999),
        #         stock_qty=random.randint(1, 100)
        #     )

        #     VariantAttributeValue.objects.create(
        #         variant=variant,
        #         attribute=color_attr,
        #         value=color
        #     )

        #     # Size only for fashion
        #     if category == fashion:
        #         size = random.choice(SIZES)
        #         VariantAttributeValue.objects.create(
        #             variant=variant,
        #             attribute=size_attr,
        #             value=size
        #         )

        #     # -------------------------
        #     # IMAGES
        #     # -------------------------
        #     ProductImage.objects.create(
        #         variant=variant,
        #         image=f"dummy/{selected_image}",
        #         is_main=True
        #     )

        #     # -------------------------
        #     # SPECIFICATIONS (TV ONLY)
        #     # -------------------------
        #     if category == electronics:
        #         for group_name, items in TV_SPECS.items():
        #             group = SpecificationGroup.objects.create(
        #                 product=product,
        #                 name=group_name
        #             )

        #             for key, values in items.items():
        #                 SpecificationItem.objects.create(
        #                     group=group,
        #                     name=key,
        #                     value=random.choice(values)
        #                 )

    print("✅ 100 products created successfully!")


run()