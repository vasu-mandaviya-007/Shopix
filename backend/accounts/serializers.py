from rest_framework import serializers
from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):

    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Profile
        fields = ["email", "first_name", "last_name", "phone_number", "profile_pic"]

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
