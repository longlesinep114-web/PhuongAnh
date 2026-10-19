import os
import base64

source_dir = r"c:\Users\pc -klc\Downloads\Thư mục mới (2)\my-workspace"
html_path = os.path.join(source_dir, "index.html")
css_path = os.path.join(source_dir, "style.css")
js_path = os.path.join(source_dir, "script.js")

with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

with open(css_path, "r", encoding="utf-8") as f:
    css = f.read()

with open(js_path, "r", encoding="utf-8") as f:
    js = f.read()

# Inline CSS
html = html.replace('<link rel="stylesheet" href="style.css">', f"<style>\n{css}\n</style>")

# Inline JS
html = html.replace('<script src="script.js"></script>', f"<script>\n{js}\n</script>")

# Inline SVG Logo
logo_path = os.path.join(source_dir, "assets", "logo-sofa.svg")
if os.path.exists(logo_path):
    with open(logo_path, "rb") as f:
        svg_b64 = base64.b64encode(f.read()).decode("utf-8")
    data_uri = f"data:image/svg+xml;base64,{svg_b64}"
    html = html.replace('src="assets/logo-sofa.svg"', f'src="{data_uri}"')

desktop_dir = os.path.join(os.environ.get("USERPROFILE", r"C:\Users\pc -klc"), "Desktop")
out_file = os.path.join(desktop_dir, "web-xuong-sofa-FULL-ALL-IN-ONE.html")

with open(out_file, "w", encoding="utf-8") as f:
    f.write(html)

print("Created All-in-One single file:", out_file)
print("File size:", os.path.getsize(out_file), "bytes")
