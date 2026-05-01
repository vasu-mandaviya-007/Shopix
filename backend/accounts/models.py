from django.db import models
from django.contrib.auth.models import User
from base.models import BaseModel

 
from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import post_save
from cloudinary.models import CloudinaryField

from django.utils import timezone
from datetime import timedelta 
from django.core.exceptions import ObjectDoesNotExist

class EmailOTP(models.Model):
    
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        return timezone.now() > self.created_at + timedelta(minutes=5)

    def __str__(self):
        return self.email 

 
class Profile(BaseModel):

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")

    phone_number = models.CharField(max_length=15, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)

    profile_pic = CloudinaryField(
        "image", folder="ecommerce/profile_pics", blank=True, null=True
    )

    gender = models.CharField(max_length=10, choices=(('M', 'Male'), ('F', 'Female'), ('O', 'Other')), blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)

    email_verified = models.BooleanField(default=False)
    newsletter_subscribed = models.BooleanField(default=True)

    def __str__(self):
        return self.user.email



@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    else:
        # 🌟 THE FIX: Agar user purana hai aur profile save karni hai
        try:
            instance.profile.save()
        except ObjectDoesNotExist:
            # Agar profile nahi mili (like purana superuser), toh nayi bana do!
            Profile.objects.create(user=instance)