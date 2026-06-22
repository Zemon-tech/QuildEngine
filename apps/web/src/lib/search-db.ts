export interface SearchItem {
  id: string;
  title: string;
  category:
    | "Courses"
    | "Tutorials"
    | "Lessons"
    | "Topics"
    | "DSA Problems"
    | "Q/A"
    | "Case Studies"
    | "Test Cases"
    | "Events"
    | "Documentation"
    | "Research"
    | "User Profiles";
  subtitle?: string;
  path: string;
  tags?: string[];
}

export const searchDatabase: SearchItem[] = [
  // ── Courses ─────────────────────────────────────────────────────────
  {
    id: "course-dsa",
    title: "DSA Fundamentals",
    category: "Courses",
    subtitle: "Master data structures and algorithms from first principles",
    path: "/courses/dsa-fundamentals",
    tags: ["dsa", "algorithms", "data structures", "computer science", "big o"],
  },
  {
    id: "course-system-design",
    title: "System Design",
    category: "Courses",
    subtitle: "Scale applications to millions of users",
    path: "/courses/system-design",
    tags: [
      "architecture",
      "scaling",
      "database",
      "load balancer",
      "microservices",
    ],
  },
  {
    id: "course-react-advanced",
    title: "React Advanced Patterns",
    category: "Courses",
    subtitle: "State management, performance, and custom hook architectures",
    path: "/courses/react-advanced",
    tags: ["react", "hooks", "performance", "state", "context"],
  },

  // ── Tutorials ───────────────────────────────────────────────────────
  {
    id: "tutorial-ts",
    title: "TypeScript Deep Dive",
    category: "Tutorials",
    subtitle: "Advanced types, generics, and declaration merging",
    path: "/learn/tutorials",
    tags: ["typescript", "ts", "generics", "types", "compiler"],
  },
  {
    id: "tutorial-tailwind",
    title: "Tailwind CSS Best Practices",
    category: "Tutorials",
    subtitle: "Responsive styling and utility-first clean code",
    path: "/learn/tutorials",
    tags: ["tailwind", "css", "styling", "design system", "flexbox"],
  },

  // ── Lessons ─────────────────────────────────────────────────────────
  {
    id: "lesson-binary-trees",
    title: "Binary Trees — Traversal",
    category: "Lessons",
    subtitle: "Pre-order, in-order, and post-order depth-first traversals",
    path: "/courses/dsa-fundamentals/modules/trees-graphs/lessons/binary-trees-traversal",
    tags: ["binary tree", "dfs", "traversal", "recursion", "stack"],
  },
  {
    id: "lesson-linked-lists",
    title: "Linked Lists Basics",
    category: "Lessons",
    subtitle: "Singly and doubly linked lists creation and operations",
    path: "/courses/dsa-fundamentals/modules/linked-lists/lessons/linked-lists-basics",
    tags: [
      "linked list",
      "nodes",
      "pointers",
      "singly linked",
      "doubly linked",
    ],
  },
  {
    id: "lesson-graph-algo",
    title: "Graph Algorithms (BFS/DFS)",
    category: "Lessons",
    subtitle:
      "Breadth-first and depth-first searches on matrices and adjacency lists",
    path: "/courses/dsa-fundamentals/modules/trees-graphs/lessons/graph-algorithms",
    tags: ["graph", "bfs", "dfs", "adjacency list", "queue"],
  },

  // ── Topics ──────────────────────────────────────────────────────────
  {
    id: "topic-css-layouts",
    title: "Modern CSS Grid & Flexbox layouts",
    category: "Topics",
    subtitle: "Building dynamic, viewport-responsive pages",
    path: "/learn/notes",
    tags: ["css", "grid", "flexbox", "responsive", "media queries"],
  },
  {
    id: "topic-react-state",
    title: "State Management in Modern React",
    category: "Topics",
    subtitle: "Zustand, Recoil, Redux and Context API comparison",
    path: "/learn/articles",
    tags: ["state", "zustand", "redux", "context", "react state"],
  },
  {
    id: "topic-rsc",
    title: "React Server Components (RSC)",
    category: "Topics",
    subtitle: "Hybrid server-client rendering and routing architecture",
    path: "/learn/roadmaps",
    tags: ["rsc", "nextjs", "ssr", "server components", "client components"],
  },

  // ── DSA Problems ────────────────────────────────────────────────────
  {
    id: "dsa-two-sum",
    title: "Two Sum (Easy)",
    category: "DSA Problems",
    subtitle: "Find two numbers in an array that add up to a target",
    path: "/dsa/arrays",
    tags: ["hash map", "array", "two pointers", "search"],
  },
  {
    id: "dsa-valid-parentheses",
    title: "Valid Parentheses (Easy)",
    category: "DSA Problems",
    subtitle: "Validate correct opening/closing ordering of braces",
    path: "/dsa/strings",
    tags: ["stack", "string", "parsing"],
  },
  {
    id: "dsa-reverse-list",
    title: "Reverse Linked List (Easy)",
    category: "DSA Problems",
    subtitle: "Invert the direction of a singly linked list in-place",
    path: "/dsa/linked-list",
    tags: ["linked list", "recursion", "pointers"],
  },
  {
    id: "dsa-tree-path",
    title: "Binary Tree Maximum Path Sum (Hard)",
    category: "DSA Problems",
    subtitle: "Find the maximum path sum between any two nodes in a tree",
    path: "/dsa/trees",
    tags: ["binary tree", "dfs", "recursion", "dynamic programming"],
  },
  {
    id: "dsa-clone-graph",
    title: "Clone Graph (Medium)",
    category: "DSA Problems",
    subtitle: "Create a deep copy of a connected undirected graph",
    path: "/dsa/graph",
    tags: ["graph", "bfs", "dfs", "hash map", "clone"],
  },

  // ── Q/A ─────────────────────────────────────────────────────────────
  {
    id: "qa-react-refs",
    title: "React 19 Ref Handling and forwardRef",
    category: "Q/A",
    subtitle: "How refs behave without forwardRef in React 19",
    path: "/interview-qa/technical",
    tags: ["react 19", "refs", "forwardref", "technical interview"],
  },
  {
    id: "qa-behavioral-failure",
    title: "Dealing with Project Failure",
    category: "Q/A",
    subtitle: "Structuring responses for 'Tell me about a time you failed'",
    path: "/interview-qa/behavioral",
    tags: ["behavioral", "interview prep", "failure", "star method"],
  },
  {
    id: "qa-ai-mock",
    title: "AI Mock Interview: API Gateway Scaling",
    category: "Q/A",
    subtitle: "Practice system design scalability constraints with feedback",
    path: "/interview-qa/ai-generated",
    tags: ["system design", "ai feedback", "scaling", "rate limiting"],
  },

  // ── Case Studies ────────────────────────────────────────────────────
  {
    id: "case-chat-app",
    title: "Designing a Scalable Chat Application",
    category: "Case Studies",
    subtitle: "Handling web sockets, presence detection, and message storage",
    path: "/case-studies/system-design",
    tags: ["websockets", "redis", "cassandra", "presence", "pub/sub"],
  },
  {
    id: "case-payment-gateway",
    title: "High-Throughput Payment Processing",
    category: "Case Studies",
    subtitle: "Achieving idempotency, reliability, and ledger consistency",
    path: "/case-studies/product",
    tags: ["payments", "idempotency", "transactions", "ledger", "stripe"],
  },
  {
    id: "case-ecommerce-checkout",
    title: "E-Commerce Checkout Optimization",
    category: "Case Studies",
    subtitle: "Reducing bounce rates and latency in cart-to-order flow",
    path: "/case-studies/business",
    tags: ["business case", "checkout", "conversion rate", "metrics"],
  },

  // ── Test Cases ──────────────────────────────────────────────────────
  {
    id: "test-frontend",
    title: "Mock Test: Frontend & React State Flow",
    category: "Test Cases",
    subtitle: "Timed simulation of standard senior frontend screening",
    path: "/assessments/mock-tests",
    tags: ["mock test", "frontend", "timed assessment"],
  },
  {
    id: "test-js-core",
    title: "Assessment: JavaScript Core Specifications",
    category: "Test Cases",
    subtitle: "Detailed questions on event loop, closures, and microtasks",
    path: "/assessments/assessments",
    tags: ["javascript", "event loop", "closures", "microtasks"],
  },
  {
    id: "test-weekly-challenge",
    title: "Weekly Challenge 25: Graph Traversal Speedrun",
    category: "Test Cases",
    subtitle: "Solve 3 graph problems within 45 minutes",
    path: "/assessments/weekly-challenges",
    tags: ["weekly challenge", "graph", "speedrun", "live coding"],
  },

  // ── Events ──────────────────────────────────────────────────────────
  {
    id: "event-sysdesign",
    title: "System Design Webinar",
    category: "Events",
    subtitle: "Interactive deep dive into database replication strategies",
    path: "/events",
    tags: ["webinar", "database", "replication", "system design"],
  },
  {
    id: "event-hackathon",
    title: "Frontend Hackathon",
    category: "Events",
    subtitle:
      "Collaborate and build high-performance web solutions in 48 hours",
    path: "/events/hackathons",
    tags: ["hackathon", "frontend", "team building", "competition"],
  },
  {
    id: "event-ts-workshop",
    title: "TypeScript Generics Workshop",
    category: "Events",
    subtitle: "Hands-on coding session creating type-safe utility functions",
    path: "/events/workshops",
    tags: ["workshop", "typescript", "live coding", "generics"],
  },

  // ── Documentation ───────────────────────────────────────────────────
  {
    id: "doc-ssr-routing",
    title: "React Router SSR and Data Loading",
    category: "Documentation",
    subtitle: "Prefetching data and hydration matching on edge runtime",
    path: "/documentation",
    tags: [
      "documentation",
      "react router",
      "ssr",
      "data fetching",
      "hydration",
    ],
  },
  {
    id: "doc-tanstack-start",
    title: "TanStack Start Quickstart",
    category: "Documentation",
    subtitle: "Bootstrap a server-ready React application in 5 minutes",
    path: "/documentation",
    tags: ["tanstack start", "quickstart", "server actions", "routing"],
  },
  {
    id: "doc-css-vars",
    title: "Styling with CSS Variables",
    category: "Documentation",
    subtitle: "Guidelines for configuring colors, gaps, and theme hooks",
    path: "/documentation",
    tags: ["css variables", "styling", "theming", "colors"],
  },

  // ── Research ────────────────────────────────────────────────────────
  {
    id: "research-ai-agents",
    title: "AI Agent Workflows & Reasoning Loop",
    category: "Research",
    subtitle: "Comparing tool-use pipelines and agentic reflection systems",
    path: "/research",
    tags: ["research", "ai agents", "reasoning", "reflection", "llms"],
  },
  {
    id: "research-bundlers",
    title: "Next-Gen Bundlers Performance Analysis",
    category: "Research",
    subtitle: "Comparing build speeds of Turbopack, Rolldown, and Esbuild",
    path: "/research",
    tags: ["bundler", "turbopack", "rolldown", "esbuild", "performance"],
  },
  {
    id: "research-wasm-db",
    title: "WebAssembly Database Drivers",
    category: "Research",
    subtitle: "Running lightweight SQL engines inside client environment",
    path: "/research",
    tags: ["wasm", "sqlite", "webassembly", "database"],
  },

  // ── User Profiles ───────────────────────────────────────────────────
  {
    id: "profile-overview",
    title: "My Profile Overview",
    category: "User Profiles",
    subtitle: "Manage personal preferences, user handle, and status",
    path: "/profile?tab=profile",
    tags: ["profile", "settings", "status", "avatar"],
  },
  {
    id: "profile-projects",
    title: "Projects & Research",
    category: "User Profiles",
    subtitle: "View current active research papers and Github repositories",
    path: "/profile?tab=projects",
    tags: ["projects", "github", "research papers", "portfolio"],
  },
  {
    id: "profile-skills",
    title: "Skills & Certifications",
    category: "User Profiles",
    subtitle: "Verify programming language expert badges and certificates",
    path: "/profile?tab=skills",
    tags: ["skills", "certifications", "badges", "credentials"],
  },
];
