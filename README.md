# 🐛 BugField — Insurance Platform Bug Tracker

A Jira-style bug tracker built around the **Product Bug Field Guide** severity taxonomy.

## 🚀 Run locally

```bash
npm install
npm start
# → http://localhost:3000
```

For auto-restart on file changes:
```bash
npm run dev
```

## 📁 Project structure

```
bugfield/
├── server/
│   ├── index.js            # Express entry point
│   └── routes/
│       └── issues.js       # REST API
├── public/
│   ├── index.html
│   ├── css/main.css
│   └── js/
│       ├── data.js         # Constants (severity, status, team)
│       ├── api.js          # Fetch layer
│       ├── ui.js           # Rendering + drag & drop
│       └── app.js          # App controller
├── render.yaml             # Render.com deployment config
├── .gitignore
└── package.json
```

## 🌐 Deploy to Render (free)

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Render auto-detects `render.yaml` and deploys
5. You get a live URL like `https://bugfield.onrender.com`

## 🐞 Severity scale

| Level | Name | Journey Impact |
|-------|------|----------------|
| 1 🐞 | Ladybug | None or negligible |
| 2 🐜 | Ant | Low |
| 3 🦟 | Mosquito | Low to moderate |
| 4 🪲 | Stink Bug | Moderate |
| 5 🦌 | Stag Beetle | High |
| 6 🐝 | Wasp | Critical |

## ⌨️ Keyboard shortcuts

| Key | Action |
|-----|--------|
| `N` | Open "Log Bug" form |
| `Esc` | Close any modal |
