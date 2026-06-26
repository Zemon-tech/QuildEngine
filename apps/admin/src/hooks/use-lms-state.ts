import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ==========================================
// Types & Interfaces
// ==========================================

export type Difficulty = "Beginner" | "Intermediate" | "Advanced" | "Expert";
export type ContentStatus = "published" | "draft" | "archived";
export type SubmissionType = "file" | "text" | "code";
export type QuestionType =
  | "mcq"
  | "multi"
  | "truefalse"
  | "fillblank"
  | "coding";
export type CertTemplate = "classic" | "modern" | "minimal";
export type CategoryType = "course" | "tutorial";

export interface LmsCourse {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  thumbnail: string;
  banner: string;
  category: string;
  difficulty: Difficulty;
  durationWeeks: number;
  estimatedHours: number;
  outcomes: string[];
  prerequisites: string[];
  skillsGained: string[];
  tags: string[];
  status: ContentStatus;
  instructorIds: string[];
  certificateEnabled: boolean;
  studentsCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface LmsModule {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  outcomes: string[];
  durationMinutes: number;
  status: "published" | "draft";
  prerequisites: string[];
  createdAt: string;
}

export interface LmsLesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  videoUrl: string;
  notes: string;
  resources: string[];
  attachments: string[];
  estimatedDuration: number;
  order: number;
  createdAt: string;
}

export interface LmsTopic {
  id: string;
  lessonId: string;
  title: string;
  concepts: string;
  examples: string;
  exercises: string;
  notes: string;
  codeSnippets: string[];
  resources: string[];
  order: number;
  createdAt: string;
}

export interface LmsTutorial {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  tags: string[];
  difficulty: Difficulty;
  readingTime: number;
  author: string;
  status: ContentStatus;
  aiSummary: string;
  aiObjectives: string[];
  aiSeoDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface LmsInstructor {
  id: string;
  name: string;
  email: string;
  bio: string;
  expertise: string[];
  avatar: string;
  courseIds: string[];
  rating: number;
  studentsCount: number;
  createdAt: string;
}

export interface LmsAssignment {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  dueDate: string;
  submissionType: SubmissionType;
  evaluationCriteria: string;
  autoGrading: boolean;
  status: "published" | "draft";
  submissionsCount: number;
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  points: number;
}

export interface LmsQuiz {
  id: string;
  topicId: string;
  title: string;
  questions: QuizQuestion[];
  timeLimit: number;
  passingMarks: number;
  randomize: boolean;
  attemptLimit: number;
  status: "published" | "draft";
  attemptsCount: number;
  averageScore: number;
  createdAt: string;
}

export interface LmsCertificate {
  id: string;
  courseId: string;
  template: CertTemplate;
  autoIssue: boolean;
  issuedCount: number;
  createdAt: string;
}

export interface LmsCategory {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  type: CategoryType;
  itemCount: number;
}

export interface LmsTag {
  id: string;
  name: string;
  slug: string;
  color: string;
  type: CategoryType;
  usageCount: number;
}

interface LmsDb {
  courses: LmsCourse[];
  modules: LmsModule[];
  lessons: LmsLesson[];
  topics: LmsTopic[];
  tutorials: LmsTutorial[];
  instructors: LmsInstructor[];
  assignments: LmsAssignment[];
  quizzes: LmsQuiz[];
  certificates: LmsCertificate[];
  categories: LmsCategory[];
  tags: LmsTag[];
}

// ==========================================
// Default Mock Data
// ==========================================

function defaultDb(): LmsDb {
  return {
    courses: [
      {
        id: "c1",
        title: "Complete JavaScript Mastery",
        slug: "js-mastery",
        subtitle: "From Beginner to Expert JS Engineer",
        description:
          "Master JavaScript from the fundamentals to advanced patterns including closures, async/await, TypeScript, and modern tooling.",
        thumbnail: "",
        banner: "",
        category: "Web Development",
        difficulty: "Intermediate",
        durationWeeks: 12,
        estimatedHours: 48,
        outcomes: [
          "Build full-stack apps",
          "Understand async patterns",
          "Write clean TypeScript",
        ],
        prerequisites: [
          "Basic HTML/CSS",
          "Any programming language experience",
        ],
        skillsGained: ["JavaScript", "TypeScript", "Node.js", "React"],
        tags: ["javascript", "typescript", "web"],
        status: "published",
        instructorIds: ["i1", "i2"],
        certificateEnabled: true,
        studentsCount: 3842,
        rating: 4.8,
        createdAt: "2026-01-10T09:00:00Z",
        updatedAt: "2026-06-01T11:30:00Z",
      },
      {
        id: "c2",
        title: "Python for Data Science",
        slug: "python-data-science",
        subtitle: "Data Analysis, Visualization & ML Fundamentals",
        description:
          "Learn Python from scratch and apply it to real-world data science problems using Pandas, NumPy, Matplotlib, and Scikit-learn.",
        thumbnail: "",
        banner: "",
        category: "Data Science",
        difficulty: "Beginner",
        durationWeeks: 10,
        estimatedHours: 40,
        outcomes: [
          "Analyze large datasets",
          "Create visualizations",
          "Build ML models",
        ],
        prerequisites: ["No prior programming experience needed"],
        skillsGained: ["Python", "Pandas", "NumPy", "Scikit-learn"],
        tags: ["python", "data-science", "machine-learning"],
        status: "published",
        instructorIds: ["i3"],
        certificateEnabled: true,
        studentsCount: 2105,
        rating: 4.7,
        createdAt: "2026-02-15T09:00:00Z",
        updatedAt: "2026-05-20T14:00:00Z",
      },
      {
        id: "c3",
        title: "System Design for Senior Engineers",
        slug: "system-design-senior",
        subtitle: "Design Scalable, Distributed Systems",
        description:
          "Deep-dive into system design principles: scalability, consistency, availability, microservices, and real-world architecture patterns.",
        thumbnail: "",
        banner: "",
        category: "Software Engineering",
        difficulty: "Advanced",
        durationWeeks: 8,
        estimatedHours: 32,
        outcomes: [
          "Design distributed systems",
          "Understand CAP theorem",
          "Architect microservices",
        ],
        prerequisites: [
          "3+ years engineering experience",
          "Basic distributed systems knowledge",
        ],
        skillsGained: [
          "System Design",
          "Distributed Systems",
          "Architecture Patterns",
        ],
        tags: ["system-design", "architecture", "distributed"],
        status: "draft",
        instructorIds: ["i2"],
        certificateEnabled: true,
        studentsCount: 0,
        rating: 0,
        createdAt: "2026-04-01T09:00:00Z",
        updatedAt: "2026-06-10T16:00:00Z",
      },
      {
        id: "c4",
        title: "React Native Mobile Development",
        slug: "react-native-mobile",
        subtitle: "Build iOS & Android Apps with React Native",
        description:
          "Learn to build production-quality mobile apps with React Native, Expo, and native device APIs.",
        thumbnail: "",
        banner: "",
        category: "Mobile Development",
        difficulty: "Intermediate",
        durationWeeks: 9,
        estimatedHours: 36,
        outcomes: [
          "Build cross-platform mobile apps",
          "Integrate native APIs",
          "Publish to app stores",
        ],
        prerequisites: ["React.js fundamentals", "JavaScript ES6+"],
        skillsGained: ["React Native", "Expo", "Mobile UI", "Native APIs"],
        tags: ["react-native", "mobile", "ios", "android"],
        status: "published",
        instructorIds: ["i1"],
        certificateEnabled: false,
        studentsCount: 1247,
        rating: 4.6,
        createdAt: "2026-03-05T09:00:00Z",
        updatedAt: "2026-06-05T10:00:00Z",
      },
      {
        id: "c5",
        title: "Machine Learning Bootcamp",
        slug: "ml-bootcamp",
        subtitle: "End-to-End ML Pipelines & Deep Learning",
        description:
          "From supervised learning to neural networks — build real ML models and deploy them to production.",
        thumbnail: "",
        banner: "",
        category: "AI & ML",
        difficulty: "Advanced",
        durationWeeks: 16,
        estimatedHours: 64,
        outcomes: [
          "Build and train neural networks",
          "Deploy ML models",
          "Understand deep learning",
        ],
        prerequisites: [
          "Python proficiency",
          "Linear algebra basics",
          "Statistics fundamentals",
        ],
        skillsGained: ["TensorFlow", "PyTorch", "Deep Learning", "MLOps"],
        tags: ["machine-learning", "deep-learning", "ai", "python"],
        status: "draft",
        instructorIds: ["i3", "i4"],
        certificateEnabled: true,
        studentsCount: 0,
        rating: 0,
        createdAt: "2026-05-01T09:00:00Z",
        updatedAt: "2026-06-20T09:00:00Z",
      },
    ],
    modules: [
      {
        id: "m1",
        courseId: "c1",
        title: "JavaScript Fundamentals",
        description: "Variables, types, functions, scope and closures.",
        order: 1,
        outcomes: ["Understand JS types", "Write pure functions"],
        durationMinutes: 240,
        status: "published",
        prerequisites: [],
        createdAt: "2026-01-15T09:00:00Z",
      },
      {
        id: "m2",
        courseId: "c1",
        title: "Async JavaScript & Promises",
        description: "Callbacks, Promises, async/await and error handling.",
        order: 2,
        outcomes: ["Master async patterns", "Handle errors gracefully"],
        durationMinutes: 180,
        status: "published",
        prerequisites: ["m1"],
        createdAt: "2026-01-20T09:00:00Z",
      },
      {
        id: "m3",
        courseId: "c2",
        title: "Python Basics & Data Types",
        description: "Variables, lists, dicts, comprehensions and file I/O.",
        order: 1,
        outcomes: ["Write Python scripts", "Use data structures"],
        durationMinutes: 200,
        status: "published",
        prerequisites: [],
        createdAt: "2026-02-20T09:00:00Z",
      },
      {
        id: "m4",
        courseId: "c2",
        title: "Pandas & Data Wrangling",
        description: "DataFrames, data cleaning, merging, and analysis.",
        order: 2,
        outcomes: ["Clean messy data", "Aggregate and transform datasets"],
        durationMinutes: 220,
        status: "published",
        prerequisites: ["m3"],
        createdAt: "2026-02-25T09:00:00Z",
      },
      {
        id: "m5",
        courseId: "c3",
        title: "Scalability Foundations",
        description: "Horizontal vs vertical scaling, load balancing, caching.",
        order: 1,
        outcomes: [
          "Design scalable systems",
          "Choose appropriate scaling strategy",
        ],
        durationMinutes: 180,
        status: "draft",
        prerequisites: [],
        createdAt: "2026-04-05T09:00:00Z",
      },
      {
        id: "m6",
        courseId: "c4",
        title: "React Native Core Concepts",
        description: "Components, StyleSheet, Flexbox and navigation.",
        order: 1,
        outcomes: ["Build mobile UIs", "Navigate between screens"],
        durationMinutes: 200,
        status: "published",
        prerequisites: [],
        createdAt: "2026-03-10T09:00:00Z",
      },
    ],
    lessons: [
      {
        id: "l1",
        moduleId: "m1",
        title: "Variables & Scope",
        description: "var, let, const and how scope works in JavaScript.",
        videoUrl: "https://example.com/js-scope",
        notes: "Avoid using var. Prefer const over let.",
        resources: ["MDN Scope Guide"],
        attachments: [],
        estimatedDuration: 45,
        order: 1,
        createdAt: "2026-01-16T09:00:00Z",
      },
      {
        id: "l2",
        moduleId: "m1",
        title: "Functions & Closures",
        description:
          "Function declarations, expressions, arrow functions and closures.",
        videoUrl: "https://example.com/js-closures",
        notes: "Closures are one of the most powerful features of JS.",
        resources: ["JavaScript.info Closures"],
        attachments: [],
        estimatedDuration: 60,
        order: 2,
        createdAt: "2026-01-17T09:00:00Z",
      },
      {
        id: "l3",
        moduleId: "m2",
        title: "Promises Deep Dive",
        description: "Creating, chaining and handling promises.",
        videoUrl: "https://example.com/promises",
        notes: "Always handle promise rejections.",
        resources: ["MDN Promise API"],
        attachments: [],
        estimatedDuration: 50,
        order: 1,
        createdAt: "2026-01-21T09:00:00Z",
      },
      {
        id: "l4",
        moduleId: "m3",
        title: "Python Lists & Dicts",
        description: "Working with Python's core data structures.",
        videoUrl: "https://example.com/py-data",
        notes: "List comprehensions are idiomatic Python.",
        resources: ["Python Docs"],
        attachments: [],
        estimatedDuration: 40,
        order: 1,
        createdAt: "2026-02-21T09:00:00Z",
      },
      {
        id: "l5",
        moduleId: "m6",
        title: "Building Your First Screen",
        description:
          "Create a React Native screen with Text, View, and StyleSheet.",
        videoUrl: "https://example.com/rn-first-screen",
        notes: "Always use StyleSheet.create for performance.",
        resources: ["RN Docs"],
        attachments: [],
        estimatedDuration: 55,
        order: 1,
        createdAt: "2026-03-11T09:00:00Z",
      },
    ],
    topics: [
      {
        id: "t1",
        lessonId: "l1",
        title: "Temporal Dead Zone",
        concepts:
          "TDZ is the period between entering a scope and variable declaration.",
        examples: "console.log(x); let x = 5; // ReferenceError",
        exercises: "Identify TDZ in 3 code samples.",
        notes: "",
        codeSnippets: ["let x = 5; const y = x * 2;"],
        resources: [],
        order: 1,
        createdAt: "2026-01-17T09:00:00Z",
      },
      {
        id: "t2",
        lessonId: "l2",
        title: "Closure Patterns",
        concepts:
          "A closure gives access to an outer function scope from an inner function.",
        examples: "function counter() { let n = 0; return () => ++n; }",
        exercises: "Build a memoization function using closures.",
        notes: "Closures are created every time a function is created.",
        codeSnippets: ["const add = (a) => (b) => a + b;"],
        resources: [],
        order: 1,
        createdAt: "2026-01-18T09:00:00Z",
      },
      {
        id: "t3",
        lessonId: "l3",
        title: "Promise Chaining",
        concepts: "Each .then() returns a new promise, enabling chaining.",
        examples:
          "fetch(url).then(r => r.json()).then(data => console.log(data))",
        exercises: "Convert callback hell to promise chains.",
        notes: "Return values from .then() to pass them to the next handler.",
        codeSnippets: ["Promise.all([p1, p2]).then(([r1, r2]) => {})"],
        resources: [],
        order: 1,
        createdAt: "2026-01-22T09:00:00Z",
      },
    ],
    tutorials: [
      {
        id: "tu1",
        title: "Understanding Big O Notation",
        slug: "big-o-notation",
        content:
          "# Big O Notation\n\nBig O notation describes the upper bound of an algorithm complexity.\n\n## Time Complexity\n\n- O(1) Constant time\n- O(log n) Logarithmic\n- O(n) Linear\n- O(n^2) Quadratic",
        category: "Computer Science",
        tags: ["algorithms", "complexity", "dsa"],
        difficulty: "Beginner",
        readingTime: 8,
        author: "Dr. Emily Smith",
        status: "published",
        aiSummary:
          "An accessible introduction to Big O notation for algorithm analysis.",
        aiObjectives: [
          "Understand time complexity",
          "Analyze space complexity",
          "Compare algorithm efficiency",
        ],
        aiSeoDescription:
          "Learn Big O notation with practical examples and visualizations. Understand how to analyze algorithm complexity.",
        createdAt: "2026-01-05T09:00:00Z",
        updatedAt: "2026-03-10T12:00:00Z",
      },
      {
        id: "tu2",
        title: "Git Workflow Best Practices",
        slug: "git-workflow",
        content:
          "# Git Workflow Best Practices\n\nA well-defined Git workflow improves team collaboration.\n\n## Branching Strategy\n\nUse feature branches for all new work.",
        category: "DevOps",
        tags: ["git", "version-control", "workflow"],
        difficulty: "Beginner",
        readingTime: 6,
        author: "Alex Rivera",
        status: "published",
        aiSummary:
          "Practical Git workflow strategies for modern development teams.",
        aiObjectives: [
          "Use feature branches",
          "Write meaningful commit messages",
          "Review code effectively",
        ],
        aiSeoDescription:
          "Master Git workflows with branching strategies, commit conventions, and pull request best practices.",
        createdAt: "2026-02-01T09:00:00Z",
        updatedAt: "2026-04-15T09:00:00Z",
      },
      {
        id: "tu3",
        title: "React Performance Optimization",
        slug: "react-performance",
        content:
          "# React Performance Optimization\n\nPerformance matters in production applications.\n\n## useMemo and useCallback\n\nMemoize expensive computations and stable callback references.",
        category: "Web Development",
        tags: ["react", "performance", "optimization"],
        difficulty: "Advanced",
        readingTime: 12,
        author: "Jessica Zhang",
        status: "published",
        aiSummary:
          "Advanced techniques for optimizing React application performance.",
        aiObjectives: [
          "Identify performance bottlenecks",
          "Use memoization effectively",
          "Profile React apps",
        ],
        aiSeoDescription:
          "Optimize React apps with useMemo, useCallback, React.memo, and code splitting.",
        createdAt: "2026-03-01T09:00:00Z",
        updatedAt: "2026-05-20T10:00:00Z",
      },
      {
        id: "tu4",
        title: "Introduction to Kubernetes",
        slug: "intro-kubernetes",
        content:
          "# Introduction to Kubernetes\n\nKubernetes is a container orchestration platform.",
        category: "DevOps",
        tags: ["kubernetes", "containers", "devops"],
        difficulty: "Intermediate",
        readingTime: 15,
        author: "Marcus Lee",
        status: "draft",
        aiSummary:
          "A beginner-friendly intro to Kubernetes concepts and architecture.",
        aiObjectives: [
          "Understand pods and services",
          "Deploy apps to K8s",
          "Manage configurations",
        ],
        aiSeoDescription:
          "Learn Kubernetes from scratch with hands-on examples.",
        createdAt: "2026-04-10T09:00:00Z",
        updatedAt: "2026-06-01T09:00:00Z",
      },
      {
        id: "tu5",
        title: "CSS Grid Complete Guide",
        slug: "css-grid-guide",
        content:
          "# CSS Grid Complete Guide\n\nCSS Grid is a two-dimensional layout system.",
        category: "Web Development",
        tags: ["css", "grid", "layout"],
        difficulty: "Beginner",
        readingTime: 10,
        author: "Jessica Zhang",
        status: "draft",
        aiSummary:
          "A complete reference for CSS Grid layout with practical examples.",
        aiObjectives: [
          "Create grid layouts",
          "Use template areas",
          "Build responsive grids",
        ],
        aiSeoDescription:
          "Master CSS Grid with a complete guide covering all properties and real-world layout patterns.",
        createdAt: "2026-05-05T09:00:00Z",
        updatedAt: "2026-06-15T09:00:00Z",
      },
    ],
    instructors: [
      {
        id: "i1",
        name: "Dr. Emily Smith",
        email: "emily@quild.dev",
        bio: "Senior JS Engineer with 12 years of experience building scalable web applications. Google Developer Expert.",
        expertise: ["JavaScript", "TypeScript", "React", "Node.js"],
        avatar: "",
        courseIds: ["c1", "c4"],
        rating: 4.9,
        studentsCount: 5089,
        createdAt: "2025-12-01T09:00:00Z",
      },
      {
        id: "i2",
        name: "Alex Rivera",
        email: "alex@quild.dev",
        bio: "Staff Engineer at a FAANG company, specializing in distributed systems and infrastructure design.",
        expertise: ["System Design", "Distributed Systems", "Go", "Kubernetes"],
        avatar: "",
        courseIds: ["c1", "c3"],
        rating: 4.8,
        studentsCount: 3102,
        createdAt: "2025-12-15T09:00:00Z",
      },
      {
        id: "i3",
        name: "Jessica Zhang",
        email: "jessica@quild.dev",
        bio: "ML Research Scientist with publications in NLP and Computer Vision. PhD from MIT.",
        expertise: ["Machine Learning", "Python", "TensorFlow", "NLP"],
        avatar: "",
        courseIds: ["c2", "c5"],
        rating: 4.9,
        studentsCount: 2105,
        createdAt: "2026-01-05T09:00:00Z",
      },
      {
        id: "i4",
        name: "Marcus Lee",
        email: "marcus@quild.dev",
        bio: "DevOps Architect building cloud-native platforms at enterprise scale for Fortune 500 companies.",
        expertise: ["DevOps", "AWS", "Kubernetes", "Terraform"],
        avatar: "",
        courseIds: ["c5"],
        rating: 4.7,
        studentsCount: 1240,
        createdAt: "2026-02-01T09:00:00Z",
      },
    ],
    assignments: [
      {
        id: "a1",
        lessonId: "l1",
        title: "Scope Explorer Exercise",
        description:
          "Identify the scope chain in 5 provided code snippets and explain how variables are resolved.",
        dueDate: "2026-07-15T23:59:00Z",
        submissionType: "text",
        evaluationCriteria:
          "Accuracy of scope analysis, clarity of explanation",
        autoGrading: false,
        status: "published",
        submissionsCount: 124,
        createdAt: "2026-01-16T09:00:00Z",
      },
      {
        id: "a2",
        lessonId: "l2",
        title: "Build a Closure-based Module",
        description:
          "Create a module pattern using closures that manages a shopping cart state.",
        dueDate: "2026-07-20T23:59:00Z",
        submissionType: "code",
        evaluationCriteria: "Correct encapsulation, tests passing, clean code",
        autoGrading: true,
        status: "published",
        submissionsCount: 98,
        createdAt: "2026-01-18T09:00:00Z",
      },
      {
        id: "a3",
        lessonId: "l3",
        title: "Promise Chain Refactor",
        description:
          "Refactor the provided callback-based API client to use promises and async/await.",
        dueDate: "2026-07-25T23:59:00Z",
        submissionType: "code",
        evaluationCriteria:
          "Correct async handling, error handling, readability",
        autoGrading: true,
        status: "published",
        submissionsCount: 87,
        createdAt: "2026-01-22T09:00:00Z",
      },
      {
        id: "a4",
        lessonId: "l4",
        title: "Data Cleaning Challenge",
        description:
          "Clean and analyze the provided messy CSV dataset using Pandas.",
        dueDate: "2026-08-01T23:59:00Z",
        submissionType: "file",
        evaluationCriteria:
          "Data quality, analysis insights, visualization quality",
        autoGrading: false,
        status: "published",
        submissionsCount: 45,
        createdAt: "2026-02-22T09:00:00Z",
      },
    ],
    quizzes: [
      {
        id: "q1",
        topicId: "t1",
        title: "JavaScript Scope Quiz",
        questions: [
          {
            id: "qq1",
            type: "mcq",
            question: "What keyword creates block-scoped variables?",
            options: ["var", "let", "function", "scope"],
            answer: "let",
            explanation:
              "let and const are block-scoped; var is function-scoped.",
            points: 10,
          },
          {
            id: "qq2",
            type: "truefalse",
            question: "var is hoisted to the top of the function scope.",
            options: ["True", "False"],
            answer: "True",
            explanation:
              "var declarations are hoisted and initialized to undefined.",
            points: 10,
          },
        ],
        timeLimit: 15,
        passingMarks: 70,
        randomize: true,
        attemptLimit: 3,
        status: "published",
        attemptsCount: 203,
        averageScore: 78,
        createdAt: "2026-01-17T09:00:00Z",
      },
      {
        id: "q2",
        topicId: "t2",
        title: "Closures Quiz",
        questions: [
          {
            id: "qq3",
            type: "mcq",
            question: "What is a closure?",
            options: [
              "A loop structure",
              "A function that retains access to its outer scope",
              "A class method",
              "An async function",
            ],
            answer: "A function that retains access to its outer scope",
            explanation:
              "Closures preserve access to variables from the enclosing scope.",
            points: 10,
          },
        ],
        timeLimit: 10,
        passingMarks: 80,
        randomize: false,
        attemptLimit: 2,
        status: "published",
        attemptsCount: 156,
        averageScore: 82,
        createdAt: "2026-01-19T09:00:00Z",
      },
    ],
    certificates: [
      {
        id: "cert1",
        courseId: "c1",
        template: "modern",
        autoIssue: true,
        issuedCount: 287,
        createdAt: "2026-01-10T09:00:00Z",
      },
      {
        id: "cert2",
        courseId: "c2",
        template: "classic",
        autoIssue: true,
        issuedCount: 142,
        createdAt: "2026-02-15T09:00:00Z",
      },
      {
        id: "cert3",
        courseId: "c3",
        template: "minimal",
        autoIssue: false,
        issuedCount: 0,
        createdAt: "2026-04-01T09:00:00Z",
      },
      {
        id: "cert4",
        courseId: "c5",
        template: "modern",
        autoIssue: false,
        issuedCount: 0,
        createdAt: "2026-05-01T09:00:00Z",
      },
    ],
    categories: [
      {
        id: "cat1",
        name: "Web Development",
        slug: "web-development",
        parentId: null,
        type: "course",
        itemCount: 2,
      },
      {
        id: "cat2",
        name: "Data Science",
        slug: "data-science",
        parentId: null,
        type: "course",
        itemCount: 1,
      },
      {
        id: "cat3",
        name: "Software Engineering",
        slug: "software-engineering",
        parentId: null,
        type: "course",
        itemCount: 1,
      },
      {
        id: "cat4",
        name: "Mobile Development",
        slug: "mobile-development",
        parentId: null,
        type: "course",
        itemCount: 1,
      },
      {
        id: "cat5",
        name: "AI & ML",
        slug: "ai-ml",
        parentId: null,
        type: "course",
        itemCount: 1,
      },
      {
        id: "cat6",
        name: "DevOps",
        slug: "devops",
        parentId: null,
        type: "tutorial",
        itemCount: 2,
      },
    ],
    tags: [
      {
        id: "tag1",
        name: "javascript",
        slug: "javascript",
        color: "#f7df1e",
        type: "course",
        usageCount: 8,
      },
      {
        id: "tag2",
        name: "typescript",
        slug: "typescript",
        color: "#3178c6",
        type: "course",
        usageCount: 5,
      },
      {
        id: "tag3",
        name: "python",
        slug: "python",
        color: "#3776ab",
        type: "course",
        usageCount: 7,
      },
      {
        id: "tag4",
        name: "react",
        slug: "react",
        color: "#61dafb",
        type: "course",
        usageCount: 4,
      },
      {
        id: "tag5",
        name: "machine-learning",
        slug: "machine-learning",
        color: "#ff6b6b",
        type: "course",
        usageCount: 3,
      },
      {
        id: "tag6",
        name: "algorithms",
        slug: "algorithms",
        color: "#a78bfa",
        type: "tutorial",
        usageCount: 6,
      },
      {
        id: "tag7",
        name: "git",
        slug: "git",
        color: "#f05032",
        type: "tutorial",
        usageCount: 3,
      },
      {
        id: "tag8",
        name: "css",
        slug: "css",
        color: "#264de4",
        type: "tutorial",
        usageCount: 4,
      },
    ],
  };
}

// ==========================================
// DB Helpers
// ==========================================

const LMS_DB_KEY = "quild_lms_db";

function readDb(): LmsDb {
  try {
    const raw = localStorage.getItem(LMS_DB_KEY);
    if (raw) return JSON.parse(raw) as LmsDb;
  } catch {
    // ignore parse errors
  }
  return defaultDb();
}

function writeDb(db: LmsDb): void {
  localStorage.setItem(LMS_DB_KEY, JSON.stringify(db));
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ==========================================
// Courses
// ==========================================

export function useLmsCourses() {
  return useQuery({
    queryKey: ["lms", "courses"],
    queryFn: async () => {
      await delay(200);
      return readDb().courses;
    },
  });
}

export function useSaveLmsCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (course: LmsCourse) => {
      await delay(300);
      const db = readDb();
      const idx = db.courses.findIndex((c) => c.id === course.id);
      if (idx >= 0) db.courses[idx] = course;
      else db.courses.push(course);
      writeDb(db);
      return course;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lms"] }),
  });
}

export function useDeleteLmsCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await delay(200);
      const db = readDb();
      db.courses = db.courses.filter((c) => c.id !== id);
      writeDb(db);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lms"] }),
  });
}

// ==========================================
// Modules
// ==========================================

export function useLmsModules() {
  return useQuery({
    queryKey: ["lms", "modules"],
    queryFn: async () => {
      await delay(200);
      return readDb().modules;
    },
  });
}

export function useSaveLmsModule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (mod: LmsModule) => {
      await delay(300);
      const db = readDb();
      const idx = db.modules.findIndex((m) => m.id === mod.id);
      if (idx >= 0) db.modules[idx] = mod;
      else db.modules.push(mod);
      writeDb(db);
      return mod;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lms"] }),
  });
}

export function useDeleteLmsModule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await delay(200);
      const db = readDb();
      db.modules = db.modules.filter((m) => m.id !== id);
      writeDb(db);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lms"] }),
  });
}

// ==========================================
// Lessons
// ==========================================

export function useLmsLessons() {
  return useQuery({
    queryKey: ["lms", "lessons"],
    queryFn: async () => {
      await delay(200);
      return readDb().lessons;
    },
  });
}

export function useSaveLmsLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (lesson: LmsLesson) => {
      await delay(300);
      const db = readDb();
      const idx = db.lessons.findIndex((l) => l.id === lesson.id);
      if (idx >= 0) db.lessons[idx] = lesson;
      else db.lessons.push(lesson);
      writeDb(db);
      return lesson;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lms"] }),
  });
}

export function useDeleteLmsLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await delay(200);
      const db = readDb();
      db.lessons = db.lessons.filter((l) => l.id !== id);
      writeDb(db);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lms"] }),
  });
}

// ==========================================
// Topics
// ==========================================

export function useLmsTopics() {
  return useQuery({
    queryKey: ["lms", "topics"],
    queryFn: async () => {
      await delay(200);
      return readDb().topics;
    },
  });
}

export function useSaveLmsTopic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (topic: LmsTopic) => {
      await delay(300);
      const db = readDb();
      const idx = db.topics.findIndex((t) => t.id === topic.id);
      if (idx >= 0) db.topics[idx] = topic;
      else db.topics.push(topic);
      writeDb(db);
      return topic;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lms"] }),
  });
}

export function useDeleteLmsTopic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await delay(200);
      const db = readDb();
      db.topics = db.topics.filter((t) => t.id !== id);
      writeDb(db);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lms"] }),
  });
}

// ==========================================
// Tutorials
// ==========================================

export function useLmsTutorials() {
  return useQuery({
    queryKey: ["lms", "tutorials"],
    queryFn: async () => {
      await delay(200);
      return readDb().tutorials;
    },
  });
}

export function useSaveLmsTutorial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (tutorial: LmsTutorial) => {
      await delay(300);
      const db = readDb();
      const idx = db.tutorials.findIndex((t) => t.id === tutorial.id);
      if (idx >= 0) db.tutorials[idx] = tutorial;
      else db.tutorials.push(tutorial);
      writeDb(db);
      return tutorial;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lms"] }),
  });
}

export function useDeleteLmsTutorial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await delay(200);
      const db = readDb();
      db.tutorials = db.tutorials.filter((t) => t.id !== id);
      writeDb(db);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lms"] }),
  });
}

// ==========================================
// Instructors
// ==========================================

export function useLmsInstructors() {
  return useQuery({
    queryKey: ["lms", "instructors"],
    queryFn: async () => {
      await delay(200);
      return readDb().instructors;
    },
  });
}

export function useSaveLmsInstructor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (instructor: LmsInstructor) => {
      await delay(300);
      const db = readDb();
      const idx = db.instructors.findIndex((i) => i.id === instructor.id);
      if (idx >= 0) db.instructors[idx] = instructor;
      else db.instructors.push(instructor);
      writeDb(db);
      return instructor;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lms"] }),
  });
}

export function useDeleteLmsInstructor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await delay(200);
      const db = readDb();
      db.instructors = db.instructors.filter((i) => i.id !== id);
      writeDb(db);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lms"] }),
  });
}

// ==========================================
// Assignments
// ==========================================

export function useLmsAssignments() {
  return useQuery({
    queryKey: ["lms", "assignments"],
    queryFn: async () => {
      await delay(200);
      return readDb().assignments;
    },
  });
}

export function useSaveLmsAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (assignment: LmsAssignment) => {
      await delay(300);
      const db = readDb();
      const idx = db.assignments.findIndex((a) => a.id === assignment.id);
      if (idx >= 0) db.assignments[idx] = assignment;
      else db.assignments.push(assignment);
      writeDb(db);
      return assignment;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lms"] }),
  });
}

export function useDeleteLmsAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await delay(200);
      const db = readDb();
      db.assignments = db.assignments.filter((a) => a.id !== id);
      writeDb(db);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lms"] }),
  });
}

// ==========================================
// Quizzes
// ==========================================

export function useLmsQuizzes() {
  return useQuery({
    queryKey: ["lms", "quizzes"],
    queryFn: async () => {
      await delay(200);
      return readDb().quizzes;
    },
  });
}

export function useSaveLmsQuiz() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (quiz: LmsQuiz) => {
      await delay(300);
      const db = readDb();
      const idx = db.quizzes.findIndex((q) => q.id === quiz.id);
      if (idx >= 0) db.quizzes[idx] = quiz;
      else db.quizzes.push(quiz);
      writeDb(db);
      return quiz;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lms"] }),
  });
}

export function useDeleteLmsQuiz() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await delay(200);
      const db = readDb();
      db.quizzes = db.quizzes.filter((q) => q.id !== id);
      writeDb(db);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lms"] }),
  });
}

// ==========================================
// Certificates
// ==========================================

export function useLmsCertificates() {
  return useQuery({
    queryKey: ["lms", "certificates"],
    queryFn: async () => {
      await delay(200);
      return readDb().certificates;
    },
  });
}

export function useSaveLmsCertificate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (cert: LmsCertificate) => {
      await delay(300);
      const db = readDb();
      const idx = db.certificates.findIndex((c) => c.id === cert.id);
      if (idx >= 0) db.certificates[idx] = cert;
      else db.certificates.push(cert);
      writeDb(db);
      return cert;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lms"] }),
  });
}

// ==========================================
// Categories & Tags
// ==========================================

export function useLmsCategories() {
  return useQuery({
    queryKey: ["lms", "categories"],
    queryFn: async () => {
      await delay(200);
      return readDb().categories;
    },
  });
}

export function useSaveLmsCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (cat: LmsCategory) => {
      await delay(300);
      const db = readDb();
      const idx = db.categories.findIndex((c) => c.id === cat.id);
      if (idx >= 0) db.categories[idx] = cat;
      else db.categories.push(cat);
      writeDb(db);
      return cat;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lms"] }),
  });
}

export function useDeleteLmsCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await delay(200);
      const db = readDb();
      db.categories = db.categories.filter((c) => c.id !== id);
      writeDb(db);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lms"] }),
  });
}

export function useLmsTags() {
  return useQuery({
    queryKey: ["lms", "tags"],
    queryFn: async () => {
      await delay(200);
      return readDb().tags;
    },
  });
}

export function useSaveLmsTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (tag: LmsTag) => {
      await delay(300);
      const db = readDb();
      const idx = db.tags.findIndex((t) => t.id === tag.id);
      if (idx >= 0) db.tags[idx] = tag;
      else db.tags.push(tag);
      writeDb(db);
      return tag;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lms"] }),
  });
}

export function useDeleteLmsTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await delay(200);
      const db = readDb();
      db.tags = db.tags.filter((t) => t.id !== id);
      writeDb(db);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lms"] }),
  });
}

// ==========================================
// Aggregate stats (for dashboard)
// ==========================================

export function useLmsStats() {
  return useQuery({
    queryKey: ["lms", "stats"],
    queryFn: async () => {
      await delay(250);
      const db = readDb();
      return {
        totalCourses: db.courses.length,
        publishedCourses: db.courses.filter((c) => c.status === "published")
          .length,
        draftCourses: db.courses.filter((c) => c.status === "draft").length,
        totalModules: db.modules.length,
        totalLessons: db.lessons.length,
        totalTopics: db.topics.length,
        totalTutorials: db.tutorials.length,
        publishedTutorials: db.tutorials.filter((t) => t.status === "published")
          .length,
        totalStudents: db.courses.reduce((acc, c) => acc + c.studentsCount, 0),
        activeStudents: Math.floor(
          db.courses.reduce((acc, c) => acc + c.studentsCount, 0) * 0.68,
        ),
        certificatesIssued: db.certificates.reduce(
          (acc, c) => acc + c.issuedCount,
          0,
        ),
        quizAttempts: db.quizzes.reduce((acc, q) => acc + q.attemptsCount, 0),
        assignmentSubmissions: db.assignments.reduce(
          (acc, a) => acc + a.submissionsCount,
          0,
        ),
        completionRate: 72,
        totalInstructors: db.instructors.length,
      };
    },
  });
}
