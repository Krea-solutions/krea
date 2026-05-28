# KREA — Creative Technology Studio

Production-grade Next.js 15 site for KREA agency. Cinematic dark/blue aesthetic with orange accents, RU/EN auto-localization, Telegram-integrated lead form, and a hidden admin panel.

---

## Stack

- **Next.js 15** (App Router, Server Components, Edge-ready middleware)
- **React 18**
- **TypeScript**
- **TailwindCSS 3.4**
- **next-intl** (i18n with auto-detection by IP country + browser locale)
- **jose** (JWT auth for admin)
- **bcryptjs** (password hashing)
- File-based JSON storage in `./data` for leads & settings (zero DB needed)

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Copy env and configure
cp .env.local.example .env.local
# Edit .env.local — see "Environment" below

# 3. Generate an admin password hash
node -e "console.log(require('bcryptjs').hashSync('YOUR_PASSWORD_HERE', 10))"
# Paste the output into ADMIN_PASSWORD_HASH in .env.local

# 4. Run
npm run dev
```

Open `http://localhost:3000`.

---

## Environment (`.env.local`)

| Variable | Description |
|---|---|
| `TELEGRAM_BOT_TOKEN` | From [@BotFather](https://t.me/BotFather). Create a bot, copy the token. |
| `TELEGRAM_CHAT_ID` | Your personal ID, a group ID (negative number), or a channel. To get your ID, message [@userinfobot](https://t.me/userinfobot). For a group: add your bot, send a message, then visit `https://api.telegram.org/bot<TOKEN>/getUpdates`. |
| `ADMIN_USERNAME` | Admin login username |
| `ADMIN_PASSWORD_HASH` | bcrypt hash of your admin password (see step 3 above) |
| `JWT_SECRET` | A long random string (32+ chars). Generate: `openssl rand -base64 48` |
| `NEXT_PUBLIC_SITE_URL` | Optional, used for OG metadata |

---

## Lead flow

1. Visitor fills the form on `/#contact`
2. `POST /api/leads` validates input, stores it in `data/leads.json`
3. Server immediately calls Telegram Bot API → message arrives in your chat
4. Admin can view, mark read, archive, delete in the panel

Validation: required name/contact/message, contact must be a valid email, `@telegram`, or phone. Honeypot field + per-IP rate limit (5 submissions/minute).

---

## Admin panel — hidden

URL: `/kr-control-7x4q` (obscured, not linked anywhere on the public site)

- The path is `noindex, nofollow` (won't be indexed by search engines)
- Protected by JWT cookie middleware
- Login attempts rate-limited (8/15min per IP)
- Sessions last 7 days

**Want to change the URL?** Rename the folder `src/app/kr-control-7x4q` to whatever you want (e.g. `src/app/my-secret-path-9k2x`) and update the constants in `src/middleware.ts` and the redirects in `src/app/kr-control-7x4q/login/page.tsx` and `src/app/kr-control-7x4q/page.tsx`.

Admin features:
- **Leads** — list, filter (all/new/read/archived), detail view, status changes, delete
- **Stats** — total/7d/30d, 14-day timeline chart, breakdown by status/locale/budget
- **Settings** — toggle Telegram notifications, auto-reply, email signature

---

## i18n / localization

Languages: **English** (default) and **Russian**.

Detection priority:
1. `krea_locale` cookie (manual switcher persists here)
2. `x-vercel-ip-country` / `cf-ipcountry` header — Russian if country is RU/BY/KZ/KG/UZ/TJ/AM/AZ/TM/MD/UA
3. `Accept-Language` header — Russian if it includes ru/be/kk/uk/ky/tg/uz/az/hy
4. English

Switching language is via the EN/RU toggle in the nav.

To add a language: copy `src/messages/en.json` → `src/messages/<code>.json`, translate, add the code to `SUPPORTED_LOCALES` in `src/i18n/request.ts`.

---

## Deployment

### Vercel (recommended)

```bash
npm i -g vercel
vercel
```

Add the env vars in the Vercel dashboard. Vercel sets `x-vercel-ip-country` automatically, so country-based locale detection works out of the box.

**Important:** The default file-based storage (`data/*.json`) won't persist on Vercel's serverless runtime. For production, swap `src/lib/storage.ts` to use a real DB (Postgres / Upstash Redis / Supabase / etc.) — the storage interface is small and isolated.

### Self-hosted

Any Node host (Railway, Fly.io, Coolify, Hetzner + PM2…) works. Mount `./data` as a persistent volume.

---

## Project structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/{login,logout}/route.ts
│   │   ├── leads/route.ts          # POST (public) + GET (admin)
│   │   ├── leads/[id]/route.ts     # PATCH + DELETE (admin)
│   │   ├── settings/route.ts       # GET + PUT (admin)
│   │   └── stats/route.ts          # GET (admin)
│   ├── kr-control-7x4q/            # ← hidden admin panel
│   │   ├── page.tsx
│   │   ├── AdminClient.tsx
│   │   └── login/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                    # Homepage (server-rendered)
├── components/                     # All UI components
│   ├── HomeClient.tsx              # Orchestrator
│   ├── Hero.tsx                    # Hero w/ flow-field canvas
│   ├── WorkList.tsx                # Selected work + floating preview
│   ├── Capabilities.tsx            # Services grid
│   ├── Philosophy.tsx              # Quote section + gradient mesh
│   ├── Process.tsx
│   ├── Metrics.tsx                 # Animated counters
│   ├── Testimonials.tsx
│   ├── LeadForm.tsx                # ⇢ Telegram
│   ├── Footer.tsx
│   ├── Nav.tsx, Cursor.tsx, Loader.tsx, Marquee.tsx
├── i18n/request.ts                 # Locale detection
├── lib/
│   ├── auth.ts                     # JWT + bcrypt
│   ├── storage.ts                  # JSON-file storage (leads + settings)
│   └── telegram.ts                 # Bot API wrapper
├── messages/{en,ru}.json
└── middleware.ts                   # Admin route protection
```

---

## Design system

Color palette is defined in `tailwind.config.js` and `src/app/globals.css`:

| Token | Hex | Use |
|---|---|---|
| `bg` | `#05090f` | Deep blue-black background |
| `bg-2` | `#0a1220` | Card / panel surfaces |
| `ink` | `#eaf2ff` | Primary text |
| `ink-dim` | `#7a8aa3` | Secondary text |
| `cyan` | `#4dc8ff` | Primary accent — italics, highlights |
| `azure` | `#2596ff` | Mid-blue, gradients |
| `deep` | `#0b3a7a` | Deepest blue accent |
| `glow` | `#9dd9ff` | Glow/hover state |
| `accent` | `#ff7a2d` | Orange accent — CTAs, status, contrast |

Typography: **Fraunces** (serif display + italics), **Inter** (body), **JetBrains Mono** (labels & numbers).

---

## License

Proprietary. Built for KREA Studio.
