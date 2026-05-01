from rest_framework.response import Response
from rest_framework.decorators import APIView
from rest_framework import status
from .models import EmailOTP, Profile
from .utils import send_otp_email
import random
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.core.validators import validate_email

from django.db import transaction
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from django.conf import settings
from accounts.serializers import ProfileSerializer
import cloudinary.uploader
from django.contrib.auth.models import update_last_login


class SendEmailOTP(APIView):

    def post(self, request):
        try:
            email = request.data.get("email")

            if not email:
                return Response({"error": "Please enter your email"}, status=400)

            otp = str(random.randint(100000, 999999))

            EmailOTP.objects.filter(email=email).delete()

            EmailOTP.objects.create(email=email, otp=otp)

            send_otp_email(email, otp)

            return Response({"message": "OTP sent to email"})

        except Exception as e:
            return Response({"error": "Internal Server Error"}, status=500)


class VerifyEmailOTP(APIView):

    def post(self, request):

        try:

            with transaction.atomic():

                email = request.data.get("email")
                otp = request.data.get("otp")

                if not email:
                    return Response(
                        {"error": "Please Enter Your Email"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                if not otp:
                    return Response(
                        {"error": "Please Enter OTP"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                try:
                    validate_email(email)
                except ValidationError:
                    return Response(
                        {"error": "Invalid Email"}, status=status.HTTP_400_BAD_REQUEST
                    )

                otp_obj = EmailOTP.objects.get(email=email, otp=otp)

                if otp_obj.is_expired():
                    return Response(
                        {"error": "OTP Expired"}, status=status.HTTP_400_BAD_REQUEST
                    )

                user, created = User.objects.get_or_create(email=email, username=email)

                if created:
                    profile = Profile.objects.get_or_create(user=user)
                else : 
                    profile = user.profile

                profile.email_verified = True
                profile.save()

                update_last_login(None, user)

                refresh = RefreshToken.for_user(user)
                otp_obj.delete()

                return Response(
                    {
                        "message": (
                            "Register Successfully" if created else "Login Successfully"
                        ),
                        "access": str(refresh.access_token),
                        "refresh": str(refresh),
                        "user": {"email": user.email},
                    }
                )

        except EmailOTP.DoesNotExist:
            return Response(
                {"error": "Invalid OTP"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:

            print(e)
            return Response(
                {"error": "Internal Server Error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class GoogleLogin(APIView):
    def post(self, request):
        token = request.data.get("token")

        try:
            idinfo = id_token.verify_oauth2_token(
                token,
                google_requests.Request(),
                settings.GOOGLE_CLIENT_ID,
                clock_skew_in_seconds=30,
            )

            email = idinfo["email"]
            first_name = idinfo.get("given_name", "")
            last_name = idinfo.get("family_name", "")
            picture_url = idinfo.get("picture", "")
            is_google_verified = idinfo.get("email_verified", False)

            user = User.objects.filter(email=email).first()

            if not user:
                user = User.objects.create(
                    username=email,
                    email=email,
                    first_name=first_name[:30],
                    last_name=last_name[:150],
                )

                user.set_unusable_password()
                user.save()

                profile, _ = Profile.objects.get_or_create(user=user)

            else:
                profile, _ = Profile.objects.get_or_create(user=user)

            if is_google_verified:
                profile.email_verified = True
                profile.save()

            update_last_login(None, user)

            if profile and picture_url and not profile.profile_pic:

                try:

                    upload_result = cloudinary.uploader.upload(
                        picture_url, folder="ecommerce/profile_pics"
                    )

                    profile.profile_pic = upload_result["public_id"]
                    profile.save()

                except Exception as e:
                    print("Error While Saving Google Image : ", e)

            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                    "user": {"email": user.email, "first_name": user.first_name},
                }
            )

        except Exception as e:
            print("Google Error : ", e)
            return Response({"error": "Invalid Google token"}, status=400)


from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .serializers import ProfileSerializer


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user

        profile, created = Profile.objects.get_or_create(user=user)

        return profile
