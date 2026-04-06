
from rest_framework import serializers
from .models import Category

# Serializer for Category
class CategorySerializer(serializers.ModelSerializer):
    
    children = serializers.SerializerMethodField() 
    full_name = serializers.SerializerMethodField()
    category_image = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = '__all__'  

    def get_full_name(self,obj) : 
        return obj.get_full_name()
    
    def get_category_image(self, obj):
        return obj.category_image.url

    def get_children(self,obj) : 

        children = obj.children.all()

        if not children.exists() : 
            return None
        
        serializer = CategorySerializer(children,many=True)
        return serializer.data