const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// Serve everything in /public as static files
app.use(express.static(path.join(__dirname, '../public')));

// API routes (data layer — ready for future DB integration)
app.use(express.json());
app.use('/api', require('./routes/issues'));

// Catch-all: send index.html for any unknown route (SPA-ready)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🐛 BugField running at http://localhost:${PORT}\n`);
});
