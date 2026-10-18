from django.urls import path
from . import views

urlpatterns = [
    path("products/", views.product_list),
    path("products/<int:product_id>/", views.product_detail),
    path("cart/", views.cart_get),
    path("cart/add/", views.cart_add),
    path("cart/update/", views.cart_update),
    path("cart/remove/", views.cart_remove),
    path("checkout/", views.checkout),
]