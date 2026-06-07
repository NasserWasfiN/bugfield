// ── UI Helpers ─────────────────────────────────────────────────────────────

function sevBadge(s) {
  const v = SEV[s];
  return `<span class="badge" style="background:${v.bg};color:${v.text}">${v.icon} ${v.label}</span>`;
}

function statusBadge(s) {
  const [bg, tc] = STATUS_BADGE[s] || ['#F1EFE8', '#5F5E5A'];
  const lbl = STATUS_MAP[s]?.label || s;
  return `<span class="badge" style="background:${bg};color:${tc}">${lbl}</span>`;
}

function avEl(a, sz = 22) {
  const name = ASSIGNEES[a] || a;
  const [bg, tc] = AV_COLORS[a] || ['#f0efe9', '#5c5b55'];
  const initials = a.length <= 2 ? a : a.slice(0, 2);
  return `<div class="avatar-circle" title="${name}" style="width:${sz}px;height:${sz}px;font-size:${sz < 26 ? 9 : 11}px;background:${bg};color:${tc}">${initials}</div>`;
}

function showToast(msg, duration = 2400) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

// ── Board with Drag & Drop ─────────────────────────────────────────────────
function renderBoard(issues) {
  const kv = document.getElementById('kanban-view');
  kv.innerHTML = '';

  STATUS_COLS.forEach(col => {
    const cards = issues.filter(i => i.status === col.id);

    const colEl = document.createElement('div');
    colEl.className = 'col';
    colEl.dataset.status = col.id;

    colEl.innerHTML = `
      <div class="col-head">
        <div class="col-dot" style="background:${col.dot}"></div>
        <span class="col-label">${col.label}</span>
        <span class="col-count" id="count-${col.id}">${cards.length}</span>
      </div>
      <div class="col-cards" id="cards-${col.id}" data-status="${col.id}">
        ${cards.length === 0 ? '<div class="col-empty" id="empty-'+col.id+'">No bugs</div>' : ''}
      </div>`;

    kv.appendChild(colEl);

    // Append actual card DOM nodes (so we can attach drag listeners)
    const cardsContainer = colEl.querySelector('.col-cards');
    cards.forEach(c => {
      const cardEl = createCardEl(c);
      cardsContainer.appendChild(cardEl);
    });

    // Drop zone listeners on the cards container
    setupDropZone(cardsContainer);
  });
}

function createCardEl(c) {
  const div = document.createElement('div');
  div.className = 'card';
  div.draggable = true;
  div.dataset.id = c.id;
  div.innerHTML = `
    <div class="card-title">${escHtml(c.title)}</div>
    <div class="card-meta">
      ${sevBadge(c.sev)}
      <span class="tag">${c.product}</span>
      ${avEl(c.assignee)}
    </div>
    <div class="card-id">${c.id}</div>`;

  // Click to open detail (only if not dragging)
  div.addEventListener('click', () => {
    if (!div.classList.contains('is-dragging')) openDetail(c.id);
  });

  // Drag events
  div.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/plain', c.id);
    e.dataTransfer.effectAllowed = 'move';
    div.classList.add('is-dragging');
    // slight delay so the ghost image renders before we hide
    setTimeout(() => div.classList.add('dragging-hidden'), 0);
  });

  div.addEventListener('dragend', () => {
    div.classList.remove('is-dragging', 'dragging-hidden');
    // Remove all drop highlights
    document.querySelectorAll('.col-cards').forEach(z => z.classList.remove('drag-over'));
  });

  return div;
}

function setupDropZone(zone) {
  zone.addEventListener('dragover', e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    zone.classList.add('drag-over');

    // Reorder preview: find closest card to cursor
    const dragging = document.querySelector('.is-dragging');
    const afterEl  = getDragAfterElement(zone, e.clientY);
    if (afterEl) {
      zone.insertBefore(dragging, afterEl);
    } else {
      zone.appendChild(dragging);
    }
  });

  zone.addEventListener('dragleave', e => {
    // Only remove highlight if leaving the zone entirely
    if (!zone.contains(e.relatedTarget)) {
      zone.classList.remove('drag-over');
    }
  });

  zone.addEventListener('drop', async e => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    const id     = e.dataTransfer.getData('text/plain');
    const status = zone.dataset.status;
    if (!id || !status) return;

    await moveIssueById(id, status);
  });
}

// Returns the card element that comes just after the cursor Y position
function getDragAfterElement(container, y) {
  const cards = [...container.querySelectorAll('.card:not(.is-dragging)')];
  return cards.reduce((closest, child) => {
    const box    = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    }
    return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// ── List ───────────────────────────────────────────────────────────────────
function renderList(issues) {
  const lv = document.getElementById('list-view');
  lv.innerHTML = `
    <table class="list-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Severity</th>
          <th>Status</th>
          <th>Product</th>
          <th>Assignee</th>
        </tr>
      </thead>
      <tbody>
        ${issues.map(i => `
          <tr onclick="openDetail('${i.id}')">
            <td class="id-mono">${i.id}</td>
            <td style="font-weight:500;max-width:300px">${escHtml(i.title)}</td>
            <td>${sevBadge(i.sev)}</td>
            <td>${statusBadge(i.status)}</td>
            <td><span class="tag">${i.product}</span></td>
            <td>
              <div style="display:flex;align-items:center;gap:7px">
                ${avEl(i.assignee)}
                <span>${ASSIGNEES[i.assignee] || i.assignee}</span>
              </div>
            </td>
          </tr>`).join('')}
      </tbody>
    </table>`;
}

// ── Reports ────────────────────────────────────────────────────────────────
function renderReports(issues) {
  const rv    = document.getElementById('reports-view');
  const total = issues.length;
  const open  = issues.filter(i => i.status !== 'done').length;
  const done  = issues.filter(i => i.status === 'done').length;
  const wasps = issues.filter(i => i.sev === 6).length;

  const sevCounts    = [1,2,3,4,5,6].map(s => ({ ...SEV[s], count: issues.filter(i => i.sev === s).length }));
  const maxSev       = Math.max(...sevCounts.map(s => s.count), 1);
  const statusCounts = STATUS_COLS.map(c => ({ ...c, count: issues.filter(i => i.status === c.id).length }));
  const maxStat      = Math.max(...statusCounts.map(c => c.count), 1);

  rv.innerHTML = `
    <div class="reports-grid">
      <div class="stat-card">
        <div class="stat-label">Total bugs</div>
        <div class="stat-value">${total}</div>
        <div class="stat-sub">across all columns</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Open</div>
        <div class="stat-value" style="color:#D85A30">${open}</div>
        <div class="stat-sub">not yet resolved</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Done</div>
        <div class="stat-value" style="color:#1D9E75">${done}</div>
        <div class="stat-sub">${total ? Math.round(done/total*100) : 0}% completion</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Wasps 🐝</div>
        <div class="stat-value" style="color:#E24B4A">${wasps}</div>
        <div class="stat-sub">critical blockers</div>
      </div>
    </div>
    <div class="charts-grid">
      <div class="chart-card">
        <h3>Bugs by severity</h3>
        ${sevCounts.map(s => `
          <div class="bar-row">
            <div class="bar-label">${s.icon} ${s.label}</div>
            <div class="bar-track"><div class="bar-fill" style="width:${Math.round(s.count/maxSev*100)}%;background:${s.bar}"></div></div>
            <div class="bar-count">${s.count}</div>
          </div>`).join('')}
      </div>
      <div class="chart-card">
        <h3>Bugs by status</h3>
        ${statusCounts.map(c => `
          <div class="bar-row">
            <div class="bar-label">${c.label}</div>
            <div class="bar-track"><div class="bar-fill" style="width:${Math.round(c.count/maxStat*100)}%;background:${c.dot}"></div></div>
            <div class="bar-count">${c.count}</div>
          </div>`).join('')}
      </div>
    </div>`;
}

// ── Detail panel ───────────────────────────────────────────────────────────
function renderDetail(issue) {
  const s      = SEV[issue.sev];
  const others = STATUS_COLS.filter(c => c.id !== issue.status);

  document.getElementById('detail-panel').innerHTML = `
    <div class="modal-header">
      <span class="id-mono">${issue.id}</span>
      <div style="display:flex;gap:6px">
        <button class="icon-btn btn-danger" title="Delete bug" onclick="deleteIssue('${issue.id}')">
          <i class="fa-solid fa-trash-can"></i>
        </button>
        <button class="icon-btn" onclick="closeDetail()"><i class="fa-solid fa-xmark"></i></button>
      </div>
    </div>

    <h2 style="font-size:17px;font-weight:600;line-height:1.35;margin-bottom:12px;color:var(--text)">${escHtml(issue.title)}</h2>

    <div style="display:flex;gap:7px;flex-wrap:wrap;margin-bottom:16px">
      ${sevBadge(issue.sev)}
      ${statusBadge(issue.status)}
      <span class="badge" style="background:var(--surface2);color:var(--text2)">${issue.product}</span>
    </div>

    <div class="detail-sev-block" style="background:${s.bg}">
      <div class="detail-sev-icon">${s.icon}</div>
      <div>
        <div style="font-size:13.5px;font-weight:600;color:${s.text};margin-bottom:3px">${s.label} — ${s.sub}</div>
        <div style="font-size:12.5px;color:${s.text};opacity:0.85;line-height:1.5">${s.desc}</div>
      </div>
    </div>

    <div class="detail-desc">${escHtml(issue.desc || 'No description provided.')}</div>

    <div class="detail-grid">
      <div class="detail-field">
        <label>Assignee</label>
        <div style="display:flex;align-items:center;gap:7px;margin-top:5px">
          ${avEl(issue.assignee, 26)}
          <span>${ASSIGNEES[issue.assignee] || issue.assignee}</span>
        </div>
      </div>
      <div class="detail-field">
        <label>Product line</label>
        <p>${issue.product}</p>
      </div>
      <div class="detail-field">
        <label>Journey impact</label>
        <p style="color:${s.text};font-weight:600">${s.impact}</p>
      </div>
      <div class="detail-field">
        <label>Current status</label>
        <p>${STATUS_MAP[issue.status]?.label || issue.status}</p>
      </div>
    </div>

    <div class="move-section">
      <div class="move-label">Move to</div>
      <div class="move-grid">
        ${others.map(c => `
          <button class="move-btn" onclick="moveIssue('${issue.id}','${c.id}')">
            <span class="move-btn-dot" style="background:${c.dot}"></span>
            ${c.label}
          </button>`).join('')}
      </div>
    </div>`;
}

// ── Util ───────────────────────────────────────────────────────────────────
function escHtml(str = '') {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
