const router = require('express').Router();

let issues = [
  { id: 'BF-001', title: 'Misaligned quote summary icon on HAB step 3',             sev: 1, status: 'todo',         product: 'HAB',  assignee: 'AS',  desc: 'The shield icon on HAB step 3 quote summary is 2px off-centre. No journey impact.' },
  { id: 'BF-002', title: 'RQB confirmation label unclear after policy bind',         sev: 2, status: 'inprogress',   product: 'Auto', assignee: 'NA',  desc: 'Label reads "Submitted" but agents expect "Bound". Causes ~1 support call per day.' },
  { id: 'BF-003', title: 'Validation toast repeats on every keystroke in Guidewire', sev: 3, status: 'configreview', product: 'Auto', assignee: 'FA',  desc: 'The "Required field" toast fires on each keystroke rather than on blur. Noticeable for power users entering VIN.' },
  { id: 'BF-004', title: 'EEP embedded widget shows stale state after refresh',      sev: 4, status: 'readyqa',     product: 'Both', assignee: 'AE',  desc: 'After page refresh the EEP Unqork widget retains previous session state, confusing agents about quote status.' },
  { id: 'BF-005', title: 'CHAP migration: save fails silently on timeout',           sev: 5, status: 'inqa',        product: 'Both', assignee: 'AM',  desc: 'During CHAP data migration the Salesforce save occasionally times out without surfacing an error. Agent must retry manually.' },
  { id: 'BF-006', title: 'Payment gateway returns 500 on HAB multi-property bind',  sev: 6, status: 'blocked',     product: 'HAB',  assignee: 'NA',  desc: 'Critical: multi-property HAB bind triggers a 500 from the payment gateway. Policy cannot be completed. Quote lost.' },
  { id: 'BF-007', title: 'Partners onboarding form skips postal code validation',    sev: 3, status: 'failedqa',   product: 'Auto', assignee: 'KE',  desc: 'Postal code field accepts invalid formats, causing downstream Guidewire lookup failures.' },
  { id: 'BF-008', title: 'SSO login failure for agents after CHAP cutover',          sev: 6, status: 'poreview',   product: 'Both', assignee: 'US',  desc: 'Post-CHAP migration SSO login fails for ~12% of agents. Complete blocker — no workaround.' },
  { id: 'BF-009', title: 'HAB deductible options not persisting on back navigation', sev: 4, status: 'done',       product: 'HAB',  assignee: 'JE',  desc: 'Navigating back in the HAB quoting flow resets the deductible selection to default.' }
];

let idSeq = 109;
function nextId() {
  idSeq++;
  return 'BF-' + String(idSeq).padStart(3, '0');
}

router.get('/issues', (req, res) => res.json(issues));

router.get('/issues/:id', (req, res) => {
  const issue = issues.find(i => i.id === req.params.id);
  if (!issue) return res.status(404).json({ error: 'Not found' });
  res.json(issue);
});

router.post('/issues', (req, res) => {
  const { title, sev, status, product, assignee, desc } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  const issue = { id: nextId(), title, sev: Number(sev), status, product, assignee, desc: desc || '' };
  issues.unshift(issue);
  res.status(201).json(issue);
});

router.patch('/issues/:id', (req, res) => {
  const issue = issues.find(i => i.id === req.params.id);
  if (!issue) return res.status(404).json({ error: 'Not found' });
  Object.assign(issue, req.body);
  res.json(issue);
});

router.delete('/issues/:id', (req, res) => {
  const idx = issues.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  issues.splice(idx, 1);
  res.json({ ok: true });
});

module.exports = router;
