from rest_framework import serializers
from .models import Profile
 

class ProfileSerializer(serializers.ModelSerializer):
 
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Profile
        fields = ["email","first_name","last_name","date_of_birth","phone_number", "profile_pic"]
    
    def update(self, instance, validated_data):
        # User data alag nikal kar User update karo
        user_data = validated_data.pop('user', {})
        if user_data:
            user = instance.user
            user.first_name = user_data.get('first_name', user.first_name)
            user.last_name = user_data.get('last_name', user.last_name)
            user.save()

        # Baki bacha hua data Profile me update karo
        return super().update(instance, validated_data)


    def to_representation(self, instance):
        # 1. Pehle default data fetch karein
        data = super().to_representation(instance)

        # 2. Agar profile_pic exist karti hai, toh uska URL theek karein
        if instance.profile_pic:
            # Agar URL pehle se theek hai (http se shuru ho raha hai), toh wahi rehne dein
            if str(instance.profile_pic.url).startswith('http'):
                data['profile_pic'] = str(instance.profile_pic.url)
            else:
                # Warna Cloudinary ka base URL append kar dein
                # (Apna asli 'cloud_name' yahan daalein)
                data['profile_pic'] = f"https://res.cloudinary.com/dhdzriwzq/{instance.profile_pic}"
        else:
            data['profile_pic'] = None

        return data
