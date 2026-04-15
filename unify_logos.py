import os
import glob
import re

workspace = r"d:\mageten\luthier-tools-platform\luthier-tools"

# Root level HTML files
html_files_root = glob.glob(os.path.join(workspace, "*.html"))
# Dashboard HTML files
html_files_dash = glob.glob(os.path.join(workspace, "dashboard", "*.html"))

# Regex for logo-wrap pattern
# <a href="index.html" class="logo-wrap">...</a>
root_logo_search = r'<a href="index\.html" class="logo-wrap">.*?</a>'
root_logo_replace = '<a href="index.html" class="logo-wrap"><div class="logo-icon"><img src="assets/images/favicon.png" alt="Logo"></div><span>LuthierTools</span></a>'

# Footer logo pattern
# <div class="footer-logo">...</div>
footer_logo_search = r'<div class="footer-logo">.*?</div>LuthierTools'
footer_logo_replace = '<div class="footer-logo"><div class="logo-icon"><img src="assets/images/favicon.png" alt="Logo"></div>LuthierTools'

# Dashboard logo pattern
# <a href="../index.html" class="sb-logo">...</a>
dash_logo_search = r'<a href="\.\./index\.html" class="sb-logo">.*?</a>'
dash_logo_replace = '<a href="../index.html" class="sb-logo"><div class="sb-logo-icon"><img src="../assets/images/favicon.png" alt="Logo"></div><span>LuthierTools</span></a>'

for f in html_files_root:
    with open(f, "r", encoding="utf-8") as file:
        content = file.read()
    
    # Update Header Logo
    content = re.sub(root_logo_search, root_logo_replace, content, flags=re.DOTALL)
    
    # Update Footer Logo
    content = re.sub(footer_logo_search, footer_logo_replace, content, flags=re.DOTALL)
    
    # Login/Signup specific (logo-container class)
    if 'logo-container' in content:
        content = re.sub(r'<a href="index\.html" class="logo-container".*?</a>', 
                         '<a href="index.html" class="logo-container" style="text-decoration: none;"><div class="logo-badge" style="background:var(--secondary); padding:8px;"><img src="assets/images/favicon.png" alt="Logo" style="width:100%;height:100%;object-fit:contain;"></div><div class="logo-text">LuthierTools</div></a>', 
                         content, flags=re.DOTALL)

    with open(f, "w", encoding="utf-8") as file:
        file.write(content)
    print(f"Updated root {os.path.basename(f)}")

for f in html_files_dash:
    with open(f, "r", encoding="utf-8") as file:
        content = file.read()
    
    # Update Dashboard Sidebar Logo
    content = re.sub(dash_logo_search, dash_logo_replace, content, flags=re.DOTALL)
    
    with open(f, "w", encoding="utf-8") as file:
        file.write(content)
    print(f"Updated dash {os.path.basename(f)}")

print("Unified logo alignment complete!")
