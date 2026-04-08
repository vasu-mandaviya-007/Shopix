from django.urls import reverse_lazy
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

ALLOWED_HOSTS = config("ALLOWED_HOSTS", default="", cast=Csv())


FRONTEND_URL = config("FRONTEND_URL", default="http://localhost:5173")

INSTALLED_APPS = [
    "unfold",
    "unfold.contrib.filters",
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
]


from django.templatetags.static import static


# settings.py me:
def environment_callback(request):
    return [
        "Development",
        "info",
    ]  # Options: info (blue), success (green), warning (yellow), danger (red)


UNFOLD = {
    "COMMAND": {
        "search_models": True,  # Default: False
        "search_callback": "utils.search_callback",
        "show_history": True,  # Enable history
    },
    "SITE_TITLE": "Shopix",  # Browser tab ka title
    "SITE_HEADER": "-",  # Login page aur header ka naam
    # "SITE_SUBHEADER": "Appears under SITE_HEADER",
    "SITE_URL": "/",  # 'View Site' button kahan le jayega
    "ENVIRONMENT": "ecomm.settings.environment_callback",
    # Custom Logo (Light aur Dark mode ke liye alag)
    "SITE_ICON": {
        "light": lambda request: static("images/shopix_logo.png"),
        "dark": lambda request: static("images/shopix_dark_logo.png"),
    },
    "SITE_LOGO": {
        "light": lambda request: static("images/shopix_logo.png"),
        "dark": lambda request: static("images/shopix_dark_logo.png"),
    },
    "SITE_DROPDOWN": [
        {
            "icon": "diamond",
            "title": ("My site"),
            "link": "https://example.com",
        },
        # ...
    ],
    "SITE_SYMBOL": "speed",
    "SHOW_HISTORY": True,
    "SHOW_BACK_BUTTON": True,
    "SITE_FAVICONS": [
        {
            "rel": "icon",
            "sizes": "32x32",
            "type": "image/ico",
            "href": lambda request: static("images/favicon.ico"),
        },
    ],
    "SIDEBAR": {
        "show_search": True,  # Search in applications and models names
        "command_search": True,  # Replace the sidebar search with the command search
        "show_all_applications": True,  # Dropdown with all applications and models
        "navigation": [
            # --------------------------------------------------------
            # SECTION 3: USERS & ACCOUNTS (Auth App)
            # --------------------------------------------------------
            {
                "title": "Users & Access",
                "separator": True,
                "items": [
                    {
                        "title": "Customers & Admins",
                        "icon": "group",  # People icon
                        "link": reverse_lazy("admin:auth_user_changelist"),
                    },
                    {
                        "title": "Roles & Permissions",
                        "icon": "admin_panel_settings",  # Shield icon
                        "link": reverse_lazy("admin:auth_group_changelist"),
                    },
                ],
            },
            # --------------------------------------------------------
            # SECTION 1: CATALOG & INVENTORY (Products App)
            # --------------------------------------------------------
            {
                "title": "Catalog & Inventory",
                "separator": True,  # Menu ke upar ek line banayega
                "items": [
                    {
                        "title": "All Products",
                        "icon": "inventory_2",  # Box/Inventory icon
                        "link": reverse_lazy("admin:products_product_changelist"),
                    },
                    {
                        "title": "Product Variants",
                        "icon": "style",
                        "link": reverse_lazy(
                            "admin:products_productvariant_changelist"
                        ),
                    },
                    {
                        "title": "Brands",
                        "icon": "workspace_premium",
                        "link": reverse_lazy("admin:products_brand_changelist"),
                    },
                    {
                        "title": "Brands",
                        "icon": "image",
                        "link": reverse_lazy("admin:products_productimage_changelist"),
                    },
                    {
                        "title": "Attributes (Size/Color)",
                        "icon": "tune",
                        "link": reverse_lazy(
                            "admin:products_productattribute_changelist"
                        ),
                    },
                    {
                        "title": "Specification Item",
                        "icon": "tune",
                        "link": reverse_lazy(
                            "admin:products_specificationitem_changelist"
                        ),
                    },
                    {
                        "title": "Categories",
                        "icon": "category",
                        "link": reverse_lazy("admin:categories_category_changelist"),
                    },
                ],
            },
            # --------------------------------------------------------
            # SECTION 2: SALES & FULFILLMENT (Orders App)
            # --------------------------------------------------------
            {
                "title": "Sales & Fulfillment",
                "separator": True,
                "items": [
                    {
                        "title": "All Orders",
                        "icon": "shopping_cart",  # Cart icon
                        "link": reverse_lazy("admin:orders_order_changelist"),
                    },
                    {
                        "title": "Shipping Addresses",
                        "icon": "local_shipping",  # Truck icon
                        "link": reverse_lazy("admin:orders_address_changelist"),
                    },
                ],
            },
        ],
    },
    # "COLORS": {
    #     "primary": {
    #         "50": "#e3f2fd",
    #         "100": "#bbdefb",
    #         "200": "#90caf9",
    #         "300": "#64b5f6",
    #         "400": "#42a5f5",
    #         "500": "#1976d2",  # Exact Material UI Primary color
    #         "600": "#1565c0",  # Hover color (Darker)
    #         "700": "#0d47a1",
    #         "800": "#0a369d",
    #         "900": "#072273",
    #         "950": "#04144d",
    #     },
    # },
    "COLORS": {
        "primary": {
            "50": "#f0f9ff",
            "100": "#e0f2fe",
            "200": "#bae6fd",
            "300": "#7dd3fc",
            "400": "#38bdf8",
            "500": "#0ea5e9",  # Fresh Sky Blue
            "600": "#0284c7",  # Hover
            "700": "#0369a1",
            "800": "#075985",
            "900": "#0c4a6e",
            "950": "#082f49",
        },
    },
    "LOGIN": {
        # Ek high-quality image background me lagane ke liye
        "image": lambda request: static("images/admin-login-bg.png"),
        # Login redirect ko customise karna (Agar sidha orders par le jana ho)
        # "redirect_after": "/admin/orders/order/",
    },
}


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
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "ecomm_project",  # your database name
        "USER": "ecommerce_admin",  # your database username
        "PASSWORD": "vasu2005",  # your database password
        "HOST": "localhost",  # leave as 'localhost' if running locally
        "PORT": "5432",  # default PostgreSQL port
    }
}

# Neon Database
# DATABASES = {
#     "default": dj_database_url.config(
#         default=os.environ.get("DATABASE_URL"),
#         conn_max_age=600,
#         conn_health_checks=True,
#     )
# }


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


STATIC_URL = "/static/"
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
