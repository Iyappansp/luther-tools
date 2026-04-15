import os
import glob

workspace = r"d:\mageten\luthier-tools-platform\luthier-tools"

# Root level HTML files
html_files_root = glob.glob(os.path.join(workspace, "*.html"))
# Dashboard HTML files
html_files_dash = glob.glob(os.path.join(workspace, "dashboard", "*.html"))

# 1. Update Root Pages (Header Actions)
# Already done for most, but let's ensure 404, login, signup are covered if they have headers.
for f in html_files_root:
    with open(f, "r", encoding="utf-8") as file:
        content = file.read()
    
    filename = os.path.basename(f)
    
    # Specific fix for login/signup (fixed buttons)
    if filename in ['login.html', 'signup.html']:
        if 'rtl-toggle-fixed' not in content:
            # Add RTL button and its CSS
            rtl_btn = '<button class="hdr-btn rtl-toggle-fixed" data-rtl-toggle title="Toggle RTL">🌐</button>\n'
            # Insert before theme button
            content = content.replace('<button class="hdr-btn theme-toggle-fixed"', rtl_btn + '<button class="hdr-btn theme-toggle-fixed"')
            # Add CSS for rtl-toggle-fixed
            content = content.replace('.theme-toggle-fixed { position: fixed; top: 24px; right: 24px; z-index: 100; }', 
                                     '.theme-toggle-fixed { position: fixed; top: 24px; right: 24px; z-index: 100; }\n    .rtl-toggle-fixed { position: fixed; top: 24px; right: 74px; z-index: 100; }')
            with open(f, "w", encoding="utf-8") as file:
                file.write(content)
            print(f"Updated fixed btn in {filename}")
            continue

    # Regular header actions
    if 'hdr-actions' in content and 'data-rtl-toggle' not in content:
        rtl_btn = '      <button class="hdr-btn" data-rtl-toggle title="Toggle RTL"><img src="https://img.icons8.com/isometric/30/globe.png" alt="RTL" style="width:20px;height:20px;"></button>\n'
        content = content.replace('<button class="hamburger"', rtl_btn + '      <button class="hamburger"')
        with open(f, "w", encoding="utf-8") as file:
            file.write(content)
        print(f"Updated header in {filename}")

# 2. Update Dashboard Pages
for f in html_files_dash:
    with open(f, "r", encoding="utf-8") as file:
        content = file.read()
    
    if 'data-rtl-toggle' not in content:
        # Insert before theme toggle
        rtl_btn = '        <button class="topbar-btn" data-rtl-toggle title="Toggle RTL">🌐</button>\n'
        if 'data-theme-toggle' in content:
            content = content.replace('<button class="topbar-btn" data-theme-toggle', rtl_btn + '        <button class="topbar-btn" data-theme-toggle')
        else:
            content = content.replace('<div class="dash-topbar-actions">', '<div class="dash-topbar-actions">\n' + rtl_btn)
            
        with open(f, "w", encoding="utf-8") as file:
            file.write(content)
        print(f"Updated dash {os.path.basename(f)}")

print("Comprehensive RTL button insertion complete!")
