# 🚀 DemoDay — Show What You Can Build

> **DemoDay** is the visual-first professional networking platform for tech talent—often described as **"Instagram for LinkedIn."** 

It replaces text-heavy, easily inflated resumes with high-impact, interactive video project portfolios. Instead of passive scrolling or reading bullet points, recruiters can experience your live demos, verified university/skill credentials, and interactive repositories inside a unified, beautiful feed.

---

## 🎨 Bridging Instagram & LinkedIn

Professional networking is stuck in the past, while the way developers showcase their work has evolved. DemoDay bridges the gap:

| 💼 LinkedIn (Professional Utility) | 📸 Instagram (Visual Engagement) | 🚀 DemoDay (The Bridge) |
|---|---|---|
| Rigid, text-heavy profiles | Highly visual, dynamic video reels | **Visual-first professional portfolios** |
| Hard to verify claims & skills | Geared towards social/lifestyle content | **1-click verified university & skill badges** |
| Saturated, spam-heavy inboxes | Direct messaging without guardrails | **3-Tier Recruiter Inbox** (Primary, General, Request) |
| Tells what you did | Shows what you like | **Shows what you actually built** |

---

## ✨ Key Features

### 🎥 1. 60s Project Reels
Showcase your software through engaging, vertical video micro-demos. Powered by high-speed **HLS streaming** and compressed via edge CDN networks, recruiters can swipe through working software interfaces in seconds.

### 🛡️ 2. Verified Credentials & Badges
Prove your credentials without friction. Through direct institution mappings and secure database schemas, creators hold **verified badges** for:
* **Academic Institutions:** College affiliations.
* **Verified Skills:** Proof of code competence.
* **Company Roles:** Certified workplace contributions.

### 📥 3. The 3-Tiered Inbox
Say goodbye to recruiter noise. DemoDay's custom chat protocol categorizes incoming messages into three tiers:
1. **Primary:** High-priority conversations and verified connection matches.
2. **General:** Standard inquiries and industry discussions.
3. **Requests:** Direct outreach from non-connections or outer-tier recruiters.

### 📊 4. Developer Portfolio Analytics
Track views, likes, and direct recruiter engagements on your project reels. Optimize your profiles with real-time feedback on which tech stacks are attracting the most attention.

---

## 🏗️ Technical Architecture & Monorepo Structure

DemoDay is built as a highly performant, type-safe TypeScript monorepo using **npm workspaces**:

```
DemoDay/
├── apps/
│   ├── client/          # React + Vite + MUI v6 + Zustand Store
│   └── server/          # Express + Node + TypeScript + Socket.io
├── packages/
│   └── shared/          # Shared TypeScript type interfaces & constants
├── database/
│   ├── migrations/      # Supabase PostgreSQL tables & row-level security (RLS)
│   └── neo4j/           # Graph database connection nodes (Phase 2)
├── package.json         # Workspace root and orchestration script
└── .gitignore           # Secure git rules protecting credentials (.env)
```

### 🛠️ The Tech Stack
* **Frontend:** React, Vite, Material-UI (MUI) v6, Zustand state management.
* **Backend:** Express, Node.js, TypeScript, Socket.io (Real-time Messaging).
* **Primary Database:** Supabase PostgreSQL with custom Row-Level Security (RLS) policies.
* **Graph Database:** Neo4j AuraDB (for mapping skill paths and connections).
* **Media Processing:** Cloudinary CDN edge networks for video HLS conversion.

---

## 🚦 Getting Started & Local Development

### 1. Prerequisites
Ensure you have the following installed on your system:
* [Node.js](https://nodejs.org/) (v18 or higher)
* [npm](https://www.npmjs.com/) (v9 or higher)

### 2. Configure Environment Variables
You need to create two environment variable configurations locally (which are safely ignored by git):

#### Monorepo Root `.env` (Backend Config)
Create a `.env` file at the root of the project with your Supabase credentials:
```env
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173

SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### Client `.env` (Frontend Config)
Create a `.env` file at [apps/client/.env](file:///Users/chhayanshporwal/Projects/DemoDay/apps/client/.env):
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### 3. Deploy Database Migrations
Copy and run the database migration files inside your **Supabase SQL Editor** panel:
1. First run [001_init.sql](file:///Users/chhayanshporwal/Projects/DemoDay/database/migrations/001_init.sql) to build the tables.
2. Then run [002_rls_policies.sql](file:///Users/chhayanshporwal/Projects/DemoDay/database/migrations/002_rls_policies.sql) to establish row-level security.

### 4. Install & Launch the App
Run the following commands in your terminal at the project root directory:

```bash
# Install dependencies across the entire monorepo workspaces
npm install

# Build shared package types
npm run build -w packages/shared

# Spin up both client and server development servers concurrently
npm run dev
```

Your React client will boot on `http://localhost:5173` and your Express backend on `http://localhost:3001`!

---

## 🗺️ Roadmap & Phase Progression
* **Phase 1 (Completed):** Supabase Foundation, JWT Auth verification, Zustand integration, and dynamic Onboarding Gating.
* **Phase 2 (Next):** Taxonomy Engine, Neo4j AuraDB graph connections, skill mappings, and degrees of separation indicators.
* **Phase 3:** Cloudinary HLS video integration, Reels feed, and custom player.
* **Phase 4:** Tiered Messaging System (Socket.io) and recruiter dashboards.
