import os
import re

def clean_residue(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern for the specific duplicated RTL/Theme wrap with inline styles
    residue_pattern = re.compile(r'<div\s+class="hdr-(rtl|theme)-wrap"\s+style="display:flex;align-items:center;gap:8px;padding-right:12px;border-right:1px solid var\(--border\);margin-right:5px;".*?</div>', re.DOTALL)
    
    # Also look for dangling structures that often follow these in the mess
    # e.g. <button class="hamburger">...</div></div>
    hamburger_residue = re.compile(r'<button class="hamburger".*?</button>\s*</div>\s*</div>', re.DOTALL)
    
    new_content = residue_pattern.sub('', content)
    new_content = hamburger_residue.sub('', new_content)
    
    # Remove any stray </header> or <nav class="mobile-nav"> that isn't the primary one
    # This is risky, so we'll only do it if there's more than one
    header_tags = re.findall(r'</header>', new_content)
    if len(header_tags) > 1:
        # Keep the first one, remove others? 
        # Actually, let's just look for </header> followed by <nav class="mobile-nav">
        # and if it appears twice, remove the second one.
        pass

    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Cleaned residue in {file_path}")

# Run on all HTML files including subdirectories
for root, dirs, files in os.walk('.'):
    for file in files:
        if file.endswith('.html'):
            clean_residue(os.path.join(root, file))
