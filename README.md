# 🐛 BugField — Insurance Platform Bug Tracker

A Jira-style bug tracker built around the **Product Bug Field Guide** severity taxonomy.

> ⚠️ **GitHub Pages will NOT work** — this app needs a Node.js server. Deploy to Render instead (free).

## 🌐 Deploy to Render (free live URL)

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → sign up with GitHub
3. Click **New → Web Service**
4. Select your `bugfield` repo
5. Render detects `render.yaml` automatically → click **Deploy**
6. Live in ~2 min at `https://bugfield.onrender.com` ✅

## 🖥 Run locally

```bash
npm install
npm start
# → http://localhost:3000
```

## 📁 Structure

```
bugfield/
├── server/
│   ├── index.js
│   └── routes/issues.js
├── public/
│   ├── index.html
│   ├── css/main.css
│   └── js/
│       ├── data.js
│       ├── api.js
│       ├── ui.js
│       └── app.js
├── render.yaml
└── package.json
```

## 🐞 Severity scale

| Level | Name | Impact |
|-------|------|--------|
| 1 🐞 | Ladybug | None |
| 2 🐜 | Ant | Low |
| 3 🦟 | Mosquito | Low–Moderate |
| 4 🪲 | Stink Bug | Moderate |
| 5 🦌 | Stag Beetle | High |
| 6 🐝 | Wasp | Critical |
