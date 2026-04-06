from django.urls import path
from .views import *

urlpatterns = [
    path("", get_orders),
    path("invoice/<str:order_id>/", download_invoice_pdf),
    path("<str:order_id>/cancel/", cancel_order),
    path('<str:order_id>/return/', return_order),
    path("order_details/<str:order_id>/", get_order_details),
    path("my_orders/", get_my_orders),
    path("addresses/add/", add_address),
    path("addresses/<str:address_uid>/", manage_address_details),
    path("addresses/", get_addresses),
    path("finalize-order/", finalize_order),
    path("create-checkout-session/", create_checkout_session),
    path("create-payment-intent/", create_payment_intent),
    path("checkout/", create_order),
    path("webhook/", stripe_webhook),
    path("<str:sid>/", get_order_details_by_sid),
]
