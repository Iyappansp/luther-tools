/* =========================================
   LUTHIERTOOLS — MAIN.JS
   Core engine: theme, RTL, nav, animations
   ========================================= */

/* ── THEME ENGINE ─────────────────────────── */
const Theme = {
  init(){
    const s = localStorage.getItem('lt-theme') || 'light';
    s === 'dark' ? this.dark() : this.light();
    document.querySelectorAll('[data-theme-toggle]').forEach(b => b.addEventListener('click', () => this.toggle()));
  },
  dark(){
    document.body.classList.add('dark');
    document.body.classList.remove('light');
    localStorage.setItem('lt-theme','dark');
    document.querySelectorAll('.theme-ico img').forEach(img => {
      img.src = 'https://img.icons8.com/isometric/30/sun.png';
      img.alt = 'Sun';
    });
  },
  light(){
    document.body.classList.remove('dark');
    document.body.classList.add('light');
    localStorage.setItem('lt-theme','light');
    document.querySelectorAll('.theme-ico img').forEach(img => {
      img.src = 'https://img.icons8.com/isometric/30/moon.png';
      img.alt = 'Moon';
    });
  },
  toggle(){ document.body.classList.contains('dark') ? this.light() : this.dark(); }
};

/* ── RTL ENGINE ───────────────────────────── */
const RTL = {
  init(){
    const isRtl = localStorage.getItem('lt-rtl') === '1';
    if(isRtl) this.on(true);
    document.querySelectorAll('[data-rtl-toggle]').forEach(b => {
      b.addEventListener('change', (e) => {
        if(e.target.type === 'checkbox') {
          e.target.checked ? this.on() : this.off();
        }
      });
      // Also support button clicks
      if(b.tagName === 'BUTTON' || (b.tagName === 'INPUT' && b.type !== 'checkbox')) {
        b.addEventListener('click', () => this.toggle());
      }
    });
  },
  on(init = false){
    document.body.classList.add('rtl');
    document.documentElement.dir = 'rtl';
    localStorage.setItem('lt-rtl', '1');
    if(!init && window.Toast) Toast.show('Right-to-Left Mode Active');
    this.updateUI(true);
  },
  off(){
    document.body.classList.remove('rtl');
    document.documentElement.dir = 'ltr';
    localStorage.setItem('lt-rtl', '0');
    if(window.Toast) Toast.show('Left-to-Right Mode Active');
    this.updateUI(false);
  },
  toggle(){ document.body.classList.contains('rtl') ? this.off() : this.on(); },
  updateUI(isRtl){
    document.querySelectorAll('[data-rtl-toggle]').forEach(btn => {
      if(btn.type === 'checkbox') {
        btn.checked = isRtl;
      } else {
        btn.style.borderColor = isRtl ? 'var(--primary)' : '';
        btn.style.background = isRtl ? 'rgba(146,64,14,0.05)' : '';
      }
    });
  }
};

/* ── HEADER SCROLL ────────────────────────── */
const HeaderScroll = {
  init(){
    const h = document.querySelector('.site-header');
    if(!h) return;
    window.addEventListener('scroll', () => h.classList.toggle('scrolled', window.scrollY > 20), {passive:true});
  }
};

/* ── MOBILE NAV ───────────────────────────── */
const MobileNav = {
  init(){
    const btn = document.querySelector('.hamburger');
    const nav = document.querySelector('.mobile-nav');
    if(!btn || !nav) return;
    btn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      const [a,b,c] = btn.querySelectorAll('span');
      if(open){ a.style.transform='rotate(45deg) translate(5px,5px)'; b.style.opacity='0'; c.style.transform='rotate(-45deg) translate(5px,-5px)'; }
      else { [a,b,c].forEach(s => { s.style.transform=''; s.style.opacity=''; }); }
    });
    document.addEventListener('click', e => {
      if(!btn.contains(e.target) && !nav.contains(e.target)){
        nav.classList.remove('open');
        btn.querySelectorAll('span').forEach(s => { s.style.transform=''; s.style.opacity=''; });
      }
    });
  }
};

/* ── SCROLL ANIMATIONS ────────────────────── */
const Animate = {
  init(){
    const els = document.querySelectorAll('.fade-up,.slide-left,.slide-right');
    if(!els.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, {threshold:.1, rootMargin:'0px 0px -40px 0px'});
    els.forEach(el => obs.observe(el));
  }
};

/* ── CART ─────────────────────────────────── */
const Cart = {
  items: [],
  init(){
    try{ this.items = JSON.parse(localStorage.getItem('lt-cart') || '[]'); } catch(e){ this.items=[]; }
    this.updateBadge();
    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-add-cart]');
      if(btn) this.add({ id:btn.dataset.id, name:btn.dataset.name, price:parseFloat(btn.dataset.price)||0 });
    });
  },
  add(item){
    const ex = this.items.find(i => i.id===item.id);
    ex ? ex.qty++ : this.items.push({...item, qty:1});
    localStorage.setItem('lt-cart', JSON.stringify(this.items));
    this.updateBadge();
    Toast.show(`🛒 ${item.name} added to cart`);
  },
  get count(){ return this.items.reduce((s,i) => s+(i.qty||1),0); },
  updateBadge(){
    const n = this.count;
    document.querySelectorAll('.cart-count').forEach(b => { b.textContent=n; b.style.display=n>0?'flex':'none'; });
  }
};

/* ── TOAST ────────────────────────────────── */
const Toast = {
  el: null,
  timer: null,
  show(msg, dur=3000){
    if(!this.el){
      this.el = document.createElement('div');
      this.el.className = 'toast-msg';
      document.body.appendChild(this.el);
    }
    this.el.textContent = msg;
    this.el.classList.add('show');
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.el.classList.remove('show'), dur);
  }
};

/* ── COUNTER ANIMATION ────────────────────── */
const Counter = {
  init(){
    const els = document.querySelectorAll('[data-count]');
    if(!els.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if(e.isIntersecting){ this.run(e.target); obs.unobserve(e.target); } });
    }, {threshold:.5});
    els.forEach(el => obs.observe(el));
  },
  run(el){
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const dur = 2000;
    const start = performance.now();
    const tick = now => {
      const p = Math.min((now-start)/dur, 1);
      const ease = 1 - Math.pow(1-p, 3);
      const val = ease * target;
      el.textContent = (val % 1 === 0 ? Math.round(val) : val.toFixed(1)) + suffix;
      if(p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
};

/* ── ACTIVE NAV ───────────────────────────── */
const ActiveNav = {
  init(){
    const path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a,.mobile-nav a').forEach(a => {
      const href = (a.getAttribute('href')||'').split('/').pop();
      if(href && href === path) a.classList.add('active');
    });
  }
};

/* ── DASHBOARD SIDEBAR MOBILE ─────────────── */
const DashSidebar = {
  init(){
    const toggle = document.querySelector('.sidebar-toggle-btn');
    const sidebar = document.querySelector('.dash-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if(!toggle || !sidebar) return;
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay && overlay.classList.toggle('on');
    });
    overlay && overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('on');
    });
  }
};

/* ── INIT ─────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  Theme.init();
  RTL.init();
  HeaderScroll.init();
  MobileNav.init();
  Animate.init();
  Cart.init();
  Counter.init();
  ActiveNav.init();
  DashSidebar.init();
});
