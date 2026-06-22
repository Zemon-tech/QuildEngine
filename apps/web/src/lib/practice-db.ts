export interface PracticeSubtopic {
  id: string;
  name: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: "completed" | "in_progress" | "not_started";
  questionCount: number;
  description: string;
}

export interface PracticeCategory {
  id: string;
  title: string;
  description: string;
  iconName: string;
  totalQuestions: number;
  completedQuestions: number;
  difficulty?: "Easy" | "Medium" | "Hard" | "Mixed";
  subtopics: PracticeSubtopic[];
}

export const interviewQADb: Record<string, PracticeCategory> = {
  technical: {
    id: "technical",
    title: "Technical Interview",
    description:
      "Deep-dive technical questions covering Javascript, React, system design, and algorithms.",
    iconName: "Code2",
    totalQuestions: 60,
    completedQuestions: 28,
    subtopics: [
      {
        id: "js-fundamentals",
        name: "Javascript & Web Fundamentals",
        difficulty: "Easy",
        status: "completed",
        questionCount: 15,
        description:
          "Closures, Event Loop, Promises, Prototype chain, and ES6+ specs.",
      },
      {
        id: "react-architecture",
        name: "React & Frontend Architecture",
        difficulty: "Medium",
        status: "in_progress",
        questionCount: 20,
        description:
          "Fiber reconciliation, State optimization, Concurrent features, and Custom hooks.",
      },
      {
        id: "browser-ops",
        name: "Browser Operations & Security",
        difficulty: "Hard",
        status: "not_started",
        questionCount: 10,
        description:
          "CORS, XSS, CSRF, DOM Rendering pipeline, and caching strategies.",
      },
      {
        id: "sysdesign-basics",
        name: "System Design & Scalability",
        difficulty: "Hard",
        status: "not_started",
        questionCount: 15,
        description:
          "CDN, Load Balancing, horizontal scaling, caching layer design, and microfrontends.",
      },
    ],
  },
  behavioral: {
    id: "behavioral",
    title: "Behavioral",
    description:
      "Ace situational questions using the STAR framework. Handle conflict, failure, and leadership.",
    iconName: "Users",
    totalQuestions: 40,
    completedQuestions: 12,
    subtopics: [
      {
        id: "conflict-resolution",
        name: "Conflict Resolution",
        difficulty: "Easy",
        status: "completed",
        questionCount: 10,
        description:
          "Navigating disagreements with teammates and managing stakeholder conflicts productively.",
      },
      {
        id: "handling-failure",
        name: "Handling Failure",
        difficulty: "Medium",
        status: "in_progress",
        questionCount: 10,
        description:
          "Learning from setbacks, taking ownership, and framing past failures as growth areas.",
      },
      {
        id: "leadership-ownership",
        name: "Leadership & Ownership",
        difficulty: "Hard",
        status: "not_started",
        questionCount: 10,
        description:
          "Taking initiative on projects, mentoring juniors, and steering architecture decisions.",
      },
      {
        id: "teamwork-collaboration",
        name: "Teamwork & Collaboration",
        difficulty: "Easy",
        status: "not_started",
        questionCount: 10,
        description:
          "Cross-functional communication, standard team workflows, and engineering alignment.",
      },
    ],
  },
  "ai-generated": {
    id: "ai-generated",
    title: "AI Generated",
    description:
      "Interactive AI-powered mock interviews tailoring questions to your specific resume and target role.",
    iconName: "Brain",
    totalQuestions: 20,
    completedQuestions: 4,
    subtopics: [
      {
        id: "api-gateway",
        name: "API Gateway & Load Balancer Design",
        difficulty: "Medium",
        status: "in_progress",
        questionCount: 5,
        description:
          "Designing scalable routing, authentication, and rate limiting layers.",
      },
      {
        id: "websockets-scale",
        name: "Real-time WebSockets Scaling",
        difficulty: "Hard",
        status: "not_started",
        questionCount: 5,
        description:
          "Managing concurrent connections, state sync, pub/sub, and failover scenarios.",
      },
      {
        id: "prompt-patterns",
        name: "Prompt Engineering Patterns",
        difficulty: "Easy",
        status: "completed",
        questionCount: 5,
        description:
          "Few-shot learning, chain-of-thought prompting, and agentic function calling.",
      },
      {
        id: "llm-latency",
        name: "LLM Integration & Latency Optimization",
        difficulty: "Hard",
        status: "not_started",
        questionCount: 5,
        description:
          "Semantic caching, streaming responses, model distillation, and token usage optimization.",
      },
    ],
  },
};

export const caseStudiesDb: Record<string, PracticeCategory> = {
  product: {
    id: "product",
    title: "Product",
    description:
      "Analyze product features, product-market fit, user onboarding metrics, and growth loops.",
    iconName: "Briefcase",
    totalQuestions: 12,
    completedQuestions: 4,
    subtopics: [
      {
        id: "checkout-optimization",
        name: "E-Commerce Cart Optimization",
        difficulty: "Medium",
        status: "in_progress",
        questionCount: 4,
        description:
          "Identifying conversion friction points and proposing technical checkout enhancements.",
      },
      {
        id: "onboarding-redesign",
        name: "User Onboarding Flow Redesign",
        difficulty: "Easy",
        status: "completed",
        questionCount: 4,
        description:
          "Analyzing onboarding retention funnels and multi-step progressive profiling UX.",
      },
      {
        id: "saas-monetization",
        name: "SaaS Retention & Monetization",
        difficulty: "Hard",
        status: "not_started",
        questionCount: 4,
        description:
          "Evaluating upgrade hooks, pricing tier integrations, and user engagement metrics.",
      },
    ],
  },
  "system-design": {
    id: "system-design",
    title: "System Design",
    description:
      "Architect large-scale, fault-tolerant, and high-throughput backend applications.",
    iconName: "Server",
    totalQuestions: 14,
    completedQuestions: 3,
    subtopics: [
      {
        id: "chat-service",
        name: "WhatsApp Scale Chat Service",
        difficulty: "Hard",
        status: "in_progress",
        questionCount: 5,
        description:
          "Handling web socket persistence, message delivery receipts, and offline queues.",
      },
      {
        id: "url-shortener",
        name: "TinyURL URL Shortener",
        difficulty: "Easy",
        status: "completed",
        questionCount: 4,
        description:
          "Creating high-availability redirections, key generation services, and database scaling.",
      },
      {
        id: "rate-limiter",
        name: "Distributed Rate Limiter",
        difficulty: "Medium",
        status: "not_started",
        questionCount: 5,
        description:
          "Token bucket algorithms, sliding window logs, and Redis/Memcached cluster setups.",
      },
    ],
  },
  business: {
    id: "business",
    title: "Business",
    description:
      "Evaluate revenue streams, unit economics, market sizing, and competitive strategy.",
    iconName: "BarChart3",
    totalQuestions: 10,
    completedQuestions: 1,
    subtopics: [
      {
        id: "streaming-pricing",
        name: "Streaming Service Pricing Strategy",
        difficulty: "Medium",
        status: "not_started",
        questionCount: 3,
        description:
          "Calculating ARPU, LTV, content licensing cost models, and global pricing strategies.",
      },
      {
        id: "rideshare-expansion",
        name: "Ride-Sharing Market Expansion",
        difficulty: "Hard",
        status: "in_progress",
        questionCount: 4,
        description:
          "Balancing two-sided market supply/demand, incentives, and localized marketing cost structures.",
      },
      {
        id: "adtech-economics",
        name: "Ad-Tech Unit Economics",
        difficulty: "Easy",
        status: "not_started",
        questionCount: 3,
        description:
          "Measuring CPM, CPC, CTR, publisher payouts, and yield optimization algorithms.",
      },
    ],
  },
};

export const assessmentsDb: Record<string, PracticeCategory> = {
  "mock-tests": {
    id: "mock-tests",
    title: "Mock Tests",
    description:
      "Timed simulation of standard engineering and frontend developer screening interviews.",
    iconName: "ClipboardList",
    totalQuestions: 12,
    completedQuestions: 4,
    difficulty: "Hard",
    subtopics: [
      {
        id: "senior-frontend-test",
        name: "Senior Frontend Mock Test",
        difficulty: "Hard",
        status: "in_progress",
        questionCount: 4,
        description:
          "Three-hour simulation including component architecture, bundle optimization, and API sync.",
      },
      {
        id: "fullstack-systems-test",
        name: "Fullstack Systems Mock Test",
        difficulty: "Hard",
        status: "not_started",
        questionCount: 4,
        description:
          "Comprehensive test measuring backend database indexing, caching, and React UI updates.",
      },
      {
        id: "algo-speedrun",
        name: "Algorithm Speedrun Test",
        difficulty: "Medium",
        status: "completed",
        questionCount: 4,
        description:
          "Speed test solving 4 standard Leetcode-style challenges within 60 minutes.",
      },
    ],
  },
  assessments: {
    id: "assessments",
    title: "Assessments",
    description:
      "Verify your core knowledge of languages, runtimes, frameworks, and tools.",
    iconName: "FileSearch",
    totalQuestions: 8,
    completedQuestions: 3,
    difficulty: "Medium",
    subtopics: [
      {
        id: "js-internals",
        name: "JavaScript Advanced Internals",
        difficulty: "Medium",
        status: "completed",
        questionCount: 3,
        description:
          "Event loop execution context, memory leaks, Garbage Collection, and V8 engine details.",
      },
      {
        id: "css-performance",
        name: "CSS Layouts & Rendering Performance",
        difficulty: "Easy",
        status: "in_progress",
        questionCount: 3,
        description:
          "Layout, Paint, Composite lifecycle phases, Flexbox/Grid performance, and GPU hardware acceleration.",
      },
      {
        id: "web-apis",
        name: "Web APIs & DOM Manipulation",
        difficulty: "Medium",
        status: "not_started",
        questionCount: 2,
        description:
          "Intersection Observer, Mutation Observer, Custom Events, and requestAnimationFrame.",
      },
    ],
  },
  "weekly-challenges": {
    id: "weekly-challenges",
    title: "Weekly Challenges",
    description:
      "Compete with other engineers on weekly algorithmic and architectural challenges.",
    iconName: "Zap",
    totalQuestions: 6,
    completedQuestions: 1,
    difficulty: "Mixed",
    subtopics: [
      {
        id: "week-25-graph",
        name: "Week 25: Graph Traversal Speedrun",
        difficulty: "Hard",
        status: "not_started",
        questionCount: 2,
        description:
          "Find the shortest path in dynamic weighted grids under time-based constraints.",
      },
      {
        id: "week-24-dp",
        name: "Week 24: Dynamic Programming Knapsack",
        difficulty: "Medium",
        status: "completed",
        questionCount: 2,
        description:
          "Applying memory-efficient bottom-up state transition relations to knapsack variants.",
      },
      {
        id: "week-23-cache",
        name: "Week 23: Cache Eviction Policies",
        difficulty: "Hard",
        status: "not_started",
        questionCount: 2,
        description:
          "Implementing custom LFU/LRU eviction buffers with O(1) performance invariants.",
      },
    ],
  },
};
