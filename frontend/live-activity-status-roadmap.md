# Live Activity Status Widget — Complete Implementation Roadmap

## Context for the Agent

**Project:** Arya Deep Singh's portfolio website
**Frontend stack:** React + TypeScript + Tailwind CSS (Vite/CRA, no Next.js — no built-in API routes)
**Backend stack:** Standalone Node.js + Express + PostgreSQL (Sequelize or Prisma ORM)
**Goal:** Build a "Live Status" widget on the portfolio that shows what Arya is currently doing in real life (e.g. "Driving", "Scrolling Reels", "Coding", "Listening to Music"), updated automatically via iOS Shortcuts automations that fire HTTP requests whenever certain apps/events trigger on his phone.

**End result:** A small live-updating badge/card on the portfolio (inspired by the existing terminal-style `main.ts` code block aesthetic already on the site) that says something like:

```
● NOW   🚗 Driving
   updated 2 min ago
```

This polls the backend every N seconds and updates without a page refresh.

---

## Architecture Diagram

```
┌─────────────────┐       HTTPS POST        ┌──────────────────────┐
│  iPhone          │ ───────────────────────▶│  Express API         │
│  (Shortcuts      │   Authorization: Bearer │  POST /api/activity  │
│   Automation)    │   { status, app, icon } │                      │
└─────────────────┘                          │  PostgreSQL          │
                                              │  (activity_status)   │
┌─────────────────┐       HTTPS GET          │                      │
│  Portfolio       │ ───────────────────────▶│  GET /api/activity   │
│  React Widget    │◀─────────────────────── │  (public, no auth)   │
│  (polls every    │   { status, icon, ts }  │                      │
│   15-30s)        │                         └──────────────────────┘
└─────────────────┘
```

Two trust boundaries:
- **Write endpoint** (`POST /api/activity`) — must be protected with a secret token, since it's exposed to the public internet and anyone could spam fake statuses onto your live portfolio if unprotected.
- **Read endpoint** (`GET /api/activity`) — public, read-only, safe to expose to anyone visiting the site.

---

## Phase 1 — Backend Setup (Node.js + Express + PostgreSQL)

### 1.1 Folder structure (inside your existing portfolio repo)

```
arya-portfolio/
├── src/                     ← existing React app
├── backend/                 ← NEW folder
│   ├── src/
│   │   ├── server.ts
│   │   ├── db.ts
│   │   ├── routes/
│   │   │   └── activity.routes.ts
│   │   ├── controllers/
│   │   │   └── activity.controller.ts
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts
│   │   ├── models/
│   │   │   └── activityStatus.model.ts
│   │   └── config/
│   │       └── env.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
└── package.json             ← existing frontend package.json
```

Keeping backend in its own subfolder with its own `package.json` means it deploys/runs independently of the Vite/CRA frontend build.

### 1.2 Initialize backend

```bash
mkdir backend && cd backend
npm init -y
npm install express cors dotenv pg sequelize
npm install -D typescript ts-node-dev @types/node @types/express @types/cors
npx tsc --init
```

`backend/tsconfig.json` — set these key options:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"]
}
```

### 1.3 Environment variables

`backend/.env`:

```
PORT=4000
DATABASE_URL=postgres://user:password@localhost:5432/portfolio_db
ACTIVITY_SECRET=generate_a_long_random_string_here
ALLOWED_ORIGIN=https://arya-portfolio-mu.vercel.app
NODE_ENV=production
```

Generate a strong secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Important:** Never commit `.env`. Add `backend/.env` to `.gitignore`.

### 1.4 Database connection — `backend/src/db.ts`

```typescript
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production'
      ? { require: true, rejectUnauthorized: false }
      : false,
  },
});

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};
```

### 1.5 Model — `backend/src/models/activityStatus.model.ts`

```typescript
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db';

export interface ActivityStatusAttributes {
  id: number;
  statusLabel: string;
  appName: string | null;
  icon: string | null;
  startedAt: Date;
  isActive: boolean;
}

class ActivityStatus extends Model<ActivityStatusAttributes> {}

ActivityStatus.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    statusLabel: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    appName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    icon: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    startedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'activity_status',
    timestamps: false,
  }
);

export default ActivityStatus;
```

Run a sync/migration once on startup (for a small personal project, `sequelize.sync()` is fine — no need for full migration tooling unless you want it):

```typescript
// in server.ts, after testConnection()
await sequelize.sync();
```

### 1.6 Auth middleware — `backend/src/middleware/auth.middleware.ts`

This protects the write endpoint. iOS Shortcuts will send the secret as a Bearer token.

```typescript
import { Request, Response, NextFunction } from 'express';

export const requireSecret = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const expected = `Bearer ${process.env.ACTIVITY_SECRET}`;

  if (!authHeader || authHeader !== expected) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
};
```

### 1.7 Controller — `backend/src/controllers/activity.controller.ts`

```typescript
import { Request, Response } from 'express';
import ActivityStatus from '../models/activityStatus.model';

const ALLOWED_STATUSES = new Set([
  'Driving',
  'Scrolling Reels',
  'Coding',
  'Listening to Music',
  'In a Meeting',
  'Gaming',
  'Reading',
  'Sleeping',
  'Offline',
]);

export const setActivity = async (req: Request, res: Response) => {
  try {
    const { statusLabel, appName, icon } = req.body;

    if (!statusLabel || typeof statusLabel !== 'string') {
      return res.status(400).json({ error: 'statusLabel is required' });
    }

    // Optional safety: only allow known statuses so a leaked token
    // can't be used to post arbitrary text onto your live site
    if (!ALLOWED_STATUSES.has(statusLabel)) {
      return res.status(400).json({ error: 'Unknown statusLabel' });
    }

    // deactivate any currently active status
    await ActivityStatus.update(
      { isActive: false },
      { where: { isActive: true } }
    );

    const created = await ActivityStatus.create({
      statusLabel,
      appName: appName ?? null,
      icon: icon ?? null,
      startedAt: new Date(),
      isActive: true,
    } as any);

    return res.status(201).json(created);
  } catch (err) {
    console.error('setActivity error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getActivity = async (_req: Request, res: Response) => {
  try {
    const current = await ActivityStatus.findOne({
      where: { isActive: true },
      order: [['startedAt', 'DESC']],
    });

    if (!current) {
      return res.json({
        statusLabel: 'Offline',
        icon: '💤',
        startedAt: null,
      });
    }

    return res.json(current);
  } catch (err) {
    console.error('getActivity error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
```

**Why the `ALLOWED_STATUSES` whitelist matters:** your secret token will live inside the iOS Shortcuts app on your phone. If your phone is ever lost/unlocked or the token leaks, this whitelist stops someone from posting arbitrary/embarrassing text onto your public portfolio — they can only pick from statuses you've predefined.

### 1.8 Routes — `backend/src/routes/activity.routes.ts`

```typescript
import { Router } from 'express';
import { setActivity, getActivity } from '../controllers/activity.controller';
import { requireSecret } from '../middleware/auth.middleware';

const router = Router();

router.post('/activity', requireSecret, setActivity);
router.get('/activity', getActivity);

export default router;
```

### 1.9 Server entry — `backend/src/server.ts`

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection, sequelize } from './db';
import activityRoutes from './routes/activity.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN, // your portfolio domain
    methods: ['GET', 'POST'],
  })
);

app.use('/api', activityRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const start = async () => {
  await testConnection();
  await sequelize.sync();
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

start();
```

### 1.10 Rate limiting (recommended)

Since this endpoint is internet-facing, add basic rate limiting so it can't be hammered:

```bash
npm install express-rate-limit
```

```typescript
import rateLimit from 'express-rate-limit';

const activityLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // generous, since legit automations won't fire more than a few times a minute
});

app.use('/api/activity', activityLimiter);
```

### 1.11 Local testing

```bash
cd backend
npm run dev   # or: npx ts-node-dev src/server.ts
```

Test with curl:

```bash
# Set status
curl -X POST http://localhost:4000/api/activity \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SECRET_HERE" \
  -d '{"statusLabel": "Driving", "icon": "🚗", "appName": "CarPlay"}'

# Read status
curl http://localhost:4000/api/activity
```

### 1.12 Deployment

Since the frontend is on Vercel (static React build) but this is a stateful Express + Postgres backend, Vercel serverless functions aren't a great fit. Recommended:

- **Railway** or **Render** — easiest for a small Express + Postgres app, free/cheap tier, auto-deploys from GitHub
- Or reuse the same VPS infrastructure you already run for `lms.tinkergyan.in` (HostITSmart, Ubuntu 24.04, Nginx reverse proxy, PM2/Docker) — you already know this stack well

Steps for VPS-based deploy (since you've done this before for Tinkergyan):
1. `git pull` backend folder onto VPS
2. `npm install && npm run build` (compile TS → `dist/`)
3. Run with PM2: `pm2 start dist/server.js --name activity-api`
4. Nginx reverse proxy: `api-status.yourdomain.com` → `localhost:4000`
5. Let's Encrypt SSL via Certbot (same as your LMS setup)
6. Set env vars on the server (`.env` file, not committed)

---

## Phase 2 — iOS Shortcuts Automation Setup

No app needed. iOS Shortcuts can fire HTTP requests automatically on triggers.

### 2.1 Enable automations to run without confirmation

Settings → Shortcuts → toggle off "Ask Before Running" for automations (otherwise iOS will prompt you every time, defeating the "automatic" part).

### 2.2 Automation: Instagram opened → "Scrolling Reels"

1. Open **Shortcuts** app → **Automation** tab → tap **+**
2. Choose **App**
3. Select **Instagram**, choose **Is Opened**
4. Toggle off "Notify When Run"
5. Tap **Next** → **Add Action**
6. Search and add **Get Contents of URL**
7. Configure:
   - URL: `https://api-status.yourdomain.com/api/activity`
   - Method: `POST`
   - Headers:
     - `Content-Type: application/json`
     - `Authorization: Bearer YOUR_SECRET_HERE`
   - Request Body → JSON:
     ```json
     {
       "statusLabel": "Scrolling Reels",
       "appName": "Instagram",
       "icon": "📱"
     }
     ```
8. Tap **Done**. Set **Run Immediately** (not "Notify").

### 2.3 Automation: CarPlay connected → "Driving"

1. New Automation → **CarPlay** → "Is Connected"
2. Same "Get Contents of URL" action with body:
   ```json
   { "statusLabel": "Driving", "appName": "CarPlay", "icon": "🚗" }
   ```

### 2.4 Automation: Spotify/Music opened → "Listening to Music"

Same pattern, trigger = App Opened = Spotify, body:
```json
{ "statusLabel": "Listening to Music", "appName": "Spotify", "icon": "🎵" }
```

### 2.5 Automation: VS Code / coding (Mac side, not iOS)

This one isn't a phone event — it's your Mac. Use a tiny shell script + `launchd` (cron-like scheduler on macOS) that checks the frontmost app every couple of minutes and posts "Coding" if it's VS Code or your terminal.

`~/scripts/check-coding-status.sh`:

```bash
#!/bin/bash
FRONT_APP=$(osascript -e 'tell application "System Events" to get name of first application process whose frontmost is true')

if [[ "$FRONT_APP" == "Code" || "$FRONT_APP" == "Terminal" || "$FRONT_APP" == "iTerm2" ]]; then
  curl -s -X POST https://api-status.yourdomain.com/api/activity \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer YOUR_SECRET_HERE" \
    -d '{"statusLabel": "Coding", "appName": "'"$FRONT_APP"'", "icon": "💻"}' \
    > /dev/null
fi
```

Make executable and schedule via `launchd` (every 5 minutes), or simpler — use **Cron** via `crontab -e`:

```
*/5 * * * * /bin/bash ~/scripts/check-coding-status.sh
```

### 2.6 Fallback / "Offline" expiry (important UX detail)

If you close all apps and go silent, the last status will stay stuck forever (e.g. "Driving" 6 hours later). Two options:

- **Option A (simple, recommended):** On the backend, in `getActivity`, check if `startedAt` is older than e.g. 30 minutes — if so, return `"Offline"` instead of the stale status:

```typescript
export const getActivity = async (_req: Request, res: Response) => {
  const current = await ActivityStatus.findOne({
    where: { isActive: true },
    order: [['startedAt', 'DESC']],
  });

  const STALE_MS = 30 * 60 * 1000; // 30 min
  const isStale =
    !current || Date.now() - new Date(current.get('startedAt') as Date).getTime() > STALE_MS;

  if (isStale) {
    return res.json({ statusLabel: 'Offline', icon: '💤', startedAt: null });
  }

  return res.json(current);
};
```

- **Option B:** Add a Shortcuts automation on "Screen Locked" / "Device goes idle" that explicitly posts `"Offline"`. More setup, more accurate.

Start with Option A — it's a one-line guard and covers 90% of cases.

---

## Phase 3 — Frontend Widget (React + TypeScript + Tailwind)

### 3.1 Component file — `src/components/LiveStatusWidget.tsx`

Matches the existing terminal-card aesthetic (rounded corners, mac-style dots, monospace) already used in your hero section's `main.ts` block.

```tsx
import { useEffect, useState } from 'react';

interface ActivityData {
  statusLabel: string;
  icon: string | null;
  startedAt: string | null;
}

const API_URL = 'https://api-status.yourdomain.com/api/activity';
const POLL_INTERVAL_MS = 20000; // 20 seconds

function timeAgo(dateString: string | null): string {
  if (!dateString) return '';
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins === 1) return '1 min ago';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  return `${hours}h ago`;
}

export default function LiveStatusWidget() {
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchActivity = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        if (isMounted) {
          setActivity(data);
          setLoading(false);
        }
      } catch (err) {
        // fail silently — keep last known state, don't break the page
        console.error('Failed to fetch activity status', err);
        setLoading(false);
      }
    };

    fetchActivity();
    const interval = setInterval(fetchActivity, POLL_INTERVAL_MS);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-md px-4 py-3 font-mono text-sm w-fit">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <span className="text-gray-400 tracking-wider text-xs">NOW</span>
      </div>

      <div className="mt-1.5 flex items-center gap-2">
        {loading ? (
          <span className="text-gray-500">loading…</span>
        ) : (
          <>
            <span className="text-base">{activity?.icon ?? '💤'}</span>
            <span className="text-white">{activity?.statusLabel ?? 'Offline'}</span>
          </>
        )}
      </div>

      {activity?.startedAt && (
        <div className="mt-1 text-[11px] text-gray-500">
          {timeAgo(activity.startedAt)}
        </div>
      )}
    </div>
  );
}
```

### 3.2 Where to place it

Given your current hero layout (name + tagline on the left, terminal `main.ts` card on the right), the most natural spot is **just below or beside the terminal card** — small, understated, not competing with the main code-block signature element. Example placement in your hero section:

```tsx
<div className="flex flex-col gap-4">
  <TerminalCodeBlock />      {/* existing main.ts block */}
  <LiveStatusWidget />       {/* new widget, same width, stacked below */}
</div>
```

Keep it small and quiet — per your existing design restraint (dark minimal theme), this should read as a subtle live detail, not a flashy gimmick.

### 3.3 Environment variable for API URL

Don't hardcode the URL. In Vite, create `.env`:

```
VITE_ACTIVITY_API_URL=https://api-status.yourdomain.com/api/activity
```

Update the component:

```tsx
const API_URL = import.meta.env.VITE_ACTIVITY_API_URL;
```

(If using CRA instead of Vite, use `process.env.REACT_APP_ACTIVITY_API_URL` and prefix with `REACT_APP_`.)

### 3.4 Edge case: CORS

Your Express backend's `cors()` config (Phase 1.9) must allow your Vercel domain (`https://arya-portfolio-mu.vercel.app`) as the `origin`. If you later add a custom domain, update `ALLOWED_ORIGIN` in the backend `.env`.

---

## Phase 4 — Testing Checklist

- [ ] `POST /api/activity` without auth header → returns 401
- [ ] `POST /api/activity` with wrong secret → returns 401
- [ ] `POST /api/activity` with valid secret + valid status → returns 201, new row created, old row `isActive = false`
- [ ] `POST /api/activity` with a status NOT in the whitelist → returns 400
- [ ] `GET /api/activity` with no status ever set → returns `{ statusLabel: "Offline" }`
- [ ] `GET /api/activity` with a status older than 30 min → returns `{ statusLabel: "Offline" }` (staleness check)
- [ ] Frontend widget renders correctly with no backend running (fails gracefully, shows last known/Offline, doesn't crash page)
- [ ] iOS Shortcut automation actually fires when Instagram opens (test on real device — Shortcuts simulator behavior can differ)
- [ ] CORS allows requests from your live Vercel domain, blocks others

---

## Phase 5 — Future Enhancements (optional, not required for v1)

- Replace polling with **WebSockets** (Socket.IO) for instant updates instead of 20s polling delay
- Add a small history log: "Last 5 activities" instead of just current one
- Add Apple Health / location-based automatic "Driving" detection (via CoreMotion) if you ever build a companion app instead of relying on CarPlay-only trigger
- Add an admin-only manual override button (a tiny hidden page only you can access, in case automations fail and you want to set status by hand)

---

## Summary for the Agent

Build in this exact order:
1. Express + PostgreSQL backend in `/backend` folder (Phase 1)
2. Deploy backend to Railway/Render/VPS, get a live HTTPS URL
3. Set up iOS Shortcuts automations pointing at that live URL (Phase 2)
4. Build `LiveStatusWidget.tsx` in the React frontend, poll the public `GET` endpoint (Phase 3)
5. Run through the testing checklist (Phase 4) before considering it done
