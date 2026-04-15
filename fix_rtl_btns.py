import os
import glob
import re

workspace = r"d:\mageten\luthier-tools-platform\luthier-tools"

# 1. Icons configurations
ICON_GEOGRAPHY = "https://img.icons8.com/isometric/30/geography.png"

# 2. Find all HTML files
html_files = glob.glob(os.path.join(workspace, "*.html")) + glob.glob(os.path.join(workspace, "dashboard", "*.html"))

# 3. Process each file
for f in html_files:
    with open(f, "r", encoding="utf-8") as file:
        content = file.read()
    
    filename = os.path.basename(f)
    print(f"Processing {filename}...")
    
    # Replacement A: Header / Topbar button (if it has an image or emoji)
    # Target 1: <button class="hdr-btn" data-rtl-toggle ...>...</button>
    # Target 2: <button class="topbar-btn" data-rtl-toggle ...>...</button>
    
    # Use re.sub to catch different variations of the button
    # Header buttons often have an <img> or 🌐 inside
    pattern_hdr = r'<button class="hdr-btn" data-rtl-toggle title="Toggle RTL">.*?</button>'
    repl_hdr = f'<button class="hdr-btn" data-rtl-toggle title="Toggle RTL"><img src="{ICON_GEOGRAPHY}" alt="RTL" style="width:20px;height:20px;"></button>'
    content = re.sub(pattern_hdr, repl_hdr, content, flags=re.DOTALL)
    
    # Fixed buttons (login/signup)
    pattern_fixed = r'<button class="hdr-btn rtl-toggle-fixed" data-rtl-toggle title="Toggle RTL">.*?</button>'
    repl_fixed = f'<button class="hdr-btn rtl-toggle-fixed" data-rtl-toggle title="Toggle RTL"><img src="{ICON_GEOGRAPHY}" alt="RTL" style="width:20px;height:20px;"></button>'
    content = re.sub(pattern_fixed, repl_fixed, content, flags=re.DOTALL)
    
    # Dashboard topbar buttons
    pattern_dash = r'<button class="topbar-btn" data-rtl-toggle title="Toggle RTL">.*?</button>'
    repl_dash = f'<button class="topbar-btn" data-rtl-toggle title="Toggle RTL"><img src="{ICON_GEOGRAPHY}" alt="RTL" style="width:20px;height:20px;"></button>'
    content = re.sub(pattern_dash, repl_dash, content, flags=re.DOTALL)

    # Replacement B: Footer button
    # Target: <button data-rtl-toggle style="background:none;border:none;color:rgba(255,255,255,.38);font-size:.8rem;cursor:pointer;">RTL</button>
    pattern_footer = r'<button data-rtl-toggle style="background:none;border:none;color:rgba\(255,255,255,\.38\);font-size:\.8rem;cursor:pointer;">RTL</button>'
    repl_footer = f'<button data-rtl-toggle class="footer-rtl-btn" title="Toggle RTL"><img src="{ICON_GEOGRAPHY}" alt="RTL" style="width:16px;height:16px;"> <span>RTL</span></button>'
    content = re.sub(pattern_footer, repl_footer, content)

    with open(f, "w", encoding="utf-8") as file:
        file.write(content)

print("All RTL buttons updated with premium isometric icons!")
