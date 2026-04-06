from django.urls import path
from .views import SendEmailOTP, VerifyEmailOTP, GoogleLogin, UserProfileView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("send-otp/", SendEmailOTP.as_view()),
    path("verify-otp/", VerifyEmailOTP.as_view()),
    path("profile/", UserProfileView.as_view(), name="user-profile"),
    path("refresh/", TokenRefreshView.as_view()),
    path("google/", GoogleLogin.as_view()),
]
