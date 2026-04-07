from rest_framework.decorators import api_view
from rest_framework.response import Response  
from rest_framework import decorators, status
from categories.models import Category
from products.serializers import CategorySerializer
from django.utils.text import slugify
from django.views.decorators.cache import cache_page


@api_view(["GET"])
@cache_page(60 * 60)
def categories_list(req):
    categories = Category.objects.filter(parent__isnull=True).order_by("created_at")
    serializer = CategorySerializer(
        categories, many=True, context={"request": req}
    ).data 

    return Response({"categories": serializer})
 

@api_view(["GET"])
def get_sub_categories(request, slug):
    try:
        category = Category.objects.get(slug=slug)
        sub_categories = category.children.all()
        return Response(
            {"sub_category": CategorySerializer(sub_categories, many=True).data}
        )
    except Category.DoesNotExist:
        return Response({"error": "Category not found"}, status=404)

@api_view(["POST"])
def create_category(request) : 
    name = request.data.get("name")
    parent_id = request.data.get("parent")

    if not name:
        return Response(
            {"error": "Category name required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    slug = slugify(name)

    category, created = Category.objects.get_or_create(
        slug=slug,
        defaults={
            "name": name,
            "parent_id": parent_id,
        },
    )

    return Response({
        "id": category.uid,
        "name": category.get_full_name(),
        "created": created,
    })