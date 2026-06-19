# Quild Platform — Specification Document

## Overview

Quild is a platform for skill development, learning, and research — focused on core computer science and DeepTech fields. It combines structured courses, professional profiles, AI-powered research tools, industry news, and events into a single ecosystem.

**Domain:** quild.in  
**Target Audience:** Anyone interested in learning core CS skills deeply and solving real problems — students, engineers, researchers.  
**Access Model:** Free. Starts invite-only (personalized invite links sent to specific emails), then transitions to open access.

---

## Problem Statements Covered

AI/ML models, Fine Tuning, Deep Learning, OS development, Server Management, System Design, Hardware Design, Chip Design, VLSI Design, Networks, Internet, IoT Devices, Circuit Designs, and more.

---

## Feature Priority

| Priority | Features |
|----------|----------|
| Primary | Courses, User Profiles |
| Secondary | Research Tools, Paper Writing |
| Tertiary | Events, News, Package Library (deferred) |

---

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Monorepo | Turborepo + npm workspaces | Shared types, configs, unified build pipeline |
| Frontend | React + Vite + TailwindCSS + shadcn/ui | Fast, lightweight, headless components |
| Backend | Node.js + Express + TypeScript | Team familiarity, strong ecosystem |
| Database | PostgreSQL (via Supabase) | Relational data maps cleanly to courses, users, RBAC, progress |
| Auth | Supabase Auth | Invite-only via personalized links, OAuth later |
| File Storage | AWS S3 | Course assets, profile images, uploaded papers |
| Cache | Redis (deferred) | Sessions, rate limiting, progress caching — will be added later |
| Search (research) | Elasticsearch or Meilisearch (deferred) | Paper search engine — future bucket |
| Frontend Hosting | Cloudflare Pages | Fast edge delivery, per team preference |
| Backend Hosting | AWS (ECS or EC2) | Per team preference |
| API Pattern | REST (versioned: `/api/v1/*`) | Simpler for team, GraphQL optional later |
| Design System | Built incrementally with shadcn/ui + Tailwind tokens | No Figma — design evolves with implementation |

---

## Repo Structure

```
quild/
├── apps/
│   ├── web/              # User-facing React frontend
│   ├── admin/            # Admin panel React frontend
│   └── api/              # Node.js + Express backend
├── packages/
│   ├── types/            # Shared TypeScript types
│   ├── config/           # Shared configs (eslint, tsconfig, tailwind)
│   ├── ui/               # Shared UI components (shadcn-based)
│   └── db/               # Supabase client + queries
├── turbo.json
├── package.json
└── README.md
```

---

## Data Model (High-Level)

### Users & Auth
- **User** — id, email, name, username (unique), avatar, bio, role, invite_code_used, created_at
- **InviteLink** — id, email, token (unique), used, created_by, expires_at
- **Role** — superadmin, admin, editor, moderator, user

### Profiles
- **Profile** — user_id, headline, about, skills[], education[], experience[], featured_projects[]
- **ExternalLink** — user_id, platform (github | linkedin | x | arxiv | kaggle | huggingface), url, synced_data (JSON)
- **ProfileSection** — user_id, section_type, order, visibility, custom_data (JSON)

### Courses
- **Course** — id, title, slug, description, thumbnail, difficulty, tags[], status (draft | published), created_by
- **Module** — id, course_id, title, order
- **Lesson** — id, module_id, title, content (markdown/rich text), order, type (content | problem | quiz)

### Assessments
- **Problem** — id, lesson_id, title, description, evaluation_criteria (design, scalability, robustness, edge_cases, ui_ux), difficulty
- **MCQ** — id, lesson_id, question, options[], correct_answer, explanation
- **Quiz** — id, lesson_id, title, questions[] (references MCQs or inline)
- **CaseStudy** — id, lesson_id, title, scenario, questions[], evaluation_rubric

### Progress
- **UserProgress** — user_id, course_id, module_id, lesson_id, status (not_started | in_progress | completed), score, completed_at
- **UserStreak** — user_id, current_streak, longest_streak, last_activity_date

### Admin
- **Blog** — id, title, slug, content, author_id, status (draft | published), published_at
- **Event** — id, title, description, date, location, url, partner_org, status
- **Form** — id, title, fields[] (JSON), embed_config, created_by
- **FormSubmission** — id, form_id, data (JSON), submitted_at

### Research (Secondary)
- **ResearchWorkspace** — id, user_id, title, papers[], notes
- **Paper** — id, title, authors, abstract, source_url, source (arxiv | semantic_scholar | other), metadata (JSON)

---

## Feature Specifications

### 1. Courses

**Structure:** Course → Module → Lesson

**Content Types:**
- Text/Markdown lessons
- Problem statements (architecture/design focused — not just code)
- MCQs
- Quizzes
- Case study-based questions
- DSA questions (description + test cases, no built-in code editor)

**Evaluation Philosophy:**
- Not only code correctness
- Focus on: system design, architecture, scalability, robustness, edge case handling, UI/UX thinking
- Rubric-based evaluation fields per problem

**Features:**
- Course browser with filters (difficulty, tags, status)
- Progress tracking (% complete per course/module/lesson)
- Scores per assessment
- Streaks and activity history
- Admin CMS for full course CRUD

### 2. User Profiles

**Public Profile:** `quild.in/<username>`

**Sections (customizable order and visibility):**
- Bio / headline
- Skills
- Education
- Work experience
- Featured projects
- Course completions and scores
- Activity/streak data
- External platform data

**External Platform Integrations:**
- GitHub — repos, contribution graph, languages
- LinkedIn — headline, experience, education
- X — follower count, pinned posts
- arXiv — published papers
- HuggingFace — models, datasets
- Kaggle — competitions, rankings

**Implementation approach:** URL linking first, then API-based data fetching in Bucket 6.

**Customization:**
- Reorder sections
- Toggle section visibility
- Custom bio and featured content

### 3. Admin Panel

**RBAC Roles:** superadmin, admin, editor, moderator

**Features:**
- User management (invite, deactivate, role assignment)
- Course/content management (full CMS)
- Blog management (create, edit, publish)
- Event management
- Form builder (embeddable via iframe/script on external sites)
- Analytics dashboard (user signups, course engagement, active users)

### 4. Research Tools (Secondary)

**Paper Search Engine:**
- Aggregates from arXiv, Semantic Scholar, and other sources
- Full-text search over titles, abstracts, authors
- Filters by date, field, citation count

**AI-Powered Features:**
- Summarize a paper
- Compare multiple papers
- Extract key findings
- Generate literature reviews
- Research workspace for organizing papers and notes

### 5. Events & News (Tertiary)

- Event listing (partnered and curated)
- Industry news scraping from multiple organizations
- Feed/digest system

### 6. Package Library (Deferred)

- CLI tool for scaffolding projects (Python, TS, JS, Java, C, C#, C++, Rust, frontend, backend, turbo repos)
- Will be integrated later

---

## Auth Flow

1. Admin creates personalized invite link for a specific email
2. User receives invite link via email
3. User clicks link → lands on registration page (email pre-filled, verified)
4. User creates account (password or magic link via Supabase Auth)
5. Post-registration: user sets up username and basic profile
6. Later: transition to open access (remove invite requirement)

---

## Constraints

- No built-in code editor/runner for now
- No payment/subscription system (everything is free)
- Package library is deferred
- Research tools are secondary priority — built after courses and profiles are solid
- Design system evolves incrementally (no Figma upfront)
- Must support 1000s of users within first few months
- Invite-only at launch with personalized links

---

## Technical Constraints

- npm workspaces (not pnpm/yarn)
- Supabase for database (PostgreSQL) and auth
- Supabase JS client for DB queries (no ORM for now)
- Express.js for API (not Fastify, not tRPC)
- React + Vite (not Next.js)
- shadcn/ui for components (not Material UI)
- TailwindCSS for styling
- Cloudflare Pages for frontend deployment
- AWS for backend deployment
- Redis deferred (will be added later for caching)

---

## Sprint Buckets

### Bucket 1 — Foundation (Week 1-2)
- Turborepo + npm workspaces setup
- Shared packages (types, config, eslint, prettier, tsconfig)
- Supabase project setup + DB schema (via SQL migrations)
- Supabase Auth integration (invite-only flow)
- Express API scaffold with versioned routes
- React app scaffolds (web + admin) with routing
- Basic auth pages (login, register via invite)
- CI/CD pipeline setup

### Bucket 2 — User Profiles (Week 3-4)
- Profile CRUD API
- Public profile page (`quild.in/username`)
- Customizable sections (bio, skills, education, experience, featured projects)
- External platform linking (URL-based)
- Profile settings page
- Username availability check

### Bucket 3 — Courses Core (Week 5-7)
- Course → Module → Lesson data model and API
- Admin CMS: create/edit/delete courses, modules, lessons
- Student-facing course browser with filters
- Lesson content rendering (markdown/rich text)
- Problem statement display with evaluation criteria

### Bucket 4 — Assessments & Progress (Week 8-9)
- MCQ engine (create, render, evaluate)
- Quiz system
- Case study questions
- DSA question definitions (no code runner)
- Progress tracking (per course/module/lesson)
- Scores and completion status
- Streak system

### Bucket 5 — Admin Panel Full (Week 10-11)
- RBAC middleware and UI
- User management (invite, deactivate, assign roles)
- Analytics dashboard
- Form builder + embed system
- Blog CMS

### Bucket 6 — Profile Data Enrichment (Week 12-13)
- GitHub API integration (repos, contributions, languages)
- LinkedIn data display
- arXiv / HuggingFace / Kaggle data fetching
- Profile SEO and sharing (OG tags, meta)

### Bucket 7 — Research Tools (Week 14-16)
- Paper search engine (arXiv + Semantic Scholar APIs)
- AI-powered summarization
- Paper comparison
- Key findings extraction
- Literature review generation
- Research workspace UI

### Bucket 8 — Events & News (Week 17-18)
- Event listing and admin management
- News scraping pipeline
- Feed/digest system

---

## Open Questions (To Revisit)

- Notification system (email, in-app)?
- Real-time features (collaborative research, live quizzes)?
- Mobile app or PWA?
- Content versioning for courses?
- Rate limiting strategy for research scraping?
- SEO strategy for course pages?
- Analytics tooling (PostHog, Mixpanel, custom)?

---

*Document created: June 2026*  
*Last updated: June 2026*
