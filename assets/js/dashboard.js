/* =========================================
   LUTHIERTOOLS — DASHBOARD.JS
   All dashboard data & rendering
   ========================================= */

/* ── DATA ─────────────────────────────────── */
const DB = {
  orders: [
    {id:'#LT-2401', date:'Apr 10, 2026', items:'Fret Saw, Digital Caliper Pro', total:138.99, status:'delivered'},
    {id:'#LT-2398', date:'Apr 07, 2026', items:'Fretwire Bundle x3', total:114.00, status:'shipped'},
    {id:'#LT-2391', date:'Apr 02, 2026', items:'Neck Relief Capo', total:42.00, status:'delivered'},
    {id:'#LT-2384', date:'Mar 28, 2026', items:"Luthier's Chisel Set", total:145.00, status:'processing'},
    {id:'#LT-2377', date:'Mar 22, 2026', items:'Bone Nut Blank Set x5', total:112.50, status:'delivered'},
    {id:'#LT-2368', date:'Mar 15, 2026', items:'Binding Router Bit Set', total:120.00, status:'cancelled'},
    {id:'#LT-2359', date:'Mar 08, 2026', items:'Tru-Oil Finish x2', total:39.98, status:'delivered'},
    {id:'#LT-2341', date:'Feb 28, 2026', items:'Fret Crowning File', total:35.99, status:'delivered'},
  ],
  inventory: [
    {name:'Precision Fret Saw', sku:'FS-001', cat:'Hand Tools', stock:45, max:100, status:'in'},
    {name:'Radius Sanding Block', sku:'RS-002', cat:'Finishing', stock:8, max:50, status:'low'},
    {name:'Digital Caliper Pro', sku:'DC-003', cat:'Measuring', stock:23, max:60, status:'in'},
    {name:'Binding Router Bit Set', sku:'BRB-004', cat:'Hand Tools', stock:3, max:30, status:'low'},
    {name:'Fret Crowning File', sku:'FCF-005', cat:'Hand Tools', stock:67, max:100, status:'in'},
    {name:'Nitrocellulose Finish', sku:'NF-006', cat:'Finishing', stock:0, max:40, status:'out'},
    {name:'String Action Gauge', sku:'SAG-007', cat:'Measuring', stock:31, max:80, status:'in'},
    {name:'Bone Nut Blank Set', sku:'BNB-008', cat:'Supplies', stock:5, max:50, status:'low'},
    {name:'Fretwire Bundle SS', sku:'FWB-011', cat:'Supplies', stock:88, max:150, status:'in'},
  ],
  tutorials: [
    {title:'Setting Up Your Work Bench', dur:'18 min', prog:100, cat:'Basics', icon:'🔨'},
    {title:'Fret Leveling & Crowning', dur:'34 min', prog:65, cat:'Fretwork', icon:'🎸'},
    {title:'Nut Slotting Techniques', dur:'22 min', prog:40, cat:'Setup', icon:'🦴'},
    {title:'Finish Application — Nitro', dur:'28 min', prog:10, cat:'Finishing', icon:'🖌️'},
    {title:'Bridge Plate Repairs', dur:'41 min', prog:0, cat:'Repair', icon:'🔧'},
    {title:'Acoustic Bracing Patterns', dur:'55 min', prog:0, cat:'Building', icon:'🪵'},
  ],
  community: [
    {user:'James Rodriguez', av:'JR', topic:'Best wood for first acoustic build?', replies:24, time:'2h ago', cat:'Building'},
    {user:'Melissa Kwan', av:'MK', topic:'Binding glue recommendations for mahogany', replies:12, time:'5h ago', cat:'Materials'},
    {user:'Thomas Herr', av:'TH', topic:"Review: Luthier's Chisel Set — 3 months in", replies:31, time:'1d ago', cat:'Reviews'},
    {user:'Carlos Vega', av:'CV', topic:'How I did my first fret level (with photos)', replies:47, time:'2d ago', cat:'Fretwork'},
  ]
};

/* ── ORDERS ───────────────────────────────── */
function renderOrders(orders, tbodyId='orders-body'){
  const tbody = document.getElementById(tbodyId);
  if(!tbody) return;
  tbody.innerHTML = orders.map(o => `
    <tr>
      <td><strong style="color:var(--primary)">${o.id}</strong></td>
      <td>${o.date}</td>
      <td style="max-width:200px;font-size:.83rem;">${o.items}</td>
      <td><strong>$${o.total.toFixed(2)}</strong></td>
      <td><span class="s-badge ${o.status}">${o.status.charAt(0).toUpperCase()+o.status.slice(1)}</span></td>
      <td><button onclick="Toast.show('Viewing order ${o.id}')" style="background:transparent;border:1px solid var(--border);padding:5px 11px;border-radius:6px;font-size:.77rem;cursor:pointer;color:var(--text-muted);font-family:var(--font-body);">Details</button></td>
    </tr>`).join('');
}

/* ── INVENTORY ────────────────────────────── */
function renderInventory(){
  const tbody = document.getElementById('inventory-body');
  if(!tbody) return;
  tbody.innerHTML = DB.inventory.map(item => {
    const pct = Math.round(item.stock/item.max*100);
    const color = item.status==='out' ? '#DC2626' : item.status==='low' ? '#D97706' : '#059669';
    const cls = item.status==='in' ? 'in-stock' : item.status==='low' ? 'low-stock' : 'out-stock';
    const lbl = item.status==='in' ? '● In Stock' : item.status==='low' ? '◐ Low Stock' : '○ Out of Stock';
    return `<tr>
      <td><strong>${item.name}</strong></td>
      <td><code style="font-size:.78rem;color:var(--text-muted)">${item.sku}</code></td>
      <td>${item.cat}</td>
      <td>
        <div style="display:flex;align-items:center;gap:10px;">
          <div class="prog-track" style="flex:1;min-width:70px;"><div class="prog-fill" style="width:${pct}%;background:${color};"></div></div>
          <span style="font-size:.82rem;font-weight:600;min-width:48px;color:var(--text)">${item.stock}/${item.max}</span>
        </div>
      </td>
      <td><span class="s-badge ${cls}">${lbl}</span></td>
      <td><button onclick="Toast.show('Reordering ${item.name}...')" style="background:var(--primary);color:#fff;border:none;padding:5px 12px;border-radius:6px;font-size:.77rem;cursor:pointer;font-family:var(--font-body);">Reorder</button></td>
    </tr>`;
  }).join('');
}

/* ── TUTORIALS ────────────────────────────── */
function renderTutorials(){
  const grid = document.getElementById('tutorials-grid');
  if(!grid) return;
  grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:18px;';
  grid.innerHTML = DB.tutorials.map(t => {
    const btnLabel = t.prog===0 ? 'Start Tutorial' : t.prog===100 ? '✓ Watch Again' : `Continue — ${t.prog}%`;
    const btnBg = t.prog===100 ? 'var(--gray-200)' : 'var(--primary)';
    const btnColor = t.prog===100 ? 'var(--text-muted)' : '#fff';
    return `<div class="t-card" style="background:var(--surface);border:1px solid var(--border);border-radius:12px;overflow:hidden;transition:var(--transition);" onmouseenter="this.style.transform='translateY(-4px)';this.style.boxShadow='var(--shadow-lg)'" onmouseleave="this.style.transform='';this.style.boxShadow=''">
      <div style="background:linear-gradient(135deg,var(--secondary),var(--primary-dark));height:130px;display:flex;align-items:center;justify-content:center;font-size:2.8rem;position:relative;">
        ${t.icon}
        ${t.prog===100 ? '<div style="position:absolute;top:10px;right:10px;background:#059669;color:#fff;font-size:.67rem;font-weight:700;padding:3px 9px;border-radius:100px;">✓ Done</div>' : ''}
        ${t.prog>0 && t.prog<100 ? `<div style="position:absolute;top:10px;right:10px;background:rgba(0,0,0,.5);color:#fff;font-size:.67rem;font-weight:700;padding:3px 9px;border-radius:100px;">${t.prog}%</div>` : ''}
      </div>
      <div style="padding:16px;">
        <div style="font-size:.69rem;font-weight:700;color:var(--primary);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;">${t.cat}</div>
        <div style="font-family:var(--font-head);font-size:.95rem;font-weight:700;color:var(--text);margin-bottom:5px;">${t.title}</div>
        <div style="font-size:.77rem;color:var(--text-muted);margin-bottom:12px;">⏱ ${t.dur}</div>
        <div class="prog-track" style="margin-bottom:12px;"><div class="prog-fill" style="width:${t.prog}%;"></div></div>
        <button onclick="Toast.show('Opening: ${t.title}')" style="width:100%;background:${btnBg};color:${btnColor};border:none;padding:9px;border-radius:8px;font-weight:600;font-size:.83rem;cursor:pointer;font-family:var(--font-body);">${btnLabel}</button>
      </div>
    </div>`;
  }).join('');
}

/* ── COMMUNITY ────────────────────────────── */
function renderCommunity(){
  const list = document.getElementById('community-list');
  if(!list) return;
  list.innerHTML = DB.community.map(p => `
    <div class="forum-card" style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:18px 20px;display:flex;align-items:flex-start;gap:12px;transition:var(--transition);cursor:pointer;"
      onmouseenter="this.style.borderColor='rgba(146,64,14,.3)';this.style.transform='translateX(4px)'"
      onmouseleave="this.style.borderColor='var(--border)';this.style.transform=''"
      onclick="Toast.show('Opening discussion...')">
      <div style="width:38px;height:38px;background:linear-gradient(135deg,var(--primary),var(--gold));border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:.85rem;flex-shrink:0;">${p.av}</div>
      <div style="flex:1;">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px;">
          <span style="font-weight:700;font-size:.875rem;color:var(--text)">${p.user}</span>
          <span style="font-size:.67rem;background:rgba(146,64,14,.1);color:var(--primary);padding:2px 8px;border-radius:100px;font-weight:700;">${p.cat}</span>
        </div>
        <div style="font-size:.9rem;color:var(--text);font-weight:500;margin-bottom:7px;">${p.topic}</div>
        <div style="display:flex;gap:14px;font-size:.76rem;color:var(--text-muted);">
          <span>💬 ${p.replies} replies</span><span>🕐 ${p.time}</span>
        </div>
      </div>
      <div style="color:var(--text-muted);font-size:1.1rem;">→</div>
    </div>`).join('');
}

/* ── CHART ────────────────────────────────── */
function renderChart(){
  const canvas = document.getElementById('activity-chart');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const data = [3200, 4100, 3800, 5200, 4800, 6100, 5400];
  const labels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const isDark = document.body.classList.contains('dark');
  const W = canvas.offsetWidth || 580;
  const H = 200;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = W * dpr; canvas.height = H * dpr;
  ctx.scale(dpr, dpr);
  const pad = {t:20,r:16,b:38,l:50};
  const cW = W-pad.l-pad.r, cH = H-pad.t-pad.b;
  const max = Math.max(...data);
  const step = cW/(data.length-1);
  const gridColor = isDark ? '#2D3748' : '#E5E7EB';
  const textColor = isDark ? '#94A3B8' : '#6B7280';
  // Grid
  ctx.strokeStyle = gridColor; ctx.lineWidth = 1;
  for(let i=0;i<=4;i++){
    const y = pad.t + (cH/4)*i;
    ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(W-pad.r,y); ctx.stroke();
    ctx.fillStyle = textColor; ctx.font='11px Inter,sans-serif'; ctx.textAlign='right';
    ctx.fillText('$'+(((4-i)*max/4/100).toFixed(0)*100), pad.l-6, y+4);
  }
  // Gradient fill
  const grad = ctx.createLinearGradient(0,pad.t,0,H-pad.b);
  grad.addColorStop(0,'rgba(146,64,14,.28)'); grad.addColorStop(1,'rgba(146,64,14,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  data.forEach((d,i) => {
    const x=pad.l+i*step, y=pad.t+cH-(d/max)*cH;
    i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
  });
  ctx.lineTo(pad.l+(data.length-1)*step, H-pad.b);
  ctx.lineTo(pad.l, H-pad.b);
  ctx.closePath(); ctx.fill();
  // Line
  ctx.strokeStyle='#92400E'; ctx.lineWidth=2.5; ctx.lineJoin='round';
  ctx.beginPath();
  data.forEach((d,i) => { const x=pad.l+i*step, y=pad.t+cH-(d/max)*cH; i===0?ctx.moveTo(x,y):ctx.lineTo(x,y); });
  ctx.stroke();
  // Dots & Labels
  ctx.textAlign='center';
  data.forEach((d,i) => {
    const x=pad.l+i*step, y=pad.t+cH-(d/max)*cH;
    ctx.fillStyle='#92400E'; ctx.beginPath(); ctx.arc(x,y,4,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(x,y,2,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=textColor; ctx.font='11px Inter,sans-serif';
    ctx.fillText(labels[i], x, H-8);
  });
}

/* ── SETTINGS ─────────────────────────────── */
function initSettings(){
  const form = document.getElementById('settings-form');
  if(!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type=submit]');
    btn.textContent='✓ Saved!'; btn.style.background='#059669';
    setTimeout(() => { btn.textContent='Save All Changes ✓'; btn.style.background=''; },2500);
    Toast.show('✓ Settings saved successfully');
  });
}

/* ── ORDER FILTERS ────────────────────────── */
function initOrderFilters(){
  document.querySelectorAll('[data-order-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-order-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const st = btn.dataset.orderFilter;
      renderOrders(st==='all' ? DB.orders : DB.orders.filter(o=>o.status===st));
    });
  });
}

/* ── INIT ─────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderOrders(DB.orders);
  renderInventory();
  renderTutorials();
  renderCommunity();
  renderChart();
  initSettings();
  initOrderFilters();
  // Sidebar theme btn
  document.querySelectorAll('.topbar-btn[data-theme-toggle]').forEach(btn => {
    btn.addEventListener('click', () => { setTimeout(renderChart, 120); });
  });
});
