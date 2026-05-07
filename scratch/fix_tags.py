import os

correct_header_region = """      <div class="hdr-actions">
        <div class="hdr-toggle-item hdr-theme-wrap">
          <span class="hdr-toggle-label">Dark</span>
          <label class="tog-sw" title="Toggle Theme">
            <input type="checkbox" data-theme-toggle>
            <span class="tog-sl"></span>
          </label>
        </div>
        <div class="hdr-toggle-item hdr-rtl-wrap">
          <span class="hdr-toggle-label">RTL</span>
          <label class="tog-sw" title="Toggle RTL">
            <input type="checkbox" data-rtl-toggle>
            <span class="tog-sl"></span>
          </label>
        </div>
        <button class="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
      </div>
    </div>
  </header>"""

def fix_header(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Target the broken hdr-actions area
    # It usually ends with a dangling </header>
    import re
    # Look for hdr-actions start and the next </header>
    pattern = re.compile(r'<div class="hdr-actions">.*?</header>', re.DOTALL)
    
    new_content = pattern.sub(correct_header_region, content, count=1)
    
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed header in {file_path}")

for f in os.listdir('.'):
    if f.endswith('.html'):
        fix_header(f)
