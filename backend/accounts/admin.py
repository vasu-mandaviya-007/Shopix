from django.contrib import admin
from accounts.models import Profile,EmailOTP
from unfold.admin import ModelAdmin


# Register your models here.

@admin.register(Profile)
class ProfileAdmin(ModelAdmin):
    list_display = ['user','first_name','last_name',"phone_number","profile_pic"]
    

@admin.register(EmailOTP)
class EmailOTPAdmin(ModelAdmin) : 
    pass

