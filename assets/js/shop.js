/* =========================================
   LUTHIERTOOLS — SHOP.JS
   Product catalog, filtering, detail page
   ========================================= */

const PRODUCTS = [
  {id:'p1', name:'Precision Fret Saw', cat:'hand-tools', price:49.99, oldPrice:64.99, stock:'in', rating:4.9, reviews:128, badge:'Bestseller', img:'https://images.unsplash.com/photo-1541818146-2485501ae11c?q=80&w=600&auto=format&fit=crop', desc:'Japanese pull-cut saw with 0.6mm kerf and walnut handle.'},
  {id:'p2', name:'Radius Sanding Block', cat:'finishing', price:28.50, oldPrice:null, stock:'in', rating:4.7, reviews:86, badge:null, img:'https://images.unsplash.com/photo-1621259182978-fbf93032bc9b?q=80&w=600&auto=format&fit=crop', desc:'Compound radius sanding block for perfectly curved fretboards.'},
  {id:'p3', name:'Digital Caliper Pro', cat:'measuring', price:89.00, oldPrice:110.00, stock:'in', rating:4.8, reviews:203, badge:'New', img:'https://images.unsplash.com/photo-1518135839073-4273ed428804?q=80&w=600&auto=format&fit=crop', desc:'0.01mm resolution digital caliper with stainless steel jaws.'},
  {id:'p4', name:'Binding Router Bit Set', cat:'hand-tools', price:120.00, oldPrice:null, stock:'low', rating:4.6, reviews:54, badge:'Pro', img:'https://images.unsplash.com/photo-1504148406050-2ca97b4ec6a5?q=80&w=600&auto=format&fit=crop', desc:'Complete 6-piece set for routing binding channels precisely.'},
  {id:'p5', name:'Fret Crowning File', cat:'hand-tools', price:35.99, oldPrice:44.99, stock:'in', rating:4.9, reviews:167, badge:null, img:'https://images.unsplash.com/photo-1550985543-f47f2c90279d?q=80&w=600&auto=format&fit=crop', desc:'Diamond-coated file for perfect fret crowning every time.'},
  {id:'p6', name:'Nitrocellulose Finish', cat:'finishing', price:54.00, oldPrice:null, stock:'in', rating:4.5, reviews:91, badge:'Popular', img:'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop', desc:'Traditional nitro lacquer for authentic vintage finishes.'},
  {id:'p7', name:'String Action Gauge', cat:'measuring', price:18.00, oldPrice:24.00, stock:'in', rating:4.7, reviews:142, badge:null, img:'https://images.unsplash.com/photo-1556449110-318041a87679?q=80&w=600&auto=format&fit=crop', desc:'Precision gauge for measuring string action and relief.'},
  {id:'p8', name:'Bone Nut Blank Set', cat:'supplies', price:22.50, oldPrice:null, stock:'low', rating:4.8, reviews:78, badge:null, img:'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?q=80&w=600&auto=format&fit=crop', desc:'Pre-shaped bone nut blanks for guitar and bass, 5-pack.'},
  {id:'p9', name:'Tru-Oil Stock Finish', cat:'finishing', price:19.99, oldPrice:null, stock:'out', rating:4.4, reviews:63, badge:null, img:'https://images.unsplash.com/photo-1520110120185-6c1eb3320521?q=80&w=600&auto=format&fit=crop', desc:'Fast-drying oil finish for necks, perfect for satin results.'},
  {id:'p10', name:"Luthier's Chisel Set", cat:'hand-tools', price:145.00, oldPrice:179.00, stock:'in', rating:5.0, reviews:45, badge:'Premium', img:'https://images.unsplash.com/photo-1530124560677-bdaea92cb005?q=80&w=600&auto=format&fit=crop', desc:'6-piece Swiss-made chisel set with hand-turned maple handles.'},
  {id:'p11', name:'Fretwire Bundle (SS)', cat:'supplies', price:38.00, oldPrice:null, stock:'in', rating:4.7, reviews:110, badge:null, img:'https://images.unsplash.com/photo-1564186763535-ebb21ef52784?q=80&w=600&auto=format&fit=crop', desc:'Stainless steel fretwire, 2-metre bundles in 4 profiles.'},
  {id:'p12', name:'Neck Relief Capo', cat:'measuring', price:42.00, oldPrice:52.00, stock:'in', rating:4.6, reviews:67, badge:'New', img:'https://images.unsplash.com/photo-1616843413587-9e3a37f7bbd8?q=80&w=600&auto=format&fit=crop', desc:'Precision capo for accurate neck relief measurements.'},
];

const STOCK_LABEL = { in:'● In Stock', low:'◐ Low Stock', out:'○ Out of Stock' };
const STOCK_CLASS = { in:'in', low:'low', out:'out' };

/* ── SHOP SYSTEM ──────────────────────────── */
const Shop = {
  filtered: [...PRODUCTS],
  cat: 'all',
  q: '',
  sort: 'default',

  init(){
    if(!document.getElementById('product-grid')) return;
    this.render();
    this.bindFilters();
    this.bindSearch();
    this.bindSort();
  },

  render(){
    const grid = document.getElementById('product-grid');
    if(!grid) return;
    grid.innerHTML = '';

    if(!this.filtered.length){
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:80px 20px;color:var(--text-muted);">
        <div style="font-size:3rem;margin-bottom:14px;">🔍</div>
        <h3 style="font-family:var(--font-head);color:var(--secondary);margin-bottom:8px;">No tools found</h3>
        <p>Try a different search or filter.</p>
      </div>`;
      return;
    }

    this.filtered.forEach((p, i) => {
      const stars = '★'.repeat(Math.floor(p.rating)) + (p.rating % 1 >= .5 ? '½' : '');
      const col = document.createElement('div');
      col.className = 'col-lg-4 col-md-6 fade-up';
      col.style.transitionDelay = `${Math.min(i,5)*0.06}s`;
      col.innerHTML = `
        <div class="product-card">
          <div class="product-img">
            <img src="${p.img}" alt="${p.name}" style="width:100%; height:100%; object-fit:cover;">
            ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
            <div class="product-overlay">
              <button class="ov-btn" data-add-cart data-id="${p.id}" data-name="${p.name}" data-price="${p.price}" title="Add to cart">🛒</button>
              <a href="tool-detail.html?id=${p.id}" class="ov-btn" title="View details">👁️</a>
              <button class="ov-btn" title="Wishlist" onclick="Toast.show('❤️ Added to wishlist')">❤️</button>
            </div>
          </div>
          <div class="product-body">
            <div class="product-cat">${p.cat.replace('-',' ')}</div>
            <div class="product-name">${p.name}</div>
            <div class="product-rating"><span class="stars">${stars}</span><span class="rating-ct">${p.rating} (${p.reviews})</span></div>
            <div class="product-foot">
              <div class="product-price">${p.oldPrice ? `<span class="old-price">$${p.oldPrice.toFixed(2)}</span>` : ''}$${p.price.toFixed(2)}</div>
              <span class="stock ${STOCK_CLASS[p.stock]}">${STOCK_LABEL[p.stock]}</span>
            </div>
          </div>
        </div>`;
      grid.appendChild(col);
    });

    // Re-trigger animations
    setTimeout(() => {
      grid.querySelectorAll('.fade-up').forEach(el => { void el.offsetHeight; el.classList.add('visible'); });
    }, 50);

    const ct = document.getElementById('product-count');
    if(ct) ct.textContent = `${this.filtered.length} tool${this.filtered.length!==1?'s':''} found`;
  },

  filter(){
    this.filtered = PRODUCTS.filter(p => {
      const mc = this.cat==='all' || p.cat===this.cat;
      const mq = !this.q || p.name.toLowerCase().includes(this.q) || p.cat.includes(this.q);
      return mc && mq;
    });
    if(this.sort==='price-asc') this.filtered.sort((a,b)=>a.price-b.price);
    else if(this.sort==='price-desc') this.filtered.sort((a,b)=>b.price-a.price);
    else if(this.sort==='rating') this.filtered.sort((a,b)=>b.rating-a.rating);
    else if(this.sort==='popular') this.filtered.sort((a,b)=>b.reviews-a.reviews);
    this.render();
  },

  bindFilters(){
    document.querySelectorAll('[data-cat-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-cat-filter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.cat = btn.dataset.catFilter;
        this.filter();
      });
    });
  },

  bindSearch(){
    const inp = document.getElementById('tool-search');
    if(!inp) return;
    inp.addEventListener('input', () => { this.q = inp.value.toLowerCase().trim(); this.filter(); });
  },

  bindSort(){
    const sel = document.getElementById('tool-sort');
    if(!sel) return;
    sel.addEventListener('change', () => { this.sort = sel.value; this.filter(); });
  }
};

/* ── TOOL DETAIL ──────────────────────────── */
const Detail = {
  init(){
    if(!document.getElementById('detail-name')) return;
    const id = new URLSearchParams(location.search).get('id') || 'p1';
    const p = PRODUCTS.find(x => x.id===id) || PRODUCTS[0];
    this.render(p);
  },
  render(p){
    const set = (id,val) => { const el=document.getElementById(id); if(el) el.textContent=val; };
    const setH = (id,val) => { const el=document.getElementById(id); if(el) el.innerHTML=val; };
    set('detail-name', p.name);
    set('detail-cat', p.cat.replace('-',' '));
    set('detail-price', `$${p.price.toFixed(2)}`);
    set('detail-rating', `${p.rating} (${p.reviews} reviews)`);
    setH('detail-img', `<img src="${p.img}" alt="${p.name}" style="width:100%; height:auto; border-radius:12px;">`);
    set('detail-desc', p.desc);
    document.title = `${p.name} — LuthierTools`;
    const stEl = document.getElementById('detail-stock');
    if(stEl){ stEl.textContent = STOCK_LABEL[p.stock]; stEl.className = `stock ${STOCK_CLASS[p.stock]}`; }
    const addBtn = document.getElementById('detail-add-cart');
    if(addBtn){ addBtn.dataset.id=p.id; addBtn.dataset.name=p.name; addBtn.dataset.price=p.price; }
    const bcEl = document.getElementById('detail-breadcrumb');
    if(bcEl) bcEl.textContent = p.name;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Shop.init();
  Detail.init();
});
