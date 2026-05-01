import os
from pathlib import Path
from datetime import timedelta
from decouple import config, Csv
import dj_database_url
from dotenv import load_dotenv
from django.urls import reverse_lazy
from django.templatetags.static import static
from corsheaders.defaults import default_headers
import cloudinary

# ==============================================================================
# 1. BASE CONFIGURATION
# ==============================================================================
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config("SECRET_KEY")

DEBUG = config("DEBUG", default=False, cast=bool)
# DEBUG = True

ALLOWED_HOSTS = config("ALLOWED_HOSTS", default="", cast=Csv())
FRONTEND_URL = config("FRONTEND_URL", default="http://localhost:5173")

GEMINI_API_KEY = config("GEMINI_API_KEY",default="") 

# ==============================================================================
# 2. APPLICATIONS & MIDDLEWARE
# ==============================================================================
INSTALLED_APPS = [
    "unfold",
    "unfold.contrib.filters",
    "unfold.contrib.import_export", 
    "import_export",
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
    "tailwind",
    "theme",
]

if DEBUG:
    # Add django_browser_reload only in DEBUG mode
    INSTALLED_APPS += ["django_browser_reload"]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # MUST be at the top
    "django.middleware.locale.LocaleMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

if DEBUG:
    # Add django_browser_reload middleware only in DEBUG mode
    MIDDLEWARE += [
        "django_browser_reload.middleware.BrowserReloadMiddleware",
    ]

# ==============================================================================
# 3. URLS, TEMPLATES & WSGI
# ==============================================================================
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

# ==============================================================================
# 4. DATABASE & AUTHENTICATION
# ==============================================================================
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

# ==============================================================================
# 5. INTERNATIONALIZATION (I18N) & TIMEZONE
# ==============================================================================
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kolkata"
USE_TZ = True
USE_I18N = True

# from django.conf.locale import LANG_INFO

# # Django ko sikhayein ki 'gu' ka data kya hai
# LANG_INFO.update({
#     'gu': {
#         'bidi': False, # Right-to-left nahi hai (jaise Arabic hoti hai)
#         'code': 'gu',
#         'name': 'Gujarati',
#         'name_local': 'ગુજરાતી',
#     }
# })

# # Ab aap Gujarati bina error ke use kar sakte hain
# LANGUAGES = [
#     ('en', 'English'),
#     ('hi', 'Hindi'),
#     ('gu', 'Gujarati'),
# ]

# ==============================================================================
# 6. STATIC & MEDIA FILES
# ==============================================================================
STATIC_URL = "/static/"
STATICFILES_DIRS = [os.path.join(BASE_DIR, "static")]
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")  # for production
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ==============================================================================
# 7. THIRD-PARTY SETTINGS (Cloudinary, CORS, JWT, Stripe, Email)
# ==============================================================================
# Cloudinary
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

# CORS
CORS_ALLOW_HEADERS = list(default_headers) + ["X-Cart-ID"]
CORS_ALLOWED_ORIGINS = config("CORS_ALLOWED_ORIGINS", cast=Csv())
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = config("CSRF_TRUSTED_ORIGINS", cast=Csv())

# REST Framework & JWT
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    )
}
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=30),
}

# Stripe & Google
STRIPE_SECRET_KEY = config("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = config("STRIPE_WEBHOOK_SECRET")
GOOGLE_CLIENT_ID = config("GOOGLE_CLIENT_ID", default="")

# Emails
EMAIL_BACKEND = config("EMAIL_BACKEND")
EMAIL_HOST = config("EMAIL_HOST")
EMAIL_PORT = config("EMAIL_PORT", cast=int)
EMAIL_USE_TLS = config("EMAIL_USE_TLS", cast=bool)
EMAIL_HOST_USER = config("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = config("EMAIL_HOST_PASSWORD")

# CKEditor
CKEDITOR_UPLOAD_PATH = "uploads/"

# ==============================================================================
# 8. UNFOLD ADMIN & TAILWIND SETTINGS
# ==============================================================================
TAILWIND_APP_NAME = "theme"


# def environment_callback(request):
#     return [
#         "Development",
#         "info",
#     ]  # Options: info (blue), success (green), warning (yellow), danger (red)

def environment_callback(request):
    """
    Ye function badge ka Text aur uski Color Class return karta hai.
    Colors options: 'primary' (Purple), 'success' (Green), 'warning' (Yellow), 'danger' (Red)
    """
    return ["DEVELOPMENT", "primary"]

UNFOLD = {
    "COMMAND": {
        "search_models": True,  # Default: False
        "search_callback": "utils.search_callback",
        "show_history": True,  # Enable history
    },
    "STYLES": [
        lambda request: static("/css/dist/styles.css"),
    ],
    "SITE_TITLE": "Shopix Admin",
    "SITE_HEADER": "Shopix",
    "SHOW_VIEW_ON_SITE": True,
    "HEADER_ACTIONS": [
        {
            "title": "View Website",
            "url": "http://localhost:5173",
            "icon": "language",  # Globe ki jagah material icon 'language'
        },
        {
            "title": "Add New Product",
            "url": "/admin/products/product/add/",  # Direct naya product add karne ka link
            "icon": "add_circle",
        },
    ],
    # "SHOW_LANGUAGES": True,
    # "ENVIRONMENT": "ecomm.settings.environment_callback", 
    "SITE_URL": "/",  # 'View Site' button kahan le jayega
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
    # "SITE_SYMBOL": "speed",
    "SITE_SYMBOL": None,
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
        # "show_all_applications": True,  # Dropdown with all applications and models
        "navigation": [
            # --------------------------------------------------------
            # SECTION 1: USERS & ACCOUNTS (Auth App)
            # --------------------------------------------------------
            {
                "title": "Customers & Accounts",
                "separator": True, 
                "collapsible": True,
                "items": [
                    {
                        "title": "Customers & Admins",
                        "icon": "people",  # 'group' se thoda modern lagta hai
                        "link": reverse_lazy("admin:auth_user_changelist"),
                    },
                    {
                        "title": "User Profile",
                        "icon": "manage_accounts",
                        "link": reverse_lazy("admin:accounts_profile_changelist"), 
                    },
                    {
                        "title": "Roles & Permissions",
                        "icon": "admin_panel_settings",
                        "link": reverse_lazy("admin:auth_group_changelist"),
                    },
                ],
            },
            # --------------------------------------------------------
            # SECTION 2: CATALOG & INVENTORY (Products App)
            # --------------------------------------------------------
            {
                "title": "Products & Inventory",
                "separator": True,
                "collapsible": True,
                "items": [
                    {
                        "title": "All Products",
                        "icon": "inventory_2",
                        "link": reverse_lazy("admin:products_product_changelist"),
                    },
                    {
                        "title": "Product Variants",
                        "icon": "layers", # Variant multi-layer hote hain isliye 'layers' best hai
                        "link": reverse_lazy("admin:products_productvariant_changelist"),
                    },
                    {
                        "title": "Customer Reviews",
                        "icon": "reviews", # Dedicated rating/review icon
                        "link": reverse_lazy("admin:products_review_changelist"),
                    },
                    {
                        "title": "Categories",
                        "icon": "category",
                        "link": reverse_lazy("admin:categories_category_changelist"),
                    },
                    {
                        "title": "Brands",
                        "icon": "workspace_premium", # Ya fir 'sell' (tag icon) use kar sakte ho
                        "link": reverse_lazy("admin:products_brand_changelist"),
                    },
                    {
                        "title": "Product Images",
                        "icon": "photo_library", # 'image' se better album icon hai
                        "link": reverse_lazy("admin:products_productimage_changelist"),
                    },
                    {
                        "title": "Attributes (Size/Color)",
                        "icon": "palette", # Color aur size show karne wali feel
                        "link": reverse_lazy("admin:products_productattribute_changelist"),
                    },
                    {
                        "title": "Specification Group",
                        "icon": "list_alt", # Spec group table jaisa hota hai
                        "link": reverse_lazy("admin:products_specificationgroup_changelist"),
                    },
                ],
            },
            # --------------------------------------------------------
            # SECTION 3: SALES & FULFILLMENT (Orders App)
            # --------------------------------------------------------
            {
                "title": "Sales & Promotions",
                "separator": True,
                "collapsible": True,
                "items": [
                    {
                        "title": "Orders",
                        "icon": "receipt_long",  # Bill/Invoice icon (Shopping cart order ke liye theek nahi lagta)
                        "link": reverse_lazy("admin:orders_order_changelist"),
                    },
                    {
                        "title": "Active Carts",
                        "icon": "shopping_cart", # Ye original cart hai
                        "link": reverse_lazy("admin:cart_cart_changelist"), 
                    },
                    {
                        "title": "Wishlists",
                        "icon": "favorite",
                        "link": reverse_lazy("admin:cart_wishlist_changelist"),
                    },
                    {
                        "title": "Coupons & Discounts",
                        "icon": "local_offer", # Dedicated discount tag icon
                        "link": reverse_lazy("admin:cart_coupon_changelist"), 
                    },
                    {
                        "title": "Shipping Addresses",
                        "icon": "location_on",  # Truck se zyada Location pin address par suit karta hai
                        "link": reverse_lazy("admin:orders_address_changelist"),
                    },
                ],
            },
            # --------------------------------------------------------
            # SECTION 4: OTHER SETTINGS
            # --------------------------------------------------------
            {
                "title": "Other Configurations",
                "separator": True,
                "collapsible": True,
                "items": [
                    {
                        "title": "Attributes Value (8GB/RED)",
                        "icon": "label", # Tag jaisa dikhega
                        "link": reverse_lazy("admin:products_variantattributevalue_changelist"),
                    },
                    {
                        "title": "Specification Item",
                        "icon": "segment", # List ke andar ke items ke liye segment icon
                        "link": reverse_lazy("admin:products_specificationitem_changelist"),
                    },
                ],
            },
        ],
    },
    "EXTENSIONS": {
        "modeltranslation": {
            "flags": {
                "en": "🇬🇧",
                "fr": "🇫🇷",
                "nl": "🇧🇪",
            },
        },
    },
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
        "base": {
            # Gemini
            # "800": "oklch(25% 0 0)", # Hover effects ke liye
            # "900": "oklch(18% 0 0)", # Sidebar ka color (Thoda sa light)
            # "950": "oklch(14% 0 0)",
            # Chat GPT
            # 🤖 CHATGPT DARK THEME (Classic Dark Gray)
            "800": "oklch(30% 0 0)",  # Hover effects ke liye
            "900": "oklch(23% 0 0)",  # Sidebar (ChatGPT gray)
            "950": "oklch(19% 0 0)",  # Main Background
        },
    },
    "LOGIN": {
        # Ek high-quality image background me lagane ke liye
        "image": lambda request: static("images/admin-login-bg.png"),
        # Login redirect ko customise karna (Agar sidha orders par le jana ho)
        # "redirect_after": "/admin/orders/order/",
    },
    "DASHBOARD_CALLBACK": "orders.dashboard.custom_dashboard_callback",
    # "TABS": "orders.admin.order_tabs_callback",
}
