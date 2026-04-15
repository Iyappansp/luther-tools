import os
import re

def restore_rtl():
    root_dir = r"d:\mageten\luthier-tools-platform\luthier-tools"
    
    rtl_block = """
      <div class="hdr-rtl-wrap" style="display:flex;align-items:center;gap:8px;padding-right:12px;border-right:1px solid var(--border);margin-right:5px;">
        <span style="font-size:0.7rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.04em;">RTL</span>
        <label class="tog-sw" title="Toggle RTL">
          <input type="checkbox" data-rtl-toggle>
          <span class="tog-sl"></span>
        </label>
      </div>"""

    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(".html"):
                file_path = os.path.join(root, file)
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()
                
                new_content = content
                
                # Restore to header
                if 'class="hdr-theme-wrap"' in content and 'class="hdr-rtl-wrap"' not in content:
                    pattern = re.compile(r'(<div class="hdr-theme-wrap".*?</div>)', re.DOTALL)
                    new_content = pattern.sub(r'\1' + rtl_block, new_content)
                
                # Restore to dashboard topbar
                elif 'class="dash-topbar-actions"' in content and 'class="hdr-rtl-wrap"' not in content:
                    pattern = re.compile(r'(<button class="topbar-btn".*?>🔔.*?</button>)', re.DOTALL)
                    new_content = pattern.sub(r'\1' + rtl_block, new_content)

                if new_content != content:
                    with open(file_path, "w", encoding="utf-8") as f:
                        f.write(new_content)
                    print(f"Restored RTL to header/topbar: {file_path}")


if __name__ == "__main__":
    restore_rtl()
