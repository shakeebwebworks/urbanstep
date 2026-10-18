"""
All API logic lives here, written as plain Django views that return JSON.
The cart is a list stored in request.session (a signed cookie):
    [{"id": 1, "size": "9", "qty": 2}, ...]
"""
import json
import re
import uuid
from functools import lru_cache
from pathlib import Path

from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_GET, require_POST

PRODUCTS_FILE = Path(__file__).resolve().parent / "products.json"
FREE_SHIPPING_OVER = 100   # dollars
SHIPPING_FEE = 7.99
MAX_QTY = 10

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
PHONE_RE = re.compile(r"^\+?[0-9 ()-]{7,20}$")

# Temporary photo search words per category (used only if a product has no "image" of its own)
PLACEHOLDER_KEYWORDS = {
    "sneakers": "sneakers",
    "hoodies": "hoodie",
    "jackets": "jacket",
    "accessories": "backpack",
}


# ---------- Helpers ----------------------------------------------------------
# @lru_cache(maxsize=1)
# Folder where you drop your own product photos (named product-1.jpg, product-2.jpg, ...)
# Folder where you drop your own product photos (product-1.jpg, product-2.webp, ...)
LOCAL_IMAGES = Path(__file__).resolve().parent.parent / "frontend" / "public" / "images"
IMAGE_EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp")


@lru_cache(maxsize=1)
def load_products():
    """Read products.json once. Photos are set by add_images.py."""
    with open(PRODUCTS_FILE, encoding="utf-8") as f:
        return json.load(f)

def get_product(product_id):
    return next((p for p in load_products() if p["id"] == product_id), None)


def error(message, status=400):
    return JsonResponse({"error": message}, status=status)


def read_json(request):
    """Parse the request body as a JSON object, or return None if invalid."""
    try:
        data = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return None
    return data if isinstance(data, dict) else None


def to_int(value):
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def get_cart(request):
    return request.session.get("cart", [])


def build_cart(request):
    """Turn the raw session cart into a full cart with product info and totals."""
    items, subtotal, count = [], 0.0, 0
    for line in get_cart(request):
        product = get_product(line["id"])
        if not product:
            continue  # product was removed from products.json
        line_total = round(product["price"] * line["qty"], 2)
        light = {k: v for k, v in product.items() if k not in ("description", "sizes")}
        items.append({"product": light, "size": line["size"], "qty": line["qty"], "line_total": line_total})
        subtotal += line_total
        count += line["qty"]
    subtotal = round(subtotal, 2)
    shipping = 0 if (subtotal == 0 or subtotal >= FREE_SHIPPING_OVER) else SHIPPING_FEE
    return {
        "items": items,
        "count": count,
        "subtotal": subtotal,
        "shipping": shipping,
        "total": round(subtotal + shipping, 2),
    }


# ---------- Serve the React app ----------------------------------------------
@ensure_csrf_cookie  # also sets the CSRF cookie that React needs for POST requests
def frontend(request):
    index = Path(settings.STATIC_ROOT) / "index.html"
    if not index.exists():
        return HttpResponse(
            "React build not found. Run 'npm run build' in /frontend, then "
            "'python manage.py collectstatic'.",
            status=501,
        )
    return HttpResponse(index.read_text(encoding="utf-8"), content_type="text/html")


# ---------- Products ---------------------------------------------------------
@require_GET
def product_list(request):
    """GET /api/products/?search=&category=&sort=price_asc|price_desc|name"""
    all_products = load_products()
    search = request.GET.get("search", "").strip().lower()
    category = request.GET.get("category", "").strip().lower()
    sort = request.GET.get("sort", "")

    result = all_products
    if category:
        result = [p for p in result if p["category"] == category]
    if search:
        result = [
            p for p in result
            if search in p["name"].lower() or search in p["description"].lower() or search in p["category"]
        ]
    if sort == "price_asc":
        result = sorted(result, key=lambda p: p["price"])
    elif sort == "price_desc":
        result = sorted(result, key=lambda p: p["price"], reverse=True)
    elif sort == "name":
        result = sorted(result, key=lambda p: p["name"])

    return JsonResponse({
        "products": result,
        "count": len(result),
        "categories": sorted({p["category"] for p in all_products}),
    })


@require_GET
def product_detail(request, product_id):
    """GET /api/products/<id>/ -> product + related products."""
    product = get_product(product_id)
    if not product:
        return error("Product not found.", 404)
    others = [p for p in load_products() if p["id"] != product_id]
    same_category = [p for p in others if p["category"] == product["category"]]
    different = [p for p in others if p["category"] != product["category"]]
    return JsonResponse({"product": product, "related": (same_category + different)[:4]})


# ---------- Cart -------------------------------------------------------------
@require_GET
@ensure_csrf_cookie
def cart_get(request):
    return JsonResponse(build_cart(request))


@require_POST
def cart_add(request):
    data = read_json(request)
    if data is None:
        return error("Invalid request.")
    product_id, qty, size = to_int(data.get("id")), to_int(data.get("qty", 1)), str(data.get("size", ""))
    product = get_product(product_id)
    if not product:
        return error("Product not found.", 404)
    if size not in product["sizes"]:
        return error("Please choose a valid size.")
    if qty is None or qty < 1:
        return error("Quantity must be at least 1.")

    cart = get_cart(request)
    for line in cart:
        if line["id"] == product_id and line["size"] == size:
            line["qty"] = min(line["qty"] + qty, MAX_QTY)
            break
    else:  # no break -> item was not in the cart yet
        cart.append({"id": product_id, "size": size, "qty": min(qty, MAX_QTY)})
    request.session["cart"] = cart  # re-assigning tells Django to save the cookie
    return JsonResponse(build_cart(request))


@require_POST
def cart_update(request):
    data = read_json(request)
    if data is None:
        return error("Invalid request.")
    product_id, size, qty = to_int(data.get("id")), str(data.get("size", "")), to_int(data.get("qty"))
    if qty is None:
        return error("Invalid quantity.")
    cart = []
    for line in get_cart(request):
        if line["id"] == product_id and line["size"] == size:
            if qty < 1:
                continue  # quantity 0 removes the line
            line["qty"] = min(qty, MAX_QTY)
        cart.append(line)
    request.session["cart"] = cart
    return JsonResponse(build_cart(request))


@require_POST
def cart_remove(request):
    data = read_json(request)
    if data is None:
        return error("Invalid request.")
    product_id, size = to_int(data.get("id")), str(data.get("size", ""))
    request.session["cart"] = [
        l for l in get_cart(request) if not (l["id"] == product_id and l["size"] == size)
    ]
    return JsonResponse(build_cart(request))


# ---------- Checkout ---------------------------------------------------------
@require_POST
def checkout(request):
    data = read_json(request)
    if data is None:
        return error("Invalid request.")

    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip()
    phone = str(data.get("phone", "")).strip()
    address = str(data.get("address", "")).strip()

    errors = {}
    if len(name) < 2:
        errors["name"] = "Please enter your full name."
    if not EMAIL_RE.match(email):
        errors["email"] = "Please enter a valid email address."
    if not PHONE_RE.match(phone):
        errors["phone"] = "Please enter a valid phone number."
    if len(address) < 10:
        errors["address"] = "Please enter your full delivery address."
    if errors:
        return JsonResponse({"errors": errors}, status=400)

    cart = build_cart(request)
    if not cart["items"]:
        return error("Your cart is empty.")

    # No payment or database yet, so we just build an order receipt and empty the cart.
    order = {
        "order_id": "US-" + uuid.uuid4().hex[:8].upper(),
        "name": name, "email": email, "phone": phone, "address": address,
        **cart,
    }
    request.session["cart"] = []
    return JsonResponse({"order": order})