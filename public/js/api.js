// ── API layer — all server communication goes here ──────────────────────────
const API = {
  async getIssues() {
    const res = await fetch('/api/issues');
    return res.json();
  },
  async createIssue(data) {
    const res = await fetch('/api/issues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async updateIssue(id, data) {
    const res = await fetch(`/api/issues/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async deleteIssue(id) {
    const res = await fetch(`/api/issues/${id}`, { method: 'DELETE' });
    return res.json();
  }
};
