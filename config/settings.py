"""
Django settings for UrbanStep.
Secrets and environment-specific values come from ENVIRONMENT VARIABLES,
so nothing private is ever stored in the code.
"""
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# --- Core security settings -------------------------------------------------
# DEBUG must be the exact text "True" to turn on. Anything else = off (safe).
DEBUG = os.environ.get("DEBUG", "False") == "True"

SECRET_KEY = os.environ.get("SECRET_KEY")
if not SECRET_KEY:
    if DEBUG:
        SECRET_KEY = "dev-only-insecure-key"  # fine for local development only
    else:
        raise RuntimeError("Set the SECRET_KEY environment variable.")

# Comma-separated list, e.g. "urbanstep.com,www.urbanstep.com"
ALLOWED_HOSTS = [h.strip() for h in os.environ.get("ALLOWED_HOSTS", "").split(",") if h.strip()]
CSRF_TRUSTED_ORIGINS = [o.strip() for o in os.environ.get("CSRF_TRUSTED_ORIGINS", "").split(",") if o.strip()]

# Render automatically provides this variable (e.g. urbanstep.onrender.com)
RENDER_HOST = os.environ.get("RENDER_EXTERNAL_HOSTNAME")
if RENDER_HOST:
    ALLOWED_HOSTS.append(RENDER_HOST)
    CSRF_TRUSTED_ORIGINS.append(f"https://{RENDER_HOST}")

if DEBUG:
    ALLOWED_HOSTS += ["localhost", "127.0.0.1"]
    # Trust the Vite dev server on any of its usual ports (5173, 5174, 5175, ...)
    for port in range(5173, 5181):
        CSRF_TRUSTED_ORIGINS += [f"http://localhost:{port}", f"http://127.0.0.1:{port}"]

# --- Apps & middleware ------------------------------------------------------
INSTALLED_APPS = [
    "django.contrib.staticfiles",
    "store",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",  # serves static files in production
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
]

ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"

# --- No database ------------------------------------------------------------
DATABASES = {}

# The cart is kept in a signed (tamper-proof) cookie in the visitor's browser.
SESSION_ENGINE = "django.contrib.sessions.backends.signed_cookies"
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = "Lax"

# --- Static files (the built React app) -------------------------------------
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
_react_build = BASE_DIR / "frontend" / "dist"
STATICFILES_DIRS = [_react_build] if _react_build.exists() else []

STORAGES = {
    "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
    "staticfiles": {"BACKEND": "whitenoise.storage.CompressedStaticFilesStorage"},
}

# --- Extra protection when running live -------------------------------------
if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")  # Render terminates HTTPS
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = 3600  # raise to 31536000 (1 year) once everything works