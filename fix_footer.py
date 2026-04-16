import os
import re
import glob

# Get correct footer from index.html
with open('index.html', 'r', encoding='utf-8') as f:
    index_content = f.read()

match = re.search(r'(<footer class="site-footer">.*?</footer>)', index_content, re.DOTALL)
if not match:
    print("Could not find footer in index.html")
    exit(1)

correct_footer = match.group(1)

# Apply to all html files
html_files = glob.glob('*.html')
for file in html_files:
    if file == 'index.html':
        continue
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '<footer' not in content:
        print(f"Skipping {file} as it has no footer tags.")
        continue

    # Try to find the footer block
    new_content = re.sub(r'<footer[^>]*>.*?</footer>', correct_footer, content, flags=re.DOTALL)
    
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated footer in {file}")
    else:
        print(f"No changes needed for {file} or footer tag not matched properly.")
