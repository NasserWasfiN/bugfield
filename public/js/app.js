// ── State ──────────────────────────────────────────────────────────────────
let issues      = [];
let currentView = 'board';

// ── Boot ───────────────────────────────────────────────────────────────────
async function init() {
  showLoading();
  issues = await API.getIssues();
  setView('board');
}

function showLoading() {
  document.getElementById('kanban-view').innerHTML =
    '<div class="loading"><div class="spinner"></div> Loading…</div>';
}

// ── Filtering ──────────────────────────────────────────────────────────────
function filtered() {
  const q  = document.getElementById('search').value.toLowerCase();
  const sf = document.getElementById('sev-filter').value;
  const af = document.getElementById('assignee-filter').value;
  const pf = document.getElementById('product-filter').value;

  return issues.filter(i => {
    if (q  && !i.title.toLowerCase().includes(q) && !i.id.toLowerCase().includes(q)) return false;
    if (sf && String(i.sev) !== sf) return false;
    if (af && i.assignee !== af)    return false;
    if (pf && i.product  !== pf)    return false;
    return true;
  });
}

// ── Render ─────────────────────────────────────────────────────────────────
function render() {
  const f = filtered();
  document.getElementById('issue-count').textContent = `${f.length} issue${f.length !== 1 ? 's' : ''}`;

  if      (currentView === 'board')   renderBoard(f);
  else if (currentView === 'list')    renderList(f);
  else                                renderReports(f);
}

// ── Views ──────────────────────────────────────────────────────────────────
function setView(v) {
  currentView = v;
  document.getElementById('kanban-view').style.display   = v === 'board'   ? 'flex'  : 'none';
  document.getElementById('list-view').style.display     = v === 'list'    ? 'block' : 'none';
  document.getElementById('reports-view').style.display  = v === 'reports' ? 'flex'  : 'none';
  document.getElementById('vb-board').className = 'view-btn' + (v === 'board' ? ' active' : '');
  document.getElementById('vb-list').className  = 'view-btn' + (v === 'list'  ? ' active' : '');
  render();
}

function setNav(el, page) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');
  const titles = { board: 'Bug Board', backlog: 'Backlog', reports: 'Reports' };
  document.getElementById('page-title').textContent = titles[page] || 'BugField';

  if      (page === 'backlog')  setView('list');
  else if (page === 'reports')  setView('reports');
  else                          setView('board');
}

// ── Create ─────────────────────────────────────────────────────────────────
function openCreate() {
  document.getElementById('create-modal').classList.add('open');
  document.getElementById('f-title').focus();
}

function closeCreate() {
  document.getElementById('create-modal').classList.remove('open');
}

async function saveIssue() {
  const title = document.getElementById('f-title').value.trim();
  if (!title) { document.getElementById('f-title').focus(); return; }

  const payload = {
    title,
    sev:      parseInt(document.getElementById('f-sev').value),
    status:   document.getElementById('f-status').value,
    product:  document.getElementById('f-product').value,
    assignee: document.getElementById('f-assignee').value,
    desc:     document.getElementById('f-desc').value.trim()
  };

  const created = await API.createIssue(payload);
  issues.unshift(created);
  closeCreate();
  document.getElementById('f-title').value = '';
  document.getElementById('f-desc').value  = '';
  render();
  showToast(`✓ ${created.id} created`);
}

// ── Detail ─────────────────────────────────────────────────────────────────
function openDetail(id) {
  const issue = issues.find(i => i.id === id);
  if (!issue) return;
  renderDetail(issue);
  document.getElementById('detail-overlay').classList.add('open');
}

function closeDetail() {
  document.getElementById('detail-overlay').classList.remove('open');
}

// Called from detail panel "Move to" buttons
async function moveIssue(id, status) {
  const issue = issues.find(i => i.id === id);
  if (!issue) return;
  await API.updateIssue(id, { status });
  issue.status = status;
  closeDetail();
  render();
  showToast(`↗ Moved to ${STATUS_MAP[status]?.label}`);
}

// Called from drag-and-drop (no modal to close)
async function moveIssueById(id, status) {
  const issue = issues.find(i => i.id === id);
  if (!issue || issue.status === status) return;
  await API.updateIssue(id, { status });
  issue.status = status;
  // Update column counts without full re-render to keep drag smooth
  STATUS_COLS.forEach(col => {
    const countEl = document.getElementById('count-' + col.id);
    if (countEl) countEl.textContent = issues.filter(i => i.status === col.id).length;
  });
  // Update issue-count badge
  const f = filtered();
  document.getElementById('issue-count').textContent = `${f.length} issue${f.length !== 1 ? 's' : ''}`;
  showToast(`↗ Moved to ${STATUS_MAP[status]?.label}`);
}

async function deleteIssue(id) {
  if (!confirm('Delete this bug? This cannot be undone.')) return;
  await API.deleteIssue(id);
  issues = issues.filter(i => i.id !== id);
  closeDetail();
  render();
  showToast('🗑 Bug deleted');
}

// ── Keyboard shortcuts ─────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeCreate(); closeDetail(); }
  if (e.key === 'n' && !e.target.matches('input,textarea,select')) openCreate();
});

// ── Start ──────────────────────────────────────────────────────────────────
init();
