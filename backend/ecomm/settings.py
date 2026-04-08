from pathlib import Path
import os
from decouple import config, Csv
import dj_database_url
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config("SECRET_KEY")

DEBUG = config("DEBUG", default=False, cast=bool)
# DEBUG = True

ALLOWED_HOSTS = config("ALLOWED_HOSTS", default="", cast=Csv())


FRONTEND_URL = config("FRONTEND_URL", default="http://localhost:5173")

INSTALLED_APPS = [
    "jazzmin",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "nested_admin",
    "accounts",
    "categories",
    "cart",
    "orders",
    "rest_framework",
    "corsheaders",
    "ckeditor",
    "ckeditor_uploader",
    # Delete Image when Product deleted
    "products.apps.ProductsConfig",
    "cloudinary_storage",
    "cloudinary",
    # "products",
]

JAZZMIN_SETTINGS = {
    "site_title": "Shopix Admin",
    "site_header": "Shopix Dashboard",
    "site_brand": "Pro",
    "site_logo": "shopix_dark_logo.png",
    "site_icon": "favicon.ico",
    "welcome_sign": "Welcome to the Store Admin",
    "copyright": "Shopix",
    "welcome_sign": "Welcome to the Shopix",
    "search_model": ["auth.User"],
    "topmenu_links": [
        {"name": "Home", "url": "admin:index", "permissions": ["auth.view_user"]},
        {"name": "Visit Live Site", "url": "https://shopix-three.vercel.app", "new_window": True},
        {"model": "auth.User"},
    ],
    "usermenu_links": [
        {"model": "auth.user"},
    ],
    "hide_apps": ["auth.group"],
    "hide_models": ["auth.group"],
    "related_modal_active": True,
    "custom_css": "css/admin_custom.css",
    "use_google_fonts_cdn": True,
    # "show_ui_builder": True, 

    # SideMenu Icons
    "icons": {

        "home": "bi bi-grid-1x2-fill",
        "auth": "fas fa-users-cog",
        "auth.user": "bi bi-person-circle", 
        "accounts.emailotp": "bi bi-envelope-arrow-down",
        "accounts.profile": "bi bi-person-badge",

        "products.product": "bi bi-box-seam",
        "products.productvariant": "bi bi-boxes",
        "products.brand": "fas fa-bookmark",
        "products.productimage": "bi bi-image",

        "categories.category": "fas fa-tags", 

        "cart.cart": "fas fa-shopping-cart",
        "cart.cartitems": "bi bi-box-seam",
        "cart.coupon": "bi bi-ticket-perforated",

        "orders.order": "fas fa-truck-fast",
        "orders.orderitem": "bi bi-box-seam",
        "orders.address": "fas fa-address-book",

    },
    "default_icon_parents": "fas fa-chevron-circle-right",
    "default_icon_children": "fas fa-circle",
}

JAZZMIN_UI_TWEAKS = {
    "theme": "cosmo",
    "dark_mode_theme": "darkly",
}


X_FRAME_OPTIONS = "SAMEORIGIN"

CKEDITOR_UPLOAD_PATH = "uploads/"

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    )
}

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # MUST be at the top
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

STRIPE_SECRET_KEY = config("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = config("STRIPE_WEBHOOK_SECRET")

from corsheaders.defaults import default_headers

CORS_ALLOW_HEADERS = list(default_headers) + [
    "X-Cart-ID",
]


CORS_ALLOWED_ORIGINS = config("CORS_ALLOWED_ORIGINS", cast=Csv())

CORS_ALLOW_ALL_ORIGINS = False

CSRF_TRUSTED_ORIGINS = config("CSRF_TRUSTED_ORIGINS", cast=Csv())

CORS_ALLOW_CREDENTIALS = True


SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=30),
}


GOOGLE_CLIENT_ID = config("GOOGLE_CLIENT_ID", default="")

ROOT_URLCONF = "ecomm.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                "cart.context_processors.cart_counter",
            ],
        },
    },
]

WSGI_APPLICATION = "ecomm.wsgi.application"


# Local Database
# DATABASES = {
#     "default": {
#         "ENGINE": "django.db.backends.postgresql",
#         "NAME": "ecomm_project",  # your database name
#         "USER": "ecommerce_admin",  # your database username
#         "PASSWORD": "vasu2005",  # your database password
#         "HOST": "localhost",  # leave as 'localhost' if running locally
#         "PORT": "5432",  # default PostgreSQL port
#     }
# }

# Neon Database
DATABASES = {
    "default": dj_database_url.config(
        default=os.environ.get("DATABASE_URL"),
        conn_max_age=600,
        conn_health_checks=True,
    )
}


AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


LANGUAGE_CODE = "en-us"

# TIME_ZONE = "UTC"
TIME_ZONE = "Asia/Kolkata"

USE_TZ = True

USE_I18N = True


STATIC_URL = "static/"
STATICFILES_DIRS = [os.path.join(BASE_DIR, "static")]
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")  # for production
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"


# Media files (user uploads)
MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")


DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


import cloudinary

CLOUDINARY_STORAGE = {
    "CLOUD_NAME": config("CLOUDINARY_CLOUD_NAME", default=""),
    "API_KEY": config("CLOUDINARY_API_KEY", default=""),
    "API_SECRET": config("CLOUDINARY_API_SECRET", default=""),
}

cloudinary.config(
    cloud_name=CLOUDINARY_STORAGE["CLOUD_NAME"],
    api_key=CLOUDINARY_STORAGE["API_KEY"],
    api_secret=CLOUDINARY_STORAGE["API_SECRET"],
    secure=True,
)

DEFAULT_FILE_STORAGE = "cloudinary_storage.storage.MediaCloudinaryStorage"

EMAIL_BACKEND = config("EMAIL_BACKEND")
EMAIL_HOST = config("EMAIL_HOST")
EMAIL_PORT = config("EMAIL_PORT", cast=int)
EMAIL_USE_TLS = config("EMAIL_USE_TLS", cast=bool)

EMAIL_HOST_USER = config("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = config("EMAIL_HOST_PASSWORD")
