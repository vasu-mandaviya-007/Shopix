from django.urls import path
from .views import *

urlpatterns = [
    path("my_orders/", get_my_orders),
    path("order_details/<str:order_id>/", get_order_details),

    path("addresses/", get_addresses),
    path("addresses/add/", add_address),
    path("addresses/<str:address_uid>/", manage_address_details),

    path("invoice/<str:order_id>/", download_invoice_pdf),
    path("create-checkout-session/", create_checkout_session),
    path("webhook/", stripe_webhook),

    # Order Action
    path('<str:order_id>/return/', return_order),
    path("<str:order_id>/cancel/", cancel_order),

    path("<str:sid>/", get_order_success_details),
]
