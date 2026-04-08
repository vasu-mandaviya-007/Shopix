from pathlib import Path
import os
from decouple import config, Csv
import dj_database_url
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config("SECRET_KEY")

# DEBUG = config("DEBUG", default=False, cast=bool)
DEBUG = True

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
    # "show_ui_builder": True,
    "show_ui_builder": False,
    "welcome_sign": "Welcome to the Shopix",
    "search_model": ["auth.User"],
    "topmenu_links": [
        # Url that gets reversed (Permissions can be added)
        {"name": "Home", "url": "admin:index", "permissions": ["auth.view_user"]},
        # model admin to link to (Permissions checked against model)
        {"model": "auth.User"},
        # App with dropdown menu to all its models pages (Permissions checked against models)
    ],
    "usermenu_links": [
        {"model": "auth.user"},
    ],
    "related_modal_active": True,
    "custom_css": "css/admin_custom.css",
    "use_google_fonts_cdn": True,
#     # "show_ui_builder": True,
}

JAZZMIN_UI_TWEAKS = {
    "theme": "cosmo",  # Instantly applies a beautiful dark mode theme
    "dark_mode_theme": "darkly",
}
# JAZZMIN_UI_TWEAKS = {
#     "theme": "darkly",  # Instantly applies a beautiful dark mode theme
# }



# JAZZMIN_SETTINGS = {
#     # title of the window (Will default to current_admin_site.site_title if absent or None)
#     "site_title": "Shopix Admin",
#     # Title on the login screen (19 chars max) (defaults to current_admin_site.site_header if absent or None)
#     "site_header": "Admin",
#     # Title on the brand (19 chars max) (defaults to current_admin_site.site_header if absent or None)
#     "site_brand": "Admin",
#     # Logo to use for your site, must be present in static files, used for brand on top left
#     "site_logo": "shopix_dark_logo.png",
#     # Logo to use for your site, must be present in static files, used for login form logo (defaults to site_logo)
#     "login_logo": None,
#     # Logo to use for login form in dark themes (defaults to login_logo)
#     "login_logo_dark": None,
#     # CSS classes that are applied to the logo above
#     "site_logo_classes": "img-circle",
#     # Relative path to a favicon for your site, will default to site_logo if absent (ideally 32x32 px)
#     "site_icon": "favicon.ico",
#     # Welcome text on the login screen
#     "welcome_sign": "Welcome to the Shopix",
#     # Copyright on the footer
#     "copyright": "Shopix",
#     # List of model admins to search from the search bar, search bar omitted if excluded
#     # If you want to use a single search field you dont need to use a list, you can use a simple string
#     "search_model": ["auth.User"],
#     # Field name on user model that contains avatar ImageField/URLField/Charfield or a callable that receives the user
#     "user_avatar": None,
#     ############
#     # Top Menu #
#     ############
#     # Links to put along the top menu
#     "topmenu_links": [
#         # Url that gets reversed (Permissions can be added)
#         {"name": "Home", "url": "admin:index", "permissions": ["auth.view_user"]},
#         # model admin to link to (Permissions checked against model)
#         {"model": "auth.User"},
#         # App with dropdown menu to all its models pages (Permissions checked against models)
#     ],
#     #############
#     # User Menu #
#     #############
#     # Additional links to include in the user menu on the top right ("app" url type is not allowed)
#     "usermenu_links": [
#         {"model": "auth.user"},
#     ],
#     #############
#     # Side Menu #
#     #############
#     # Whether to display the side menu
#     "show_sidebar": True,
#     # Whether to aut expand the menu
#     "navigation_expanded": True,
#     # Hide these apps when generating side menu e.g (auth)
#     "hide_apps": [],
#     # Hide these models when generating side menu (e.g auth.user)
#     "hide_models": [],
#     # List of apps (and/or models) to base side menu ordering off of (does not need to contain all apps/models)
#     "order_with_respect_to": ["auth", "books", "books.author", "books.book"],
#     # Custom links to append to app groups, keyed on app name

#     # Custom icons for side menu apps/models See https://fontawesome.com/icons?d=gallery&m=free&v=5.0.0,5.0.1,5.0.10,5.0.11,5.0.12,5.0.13,5.0.2,5.0.3,5.0.4,5.0.5,5.0.6,5.0.7,5.0.8,5.0.9,5.1.0,5.1.1,5.2.0,5.3.0,5.3.1,5.4.0,5.4.1,5.4.2,5.13.0,5.12.0,5.11.2,5.11.1,5.10.0,5.9.0,5.8.2,5.8.1,5.7.2,5.7.1,5.7.0,5.6.3,5.5.0,5.4.2
#     # for the full list of 5.13.0 free icon classes
#     "icons": {
#         "auth": "fas fa-users-cog",
#         "auth.user": "fas fa-user",
#         "auth.Group": "fas fa-users",
#     },
#     # Icons that are used when one is not manually specified
#     "default_icon_parents": "fas fa-chevron-circle-right",
#     "default_icon_children": "fas fa-circle",
#     #################
#     # Related Modal #
#     #################
#     # Use modals instead of popups
#     "related_modal_active": True,
#     #############
#     # UI Tweaks #
#     #############
#     # Relative paths to custom CSS/JS scripts (must be present in static files)
#     "custom_css": None,
#     "custom_js": None,
#     # Whether to link font from fonts.googleapis.com (use custom_css to supply font otherwise)
#     "use_google_fonts_cdn": True,
#     # Whether to show the UI customizer on the sidebar
#     # "show_ui_builder": True,
#     ###############
#     # Change view #
#     ###############
#     # Render out the change view as a single form, or in tabs, current options are
#     # - single
#     # - horizontal_tabs (default)
#     # - vertical_tabs
#     # - collapsible
#     # - carousel
#     "changeform_format": "horizontal_tabs",
#     # override change forms on a per modeladmin basis
#     "changeform_format_overrides": {
#         "auth.user": "collapsible",
#         "auth.group": "vertical_tabs",
#     },
#     # Add a language dropdown into the admin
#     "language_chooser": False,
#     # "show_ui_builder" : True,
# }

# JAZZMIN_UI_TWEAKS = {
#     # "theme": "simplex",  # Instantly applies a beautiful dark mode theme
#     # "dark_mode_theme": "simplex",
# }

# JAZZMIN_UI_TWEAKS = {
#     "theme": "flatly",           # ☀️ दिन के लिए लाइट थीम (या कोई और लाइट थीम)
#     "dark_mode_theme": "darkly", # 🌙 रात के लिए डार्क थीम
# }

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
