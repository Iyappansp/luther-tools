import os
import glob
import re

workspace = r"d:\mageten\luthier-tools-platform\luthier-tools"

# Root level HTML files
html_files_root = glob.glob(os.path.join(workspace, "*.html"))
# Dashboard HTML files
html_files_dash = glob.glob(os.path.join(workspace, "dashboard", "*.html"))

rtl_btn_root = '      <button class="hdr-btn" data-rtl-toggle title="Toggle RTL"><img src="https://img.icons8.com/isometric/30/globe.png" alt="RTL" style="width:20px;height:20px;"></button>\n'
rtl_btn_dash = '        <button class="topbar-btn" data-rtl-toggle title="Toggle RTL">🌐</button>\n'

for f in html_files_root:
    with open(f, "r", encoding="utf-8") as file:
        content = file.read()
    
    # Check if already has data-rtl-toggle in header
    if 'data-rtl-toggle' in content and 'hdr-actions' in content:
        # If it's only in footer, we need to add it to header
        # Find hdr-actions and insert before hamburger
        if 'class="hdr-btn" data-rtl-toggle' not in content:
            content = content.replace('<button class="hamburger"', rtl_btn_root + '      <button class="hamburger"')
            with open(f, "w", encoding="utf-8") as file:
                file.write(content)
            print(f"Updated root {os.path.basename(f)}")

for f in html_files_dash:
    with open(f, "r", encoding="utf-8") as file:
        content = file.read()
    
    if 'data-rtl-toggle' not in content:
        # Insert before theme toggle or + New Order
        if 'data-theme-toggle' in content:
            content = content.replace('<button class="topbar-btn" data-theme-toggle', rtl_btn_dash + '        <button class="topbar-btn" data-theme-toggle')
        else:
            content = content.replace('<div class="dash-topbar-actions">', '<div class="dash-topbar-actions">\n' + rtl_btn_dash)
            
        with open(f, "w", encoding="utf-8") as file:
            file.write(content)
        print(f"Updated dash {os.path.basename(f)}")

print("RTL button insertion complete!")
