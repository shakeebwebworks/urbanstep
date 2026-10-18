from django.urls import include, path, re_path
from store.views import frontend

urlpatterns = [
    path("api/", include("store.urls")),
    re_path(r"^(?!api/|static/).*$", frontend),
]