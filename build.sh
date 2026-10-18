#!/usr/bin/env bash
# Render runs this file on every deploy. Stop immediately if any step fails.
set -o errexit

# 1) Build the React app into frontend/dist
cd frontend
npm install
npm run build
cd ..

# 2) Install Python packages
pip install -r requirements.txt

# 3) Copy the React build into /staticfiles so WhiteNoise can serve it
python manage.py collectstatic --no-input