import json
import pathlib

root = pathlib.Path(__file__).parent
images = root / "frontend" / "public" / "images"
path = root / "store" / "products.json"

products = json.loads(path.read_text(encoding="utf-8"))
for p in products:
    match = sorted(images.glob(f"product-{p['id']}.*"))
    if match:
        p["image"] = f"images/{match[0].name}"
        print("FOUND  ", p["id"], p["name"], "->", match[0].name)
    else:
        print("NO PHOTO", p["id"], p["name"])

path.write_text(json.dumps(products, indent=2), encoding="utf-8")
print("Done.")