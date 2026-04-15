import os
import glob

workspace = r"d:\mageten\luthier-tools-platform\luthier-tools"

# Root level HTML files
html_files_root = glob.glob(os.path.join(workspace, "*.html"))

for f in html_files_root:
    with open(f, "r", encoding="utf-8") as file:
        content = file.read()
    
    # Replace icons8 guitar image with favicon where used
    content = content.replace("https://img.icons8.com/isometric/50/guitar.png", "assets/images/favicon.png")
    
    with open(f, "w", encoding="utf-8") as file:
        file.write(content)
    print(f"Updated {os.path.basename(f)}")

print("Favicon replacement in existing img tags and rel=icon complete!")
