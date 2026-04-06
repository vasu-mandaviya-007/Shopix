from django.contrib import admin
from accounts.models import Profile,EmailOTP,User
from orders.models import Address

# Register your models here.

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user','first_name','last_name',"phone_number","profile_pic"]

# admin.site.register(Profile)
# admin.site.register(User)
admin.site.register(Address)
admin.site.register(EmailOTP)

