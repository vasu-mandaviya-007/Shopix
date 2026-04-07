from django.db import models
from django.contrib.auth.models import User
from base.models import BaseModel


from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import post_save
from cloudinary.models import CloudinaryField

from django.utils import timezone
from datetime import timedelta


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

    first_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)

    profile_pic = CloudinaryField(
        "image", folder="ecommerce/profile_pics", blank=True, null=True
    )

    def __str__(self):
        return self.user.email

