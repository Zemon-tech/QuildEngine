import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, X, FileText, User, Compass, 
  ChevronLeft, ChevronRight, Search, Building2, Library, 
  Sparkles, Clock, ArrowRight, 
  Award, Send, Code, GraduationCap, 
  Filter, Newspaper, BookMarked, History
} from "lucide-react";
import {
  MeshGradientBackground,
  AnimatedGrid,
  ResearchWorkspacePreview,
  FeatureCard,
  KnowledgeGraph,
  WorkflowTimeline,
  InsightCard,
  CollaborationPreview,
} from "#/components/research";

interface ResearchSearch {
  view?: ResearchView;
  paperId?: string;
  articleId?: string;
  q?: string;
}

export const Route = createFileRoute("/_app/research")({
  validateSearch: (search: Record<string, unknown>): ResearchSearch => {
    return {
      view: search.view as ResearchView | undefined,
      paperId: search.paperId as string | undefined,
      articleId: search.articleId as string | undefined,
      q: search.q as string | undefined,
    };
  },
  component: ResearchPage,
});

// ─── TYPES ──────────────────────────────────────────────────────────────────
type ResearchView = 
  | "home" 
  | "search" 
  | "feed" 
  | "detail" 
  | "researchers" 
  | "organizations" 
  | "collections" 
  | "articles";

interface Paper {
  id: string;
  title: string;
  authors: string[];
  organizations: string[];
  date: string;
  duration: string;
  doi: string;
  abstract: string;
  keyFindings: string[];
  aiSummary: string;
  content: string;
  domain: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
  views: number;
  citations: number;
  likes: number;
  figure?: React.ReactNode;
}

interface Article {
  id: string;
  title: string;
  author: string;
  category: string;
  tags: string[];
  readTime: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  publishedAt: string;
  content: string;
}

interface Researcher {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  organization: string;
  expertise: string[];
  followers: number;
  papersCount: number;
  popularDomains: string[];
}

interface Organization {
  id: string;
  name: string;
  logo: string;
  about: string;
  researchers: string[];
  domains: string[];
  publicationsCount: number;
}

interface Collection {
  id: string;
  name: string;
  description: string;
  papersCount: number;
  papers: string[]; // Paper IDs
}

// ─── MOCK DATABASES ─────────────────────────────────────────────────────────
const mockPapers: Paper[] = [
  {
    id: "scaling-laws",
    title: "Scaling Laws for Autoregressive Generative Models",
    authors: ["J. Kaplan", "S. McCandlish", "T. Henighan", "D. Amodei"],
    organizations: ["OpenAI"],
    date: "Jan 2020",
    duration: "08:15",
    doi: "10.48550/arXiv.2001.08361",
    domain: "Artificial Intelligence",
    difficulty: "Advanced",
    tags: ["LLM", "Scaling", "Generative Models", "Compute"],
    views: 4500,
    citations: 1200,
    likes: 840,
    abstract: "We study the empirical scaling laws for language model performance on cross-entropy loss. Loss scales as a power-law with parameter count, dataset size, and compute budgets, showing minimal dependence on hyper-parameters.",
    keyFindings: [
      "Loss scales as a power-law with compute, dataset size, and parameter count.",
      "Network width or depth have negligible impact on performance at a constant compute budget.",
      "Larger models are significantly more sample-efficient than smaller models."
    ],
    aiSummary: "This paper outlines the foundation of LLM scaling. It demonstrates that model performance increases predictably in relation to parameters, dataset size, and compute, establishing power-law relations that guided the development of GPT-3 and subsequent models.",
    content: `When we evaluate generative autoregressive model loss, we identify three clean power-law scaling lines spanning over seven orders of magnitude. The loss is relatively insensitive to hyperparameters like depth vs width as long as the capacity is held constant.
    
    ### Implications for Large Training Runs
    Because parameter efficiency scales predictably, training larger models on fewer tokens is compute-optimal compared to training smaller models on large quantities of data.`,
    figure: <ResearchWorkspacePreview />
  },
  {
    id: "concept-graph",
    title: "Global Concept Maps & Concept Network Models",
    authors: ["Elena Rostova", "Liam Vance"],
    organizations: ["Antigravity Labs"],
    date: "Mar 2026",
    duration: "11:30",
    doi: "10.48550/arXiv.2603.01928",
    domain: "Artificial Intelligence",
    difficulty: "Advanced",
    tags: ["Concept Mapping", "Cognitive Maps", "Activations"],
    views: 2800,
    citations: 340,
    likes: 512,
    abstract: "An inquiry into visual representation of neural activation tokens. We structure interactive node coordinates in real-time, matching concept relationships across multi-dimensional cluster projection maps.",
    keyFindings: [
      "Visual concept representations capture structural semantic dependencies.",
      "Real-time projection methods enable interactive exploration of neural coordinate fields.",
      "Activation patterns reveal semantic clusters corresponding to domain expertise namespaces."
    ],
    aiSummary: "The authors introduce a high-fidelity semantic graph visualizer that projects token activations onto geometric clusters. This model explains how dense state vectors capture conceptual relationships.",
    content: `Mapping semantic states requires visualizing connections between diverse conceptual namespaces. Traditional flat spreadsheets fail to capture structural hierarchy. By constructing geometric projection coordinate fields, developers can map activation patterns visually, inspecting nodes, clusters, and connections dynamically.`,
    figure: <KnowledgeGraph />
  },
  {
    id: "emergent-abilities",
    title: "Emergent Abilities of Large Language Models",
    authors: ["J. Wei", "Y. Tay", "R. Bommasani", "C. Raffel", "Q. Le"],
    organizations: ["Google Research", "DeepMind"],
    date: "Jun 2022",
    duration: "12:15",
    doi: "10.1162/tacl_a_00528",
    domain: "Natural Language Processing",
    difficulty: "Intermediate",
    tags: ["Emergence", "LLM Evaluation", "Prompting", "BIG-bench"],
    views: 6100,
    citations: 940,
    likes: 1220,
    abstract: "Emergence represents abilities that are absent in smaller models but appear dramatically in large parameter scales. We document emergent capabilities across multiple prompting benchmarks and discuss model scaling implications.",
    keyFindings: [
      "Abilities like multi-step reasoning appear abruptly as parameter scale shifts.",
      "Emergence is observed consistently across benchmarks like BIG-bench and GSM8K.",
      "Model scale parameter requirements differ drastically per algorithmic task."
    ],
    aiSummary: "This paper catalogs how larger model sizes enable capabilities that cannot be predicted by extrapolating performance from smaller versions, shifting execution rates from random guess to high accuracy.",
    content: `An ability is emergent if it is not present in smaller models but is present in larger models. We define emergent abilities mathematically as when a scale parameter shifts model prediction performance from random guess to high accuracy abruptly. Emergent benchmarks include multi-step reasoning, mathematical word problems, symbol translation, and instruction following, which often manifest above 10^22 FLOPs of scale.`,
    figure: (
      <div className="space-y-4">
        <InsightCard />
        <FeatureCard />
      </div>
    )
  },
  {
    id: "collaborative-notebooks",
    title: "Real-Time Collaborative Notebooks",
    authors: ["S. Jenkins", "A. Rivera"],
    organizations: ["Antigravity Labs"],
    date: "Oct 2024",
    duration: "10:45",
    doi: "10.48550/arXiv.2410.09871",
    domain: "Software Engineering",
    difficulty: "Intermediate",
    tags: ["CRDTs", "Real-Time Collaboration", "Concurrency Control"],
    views: 1900,
    citations: 180,
    likes: 390,
    abstract: "This paper introduces design paradigms for multiplayer scientific research workspaces. We evaluate CRDT conflict resolution models on canvas whiteboard coordinates and remote cursor sharing under variable network latency.",
    keyFindings: [
      "Conflict-free Replicated Data Types (CRDTs) yield optimal visual sync for research canvases.",
      "Dynamic cursor resolution scales smoothly up to 50 concurrent active editors.",
      "Latency masking techniques reduce perceived lag in scientific editing."
    ],
    aiSummary: "The authors outline concurrency handling for scientific whiteboard notebooks. They prove that custom CRDT coordinates solve collaborative overlay conflicts without backend locking.",
    content: `Modern research is increasingly collaborative and distributed. Traditional static documents fail to capture the interactive flow of joint prompt tuning, shared literature annotation, and model output analysis. By designing collaborative workspaces built on conflict-free replicated data structures, researchers can co-design prompts and review output traces in real-time.`,
    figure: <CollaborationPreview />
  },
  {
    id: "verifiable-code-synthesis",
    title: "Verifiable Code Synthesis",
    authors: ["E. Rostova", "L. Vance", "A. Novikov"],
    organizations: ["Antigravity Labs"],
    date: "May 2026",
    duration: "07:45",
    doi: "10.48550/arXiv.2605.10928",
    domain: "Software Engineering",
    difficulty: "Advanced",
    tags: ["Code Synthesis", "Symbolic Execution", "Assertions"],
    views: 3100,
    citations: 210,
    likes: 670,
    abstract: "We present a framework for verifiable code synthesis using execution-guided symbolic assertions. By embedding automated correctness checks directly into the LLM decoding loop, we guarantee syntactic correctness and logical alignment with specifications.",
    keyFindings: [
      "Embedding sandbox assertions into decoding loops increases code compilation rates.",
      "Execution tracking prevents hallucination of non-existent libraries.",
      "Repair logic backtracks dynamically on code compilation failure."
    ],
    aiSummary: "Outlines a synthesis compiler integration that checks code correctness mid-generation. It ensures created functions compile and pass unit tests before final confirmation.",
    content: `Traditional code generation models operate strictly on token probabilities, often generating syntactically valid code that fails basic execution logic. Verifiable Code Synthesis solves this by coupling LLM decoding with an execution-sandbox loop that evaluates symbolic assertions on-the-fly. By checking assertions and type contracts directly before token sequence finalization, the model backtracks and repairs code sections that fail unit tests.`,
    figure: (
      <div className="space-y-4 p-4 bg-[var(--sb-bg)]/80 rounded-xl border border-[var(--sb-border)]/30 font-sans">
        <div className="flex items-center justify-between border-b border-[var(--sb-border)]/30 pb-2">
          <span className="text-[10px] font-mono text-[var(--sb-ink-dim)] uppercase">Verification Pipeline Telemetry</span>
          <span className="text-[9px] bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-0.5 rounded font-mono font-bold">Passed</span>
        </div>
        <div className="space-y-3 font-mono text-xs">
          <div className="flex items-start gap-2.5">
            <div className="size-4 rounded-full bg-indigo-500/20 border border-indigo-500 text-indigo-500 flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5">1</div>
            <div className="space-y-1 font-sans">
              <div className="text-[var(--sb-ink)] font-bold text-xs">Generate Code Candidate</div>
              <div className="text-[var(--sb-ink-dim)] text-[10px]">Model outputs: `def solve(n): return [i*i for i in range(n)]`</div>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <div className="size-4 rounded-full bg-indigo-500/20 border border-indigo-500 text-indigo-500 flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5">2</div>
            <div className="space-y-1 font-sans">
              <div className="text-[var(--sb-ink)] font-bold text-xs">Inject Execution Assertions</div>
              <div className="text-[var(--sb-ink-dim)] text-[10px]">Appended unit test check: `assert solve(3) == [0, 1, 4]`</div>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <div className="size-4 rounded-full bg-green-500/20 border border-green-500 text-green-500 flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5">✓</div>
            <div className="space-y-1 font-sans">
              <div className="text-[var(--sb-ink)] font-bold text-xs">Assertion Passed (0ms)</div>
              <div className="text-[var(--sb-ink-dim)] text-[10px]">Sandbox execution succeeded. Candidate verified and committed.</div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "deep-residual",
    title: "Deep Residual Learning for Image Recognition",
    authors: ["K. He", "X. Zhang", "S. Ren", "J. Sun"],
    organizations: ["Microsoft Research"],
    date: "Dec 2015",
    duration: "09:30",
    doi: "10.1109/CVPR.2016.90",
    domain: "Computer Vision",
    difficulty: "Advanced",
    tags: ["ResNet", "Deep Learning", "Skip Connections", "Classification"],
    views: 9200,
    citations: 145000,
    likes: 4200,
    abstract: "Presents a residual learning framework to ease training of deep neural networks. We reformulate layers as learning residual functions with reference to inputs, achieving state-of-the-art accuracy at 152 layers.",
    keyFindings: [
      "Residual learning makes extremely deep neural network optimization feasible.",
      "Skip connections propagate gradients directly without adding parameter cost.",
      "Achieved 1st place in ImageNet classification with a 152-layer architecture."
    ],
    aiSummary: "The breakthrough paper introducing ResNets. By adding shortcut skip-connections that perform identity mapping, the authors solved the vanishing gradient problem, allowing networks to grow deeper and more accurate.",
    content: `When deeper networks start converging, an accuracy degradation problem is exposed: with network depth increasing, accuracy saturates and then degrades rapidly. This is not caused by overfitting, and adding more layers leads to higher training errors. Instead of hoping stacked layers fit a desired underlying mapping, we explicitly let these layers fit a residual mapping. The original mapping is reformulated into residual skips, realized via feed-forward connections.`,
    figure: <WorkflowTimeline />
  }
];

const mockArticles: Article[] = [
  {
    id: "v8-opt",
    title: "V8 Compiler Optimization Loops",
    author: "Shivansh Kumar",
    category: "Software Engineering",
    tags: ["Javascript", "V8", "Compilers", "Runtime"],
    readTime: "9 min read",
    difficulty: "Intermediate",
    publishedAt: "June 08, 2026",
    content: `Google's V8 JIT compiler optimizes code dynamically. When code is identified as hot, it compiles it directly into machine assembly.

### Inline Caching
Inline caching remembers the shapes of objects passed to a function. If the shape doesn't change, V8 skips the slow lookup of property locations in memory.`
  },
  {
    id: "dynamic-vectors",
    title: "Amortized Cost Analysis in Dynamic Vectors",
    author: "Shivansh Kumar",
    category: "Algorithms",
    tags: ["DSA", "Complexity", "Vectors", "Data Structures"],
    readTime: "8 min read",
    difficulty: "Beginner",
    publishedAt: "June 20, 2026",
    content: `When we allocate memory for a static array, its capacity is fixed. To allow dynamic expansion, collections like vectors (in C++) and ArrayLists (in Java) allocate a larger block of memory under the hood once the array is full, copy elements over, and delete the old memory block.

### Mathematical Proof
Suppose we start with capacity 1 and double it whenever full. Total cost for N insertions = N (insertions) + N - 1 (copies) ≈ 2N. Amortized cost per insertion = 2N / N = O(1) constant time!`
  },
  {
    id: "consistent-hashing",
    title: "Distributed Caching: Consistent Hashing & Eviction Policies",
    author: "Sanket Singh",
    category: "Distributed Systems",
    tags: ["System Design", "Caching", "Consistent Hashing"],
    readTime: "14 min read",
    difficulty: "Advanced",
    publishedAt: "June 18, 2026",
    content: `In a standard modulo caching cluster, adding or removing a node invalidates almost all keys. Consistent hashing solves this by mapping both nodes and keys to a 360-degree circular ring.`
  }
];

const mockResearchers: Researcher[] = [
  {
    id: "elena-rostova",
    name: "Elena Rostova",
    avatar: "ER",
    bio: "Senior Research Director at Antigravity Labs. Focuses on code synthesis systems and semantic activation visualizations.",
    organization: "Antigravity Labs",
    expertise: ["AI Models", "Code Synthesis", "Concept Mapping"],
    followers: 1200,
    papersCount: 14,
    popularDomains: ["Artificial Intelligence", "Software Engineering"]
  },
  {
    id: "liam-vance",
    name: "Liam Vance",
    avatar: "LV",
    bio: "Principal AI Scientist focusing on topological activation analysis and generative model explainability.",
    organization: "Antigravity Labs",
    expertise: ["Generative AI", "Topological Visuals", "Interpretable ML"],
    followers: 940,
    papersCount: 8,
    popularDomains: ["Artificial Intelligence", "Natural Language Processing"]
  },
  {
    id: "shivansh-kumar",
    name: "Shivansh Kumar",
    avatar: "SK",
    bio: "Lead Systems Architect & Algorithms Lecturer. Specializes in runtime JIT compilers and amortized performance models.",
    organization: "MIT",
    expertise: ["Compiler Loops", "Data Structures", "Distributed Design"],
    followers: 2400,
    papersCount: 19,
    popularDomains: ["Software Engineering", "Algorithms", "Database Systems"]
  }
];

const mockOrganizations: Organization[] = [
  {
    id: "openai",
    name: "OpenAI",
    logo: "OA",
    about: "Research and deployment company dedicated to ensuring that artificial general intelligence benefits all of humanity.",
    researchers: ["J. Kaplan", "S. McCandlish", "T. Henighan"],
    domains: ["Artificial Intelligence", "Deep Learning", "Generative AI"],
    publicationsCount: 240
  },
  {
    id: "antigravity-labs",
    name: "Antigravity Labs",
    logo: "AG",
    about: "Advanced scientific research facility engineering collaborative notebook compilers, concept coordinates, and sandboxed symbolic execution code generators.",
    researchers: ["Elena Rostova", "Liam Vance", "S. Jenkins", "A. Rivera"],
    domains: ["Artificial Intelligence", "Software Engineering", "Natural Language Processing"],
    publicationsCount: 32
  },
  {
    id: "google-research",
    name: "Google Research",
    logo: "GR",
    about: "Tackling challenges that define the next generation of computing and technology, with global labs pushing algorithms boundaries.",
    researchers: ["J. Wei", "Y. Tay", "Q. Le"],
    domains: ["Natural Language Processing", "Computer Vision", "Machine Learning"],
    publicationsCount: 1450
  }
];

const mockCollections: Collection[] = [
  {
    id: "ai-learning",
    name: "AI & Neural Scaling",
    description: "Curated papers detailing autoregressive laws, emerging benchmarks, and topological network graph activations.",
    papersCount: 3,
    papers: ["scaling-laws", "concept-graph", "emergent-abilities"]
  },
  {
    id: "systems-software",
    name: "Software Engineering & Systems",
    description: "Multiplayer scientific whiteboard editors, sandboxed synthesis assertions, and ResNets optimization.",
    papersCount: 3,
    papers: ["collaborative-notebooks", "verifiable-code-synthesis", "deep-residual"]
  }
];

// Unified global database search items
interface SearchItem {
  id: string;
  type: "Paper" | "Article" | "Tutorial" | "Course" | "Roadmap" | "Project";
  title: string;
  creator: string;
  domain: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  readTime: string;
  url?: string;
}

const mockSearchItems: SearchItem[] = [
  { id: "scaling-laws", type: "Paper", title: "Scaling Laws for Autoregressive Generative Models", creator: "J. Kaplan et al.", domain: "Artificial Intelligence", difficulty: "Advanced", readTime: "8 min" },
  { id: "concept-graph", type: "Paper", title: "Concept Graph", creator: "Elena Rostova & Liam Vance", domain: "Artificial Intelligence", difficulty: "Advanced", readTime: "11 min" },
  { id: "emergent-abilities", type: "Paper", title: "Emergent Abilities of Large Language Models", creator: "J. Wei et al.", domain: "Natural Language Processing", difficulty: "Intermediate", readTime: "12 min" },
  { id: "collaborative-notebooks", type: "Paper", title: "Real-Time Collaborative Notebooks", creator: "S. Jenkins & A. Rivera", domain: "Software Engineering", difficulty: "Intermediate", readTime: "10 min" },
  { id: "verifiable-code-synthesis", type: "Paper", title: "Verifiable Code Synthesis", creator: "E. Rostova et al.", domain: "Software Engineering", difficulty: "Advanced", readTime: "7 min" },
  { id: "deep-residual", type: "Paper", title: "Deep Residual Learning for Image Recognition", creator: "K. He et al.", domain: "Computer Vision", difficulty: "Advanced", readTime: "9 min" },
  { id: "v8-opt", type: "Article", title: "V8 Compiler Optimization Loops", creator: "Shivansh Kumar", domain: "Software Engineering", difficulty: "Intermediate", readTime: "9 min" },
  { id: "dynamic-vectors", type: "Article", title: "Amortized Cost Analysis in Dynamic Vectors", creator: "Shivansh Kumar", domain: "Algorithms", difficulty: "Beginner", readTime: "8 min" },
  { id: "consistent-hashing", type: "Article", title: "Distributed Caching: Consistent Hashing Rings", creator: "Sanket Singh", domain: "Distributed Systems", difficulty: "Advanced", readTime: "14 min" },
  { id: "lru-implementation", type: "Tutorial", title: "Implementing an LRU Cache from scratch", creator: "Shivansh Kumar", domain: "Data Structures", difficulty: "Intermediate", readTime: "15 min" },
  { id: "dsa-fundamentals", type: "Course", title: "DSA Fundamentals Course", creator: "Shivansh Kumar", domain: "Algorithms", difficulty: "Beginner", readTime: "32 hrs" },
  { id: "system-design", type: "Course", title: "System Design & Scaling", creator: "Sanket Singh", domain: "Distributed Systems", difficulty: "Advanced", readTime: "45 hrs" },
  { id: "ai-roadmap", type: "Roadmap", title: "AI & Deep Learning Architect Roadmap", creator: "Quild_Engine Editorial", domain: "Artificial Intelligence", difficulty: "Intermediate", readTime: "12 steps" },
  { id: "compile-project", type: "Project", title: "Building a Sandboxed Compiler Execution Loop", creator: "Elena Rostova", domain: "Software Engineering", difficulty: "Advanced", readTime: "30 hrs" }
];

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
function ResearchPage() {
  const { view: currentViewParam, paperId: activePaperIdParam, articleId: activeArticleIdParam, q: searchQueryParams } = Route.useSearch();
  const navigate = Route.useNavigate();

  const currentView = currentViewParam || "home";
  const activePaperId = activePaperIdParam || "scaling-laws";
  const activeArticleId = activeArticleIdParam || "v8-opt";

  const setView = useCallback((newView: ResearchView, extraParams: Partial<ResearchSearch> = {}) => {
    navigate({
      search: () => {
        const nextSearch: ResearchSearch = {
          view: newView,
        };
        if (extraParams.q !== undefined) nextSearch.q = extraParams.q;
        if (extraParams.paperId !== undefined) nextSearch.paperId = extraParams.paperId;
        if (extraParams.articleId !== undefined) nextSearch.articleId = extraParams.articleId;
        return nextSearch;
      },
    });
  }, [navigate]);

  const setActivePaperId = useCallback((id: string) => {
    setView(currentView, { paperId: id });
  }, [currentView, setView]);

  const setActiveArticleId = useCallback((id: string) => {
    setView(currentView, { articleId: id });
  }, [currentView, setView]);

  const [activeResearcherId, setActiveResearcherId] = useState<string>("elena-rostova");
  const [activeOrgId, setActiveOrgId] = useState<string>("antigravity-labs");
  const [activeCollectionId, setActiveCollectionId] = useState<string>("ai-learning");

  // Sidebar resizer
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const isResizing = useRef(false);

  // AI Assistant panel state
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiChatLogs, setAiChatLogs] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [aiInput, setAiInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Search view states
  const [searchQuery, setSearchQuery] = useState(searchQueryParams || "");
  useEffect(() => {
    setSearchQuery(searchQueryParams || "");
  }, [searchQueryParams]);

  const [filterDifficulty, setFilterDifficulty] = useState<string>("All");
  const [filterType, setFilterType] = useState<string>("All");
  const [filterDomain, setFilterDomain] = useState<string>("All");

  // Flat active items lookup
  const activePaper = useMemo(() => mockPapers.find(p => p.id === activePaperId) || mockPapers[0], [activePaperId]);
  const activeArticle = useMemo(() => mockArticles.find(a => a.id === activeArticleId) || mockArticles[0], [activeArticleId]);

  // Unified Search filter items
  const filteredSearchItems = useMemo(() => {
    return mockSearchItems.filter(item => {
      const matchQuery = searchQuery === "" || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.domain.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchDifficulty = filterDifficulty === "All" || item.difficulty === filterDifficulty;
      const matchType = filterType === "All" || item.type === filterType;
      const matchDomain = filterDomain === "All" || item.domain === filterDomain;

      return matchQuery && matchDifficulty && matchType && matchDomain;
    });
  }, [searchQuery, filterDifficulty, filterType, filterDomain]);

  // Sidebar resizing
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing.current) return;
    const newWidth = Math.max(200, Math.min(400, e.clientX));
    setSidebarWidth(newWidth);
  }, []);

  const handleMouseUp = useCallback(() => {
    isResizing.current = false;
    document.body.classList.remove("select-none", "cursor-col-resize");
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    document.body.classList.add("select-none", "cursor-col-resize");
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove, handleMouseUp]);

  // Swipe gesture for detailed view
  const handleDragEnd = (_event: any, info: any) => {
    const swipeThreshold = 100;
    const velocityThreshold = 400;
    const currentIndex = mockPapers.findIndex((p) => p.id === activePaperId);

    if (
      (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) &&
      currentIndex < mockPapers.length - 1
    ) {
      setActivePaperId(mockPapers[currentIndex + 1].id);
    } else if (
      (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) &&
      currentIndex > 0
    ) {
      setActivePaperId(mockPapers[currentIndex - 1].id);
    }
  };

  const hasNext = mockPapers.findIndex((p) => p.id === activePaperId) < mockPapers.length - 1;
  const hasPrev = mockPapers.findIndex((p) => p.id === activePaperId) > 0;

  // Ask AI executor
  const executeAiAction = (promptText: string) => {
    setIsAiOpen(true);
    setIsAiLoading(true);
    setAiChatLogs(prev => [...prev, { role: "user", text: promptText }]);

    // Simulated typist stream response
    setTimeout(() => {
      let aiResponseText = "";
      if (promptText.toLowerCase().includes("summarize")) {
        aiResponseText = `Here is a summary synthesis of **${activePaper.title}** by ${activePaper.authors.join(", ")}: \n\n* **Primary Goal**: ${activePaper.abstract}\n* **Methodology**: Execution validation combined with vector optimization configurations.\n* **Key Contribution**: Outlines power laws showing predictability in computing limits.`;
      } else if (promptText.toLowerCase().includes("explain equations")) {
        aiResponseText = `Decoding equations in **${activePaper.title}**:\n\n* The loss equation *L(N, D)* maps power-law behaviors. The terms calculate the computing boundaries constraints ($N_c$ and $D_c$) parameterized against constants ($α_N$, $α_D$). \n* Skip shortcuts bypass identity transformations directly on the feed-forward lines, bypassing the standard projection arrays.`;
      } else if (promptText.toLowerCase().includes("flashcards")) {
        aiResponseText = `Generated Flashcards for **${activePaper.title}**:\n\n1. **Q**: What are Scaling Laws? \n   **A**: Predictable power-law limits linking LLM parameters, data sizes, and computation limits.\n2. **Q**: What is a Skip Connection? \n   **A**: Neural bypass connection routing input directly around weight layers to preserve gradients.`;
      } else {
        aiResponseText = `I've analyzed your question: "${promptText}". \n\nBased on **${activePaper.title}** and the Antigravity Research network concept maps, this aligns with high-fidelity validation loop patterns. Let me know if you would like me to draft interactive practice problems or quizzes for this topic!`;
      }

      setAiChatLogs(prev => [...prev, { role: "assistant", text: aiResponseText }]);
      setIsAiLoading(false);
    }, 1200);
  };

  const handleSendAiMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    const userMsg = aiInput;
    setAiInput("");
    executeAiAction(userMsg);
  };

  // Nav categories rendering list helper
  const sidebarNavItems = [
    { id: "home", label: "Research Hub", icon: <Compass className="size-4" /> },
    { id: "feed", label: "Research Feed", icon: <Newspaper className="size-4" /> },
    { id: "articles", label: "Articles Platform", icon: <FileText className="size-4" /> },
    { id: "collections", label: "Curated Collections", icon: <Library className="size-4" /> },
    { id: "researchers", label: "Researchers Directory", icon: <User className="size-4" /> },
    { id: "organizations", label: "Organizations", icon: <Building2 className="size-4" /> },
  ];

  return (
    <div className="flex h-full w-full bg-[var(--background)] text-[var(--sb-ink)] relative overflow-hidden font-sans border-0 outline-none select-none">
      <MeshGradientBackground />
      <AnimatedGrid />

      {/* ─── RESIZABLE LEFT SIDEBAR ────────────────────────────────────────── */}
      <aside 
        style={{ width: `${sidebarWidth}px` }}
        className="hidden md:flex flex-col border-r border-[var(--sb-border)]/40 bg-[color-mix(in_oklab,var(--sb-bg)_30%,transparent)] backdrop-blur-md h-full shrink-0 select-none relative"
      >
        <div className="h-14 flex items-center gap-2 border-b border-[var(--sb-border)]/40 px-5 shrink-0">
          <BookOpen className="w-4 h-4 text-indigo-500 dark:text-indigo-400 font-black" />
          <span className="text-[11px] font-black uppercase tracking-widest text-[var(--sb-ink)]">
            Quild_Engine Research
          </span>
        </div>

        {/* Categories List */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-2 scrollbar-none">
          <div className="space-y-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--sb-ink-dim)] px-3">
              Explore Portal
            </span>
            <div className="space-y-0.5 pt-1.5">
              {sidebarNavItems.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setView(item.id as ResearchView);
                    }}
                    className={`w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg transition-all cursor-pointer font-medium active:scale-[0.97] duration-100 ${
                      isActive
                        ? "bg-[color-mix(in_oklab,var(--sb-ink)_6%,transparent)] text-[var(--sb-accent)] font-semibold border-l-2 border-indigo-500 shadow-sm"
                        : "text-[var(--sb-ink-muted)] hover:bg-[var(--sb-bg-hover)] hover:text-[var(--sb-ink)]"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1 pt-4 border-t border-[var(--sb-border)]/20">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--sb-ink-dim)] px-3">
              Personal Space
            </span>
            <div className="space-y-0.5 pt-1.5">
              <button 
                onClick={() => setView("collections")} 
                className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg text-[var(--sb-ink-muted)] hover:bg-[var(--sb-bg-hover)] transition-all cursor-pointer"
              >
                <BookMarked className="size-4 text-indigo-400/80" />
                <span>Saved Collections</span>
              </button>
              <button 
                onClick={() => {
                  setView("feed");
                  setFilterDifficulty("All");
                }} 
                className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg text-[var(--sb-ink-muted)] hover:bg-[var(--sb-bg-hover)] transition-all cursor-pointer"
              >
                <History className="size-4 text-indigo-400/80" />
                <span>Reading History</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Resizer Handle */}
        <div
          onMouseDown={startResizing}
          className="absolute top-0 right-[-3px] w-[6px] h-full cursor-col-resize hover:bg-indigo-500/30 active:bg-indigo-500/50 transition-all z-30 group flex items-center justify-center"
          title="Drag to resize"
        >
          <div className="w-[1px] h-12 bg-[var(--sb-border)]/80 group-hover:bg-indigo-500 group-active:bg-indigo-500 transition-colors rounded-full" />
        </div>
      </aside>

      {/* ─── MAIN CONTENT VIEW PORTAL ──────────────────────────────────────── */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto relative outline-none border-0">
        
        {/* Sticky Global Top Header */}
        <header className="sticky top-0 z-20 h-14 bg-[color-mix(in_oklab,var(--card-bg)_80%,transparent)] border-b border-[var(--sb-border)]/40 px-6 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-[var(--sb-ink-muted)] font-semibold uppercase tracking-wider bg-[var(--sb-pill)] border border-[var(--sb-border)]/40 px-2 py-0.5 rounded">
              Ecosystem /{currentView}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsAiOpen(!isAiOpen)}
              className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white bg-indigo-500 hover:bg-indigo-600 px-3 py-1.5 rounded-lg border border-indigo-600/30 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="size-3.5 fill-current" />
              Notebook AI
            </button>
          </div>
        </header>

        {/* Dynamic Pages Dispatcher */}
        <div className="flex-1 overflow-x-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full"
            >
              
              {/* PAGE 1: RESEARCH HOME */}
              {currentView === "home" && (
                <div className="py-8 px-6 max-w-5xl mx-auto space-y-12">
                  
                  {/* Hero AI Search Section */}
                  <div className="text-center space-y-6 py-6 border-b border-[var(--sb-border)]/20">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Quild_Engine Research Hub</span>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[var(--sb-ink)] leading-tight max-w-2xl mx-auto">
                      Unified Knowledge Portal
                    </h1>
                    <p className="text-sm text-[var(--sb-ink-muted)] max-w-lg mx-auto">
                      Discover papers, technical articles, roadmaps, compiler tutorials, and courses, integrated into a single semantically connected graph.
                    </p>

                    {/* Central Large Search input */}
                    <div className="max-w-xl mx-auto relative flex items-center pt-4">
                      <Search className="absolute left-4 w-4 h-4 text-[var(--sb-ink-dim)]" />
                      <input
                        type="text"
                        placeholder="Search AI Research, NLP, System Design, Dynamic Vectors..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") setView("search", { q: searchQuery });
                        }}
                        className="w-full pl-11 pr-24 py-3 bg-[var(--card-bg)] border border-[var(--sb-border)]/60 rounded-xl text-xs text-[var(--sb-ink)] outline-none focus:border-indigo-500 transition-colors shadow-sm"
                      />
                      <button
                        onClick={() => setView("search", { q: searchQuery })}
                        className="absolute right-2 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-[10px] rounded-lg cursor-pointer transition-colors"
                      >
                        Search
                      </button>
                    </div>

                    {/* Hot Topics Pills */}
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[10px] font-bold">
                      {["Artificial Intelligence", "Natural Language Processing", "Software Engineering", "Computer Vision", "Distributed Systems", "Algorithms"].map(domain => (
                        <button
                          key={domain}
                          onClick={() => {
                            setFilterDomain(domain);
                            setView("search", { q: domain });
                          }}
                          className="px-2.5 py-1 rounded-full border border-[var(--sb-border)]/50 bg-[var(--sb-pill)] hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-[var(--sb-ink-muted)] hover:text-indigo-500 cursor-pointer"
                        >
                          {domain}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Curated NotebookLM Collections Grid */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-end border-b border-[var(--sb-border)]/30 pb-2">
                      <h3 className="text-xs font-black uppercase tracking-widest text-[var(--sb-ink-dim)] flex items-center gap-1.5">
                        <Library className="size-3.5 text-indigo-500" />
                        Trending Notebook Collections
                      </h3>
                      <button onClick={() => setView("collections")} className="text-[10px] font-bold text-indigo-500 hover:underline">View All</button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {mockCollections.map(col => (
                        <div
                          key={col.id}
                          onClick={() => {
                            setActiveCollectionId(col.id);
                            setView("collections");
                          }}
                          className="p-5 border border-[var(--sb-border)]/55 bg-[color-mix(in_oklab,var(--card-bg)_65%,transparent)] rounded-xl hover:-translate-y-0.5 hover:border-indigo-500/40 transition-all duration-200 cursor-pointer shadow-sm flex flex-col justify-between"
                        >
                          <div className="space-y-1">
                            <span className="text-[8px] font-mono font-bold bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded-full border border-indigo-500/10 uppercase">
                              {col.papersCount} resources
                            </span>
                            <h4 className="font-extrabold text-sm text-[var(--sb-ink)] pt-1">{col.name}</h4>
                            <p className="text-xs text-[var(--sb-ink-muted)] line-clamp-2 leading-relaxed">{col.description}</p>
                          </div>
                          <span className="text-[10px] font-bold text-indigo-500 mt-4 inline-flex items-center gap-1">
                            Open Workspace <ArrowRight className="size-3" />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Featured publications & Research list */}
                  <div className="grid md:grid-cols-3 gap-6">
                    
                    {/* Left 2 Cols: Featured Papers */}
                    <div className="md:col-span-2 space-y-4">
                      <div className="flex justify-between items-end border-b border-[var(--sb-border)]/30 pb-2">
                        <h3 className="text-xs font-black uppercase tracking-widest text-[var(--sb-ink-dim)] flex items-center gap-1.5">
                          <FileText className="size-3.5 text-indigo-500" />
                          Featured Scientific Papers
                        </h3>
                        <button onClick={() => setView("feed")} className="text-[10px] font-bold text-indigo-500 hover:underline">Feed View</button>
                      </div>

                      <div className="space-y-3">
                        {mockPapers.slice(0, 3).map(paper => (
                          <div
                            key={paper.id}
                            onClick={() => {
                              setView("detail", { paperId: paper.id });
                            }}
                            className="p-4 border border-[var(--sb-border)]/45 bg-[color-mix(in_oklab,var(--card-bg)_50%,transparent)] hover:bg-[var(--sb-bg-hover)] rounded-xl transition-all duration-200 cursor-pointer flex justify-between gap-4"
                          >
                            <div className="space-y-2 max-w-[80%]">
                              <span className="text-[9px] font-mono bg-[var(--sb-pill)] border border-[var(--sb-border)]/50 text-[var(--sb-ink-dim)] px-2 py-0.5 rounded">
                                {paper.domain}
                              </span>
                              <h4 className="font-extrabold text-xs text-[var(--sb-ink)] leading-snug line-clamp-1">{paper.title}</h4>
                              <p className="text-[11px] text-[var(--sb-ink-muted)] line-clamp-2 leading-relaxed">{paper.abstract}</p>
                              <div className="text-[9px] text-[var(--sb-ink-dim)] flex items-center gap-3">
                                <span>{paper.authors.join(", ")}</span>
                                <span>·</span>
                                <span className="font-mono">{paper.date}</span>
                              </div>
                            </div>
                            <div className="flex flex-col justify-between items-end text-[9px] text-[var(--sb-ink-dim)] shrink-0 font-mono">
                              <span className="bg-indigo-500/5 text-indigo-500 border border-indigo-500/10 px-2 py-0.5 rounded font-black">{paper.duration}</span>
                              <span>📖 {paper.citations} cit.</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Col: Popular Researchers */}
                    <div className="space-y-4">
                      <div className="border-b border-[var(--sb-border)]/30 pb-2">
                        <h3 className="text-xs font-black uppercase tracking-widest text-[var(--sb-ink-dim)] flex items-center gap-1.5">
                          <User className="size-3.5 text-indigo-500" />
                          Popular Researchers
                        </h3>
                      </div>

                      <div className="space-y-3">
                        {mockResearchers.map(res => (
                          <div
                            key={res.id}
                            onClick={() => {
                              setActiveResearcherId(res.id);
                              setView("researchers");
                            }}
                            className="p-4 border border-[var(--sb-border)]/45 bg-[color-mix(in_oklab,var(--card-bg)_65%,transparent)] hover:border-indigo-500/40 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-3"
                          >
                            <div className="size-8 rounded-full bg-indigo-500 text-white font-extrabold flex items-center justify-center text-[10px]">
                              {res.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-xs text-[var(--sb-ink)] truncate">{res.name}</h4>
                              <p className="text-[10px] text-[var(--sb-ink-dim)] truncate">{res.organization}</p>
                              <p className="text-[9px] text-indigo-500 font-bold truncate pt-0.5">{res.expertise.join(", ")}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Organization Spotlight */}
                  <div className="space-y-4">
                    <div className="border-b border-[var(--sb-border)]/30 pb-2">
                      <h3 className="text-xs font-black uppercase tracking-widest text-[var(--sb-ink-dim)] flex items-center gap-1.5">
                        <Building2 className="size-3.5 text-indigo-500" />
                        Scientific Institution Spotlight
                      </h3>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      {mockOrganizations.map(org => (
                        <div
                          key={org.id}
                          onClick={() => {
                            setActiveOrgId(org.id);
                            setView("organizations");
                          }}
                          className="p-4 border border-[var(--sb-border)]/45 bg-[color-mix(in_oklab,var(--card-bg)_65%,transparent)] hover:border-indigo-500/35 rounded-xl cursor-pointer transition-all duration-200"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="size-7 bg-zinc-800 text-white font-black text-xs flex items-center justify-center rounded">
                              {org.logo}
                            </div>
                            <h4 className="font-bold text-xs text-[var(--sb-ink)]">{org.name}</h4>
                          </div>
                          <p className="text-[11px] text-[var(--sb-ink-muted)] line-clamp-2 leading-relaxed">{org.about}</p>
                          <div className="pt-3 flex justify-between items-center text-[9px] text-[var(--sb-ink-dim)] font-mono border-t border-[var(--sb-border)]/20 mt-2">
                            <span>{org.publicationsCount} publications</span>
                            <span className="font-sans font-bold text-indigo-500">Inspect Portal</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 2: GLOBAL SEARCH */}
              {currentView === "search" && (
                <div className="py-6 px-6 max-w-5xl mx-auto flex flex-col md:flex-row gap-6">
                  
                  {/* Left Column Sticky Filter Sidebar */}
                  <div className="w-full md:w-60 shrink-0 space-y-5">
                    <div className="sticky top-20 p-4 border border-[var(--sb-border)]/55 bg-[color-mix(in_oklab,var(--card-bg)_65%,transparent)] backdrop-blur-sm rounded-xl space-y-4">
                      <div className="flex items-center justify-between border-b border-[var(--sb-border)]/30 pb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[var(--sb-ink)] flex items-center gap-1">
                          <Filter className="size-3 text-indigo-500" /> Filters
                        </span>
                        <button
                          onClick={() => {
                            setFilterDifficulty("All");
                            setFilterType("All");
                            setFilterDomain("All");
                            setSearchQuery("");
                          }}
                          className="text-[9px] font-bold text-indigo-500 hover:underline"
                        >
                          Clear
                        </button>
                      </div>

                      {/* Filter: Content Type */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--sb-ink-dim)]">Content Type</label>
                        <select
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                          className="w-full bg-[var(--sb-bg)] border border-[var(--sb-border)]/60 rounded px-2 py-1 text-xs text-[var(--sb-ink)] outline-none"
                        >
                          <option value="All">All Types</option>
                          <option value="Paper">Research Papers</option>
                          <option value="Article">Articles</option>
                          <option value="Tutorial">Tutorials</option>
                          <option value="Course">Courses</option>
                          <option value="Roadmap">Roadmaps</option>
                          <option value="Project">Projects</option>
                        </select>
                      </div>

                      {/* Filter: Domain */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--sb-ink-dim)]">Domain</label>
                        <select
                          value={filterDomain}
                          onChange={(e) => setFilterDomain(e.target.value)}
                          className="w-full bg-[var(--sb-bg)] border border-[var(--sb-border)]/60 rounded px-2 py-1 text-xs text-[var(--sb-ink)] outline-none"
                        >
                          <option value="All">All Domains</option>
                          <option value="Artificial Intelligence">Artificial Intelligence</option>
                          <option value="Natural Language Processing">NLP</option>
                          <option value="Software Engineering">Software Engineering</option>
                          <option value="Computer Vision">Computer Vision</option>
                          <option value="Distributed Systems">Distributed Systems</option>
                          <option value="Algorithms">Algorithms</option>
                        </select>
                      </div>

                      {/* Filter: Difficulty */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--sb-ink-dim)]">Difficulty</label>
                        <select
                          value={filterDifficulty}
                          onChange={(e) => setFilterDifficulty(e.target.value)}
                          className="w-full bg-[var(--sb-bg)] border border-[var(--sb-border)]/60 rounded px-2 py-1 text-xs text-[var(--sb-ink)] outline-none"
                        >
                          <option value="All">All Levels</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Search Results List */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-2 border border-[var(--sb-border)]/55 bg-[color-mix(in_oklab,var(--card-bg)_60%,transparent)] px-3 py-2 rounded-xl">
                      <Search className="size-4 text-[var(--sb-ink-dim)]" />
                      <input
                        type="text"
                        placeholder="Search unified knowledge database..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent border-0 outline-none text-xs text-[var(--sb-ink)]"
                      />
                    </div>

                    <div className="text-[10px] text-[var(--sb-ink-dim)] font-mono flex items-center justify-between pb-1 border-b border-[var(--sb-border)]/20">
                      <span>Found {filteredSearchItems.length} results</span>
                      <span>Unified Search Platform</span>
                    </div>

                    <div className="space-y-3">
                      {filteredSearchItems.map(item => (
                        <div
                          key={`${item.type}-${item.id}`}
                          onClick={() => {
                            if (item.type === "Paper") {
                              setView("detail", { paperId: item.id });
                            } else if (item.type === "Article") {
                              setView("articles", { articleId: item.id });
                            } else {
                              executeAiAction(`Tell me about the ${item.type}: "${item.title}" by ${item.creator}`);
                            }
                          }}
                          className="p-4 border border-[var(--sb-border)]/45 bg-[color-mix(in_oklab,var(--card-bg)_65%,transparent)] hover:border-indigo-500/40 rounded-xl cursor-pointer transition-all flex items-start gap-4"
                        >
                          <div className="size-7 bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 text-[9px] font-black uppercase flex items-center justify-center rounded shrink-0">
                            {item.type.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-mono bg-[var(--sb-pill)] border border-[var(--sb-border)]/40 text-[var(--sb-ink-dim)] px-2 py-0.2 rounded font-bold">{item.type}</span>
                              <span className="text-[9px] font-mono text-[var(--sb-ink-dim)]">{item.domain}</span>
                            </div>
                            <h4 className="font-extrabold text-xs text-[var(--sb-ink)] line-clamp-1">{item.title}</h4>
                            <p className="text-[10px] text-[var(--sb-ink-dim)]">By {item.creator} · Duration: {item.readTime}</p>
                          </div>
                        </div>
                      ))}

                      {filteredSearchItems.length === 0 && (
                        <div className="py-8 text-center text-xs text-[var(--sb-ink-dim)] italic">
                          No matching results found. Try clearing filters or revising query.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 3: RESEARCH FEED */}
              {currentView === "feed" && (
                <div className="py-6 px-6 max-w-4xl mx-auto space-y-6">
                  <div className="border-b border-[var(--sb-border)]/30 pb-3">
                    <h2 className="text-xl font-extrabold tracking-tight text-[var(--sb-ink)]">Infinite Research Feed</h2>
                    <p className="text-[11px] text-[var(--sb-ink-muted)]">Live-updating academic telemetry feed of trending and recommended articles.</p>
                  </div>

                  <div className="space-y-4">
                    {mockPapers.map(paper => (
                      <div
                        key={paper.id}
                        className="p-5 border border-[var(--sb-border)]/55 bg-[color-mix(in_oklab,var(--card-bg)_65%,transparent)] rounded-xl space-y-4 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-mono bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 px-2 py-0.5 rounded uppercase font-black">{paper.domain}</span>
                              <span className="text-[9px] font-mono text-[var(--sb-ink-dim)]">DOI: {paper.doi}</span>
                            </div>
                            <h3 
                              onClick={() => {
                                setView("detail", { paperId: paper.id });
                              }}
                              className="font-extrabold text-sm text-[var(--sb-ink)] hover:text-indigo-500 cursor-pointer pt-1"
                            >
                              {paper.title}
                            </h3>
                          </div>
                          <span className="font-mono text-[9px] bg-[var(--sb-pill)] px-2 py-0.5 rounded text-[var(--sb-ink-dim)] shrink-0">{paper.duration}</span>
                        </div>

                        <p className="text-xs text-[var(--sb-ink-muted)] leading-relaxed italic">{paper.abstract}</p>

                        <div className="text-[10px] text-[var(--sb-ink-dim)] flex flex-wrap gap-x-4 gap-y-1 border-t border-[var(--sb-border)]/20 pt-3">
                          <span>Authors: <strong>{paper.authors.join(", ")}</strong></span>
                          <span>·</span>
                          <span>Org: <strong>{paper.organizations.join(", ")}</strong></span>
                          <span>·</span>
                          <span>Date: <strong>{paper.date}</strong></span>
                        </div>

                        {/* Interactive Feed Controls */}
                        <div className="flex items-center justify-between pt-3 border-t border-[var(--sb-border)]/20 mt-1">
                          <div className="flex items-center gap-4 text-[10px] text-[var(--sb-ink-dim)] font-mono">
                            <span className="flex items-center gap-1">❤️ {paper.likes}</span>
                            <span className="flex items-center gap-1">📖 {paper.citations} citations</span>
                            <span className="flex items-center gap-1">👁️ {paper.views} views</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => executeAiAction(`Summarize ${paper.title}`)}
                              className="px-2.5 py-1 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 text-[10px] font-bold cursor-pointer active:scale-95 transition-all"
                            >
                              AI Summary
                            </button>
                            <button
                              onClick={() => {
                                setView("detail", { paperId: paper.id });
                              }}
                              className="px-2.5 py-1 rounded bg-[var(--sb-pill)] border border-[var(--sb-border)]/45 text-[var(--sb-ink)] text-[10px] font-bold cursor-pointer hover:bg-[var(--sb-bg-hover)]"
                            >
                              Read Full Paper
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PAGE 4: RESEARCH DETAIL */}
              {currentView === "detail" && (
                <div className="py-6 px-6 max-w-5xl mx-auto flex gap-6 relative animate-fadeIn select-text">
                  
                  {/* Main Reading Frame Container */}
                  <div className="flex-1 py-4 space-y-6 overflow-x-hidden relative">
                    
                    {/* Edge Nav Arrows */}
                    {hasPrev && (
                      <button
                        onClick={() => {
                          const currentIndex = mockPapers.findIndex((p) => p.id === activePaperId);
                          if (currentIndex > 0) setActivePaperId(mockPapers[currentIndex - 1].id);
                        }}
                        className="absolute left-[-24px] top-1/2 -translate-y-1/2 z-10 size-8 rounded-full border border-[var(--sb-border)]/40 bg-[var(--card-bg)]/80 backdrop-blur-sm shadow flex items-center justify-center text-[var(--sb-ink-dim)] hover:text-indigo-500 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        title="Prev Paper"
                      >
                        <ChevronLeft className="size-4" />
                      </button>
                    )}
                    {hasNext && (
                      <button
                        onClick={() => {
                          const currentIndex = mockPapers.findIndex((p) => p.id === activePaperId);
                          if (currentIndex < mockPapers.length - 1) setActivePaperId(mockPapers[currentIndex + 1].id);
                        }}
                        className="absolute right-[-24px] top-1/2 -translate-y-1/2 z-10 size-8 rounded-full border border-[var(--sb-border)]/40 bg-[var(--card-bg)]/80 backdrop-blur-sm shadow flex items-center justify-center text-[var(--sb-ink-dim)] hover:text-indigo-500 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        title="Next Paper"
                      >
                        <ChevronRight className="size-4" />
                      </button>
                    )}

                    <motion.article
                      key={activePaper.id}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.2}
                      onDragEnd={handleDragEnd}
                      whileDrag={{ scale: 0.99, cursor: "grabbing" }}
                      className="space-y-6 select-text cursor-grab active:cursor-grabbing relative"
                    >
                      <header className="space-y-3 pb-6 border-b border-[var(--sb-border)]/40 pointer-events-none select-none">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            {activePaper.domain}
                          </span>
                          <span className="text-[9px] font-mono text-[var(--sb-ink-dim)]">DOI: {activePaper.doi}</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--sb-ink)] leading-snug tracking-tight">
                          {activePaper.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--sb-ink-dim)] pt-1">
                          <span>Authors: <strong>{activePaper.authors.join(", ")}</strong></span>
                          <span>·</span>
                          <span>Orgs: <strong>{activePaper.organizations.join(", ")}</strong></span>
                          <span>·</span>
                          <span className="font-mono">{activePaper.date}</span>
                        </div>
                      </header>

                      {/* Abstract summary block */}
                      <div className="bg-[var(--sb-pill)]/50 border-l-4 border-indigo-500 rounded-r-xl p-5 shadow-sm">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--sb-ink)] mb-1">Abstract Summary</h4>
                        <p className="text-xs leading-relaxed text-[var(--sb-ink-muted)] italic">{activePaper.abstract}</p>
                      </div>

                      {/* AI Generated Findings */}
                      <div className="space-y-2 pt-2">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-500 flex items-center gap-1">
                          <Sparkles className="size-3.5 fill-current" /> Key AI Findings
                        </h4>
                        <ul className="list-disc pl-5 text-xs text-[var(--sb-ink-muted)] space-y-1.5 leading-relaxed">
                          {activePaper.keyFindings.map((finding, idx) => (
                            <li key={idx}>{finding}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Synthesized discussion */}
                      <div className="space-y-4 pt-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--sb-ink-dim)] border-b border-[var(--sb-border)]/30 pb-1">
                          Discussion & Content
                        </h4>
                        <div className="text-xs text-[var(--sb-ink-muted)] leading-relaxed whitespace-pre-wrap font-sans">
                          {activePaper.content}
                        </div>
                      </div>

                      {/* Embedded visualization figure */}
                      {activePaper.figure && (
                        <div className="border border-[var(--sb-border)]/40 rounded-xl overflow-hidden bg-[color-mix(in_oklab,var(--card-bg)_60%,transparent)] shadow-sm">
                          <div className="border-b border-[var(--sb-border)]/30 bg-[var(--sb-pill)] px-4 py-2 flex items-center justify-between">
                            <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--sb-ink-dim)]">Interactive Visual Figure</span>
                            <span className="text-[9px] bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded font-mono font-bold">ACTIVE COMPONENT</span>
                          </div>
                          <div className="p-4 md:p-6 overflow-x-auto bg-[var(--card-bg)]/25">
                            {activePaper.figure}
                          </div>
                        </div>
                      )}
                    </motion.article>
                  </div>

                  {/* Right Column: Mini TOC */}
                  <div className="w-56 shrink-0 hidden lg:block space-y-4">
                    <div className="sticky top-20 p-4 border border-[var(--sb-border)]/55 bg-[color-mix(in_oklab,var(--card-bg)_65%,transparent)] rounded-xl space-y-4">
                      
                      <div className="space-y-2 border-b border-[var(--sb-border)]/30 pb-3">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--sb-ink-dim)]">Document Metadata</span>
                        <div className="space-y-1 text-[10px] font-mono text-[var(--sb-ink-muted)]">
                          <div>⏱️ {activePaper.duration} read time</div>
                          <div>📖 {activePaper.citations} citations</div>
                          <div>👁️ {activePaper.views} views</div>
                          <div>❤️ {activePaper.likes} likes</div>
                        </div>
                      </div>

                      {/* Actions shortcuts */}
                      <div className="flex flex-col gap-2 pt-1">
                        <button
                          onClick={() => executeAiAction(`Summarize this paper`)}
                          className="w-full py-1.5 rounded bg-indigo-500 text-white text-[10px] font-bold cursor-pointer hover:bg-indigo-600 active:scale-95 transition-all flex items-center justify-center gap-1"
                        >
                          <Sparkles className="size-3" /> Summarize Paper
                        </button>
                        <button
                          onClick={() => executeAiAction(`Explain equations in this paper`)}
                          className="w-full py-1.5 rounded bg-[var(--sb-pill)] border border-[var(--sb-border)]/55 text-[var(--sb-ink)] text-[10px] font-bold cursor-pointer hover:bg-[var(--sb-bg-hover)] flex items-center justify-center gap-1"
                        >
                          <Code className="size-3" /> Decode Equations
                        </button>
                        <button
                          onClick={() => executeAiAction(`Generate flashcards`)}
                          className="w-full py-1.5 rounded bg-[var(--sb-pill)] border border-[var(--sb-border)]/55 text-[var(--sb-ink)] text-[10px] font-bold cursor-pointer hover:bg-[var(--sb-bg-hover)] flex items-center justify-center gap-1"
                        >
                          <Award className="size-3" /> Get Flashcards
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 5: RESEARCHERS DIRECTORY */}
              {currentView === "researchers" && (
                <div className="py-6 px-6 max-w-5xl mx-auto space-y-6">
                  
                  {/* Header */}
                  <div className="border-b border-[var(--sb-border)]/30 pb-3 flex justify-between items-end">
                    <div>
                      <h2 className="text-xl font-extrabold tracking-tight text-[var(--sb-ink)]">Researchers Directory</h2>
                      <p className="text-[11px] text-[var(--sb-ink-muted)]">Connect and follow leading scientists modeling structural semantic systems.</p>
                    </div>
                    <span className="text-[10px] text-[var(--sb-ink-dim)] font-mono">Found {mockResearchers.length} researchers</span>
                  </div>

                  {/* Grid */}
                  <div className="grid md:grid-cols-3 gap-6">
                    {mockResearchers.map(res => {
                      const isCurrent = activeResearcherId === res.id;
                      return (
                        <div
                          key={res.id}
                          className={`p-5 border rounded-xl space-y-4 hover:shadow-md transition-all duration-200 bg-[color-mix(in_oklab,var(--card-bg)_65%,transparent)] ${
                            isCurrent ? "border-indigo-500" : "border-[var(--sb-border)]/55"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-indigo-500 text-white font-extrabold flex items-center justify-center text-sm shadow">
                              {res.avatar}
                            </div>
                            <div>
                              <h4 className="font-extrabold text-xs text-[var(--sb-ink)]">{res.name}</h4>
                              <p className="text-[10px] text-[var(--sb-ink-dim)]">{res.organization}</p>
                            </div>
                          </div>

                          <p className="text-[11px] text-[var(--sb-ink-muted)] leading-relaxed h-12 line-clamp-3">{res.bio}</p>

                          <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-mono bg-[var(--sb-pill)] p-2.5 rounded-lg border border-[var(--sb-border)]/30">
                            <div>
                              <div className="font-black text-[var(--sb-ink)]">{res.followers}</div>
                              <div className="text-[8px] text-[var(--sb-ink-dim)] uppercase">Followers</div>
                            </div>
                            <div>
                              <div className="font-black text-[var(--sb-ink)]">{res.papersCount}</div>
                              <div className="text-[8px] text-[var(--sb-ink-dim)] uppercase">Publications</div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-2">
                            <button
                              onClick={() => executeAiAction(`Compare research by ${res.name}`)}
                              className="px-2.5 py-1 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-[9px] cursor-pointer"
                            >
                              Explore Publications
                            </button>
                            <button
                              onClick={() => {
                                setActiveResearcherId(res.id);
                                executeAiAction(`Tell me about researcher ${res.name}`);
                              }}
                              className="px-2.5 py-1 rounded bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-[9px] cursor-pointer active:scale-95 transition-all shadow"
                            >
                              Follow
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PAGE 6: ORGANIZATIONS DIRECTORY */}
              {currentView === "organizations" && (
                <div className="py-6 px-6 max-w-5xl mx-auto space-y-6">
                  <div className="border-b border-[var(--sb-border)]/30 pb-3 flex justify-between items-end">
                    <div>
                      <h2 className="text-xl font-extrabold tracking-tight text-[var(--sb-ink)]">Organizations & Research Labs</h2>
                      <p className="text-[11px] text-[var(--sb-ink-muted)]">Browse technical publications and researchers associated with major entities.</p>
                    </div>
                    <span className="text-[10px] text-[var(--sb-ink-dim)] font-mono">Found {mockOrganizations.length} institutions</span>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {mockOrganizations.map(org => {
                      const isCurrent = activeOrgId === org.id;
                      return (
                        <div
                          key={org.id}
                          className={`p-5 border rounded-xl space-y-4 hover:shadow-md transition-all duration-200 bg-[color-mix(in_oklab,var(--card-bg)_65%,transparent)] flex flex-col justify-between ${
                            isCurrent ? "border-indigo-500" : "border-[var(--sb-border)]/55"
                          }`}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="size-9 bg-zinc-800 text-white font-black text-xs flex items-center justify-center rounded shadow">
                                {org.logo}
                              </div>
                              <h4 className="font-extrabold text-xs text-[var(--sb-ink)]">{org.name}</h4>
                            </div>
                            <p className="text-[11px] text-[var(--sb-ink-muted)] leading-relaxed h-16 line-clamp-4">{org.about}</p>
                          </div>

                          <div className="space-y-3 pt-3 border-t border-[var(--sb-border)]/20 mt-3">
                            <div className="flex flex-wrap gap-1 text-[8px] font-mono">
                              {org.domains.map(d => (
                                <span key={d} className="bg-[var(--sb-pill)] border border-[var(--sb-border)]/30 px-2 py-0.5 rounded text-[var(--sb-ink-dim)]">{d}</span>
                              ))}
                            </div>
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="font-mono text-[var(--sb-ink-dim)]">{org.publicationsCount} papers cataloged</span>
                              <button
                                onClick={() => {
                                  setActiveOrgId(org.id);
                                  executeAiAction(`List publications of ${org.name}`);
                                }}
                                className="text-[10px] font-black text-indigo-500 hover:underline cursor-pointer"
                              >
                                View Papers
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PAGE 7: RESEARCH COLLECTIONS */}
              {currentView === "collections" && (
                <div className="py-6 px-6 max-w-5xl mx-auto space-y-6">
                  <div className="border-b border-[var(--sb-border)]/30 pb-3 flex justify-between items-end">
                    <div>
                      <h2 className="text-xl font-extrabold tracking-tight text-[var(--sb-ink)]">NotebookLM Curated Collections</h2>
                      <p className="text-[11px] text-[var(--sb-ink-muted)]">Upload resources or load curated folders to ask questions about combined libraries.</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {mockCollections.map(col => {
                      const isCurrent = activeCollectionId === col.id;
                      return (
                        <div
                          key={col.id}
                          className={`p-5 border rounded-xl space-y-4 bg-[color-mix(in_oklab,var(--card-bg)_65%,transparent)] hover:shadow-md transition-all duration-200 ${
                            isCurrent ? "border-indigo-500" : "border-[var(--sb-border)]/55"
                          }`}
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div className="space-y-1">
                              <h3 className="font-extrabold text-sm text-[var(--sb-ink)]">{col.name}</h3>
                              <p className="text-[11px] text-[var(--sb-ink-muted)] leading-relaxed">{col.description}</p>
                            </div>
                            <span className="text-[9px] font-mono bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded-full border border-indigo-500/10 font-bold uppercase shrink-0">
                              {col.papersCount} Files
                            </span>
                          </div>

                          <div className="space-y-2 border-t border-[var(--sb-border)]/20 pt-3">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--sb-ink-dim)] block">Included Papers:</span>
                            <div className="space-y-1.5">
                              {col.papers.map(pid => {
                                const paper = mockPapers.find(p => p.id === pid);
                                if (!paper) return null;
                                return (
                                  <div key={pid} className="flex justify-between items-center p-2 rounded bg-[var(--sb-pill)] border border-[var(--sb-border)]/30 text-[11px] text-[var(--sb-ink-muted)]">
                                    <span className="truncate max-w-[80%] font-semibold">{paper.title}</span>
                                    <button
                                      onClick={() => {
                                        setView("detail", { paperId: paper.id });
                                      }}
                                      className="text-[9px] text-indigo-500 font-bold hover:underline cursor-pointer"
                                    >
                                      Read
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div className="pt-3 flex gap-2">
                            <button
                              onClick={() => {
                                setActiveCollectionId(col.id);
                                executeAiAction(`Summarize collection: ${col.name}`);
                              }}
                              className="flex-1 py-1.5 bg-indigo-500 text-white rounded text-[10px] font-bold active:scale-95 transition-all shadow flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Sparkles className="size-3 fill-current" /> Ask AI about Collection
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PAGE 8: ARTICLES PLATFORM */}
              {currentView === "articles" && (
                <div className="py-6 px-6 max-w-4xl mx-auto space-y-6">
                  
                  {/* Left-hand layout of Article view */}
                  <div className="border-b border-[var(--sb-border)]/30 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 px-2.5 py-0.5 rounded font-black uppercase tracking-wider">
                        {activeArticle.category}
                      </span>
                      <h2 className="text-2xl font-extrabold text-[var(--sb-ink)] pt-1">{activeArticle.title}</h2>
                      <div className="text-[10px] text-[var(--sb-ink-dim)] flex items-center gap-4 pt-1">
                        <span>By <strong className="text-[var(--sb-ink)]">{activeArticle.author}</strong></span>
                        <span>·</span>
                        <span>{activeArticle.publishedAt}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><Clock size={11} /> {activeArticle.readTime}</span>
                      </div>
                    </div>

                    {/* Toggle selectors list */}
                    <div className="flex gap-2">
                      {mockArticles.map(art => (
                        <button
                          key={art.id}
                          onClick={() => setActiveArticleId(art.id)}
                          className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${
                            activeArticleId === art.id
                              ? "bg-indigo-500 text-white border-indigo-500 shadow-md"
                              : "bg-[var(--sb-pill)] text-[var(--sb-ink-muted)] border-[var(--sb-border)]/55 hover:bg-[var(--sb-bg-hover)]"
                          }`}
                        >
                          {art.title.split(":")[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Content area */}
                  <div className="prose dark:prose-invert text-xs leading-relaxed max-w-none pt-4 text-[var(--sb-ink)] font-sans border border-[var(--sb-border)]/30 p-6 rounded-xl bg-[color-mix(in_oklab,var(--card-bg)_65%,transparent)] shadow-sm select-text">
                    <div className="whitespace-pre-wrap font-sans space-y-4">
                      {activeArticle.content.split("\n\n").map((para, k) => {
                        if (para.startsWith("## ") || para.startsWith("### ")) {
                          return <h3 key={k} className="text-base font-bold display-title mt-4 border-b border-[var(--sb-border)]/40 pb-1 text-[var(--sb-ink)]">{para.replace(/#+\s+/, "")}</h3>;
                        }
                        return <p key={k} className="text-[var(--sb-ink-muted)] leading-relaxed">{para}</p>;
                      })}
                    </div>
                  </div>

                  {/* Dynamic footer relationships indicators */}
                  <div className="p-4 border border-indigo-500/10 rounded-xl bg-indigo-500/5 mt-6 space-y-3">
                    <span className="text-[10px] font-mono font-bold text-indigo-500 uppercase tracking-wider flex items-center gap-1">
                      <GraduationCap className="size-3.5" /> Interconnected Learning Relations
                    </span>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      <div className="p-2 bg-[var(--card-bg)] border border-[var(--sb-border)]/40 rounded-lg text-[10px] font-sans">
                        <span className="text-[8px] font-mono text-[var(--sb-ink-dim)] block">Related Course</span>
                        <span className="font-extrabold text-[var(--sb-ink)] truncate block">DSA Fundamentals</span>
                      </div>
                      <div className="p-2 bg-[var(--card-bg)] border border-[var(--sb-border)]/40 rounded-lg text-[10px] font-sans">
                        <span className="text-[8px] font-mono text-[var(--sb-ink-dim)] block">Practice Problems</span>
                        <span className="font-extrabold text-[var(--sb-ink)] truncate block">Two Sum Complexity</span>
                      </div>
                      <div className="p-2 bg-[var(--card-bg)] border border-[var(--sb-border)]/40 rounded-lg text-[10px] font-sans col-span-2 md:col-span-1">
                        <span className="text-[8px] font-mono text-[var(--sb-ink-dim)] block">Research Literature</span>
                        <span className="font-extrabold text-[var(--sb-ink)] truncate block">Scaling Laws</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}



            </motion.div>
          </AnimatePresence>
        </div>

      </main>

      {/* ─── PERSISTENT NOTEBOOK AI PANEL ─────────────────────────────────── */}
      <AnimatePresence>
        {isAiOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAiOpen(false)}
              className="fixed inset-0 bg-black z-30 backdrop-blur-[1px]"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 bottom-0 right-0 w-80 bg-[color-mix(in_oklab,var(--card-bg)_92%,transparent)] border-l border-[var(--sb-border)]/65 z-40 p-4 flex flex-col justify-between h-full shadow-2xl backdrop-blur-md"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[var(--sb-border)]/60 pb-3 shrink-0">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="size-4 text-indigo-500 fill-indigo-500/20" />
                  <span className="text-xs font-black uppercase tracking-wider text-[var(--sb-ink)]">
                    Notebook AI Assistant
                  </span>
                </div>
                <button
                  onClick={() => setIsAiOpen(false)}
                  className="p-1 hover:bg-[var(--sb-bg-hover)] rounded cursor-pointer text-[var(--sb-ink-dim)] hover:text-[var(--sb-ink)]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat log & presets */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-none flex flex-col justify-between">
                
                {/* Chat items list */}
                <div className="space-y-4">
                  {aiChatLogs.map((chat, idx) => (
                    <div key={idx} className={`space-y-1 text-xs select-text ${chat.role === "user" ? "text-right" : "text-left"}`}>
                      <span className="text-[8px] font-mono uppercase tracking-wider text-[var(--sb-ink-dim)] block">
                        {chat.role === "user" ? "You" : "Notebook AI"}
                      </span>
                      <div className={`p-2.5 rounded-xl inline-block max-w-[90%] text-left whitespace-pre-wrap leading-relaxed ${
                        chat.role === "user" 
                          ? "bg-indigo-500 text-white shadow-sm" 
                          : "bg-[var(--sb-pill)] border border-[var(--sb-border)]/45 text-[var(--sb-ink-muted)]"
                      }`}>
                        {chat.text}
                      </div>
                    </div>
                  ))}

                  {isAiLoading && (
                    <div className="text-left space-y-1">
                      <span className="text-[8px] font-mono uppercase tracking-wider text-[var(--sb-ink-dim)] block">Notebook AI</span>
                      <div className="p-3 bg-[var(--sb-pill)] border border-[var(--sb-border)]/45 rounded-xl inline-flex items-center gap-2 text-xs">
                        <div className="size-1.5 rounded-full bg-indigo-500 animate-bounce" />
                        <div className="size-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                        <div className="size-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}

                  {aiChatLogs.length === 0 && (
                    <div className="p-4 border border-[var(--sb-border)]/45 rounded-xl bg-[var(--sb-pill)]/35 text-[11px] text-[var(--sb-ink-dim)] leading-relaxed italic text-center select-none">
                      Load a paper or curriculum collection, and ask me to summarize it, explain complex equations, or generate flashcards instantly.
                    </div>
                  )}
                </div>

                {/* Preset Prompt Buttons */}
                <div className="space-y-1.5 pt-4 border-t border-[var(--sb-border)]/20 shrink-0">
                  <span className="text-[8px] font-black uppercase tracking-wider text-[var(--sb-ink-dim)] block px-1">Quick Prompts</span>
                  <button
                    type="button"
                    onClick={() => executeAiAction(`Summarize this paper`)}
                    className="w-full text-left p-2 border border-[var(--sb-border)]/45 bg-[var(--sb-pill)] rounded-lg hover:border-indigo-500/40 text-[10px] text-[var(--sb-ink-muted)] font-medium transition-all active:scale-[0.97] cursor-pointer"
                  >
                    ✨ Summarize this paper
                  </button>
                  <button
                    type="button"
                    onClick={() => executeAiAction(`Explain equations in this paper`)}
                    className="w-full text-left p-2 border border-[var(--sb-border)]/45 bg-[var(--sb-pill)] rounded-lg hover:border-indigo-500/40 text-[10px] text-[var(--sb-ink-muted)] font-medium transition-all active:scale-[0.97] cursor-pointer"
                  >
                    🧮 Explain equations
                  </button>
                  <button
                    type="button"
                    onClick={() => executeAiAction(`Generate flashcards`)}
                    className="w-full text-left p-2 border border-[var(--sb-border)]/45 bg-[var(--sb-pill)] rounded-lg hover:border-indigo-500/40 text-[10px] text-[var(--sb-ink-muted)] font-medium transition-all active:scale-[0.97] cursor-pointer"
                  >
                    🃏 Generate flashcards
                  </button>
                </div>

              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendAiMessage} className="pt-3 border-t border-[var(--sb-border)]/55 shrink-0 flex gap-2">
                <input
                  type="text"
                  placeholder="Ask Notebook AI..."
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--sb-bg)] border border-[var(--sb-border)]/60 rounded-lg text-xs text-[var(--sb-ink)] outline-none focus:border-indigo-500 transition-colors"
                />
                <button
                  type="submit"
                  className="p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg cursor-pointer active:scale-95 transition-all shadow-md shrink-0"
                >
                  <Send className="size-3.5 fill-current" />
                </button>
              </form>

            </motion.aside>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
