# Implementation Plan - Premium Developer Roadmaps (BFF & Backend Compliant)

Build a staff-engineer-level, desktop-first, highly polished Developer Roadmaps page inspired by roadmap.sh, Linear, and Vercel. 

To satisfy the BFF layer architecture guidelines of QuildEngine:
1. **Business Logic separation**: All scoring, user progress logic, XP increments, streaks, and achievement checks reside on the backend (`apps/api`).
2. **Server-Side Rendering (SSR)**: The `/roadmaps` route loader will fetch categories and active roadmaps on the server, serving fully-rendered markup to browsers and crawlers (SEO-compliant).
3. **BFF Proxying**: Client components will fetch and mutate data via `@tanstack/react-query` calling TanStack Start `createServerFn` endpoints, which proxy to the backend via `backendFetch()`.

---

## User Review Required

> [!IMPORTANT]
> **Workspace Paths**: All relative paths are aligned with the workspace root at `c:/Zemon/QuildEngine`.
> **React Flow Dependency**: React Flow (`@xyflow/react`) is already installed in `package.json` (`^12.11.0`). We only need to install `immer` in `apps/web`.
> **Backend Integration**: Mock data for roadmaps, user XP, and achievements will be served via Express controllers in `apps/api/src/routes/v1/roadmaps.routes.ts`.
> **Guest Mode vs. Authenticated Sync**: If the user is authenticated, progress is synchronized to the Express backend database. If unauthenticated, progress falls back to `LocalStorage` on the client.

---

## Proposed Changes

### Component 1: Express Backend (`apps/api`)

Separate backend logic from the frontend to handle calculations, data structures, and database writes.

#### [NEW] [roadmaps.routes.ts](file:///c:/Zemon/QuildEngine/apps/api/src/routes/v1/roadmaps.routes.ts)
- Create router endpoints for `/roadmaps`:
  - `GET /`: Fetch list of roadmap categories (Frontend, Backend, etc.) and metadata.
  - `GET /:id`: Fetch structured node and edge arrays for the chosen roadmap layout (Frontend, Backend, AI/ML, and fallback paths for other categories).
  - `GET /user/progress`: Fetch authenticated user progress (completed nodes, bookmarks, XP, streak, last visited node).
  - `POST /user/progress/node`: Complete, start, or reset a node. Performs backend XP calculation (+10 XP Beginner, +25 XP Intermediate, +50 XP Advanced), updates streaks, checks if an achievement is unlocked, and returns the modified state.
  - `POST /user/progress/bookmark`: Toggle bookmark state for a node.
- Include static mock data store on the backend for 12 categories, with fully-articulated node/edge coordinates for:
  1. Frontend (HTML, CSS, JS, React, Next.js, Performance)
  2. Backend (Languages, Databases, Caching, Microservices, Distributed Systems)
  3. AI / ML (Python, Linear Algebra, Scikit-Learn, PyTorch, LLMs)
  4. Fallback nodes for the remaining 9 categories.

#### [MODIFY] [index.ts](file:///c:/Zemon/QuildEngine/apps/api/src/routes/v1/index.ts)
- Import and mount the roadmaps router on `/roadmaps`.

---

### Component 2: BFF & Data Fetching (`apps/web`)

Create the server-side API proxy functions and schemas in the web application.

#### [MODIFY] [package.json](file:///c:/Zemon/QuildEngine/apps/web/package.json)
- Add `immer` to dependencies.

#### [NEW] [roadmaps.ts](file:///c:/Zemon/QuildEngine/apps/web/src/types/roadmaps.ts)
Define strict TypeScript types:
- `RoadmapNode`, `RoadmapEdge`, `Roadmap`, `RoadmapCategory`, `Resource`, `UserProgress`, `Achievement`.

#### [NEW] [roadmaps.ts](file:///c:/Zemon/QuildEngine/apps/web/src/lib/server-fns/roadmaps.ts)
Define server functions using `createServerFn` to proxy requests to the backend:
- `fetchRoadmapsList` (GET, public fallback) -> proxies to `/api/v1/roadmaps`
- `fetchRoadmapDetail` (GET, public fallback, validates `id` parameter) -> proxies to `/api/v1/roadmaps/:id`
- `fetchUserRoadmapProgress` (GET, authMiddleware) -> proxies to `/api/v1/roadmaps/user/progress`
- `updateNodeProgress` (POST, authMiddleware, validates schema via Zod) -> proxies to `/api/v1/roadmaps/user/progress/node`
- `toggleNodeBookmark` (POST, authMiddleware, validates schema via Zod) -> proxies to `/api/v1/roadmaps/user/progress/bookmark`

---

### Component 3: Client State & Canvas Hooks (`apps/web`)

#### [NEW] [use-roadmaps.ts](file:///c:/Zemon/QuildEngine/apps/web/src/hooks/use-roadmaps.ts)
Create custom TanStack Query hook wrapper for:
- Querying categories and active roadmap details.
- Querying current progress state.
- Performing mutations for completing nodes and bookmarking with **optimistic UI updates** via Immer, updating the query cache. If unauthenticated, redirects queries to a LocalStorage-backed state sync layer to ensure full offline fallback behavior.

---

### Component 4: Layout & Routes (`apps/web`)

#### [NEW] [roadmaps.tsx](file:///c:/Zemon/QuildEngine/apps/web/src/routes/_app/roadmaps.tsx)
- Define the `/roadmaps` route.
- Add an SSR route `loader` that pre-fetches the list of categories and (if `id` query param exists) the active roadmap configuration using the BFF server functions. This guarantees metadata is pre-fetched and injected for SEO crawlers.
- Render the search bar, category grids, dashboard stats, and active achievements if no `id` is active.
- Render the interactive canvas viewer, sticky left progress sidebar, and breadcrumbs if an `id` is active in the search params.

#### [MODIFY] [app-sidebar.tsx](file:///c:/Zemon/QuildEngine/apps/web/src/components/sidebar/app-sidebar.tsx)
- Add "Roadmaps" link pointing to `/roadmaps` using Lucide's `Map` icon.

---

### Component 5: Interactive UI Components (`apps/web/src/components/roadmaps`)

Implement premium UI widgets styled for Dark/Light modes with Design Engineering polish.

- **`roadmap-canvas.tsx`**: Uses `@xyflow/react` provider. Houses custom node/edge types. Uses spring-based adjustments for panning/zooming.
- **`roadmap-node.tsx`**: Custom node rendering with specific colored borders depending on difficulty level (Beginner=Green, Intermediate=Blue, Advanced=Purple) and status status (Not Started, In Progress, Completed, Locked). Incorporates subtle scale compression (`transform: scale(0.98)`) on `:active` clicks.
- **`roadmap-card.tsx` & `category-card.tsx`**: Premium card design inspired by Vercel/Linear with hover glows.
- **`search-bar.tsx` & `filter-panel.tsx`**: Debounced global search & multi-select filtration controls.
- **`progress-sidebar.tsx`**: Sticky left drawer displaying active streak fire, percentage progress bar, and list of bookmarked nodes.
- **`resource-panel.tsx`**: Sliding right drawer using `--ease-drawer` custom curve, containing tabs for resource links and markdown notes.
- **`node-tooltip.tsx`**: Fast tooltips displaying preview meta, scaling from `0.95` to `1` over 120ms with custom `cubic-bezier(0.23, 1, 0.32, 1)` and custom trigger-aware `transform-origin`.
- **`stats-card.tsx` & `achievement-card.tsx`**: Visualized gamification achievements and learning calendar metrics.
- **`breadcrumbs.tsx` & `loading-skeleton.tsx`**: SSR fallback states and breadcrumb navigation.

---

## Verification Plan

### Automated Verification
- Run typescript validation compiler: `npm run check-types` inside `apps/web`.
- Verify the build output: `npm run build` inside `apps/web`.

### Manual Verification
- Access `/roadmaps` and verify directory page SEO meta tags and mock data load correctly.
- Select a category (e.g., Frontend) to load the canvas, testing dragging, zoom, and mouse controls.
- Click a node, verify the right resource drawer slides in. Update status (e.g., In Progress -> Completed) and verify XP/streaks increase and node colors update in real-time.
- Unauthenticate the session, reload, and verify that progress toggling still functions offline via LocalStorage fallback.
