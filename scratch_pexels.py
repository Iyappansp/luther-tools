import urllib.request
import re

htmls = [
    'https://unsplash.com/s/photos/woodworking',
    'https://unsplash.com/s/photos/acoustic-guitar',
    'https://unsplash.com/s/photos/tools'
]

ids = []
for h in htmls:
    try:
        req = urllib.request.Request(h, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req).read().decode('utf-8')
        matches = re.findall(r'images\.unsplash\.com/photo-([0-9a-f\-]+)\?', res)
        if matches:
            ids.extend(matches[:3])
    except Exception as e:
        print(f"Error {h}: {e}")

ids = list(set(ids))

for i in ids:
    print(f"FOUND: {i}")
