import urllib.request
import re
import json

def get_pexels_image(query):
    req = urllib.request.Request(
        f'https://www.pexels.com/search/{query.replace(" ", "%20")}/',
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
    )
    try:
        html = urllib.request.urlopen(req).read().decode('utf-8')
        # Pexels typical image URL in srcset or src
        urls = re.findall(r'https://images.pexels.com/photos/\d+/pexels-photo-\d+\.jpeg', html)
        if urls:
            return urls[0] + '?auto=compress&cs=tinysrgb&w=600'
    except Exception as e:
        print(f"Error for {query}: {e}")
    return None

queries = [
    'rosewood texture', 'wood glue', 'stainless steel wire', 'glass jar powder',
    'cedar wood', 'varnish bottle', 'mandolin', 'ukulele', 'bass guitar', 'classical guitar', 'acoustic guitar',
    'clamp tool'
]

for q in queries:
    print(f'{q}: {get_pexels_image(q)}')
