// ── Severity definitions ───────────────────────────────────────────────────
const SEV = {
  1: { icon: '🐞', label: 'Ladybug',     sub: 'Cosmetic',             bg: '#EAF3DE', text: '#27500A', bar: '#639922', impact: 'None or negligible', desc: 'Minor UI issue. Most customers barely notice it, ignore it, and still complete their journey.' },
  2: { icon: '🐜', label: 'Ant',         sub: 'Small Friction',       bg: '#E1F5EE', text: '#085041', bar: '#1D9E75', impact: 'Low',               desc: 'A small nuisance that causes a little extra effort, but the user still reaches their goal.' },
  3: { icon: '🦟', label: 'Mosquito',    sub: 'Annoying Repeater',    bg: '#FAEEDA', text: '#633806', bar: '#EF9F27', impact: 'Low to moderate',   desc: 'Noticeable and irritating. The journey continues, but repeated exposure starts to wear on customers.' },
  4: { icon: '🪲', label: 'Stink Bug',   sub: 'Confusing Experience', bg: '#FAECE7', text: '#4A1B0C', bar: '#D85A30', impact: 'Moderate',          desc: 'The product still works, but the behavior feels off and can create hesitation, confusion, or support questions.' },
  5: { icon: '🦌', label: 'Stag Beetle', sub: 'Journey Interruption', bg: '#F5C4B3', text: '#712B13', bar: '#993C1D', impact: 'High',              desc: 'A bug that interrupts the journey or throws an error. Customers may need to retry, refresh, or find a workaround.' },
  6: { icon: '🐝', label: 'Wasp',        sub: 'Critical Blocker',     bg: '#FCEBEB', text: '#501313', bar: '#E24B4A', impact: 'Critical',          desc: 'A severe bug that blocks the objective, causes abandonment, or creates major trust and business impact.' }
};

// ── Status columns ─────────────────────────────────────────────────────────
const STATUS_COLS = [
  { id: 'todo',          label: 'To Do',         dot: '#B4B2A9' },
  { id: 'inprogress',    label: 'In Progress',    dot: '#378ADD' },
  { id: 'configreview',  label: 'Config Review',  dot: '#EF9F27' },
  { id: 'readyqa',       label: 'Ready for QA',   dot: '#1D9E75' },
  { id: 'inqa',          label: 'In QA',          dot: '#7F77DD' },
  { id: 'failedqa',      label: 'Failed QA',      dot: '#E24B4A' },
  { id: 'blocked',       label: 'Blocked',        dot: '#D85A30' },
  { id: 'poreview',      label: 'PO Review',      dot: '#D4537E' },
  { id: 'done',          label: 'Done',           dot: '#639922' }
];

const STATUS_MAP = {};
STATUS_COLS.forEach(c => STATUS_MAP[c.id] = c);

const STATUS_BADGE = {
  todo:          ['#F1EFE8', '#5F5E5A'],
  inprogress:    ['#E6F1FB', '#0C447C'],
  configreview:  ['#FAEEDA', '#633806'],
  readyqa:       ['#EAF3DE', '#27500A'],
  inqa:          ['#EEEDFE', '#3C3489'],
  failedqa:      ['#FCEBEB', '#501313'],
  blocked:       ['#FAECE7', '#4A1B0C'],
  poreview:      ['#FBEAF0', '#72243E'],
  done:          ['#EAF3DE', '#085041']
};

// ── Team ───────────────────────────────────────────────────────────────────
const ASSIGNEES = {
  NA:  'Nasser',
  FA:  'Farooq',
  AE:  'Amir E',
  AM:  'Amir M',
  AN:  'Ann',
  US:  'Usama',
  AS:  'Ashley',
  JE:  'Jessica',
  HA:  'Haadi',
  ANS: 'Anas',
  KE:  'Kelsey'
};

// Avatar palette — each person gets a unique colour pair [bg, text]
const AV_COLORS = {
  NA:  ['#dcf5ec', '#085041'],
  FA:  ['#deeefb', '#0C447C'],
  AE:  ['#faeeda', '#633806'],
  AM:  ['#fbeaf0', '#72243E'],
  AN:  ['#eeedfe', '#3C3489'],
  US:  ['#faece7', '#4A1B0C'],
  AS:  ['#eaf3de', '#27500A'],
  JE:  ['#fdf0ea', '#993C1D'],
  HA:  ['#f0f0fb', '#2D2D8C'],
  ANS: ['#fef3d0', '#7A4E00'],
  KE:  ['#f5eaf5', '#5C1A6B']
};
