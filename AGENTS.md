# CaseActive — AI Context Memory

> Last updated: 2026-05-03
> Purpose: Reduce token burn on project re-analysis. Feed this file first before asking questions.

---

## 1. What This Project Is

CaseActive is a client communication + case management SaaS for personal injury and mass tort law firms. It provides:
- Branded client portals ("Hubs")
- Automated case updates
- Role-based access (Admin, Staff, Client, Portal)
- Multi-step onboarding flow

---

## 2. Architecture (Two Codebases)

```
caseactive-sandbox/
├── STATIC PROTOTYPE (root)     # Vanilla HTML/CSS/JS — legacy prototypes
│   ├── index.html              # Identical to onboarding.html
│   ├── onboarding.html         # 5-step onboarding (dupe of index.html)
│   ├── onboarding.css          # ~18KB static styles
│   └── onboarding.js           # OTP, role selection, hub choice logic
│
├── OLDER PROTOTYPE
│   ├── style.css + script.js   # Simple auth card (unused)
│
└── REACT APP (onboarding-app/) # Production app
    ├── src/
    │   ├── main.jsx            # ReactDOM entry
    │   ├── App.jsx             # Step router (1–10), inline step components
    │   ├── index.css           # ALL styles (~58KB, monolithic)
    │   ├── demoData.js         # Demo accounts: admin@demo.com, staff@demo.com, client@demo.com, portal@demo.com (OTP=123456)
    │   ├── useDemoMode.js      # Demo state hook
    │   ├── DemoBanner.jsx      # "Demo Mode" banner UI
    │   ├── DevInspector.jsx    # Debug overlay
    │   ├── AdminDashboard.jsx  # Admin dashboard
    │   ├── StaffDashboard.jsx  # Staff dashboard
    │   ├── ClientDashboard.jsx # Client dashboard
    │   └── PortalDashboard.jsx # Portal dashboard (~48KB, largest file)
    ├── dist/                   # Pre-built Vite output
    └── package.json            # React 19.2.4 + Vite 8
```

**Rule of thumb:** If editing UI, work in `onboarding-app/src/`. Root HTML files are dead prototypes.

---

## 3. Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 19 (JSX, no TS) |
| Build | Vite 8 |
| Router | None. Integer `step` state (1–10) |
| State | React hooks only (`useState`, `useEffect`) |
| Styling | One global CSS file (`index.css`) |
| Backend | None mocked yet. All auth/data is client-side demo |
| Deploy | Firebase Hosting + Vercel (both SPA rewrite → index.html) |

---

## 4. Key Conventions

### Step Numbers → Meaning
| Step | Content |
|------|---------|
| 1 | Auth (signup/signin toggle) |
| 2 | OTP verification |
| 3 | Role selection (admin / staff / client) |
| 4 | Hub setup (create vs join) |
| 5 | Onboarding success |
| 6 | Sign-in success (existing users) |
| 7 | AdminDashboard |
| 8 | StaffDashboard |
| 9 | ClientDashboard |
| 10 | PortalDashboard |

### Role Strings
- `admin` — can create hubs, sees practice areas
- `staff` — must join existing hub
- `client` — must join, no practice areas, sees case updates
- `portal` — special external portal view

### Demo Mode
- Triggered by demo emails + OTP `123456`
- Sets `isDemoActive=true`, pre-fills dashboard data
- `DemoBanner` shows at top; exit resets to step 1

### State Shape (App.jsx)
```js
step: 10
mode: 'signup' | 'signin'
email: string
role: 'admin' | 'staff' | 'client'
practiceAreas: string[]
hubChoice: 'create' | 'join'
joinMethod: 'search' | 'invite'
otp: ['1','2','3','4','5','6']
```

---

## 5. File Hotspots

| File | Size | Notes |
|------|------|-------|
| `App.jsx` | ~25KB | Inline 6 step components. Very long. |
| `PortalDashboard.jsx` | ~48KB | Largest component. Likely monolithic. |
| `index.css` | ~58KB | All app styles. No CSS modules. |
| `onboarding.css` | ~18KB | Dead code (static prototype). |

**If asked to refactor:** Break `App.jsx` into `pages/Step{1-6}.jsx`. Split `index.css` by component or adopt Tailwind.

---

## 6. Known Issues

1. **Duplicate root HTML files** — `index.html` and `onboarding.html` are identical. Both dead.
2. **No real router** — URL never changes; back button doesn't work.
3. **No tests** — No Jest/Vitest/Playwright.
4. **No TypeScript** — Pure JSX.
5. **No API layer** — All data is mocked/demo.
6. **Accessibility gaps** — Inline SVGs often lack labels; no focus trap on step change.
7. **Monolithic CSS** — Single 58KB file.

---

## 7. Build & Deploy

```bash
cd onboarding-app
npm install
npm run dev      # localhost dev
npm run build    # outputs to dist/
npm run preview  # preview build
```

- **Firebase:** Serves `onboarding-app/dist`, SPA rewrite.
- **Vercel:** Build command `cd onboarding-app && npm install && npm run build`, output `onboarding-app/dist`.

---

## 8. Quick Commands

```bash
# List all source files (ignore node_modules)
find onboarding-app/src -type f | sort

# Check bundle size
npm run build && du -sh onboarding-app/dist

# Lint
npm run lint
```

---

## 9. When Editing

- Prefer editing files in `onboarding-app/src/`
- Avoid touching root-level `*.html`, `onboarding.css`, `onboarding.js`, `style.css`, `script.js`
- If adding a new step, update `App.jsx` step router and increment step constants
- If adding styles, either append to `index.css` (current pattern) or create a new `.css` file and import it

---

*End of memory file. Feed this before asking codebase questions.*
