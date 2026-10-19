import urllib.request
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

url = "https://noithattamviet.net/"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode("utf-8", "ignore")
        
        print("=== MENU / CATEGORIES ===")
        seen = set()
        for m in re.finditer(r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', html, re.DOTALL):
            href = m.group(1).strip()
            text = re.sub(r'<[^>]+>', '', m.group(2)).strip()
            if text and len(text) < 50 and text not in seen and not href.startswith('#') and not href.startswith('javascript'):
                seen.add(text)
                print(f"{text}: {href}")
                if len(seen) > 40:
                    break
except Exception as e:
    print(f"Error: {e}")

