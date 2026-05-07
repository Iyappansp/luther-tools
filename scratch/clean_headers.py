import os
import re

correct_header = """  <!-- HEADER -->
  <header class="site-header">
    <div class="hdr-inner">
      <a href="index.html" class="logo-wrap"><img src="assets/images/logo.png" alt="LuthierTools" class="main-logo"></a>
      <nav class="nav-links">
        <a href="index.html">Home</a>
        <a href="home-2.html">Home 2</a>
        <a href="about.html">About</a>
        <a href="tools.html">Tools</a>
        <a href="supplies.html">Supplies</a>
        <a href="gallery.html">Gallery</a>
        <a href="tutorials.html">Tutorials</a>
        <a href="community.html">Community</a>
        <a href="contact.html">Contact</a>
        <a href="dashboard/dashboard.html">Dashboard</a>
        <div class="hdr-auth-btns">
          <a href="login.html" class="nav-dash">Login</a>
        </div>
      </nav>
      <div class="hdr-actions">
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
  </header>
  <nav class="mobile-nav">
    <div class="mobile-nav-top">
      <a href="index.html" class="mobile-logo"><img src="assets/images/logo.png" alt="LuthierTools"></a>
      <button class="mobile-close">✕</button>
    </div>
    <div class="mobile-links">
      <a href="index.html">🏠 Home</a>
      <a href="home-2.html">🏠 Home 2</a>
      <a href="about.html">ℹ️ About</a>
      <a href="tools.html">🔨 Tools</a>
      <a href="supplies.html">📦 Supplies</a>
      <a href="tutorials.html">🎓 Tutorials</a>
      <a href="community.html">👥 Community</a>
      <a href="contact.html">📞 Contact</a>
      <a href="dashboard/dashboard.html">⚙️ Dashboard</a>
      <div style="height:1px;background:var(--border);margin:10px 0;"></div>
      <a href="login.html">🔐 Sign In</a>
      <a href="signup.html">👤 Sign Up</a>
    </div>
    <div class="mobile-nav-bottom">
      <div class="mobile-opt-item">
        <span>Dark Theme</span>
        <label class="tog-sw"><input type="checkbox" data-theme-toggle><span class="tog-sl"></span></label>
      </div>
      <div class="mobile-opt-item">
        <span>RTL Layout</span>
        <label class="tog-sw"><input type="checkbox" data-rtl-toggle><span class="tog-sl"></span></label>
      </div>
    </div>
  </nav>"""

def clean_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Identify the primary header block location
    match = re.search(r'<header class="site-header">', content)
    if not match:
        print(f"Skipping {file_path}")
        return
    
    start_pos = match.start()
    
    # Try to find where the header/nav sequence ends. 
    # Usually it's followed by a </nav> (from mobile-nav)
    # We'll search for the first </nav> after the header
    end_nav = content.find('</nav>', start_pos)
    if end_nav == -1:
        print(f"Skipping {file_path} - No closing nav")
        return
    
    total_end = end_nav + 6 # Include </nav>

    # 2. Aggressively remove ANY remaining bits of header-related classes in the whole file
    # and then insert the correct header at start_pos
    
    # First, cut out the old header/nav block
    temp_content = content[:start_pos] + "@@@PLACEHOLDER@@@" + content[total_end:]
    
    # Now, look for residue: 
    # hdr-actions, hdr-toggle-item, hamburger, nav-links, mobile-nav, etc.
    # We'll remove any div/nav that has these classes
    residue_patterns = [
        r'<div class="hdr-actions">.*?</div>',
        r'<div class="hdr-toggle-item.*?</div>',
        r'<button class="hamburger".*?</button>',
        r'<nav class="nav-links">.*?</nav>',
        r'<nav class="mobile-nav">.*?</nav>',
        r'<header class="site-header">.*?</header>',
        r'<!--\s*HEADER\s*-->'
    ]
    
    for pattern in residue_patterns:
        temp_content = re.sub(pattern, '', temp_content, flags=re.DOTALL)
        
    # Also catch dangling tags like lone </div> or </div></header>
    temp_content = re.sub(r'</div>\s*</div>\s*</header>', '', temp_content)
    temp_content = re.sub(r'</header>', '', temp_content)

    # 3. Final assembly
    final_content = temp_content.replace("@@@PLACEHOLDER@@@", correct_header)
    
    # Clean up double newlines
    final_content = re.sub(r'\n\s*\n\s*\n', '\n\n', final_content)

    if final_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(final_content)
        print(f"Fully Cleaned and Updated {file_path}")

html_files = [f for f in os.listdir('.') if f.endswith('.html')]
for f in html_files:
    clean_file(f)
