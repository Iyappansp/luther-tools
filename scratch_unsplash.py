import urllib.request
import re

def get_unsplash_id(query):
    req = urllib.request.Request(f'https://unsplash.com/s/photos/{query.replace(" ", "-")}', headers={'User-Agent': 'Mozilla/5.0'})
    try:
        html = urllib.request.urlopen(req).read().decode('utf-8')
        # find typical unsplash IDs (11 chars)
        matches = re.findall(r'href="/photos/[^"]+-([a-zA-Z0-9_-]{11})"', html)
        if matches:
            return matches[0]
        else:
            matches2 = re.findall(r'"id":"([a-zA-Z0-9_-]{11})"', html)
            if matches2:
                return matches2[0]
    except Exception as e:
        print(f'Error for {query}: {e}')
    return None

queries = [
    'mandolin', 'ukulele', 'wood-grain', 'carpentry-tools', 'wood-glue',
    'fretwire', 'guitar-capo', 'classical-guitar', 'bass-guitar', 
    'acoustic-guitar', 'luthier', 'amber-bottle', 'mason-jar', 'wood-texture',
    'finish', 'wood-working'
]

for q in queries:
    print(f'{q}: {get_unsplash_id(q)}')
