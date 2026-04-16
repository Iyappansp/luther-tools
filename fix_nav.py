import os
import re
import glob

# Pattern to remove class="active" from <a> tags specifically in navigation structures
# But a simpler one to remove " class=\"active\"" from any <a> or just generally might work
# if we are careful.

html_files = glob.glob('*.html')
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove ' class="active"' specifically when it's just class="active"
    # We want to keep it if it's "filter-btn active" or similar, but those usually don't have a space before class
    # The grep showed it's usually exactly class="active" on the Home link.
    
    # Let's be safer and target the specific nav link pattern
    new_content = re.sub(r'<a href="index\.html" class="active">', '<a href="index.html">', content)
    
    # Also handle single quotes or variations if any
    new_content = re.sub(r"<a href='index\.html' class='active'>", "<a href='index.html'>", new_content)
    
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Removed hardcoded active class from {file}")
