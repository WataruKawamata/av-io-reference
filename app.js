// AV I/O Reference — Application Logic

let activeId = null;
let searchQ  = '';

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function ctChip(type) { return CT[type] || CT.other; }

function highlight(str, q) {
  if (!q) return str;
  const i = str.toLowerCase().indexOf(q);
  if (i < 0) return str;
  return str.slice(0, i) +
    `<span class="match-hl">${str.slice(i, i + q.length)}</span>` +
    str.slice(i + q.length);
}

// ─── SIDEBAR (category tabs + device list) ───────────────────────────────────
function renderSidebar() {
  const q    = searchQ.toLowerCase();
  const wrap = document.getElementById('sidebarWrap');

  // Count total visible
  const total = DEVICES.filter(d => !q || (d.maker + ' ' + d.model).toLowerCase().includes(q)).length;
  document.getElementById('deviceCount').textContent = `${total} / ${DEVICES.length} devices`;

  let html = '';
  CATS.forEach(cat => {
    const devs = DEVICES.filter(d => {
      if (d.category !== cat.id) return false;
      if (!q) return true;
      return (d.maker + ' ' + d.model).toLowerCase().includes(q);
    });
    if (!devs.length) return;

    // collapsed by default — search overrides
    const isOpen = q.length > 0;

    html += `<div class="cat-section${isOpen ? '' : ' collapsed'}" data-cat="${cat.id}">
      <button class="cat-tab" onclick="toggleCat('${cat.id}')">
        <span class="cat-pip ${cat.pip}"></span>
        <span class="cat-label">${cat.label}</span>
        <span class="cat-count">${devs.length}</span>
        <span class="cat-arrow">${isOpen ? '▾' : '▸'}</span>
      </button>
      <div class="cat-devices">`;

    devs.forEach(d => {
      const isActive = activeId === d.id;
      html += `<button class="dev-btn${isActive ? ' active' : ''}" onclick="selectDevice('${d.id}')">
        <span class="dev-model">${highlight(d.model, q)}</span>
        <span class="dev-maker">${highlight(d.maker, q)}</span>
        ${d.legacy   ? '<span class="dev-badge badge-legacy">LEGACY</span>'   : ''}
        ${d.consumer ? '<span class="dev-badge badge-consumer">CONSUMER</span>' : ''}
      </button>`;
    });

    html += `</div></div>`;
  });

  if (!html) {
    html = `<p class="no-results">No devices match "<em>${q}</em>"</p>`;
  }

  wrap.innerHTML = html;
}

function toggleCat(id) {
  const el = document.querySelector(`.cat-section[data-cat="${id}"]`);
  if (!el) return;
  const collapsed = el.classList.toggle('collapsed');
  const arrow = el.querySelector('.cat-arrow');
  if (arrow) arrow.textContent = collapsed ? '▸' : '▾';
}

function toggleIO(btn) {
  const panel = btn.closest('.io-panel');
  if (!panel) return;
  panel.classList.toggle('collapsed');
}

// ─── DEVICE DETAIL ────────────────────────────────────────────────────────────
function selectDevice(id) {
  activeId = id;
  renderSidebar();

  const d   = DEVICES.find(x => x.id === id);
  if (!d) return;
  const cat = CATS.find(c => c.id === d.category);

  const empty  = document.getElementById('emptyState');
  const detail = document.getElementById('deviceDetail');
  empty.style.display  = 'none';
  detail.style.display = 'block';

  // connector rows
  const rows = list => list.map(c => {
    const chip = ctChip(c.type);
    return `<div class="conn-row">
      <div class="conn-chip ${chip.cls}">${chip.label}</div>
      <div class="conn-info">
        <div class="conn-name">${c.name}</div>
        <div class="conn-detail">${c.detail}</div>
      </div>
      <div class="conn-count">${c.count}</div>
    </div>`;
  }).join('');

  // signal flow
  const sigHtml = (d.signal || []).map((s, i) => {
    const isMain = s.startsWith('▶');
    return (i > 0 ? '<span class="sig-arrow">→</span>' : '') +
      `<span class="sig-node${isMain ? ' main' : ''}">${s.replace('▶ ', '')}</span>`;
  }).join('');

  detail.innerHTML = `
    <div class="dev-header">
      <div class="dev-icon">${d.icon || cat.icon}</div>
      <div class="dev-meta">
        <h2>${d.model}</h2>
        <div class="dev-subtitle">${d.maker} · ${cat.label}</div>
        <div class="dev-tags">
          <span class="tag ${cat.tag}">${cat.label.toUpperCase()}</span>
          <span class="tag tag-neutral">${d.inputs.length} IN · ${d.outputs.length} OUT</span>
          ${d.legacy   ? '<span class="tag tag-legacy">LEGACY</span>'   : ''}
          ${d.consumer ? '<span class="tag tag-consumer">CONSUMER</span>' : ''}
        </div>
      </div>
    </div>

    <div class="io-grid">
      <div class="io-panel in collapsed">
        <button class="io-hdr" onclick="toggleIO(this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="8,12 4,12 4,20 20,20 20,12 16,12"/>
            <polyline points="12,3 12,15"/><polyline points="8,7 12,3 16,7"/>
          </svg>
          Inputs
          <span class="io-count">${d.inputs.length}</span>
          <span class="io-arrow">▾</span>
        </button>
        <div class="io-body">${rows(d.inputs)}</div>
      </div>
      <div class="io-panel out collapsed">
        <button class="io-hdr" onclick="toggleIO(this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="8,12 4,12 4,4 20,4 20,12 16,12"/>
            <polyline points="12,21 12,9"/><polyline points="8,17 12,21 16,17"/>
          </svg>
          Outputs
          <span class="io-count">${d.outputs.length}</span>
          <span class="io-arrow">▾</span>
        </button>
        <div class="io-body">${rows(d.outputs)}</div>
      </div>
    </div>

    ${sigHtml ? `
    <div class="info-panel">
      <div class="info-label teal">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
        </svg>
        Typical Signal Flow
      </div>
      <div class="sig-flow">${sigHtml}</div>
    </div>` : ''}

    ${d.notes && d.notes.length ? `
    <div class="info-panel">
      <div class="info-label yellow">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        Notes
      </div>
      <ul class="notes-list">${d.notes.map(n => `<li>${n}</li>`).join('')}</ul>
    </div>` : ''}
  `;
}

// ─── SEARCH ───────────────────────────────────────────────────────────────────
document.getElementById('searchInput').addEventListener('input', function () {
  searchQ = this.value.trim();
  // clear selection when searching
  if (searchQ) {
    activeId = null;
    document.getElementById('emptyState').style.display  = 'flex';
    document.getElementById('deviceDetail').style.display = 'none';
  }
  renderSidebar();
});

document.addEventListener('keydown', e => {
  if (e.key === '/') {
    e.preventDefault();
    document.getElementById('searchInput').focus();
  }
  if (e.key === 'Escape') {
    document.getElementById('searchInput').value = '';
    searchQ = '';
    renderSidebar();
  }
});

// ─── INIT ─────────────────────────────────────────────────────────────────────
renderSidebar();
