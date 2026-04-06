import pandas as pd
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
from django.utils import timezone
import uuid
import re


headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36"
}

url = "https://www.flipkart.com/google-pixel-9a-obsidian-256-gb/p/itmf9d1fcfa566cf?pid=MOBH9YMEQUGCHPHN&lid=LSTMOBH9YMEQUGCHPHNSFHZNA&marketplace=FLIPKART&store=tyy%2F4io&srno=b_1_1&otracker=browse&fm=organic&iid=en_gjzwrUiQnhm1x1dJim_aDcvz5xQWGCkPvo3bej99_E3Shc9r79Ii_hGMHgPrpq71Z_TXqLzbetHXYys2TL79CQ%3D%3D&ppt=None&ppn=None&ssid=p7h8yz01r40000001768051601947"

page = req.get(
    url,
    headers=headers,
).text

soup = BeautifulSoup(page, "lxml")

def clean_product_name(name: str) -> str:
    # remove anything inside ()
    return re.sub(r"\s*\(.*?\)", "", name).strip()

raw_name = soup.find(class_="LMizgS").text
product_name = clean_product_name(raw_name)

print("\n\n==========================================================================================\n")

print(f"Product Name : {product_name}")

def extract_price(class_name):
    tag = soup.find(class_=class_name)
    if not tag:
        return 0
    digits = "".join(c for c in tag.get_text() if c.isdigit())
    return int(digits) if digits else 0

discount_price = extract_price("bnqy13")
price = extract_price("yHYOcc")

print("\n\n==========================================================================================\n")

print(f"Discount Price : {discount_price}")


print("\n\n==========================================================================================\n")

print(f"Price : {price}")


# Find Specifications
specifications = {}

spec_group = soup.find_all(class_="QZKsWF")

for i in spec_group:
    grop_name = i.find(class_="ZRVDNa").text
    spec_items = {}
    for j in i.find_all(class_="v1Jif8"):
        spec_key = j.find(class_="JMeybS").text
        spec_value = j.find(class_="QPlg21").text
        spec_items[spec_key] = spec_value
    specifications[grop_name] = spec_items

print("\n\n==========================================================================================\n")

print("Specifications : \n")

for key,values in specifications.items() : 
    print("\n")
    print(key)
    for k,v in values.items() : 
        print(f"\t--- {k} => {v}")


attribute_container = soup.find_all(class_="UD6IKn")

attributes = {}

for a in attribute_container:
    attr_name = a.find(class_="VgDgyj").text.upper()
    value = a.find(class_="yKVTId")
    if value.text:
        attributes[attr_name] = value.text
    else:
        # find active color anchor
        active_color = soup.select_one("a.yKVTId")

        if active_color:
            color_name = active_color.find_next("div", class_="wpbaaT").get_text(
                strip=True
            )

            attributes[attr_name] = color_name
        else:
            print("No active color found")

# Save Images
fetched_images = soup.find_all("img", class_="EIfF82")

images = []
count = 1
for image in fetched_images:
    img_url = image["src"].replace("128", "5000")

    images.append(img_url)

    # if not img_url:
    #     continue

    # try:
    #     img_data = req.get(img_url, headers=headers).content
    #     safe_name = sanitize_filename(product_name)[0:11]
    #     with open(f"images/{safe_name}_{count}.jpg", "wb") as f:
    #         f.write(img_data)
    #     print(f"Saved image {count}")
    #     count += 1
    # except Exception as e:
    #     print("Failed:", e)


def save_variant_images(variant, image_urls):
    for index, url in enumerate(image_urls):
        try:
            response = req.get(url, timeout=10)
            response.raise_for_status()

            # create unique filename
            ext = url.split(".")[-1].split("?")[0]
            filename = f"{uuid.uuid4()}.{ext}"

            product_image = ProductImage(variant=variant, is_main=(index == 0))

            product_image.image.save(filename, ContentFile(response.content), save=True)

        except Exception as e:
            print("Image failed:", url, e)


prompt = bool(input("Do You Want to Add Product : "))

if prompt :

    def run():
        electronics, _ = Category.objects.get_or_create(name="Mobiles", slug="mobiles")
        # fashion, _ = Category.objects.get_or_create(name="Fashion", slug="fashion")

        # for i in range(TOTAL_PRODUCTS):
        category = electronics

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
            # brand=random.choice(brands),
            description="Auto generated product",
            is_active=True,
        )

        product.categories.add(category)

        for group_name, items in specifications.items():
            group = SpecificationGroup.objects.create(product=product, name=group_name)

            for key, values in items.items():
                SpecificationItem.objects.create(group=group, name=key, value=values)

        variant = ProductVariant.objects.create(
            product=product,
            sku=generate_sku(product, attributes),
            price=price,
            discount_price=discount_price,
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

        print("product created successfully!")


run()
