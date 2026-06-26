import { useState, useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Menu, X, FileText, Calendar, User, Compass } from "lucide-react";
import {
  MeshGradientBackground,
  AnimatedGrid,
  HeroResearchSection,
  ResearchWorkspacePreview,
  FeatureCard,
  KnowledgeGraph,
  ResearchCollectionCard,
  WorkflowTimeline,
  InsightCard,
  CollaborationPreview,
  TestimonialCard,
} from "#/components/research";

export const Route = createFileRoute("/_app/research")({
  component: ResearchPage,
});

interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  date: string;
  readTime: string;
  doi: string;
  abstract: string;
  body: React.ReactNode;
  figure?: React.ReactNode;
}

interface PaperGroup {
  category: string;
  papers: ResearchPaper[];
}

function ResearchPage() {
  const [activePaperId, setActivePaperId] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const contentContainerRef = useRef<HTMLDivElement>(null);

  const paperGroups: PaperGroup[] = [
    {
      category: "Welcome",
      papers: [
        {
          id: "overview",
          title: "Overview & Lab Index",
          authors: ["Antigravity Research Labs"],
          date: "Jun 2026",
          readTime: "3 min read",
          doi: "N/A",
          abstract: "Welcome to the Antigravity Research Lab repository. This catalog serves as our open-access laboratory log where you can explore neural scaling laws, emergent model abilities, skip-connection visualizers, and decentralized collaboration systems.",
          body: (
            <div className="space-y-4 text-sm leading-relaxed text-[var(--sb-ink-muted)]">
              <p>
                Our laboratory is dedicated to creating open, verifiable models and collaborative environments. 
                Use the categorized left-side index to browse different research topics and papers written by various engineering and theory authors.
              </p>
              <p>
                Each section contains full syntheses and active visualization tools styled as interactive figures.
              </p>
            </div>
          ),
          figure: (
            <HeroResearchSection
              onStartResearch={() => setActivePaperId("scaling-laws")}
              onExploreResearch={() => setActivePaperId("emergent-abilities")}
            />
          ),
        },
      ],
    },
    {
      category: "Neural Architectures",
      papers: [
        {
          id: "scaling-laws",
          title: "Scaling Laws for Autoregressive Generative Models",
          authors: ["J. Kaplan", "S. McCandlish", "T. Henighan", "D. Amodei"],
          date: "Jan 2020",
          readTime: "8 min read",
          doi: "10.48550/arXiv.2001.08361",
          abstract: "We study the empirical scaling laws for language model performance on cross-entropy loss. Loss scales as a power-law with parameter count, dataset size, and compute budgets, showing minimal dependence on hyper-parameters.",
          body: (
            <div className="space-y-4 text-sm leading-relaxed text-[var(--sb-ink-muted)]">
              <p>
                We investigate empirical scaling laws for the cross-entropy loss of language models. We find that the loss scales smoothly as a power-law with parameter counts, dataset sizes, and total training compute budgets over ranges spanning up to seven orders of magnitude.
              </p>
              <p>
                Network width or depth changes yield negligible performance impacts when model capacity is held constant. Overfitting is avoided predictably if parameters scale in tandem with token counts.
              </p>
              <div className="bg-[var(--sb-pill)]/30 p-4 border border-[var(--sb-border)]/40 rounded-lg">
                <h5 className="text-[var(--sb-ink)] text-xs font-bold mb-2">Core Equation</h5>
                <code className="text-purple-600 dark:text-purple-400 text-xs block font-mono">
                  {"L(N, D) ≈ (N_c/N)^α_N + (D_c/D)^α_D"}
                </code>
              </div>
            </div>
          ),
          figure: <ResearchWorkspacePreview />,
        },
        {
          id: "deep-residual",
          title: "Deep Residual Learning for Image Recognition",
          authors: ["K. He", "X. Zhang", "S. Ren", "J. Sun"],
          date: "Dec 2015",
          readTime: "9 min read",
          doi: "10.1109/CVPR.2016.90",
          abstract: "Presents a residual learning framework to ease training of deep neural networks. We reformulate layers as learning residual functions with reference to inputs, achieving state-of-the-art accuracy at 152 layers.",
          body: (
            <div className="space-y-4 text-sm leading-relaxed text-[var(--sb-ink-muted)]">
              <p>
                When deeper networks start converging, an accuracy degradation problem is exposed: with network depth increasing, accuracy saturates and then degrades rapidly. This is not caused by overfitting, and adding more layers leads to higher training errors.
              </p>
              <p>
                Instead of hoping stacked layers fit a desired underlying mapping, we explicitly let these layers fit a residual mapping. The original mapping is reformulated into residual skips, realized via feed-forward connections.
              </p>
            </div>
          ),
          figure: <WorkflowTimeline />,
        },
      ],
    },
    {
      category: "Emergent Phenomena",
      papers: [
        {
          id: "emergent-abilities",
          title: "Emergent Abilities of Large Language Models",
          authors: ["J. Wei", "Y. Tay", "R. Bommasani", "C. Raffel", "Q. Le"],
          date: "Jun 2022",
          readTime: "12 min read",
          doi: "10.1162/tacl_a_00528",
          abstract: "Emergence represents abilities that are absent in smaller models but appear dramatically in large parameter scales. We document emergent capabilities across multiple prompting benchmarks and discuss model scaling implications.",
          body: (
            <div className="space-y-4 text-sm leading-relaxed text-[var(--sb-ink-muted)]">
              <p>
                An ability is emergent if it is not present in smaller models but is present in larger models. We define emergent abilities mathematically as when a scale parameter shifts model prediction performance from random guess to high accuracy abruptly.
              </p>
              <p>
                We analyze performance across task libraries like BIG-bench. Emergent benchmarks include multi-step reasoning, mathematical word problems, symbol translation, and instruction following, which often manifest above 10^22 FLOPs of scale.
              </p>
            </div>
          ),
          figure: <KnowledgeGraph />,
        },
      ],
    },
    {
      category: "Applied Systems",
      papers: [
        {
          id: "collaborative-notebooks",
          title: "Real-Time Collaborative Research Notebooks",
          authors: ["S. Jenkins", "A. Rivera", "M. Chen"],
          date: "Oct 2024",
          readTime: "11 min read",
          doi: "10.48550/arXiv.2410.09871",
          abstract: "This paper introduces design paradigms for multiplayer scientific research workspaces. We evaluate CRDT conflict resolution models on canvas whiteboard coordinates and remote cursor sharing under variable network latency.",
          body: (
            <div className="space-y-4 text-sm leading-relaxed text-[var(--sb-ink-muted)]">
              <p>
                Modern research is increasingly collaborative and distributed. Traditional static documents fail to capture the interactive flow of joint prompt tuning, shared literature annotation, and model output analysis.
              </p>
              <p>
                By designing collaborative workspaces built on conflict-free replicated data structures, researchers can co-design prompts and review output traces in real-time with zero-latency visual representation.
              </p>
            </div>
          ),
          figure: <CollaborationPreview />,
        },
        {
          id: "verifiable-synthesis",
          title: "Verifiable Code Synthesis & Validation Dashboard",
          authors: ["E. Rostova", "D. Park", "K. Sato"],
          date: "Feb 2025",
          readTime: "7 min read",
          doi: "10.48550/arXiv.2502.10293",
          abstract: "We explore automated code synthesis with integrated assertion checking and auxiliary LLM verification modules to reduce hallucination rates in generated code blocks.",
          body: (
            <div className="space-y-4 text-sm leading-relaxed text-[var(--sb-ink-muted)]">
              <p>
                Automatically generated code often lacks semantic verification, requiring manual validation by developers. We present a system architecture that embeds static assertion testing directly within the generative loop.
              </p>
              <p>
                Evaluating output programs against synthesized test suites results in a 42% relative reduction in syntax and logical execution errors during benchmark evaluation.
              </p>
            </div>
          ),
          figure: (
            <div className="space-y-8">
              <InsightCard />
              <FeatureCard />
            </div>
          ),
        },
      ],
    },
    {
      category: "Academic Community",
      papers: [
        {
          id: "endorsements-and-nodes",
          title: "Endorsements & Collaborative Research Networks",
          authors: ["Antigravity Research Consortium"],
          date: "Ongoing",
          readTime: "5 min read",
          doi: "N/A",
          abstract: "A compilation of feedback, citations, and reviews from global research labs and universities validating the open-source release of our core dataset collections and workflow nodes.",
          body: (
            <div className="space-y-4 text-sm leading-relaxed text-[var(--sb-ink-muted)]">
              <p>
                We host open discussions and receive peer evaluations from research teams worldwide. Below are highlights of scientific endorsements and repository collections hosted across our network.
              </p>
            </div>
          ),
          figure: (
            <div className="space-y-8">
              <TestimonialCard />
              <ResearchCollectionCard />
            </div>
          ),
        },
      ],
    },
  ];

  // Flat list of papers for easy lookup
  const allPapers = paperGroups.flatMap((g) => g.papers);
  const activePaper = allPapers.find((p) => p.id === activePaperId) || allPapers[0];

  // Scroll to top when changing papers
  useEffect(() => {
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTop = 0;
    }
  }, [activePaperId]);

  // Find active group for path index
  const activeGroup = paperGroups.find((g) => g.papers.some((p) => p.id === activePaper.id));

  return (
    <div className="flex h-full w-full bg-[var(--background)] text-[var(--sb-ink)] relative overflow-hidden font-sans border-0 outline-none select-none">
      {/* Background lights & grid patterns */}
      <MeshGradientBackground />
      <AnimatedGrid />

      {/* Left Sidebar Layout: W3Schools Navigation Index (Desktop) */}
      <aside className="hidden md:flex flex-col w-72 border-r border-[var(--sb-border)]/40 bg-[color-mix(in_oklab,var(--sb-bg)_30%,transparent)] backdrop-blur-md h-full shrink-0 select-none">
        <div className="h-14 flex items-center gap-2 border-b border-[var(--sb-border)]/40 px-5 shrink-0">
          <BookOpen className="w-4 h-4 text-indigo-500 dark:text-indigo-400 font-bold" />
          <span className="text-xs font-black uppercase tracking-wider text-[var(--sb-ink)]">
            Research Catalog
          </span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-4 scrollbar-none">
          {paperGroups.map((group) => (
            <div key={group.category} className="space-y-1">
              <div className="text-[10px] font-black uppercase tracking-widest text-[var(--sb-ink-dim)] px-2.5 py-1 select-none">
                {group.category}
              </div>
              {group.papers.map((paper) => {
                const isActive = activePaperId === paper.id;
                return (
                  <button
                    key={paper.id}
                    onClick={() => setActivePaperId(paper.id)}
                    className={`w-full text-left flex items-start gap-2.5 px-3 py-2 text-xs rounded-lg transition-all cursor-pointer font-medium ${
                      isActive
                        ? "bg-[color-mix(in_oklab,var(--sb-ink)_6%,transparent)] text-[var(--sb-accent)] font-semibold border-l-2 border-indigo-500"
                        : "text-[var(--sb-ink-muted)] hover:bg-[var(--sb-bg-hover)] hover:text-[var(--sb-ink)]"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[var(--sb-ink-dim)]" />
                    <div className="truncate">
                      <div className="font-semibold truncate">{paper.title}</div>
                      <div className="text-[10px] text-[var(--sb-ink-dim)] truncate mt-0.5 font-normal">
                        by {paper.authors.join(", ")}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      {/* Mobile Drawer Navigation overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            {/* Nav container */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-72 bg-[var(--card-bg)] border-r border-[var(--sb-border)] z-50 p-4 flex flex-col md:hidden"
            >
              <div className="flex justify-between items-center pb-4 border-b border-[var(--sb-border)]/60 mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--sb-ink)]">
                    Research Catalog
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 hover:bg-[var(--sb-bg-hover)] rounded cursor-pointer text-[var(--sb-ink-dim)] hover:text-[var(--sb-ink)]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto space-y-4">
                {paperGroups.map((group) => (
                  <div key={group.category} className="space-y-1">
                    <div className="text-[9px] font-black uppercase tracking-widest text-[var(--sb-ink-dim)] px-2.5 py-1">
                      {group.category}
                    </div>
                    {group.papers.map((paper) => {
                      const isActive = activePaperId === paper.id;
                      return (
                        <button
                          key={paper.id}
                          onClick={() => {
                            setActivePaperId(paper.id);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full text-left flex items-start gap-2.5 px-3 py-2 text-xs rounded-lg cursor-pointer ${
                            isActive
                              ? "bg-[color-mix(in_oklab,var(--sb-ink)_6%,transparent)] text-[var(--sb-accent)] font-semibold border-l-2 border-indigo-500"
                              : "text-[var(--sb-ink-muted)] hover:bg-[var(--sb-bg-hover)]"
                          }`}
                        >
                          <FileText className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[var(--sb-ink-dim)]" />
                          <div className="truncate">
                            <div className="font-semibold truncate">{paper.title}</div>
                            <div className="text-[10px] text-[var(--sb-ink-dim)] truncate mt-0.5">
                              by {paper.authors.join(", ")}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Workspace Frame */}
      <div
        ref={contentContainerRef}
        className="flex-1 flex flex-col h-full overflow-y-auto relative page-enter border-0 outline-none"
      >
        {/* Top Sticky Header */}
        <div className="sticky top-0 z-30 h-14 bg-[color-mix(in_oklab,var(--card-bg)_80%,transparent)] border-b border-[var(--sb-border)]/40 px-4 md:px-6 flex items-center justify-between backdrop-blur-md">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex md:hidden items-center justify-center p-2 border border-[var(--sb-border)]/65 rounded-lg text-[var(--sb-ink-muted)] hover:text-[var(--sb-ink)] hover:bg-[var(--sb-bg-hover)] cursor-pointer"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Active section breadcrumb */}
          <div className="flex items-center gap-2 ml-2 md:ml-0 font-mono text-[10px] text-[var(--sb-ink-muted)] font-semibold">
            <Compass className="w-3.5 h-3.5 text-indigo-500" />
            <span className="uppercase tracking-wider">
              {activeGroup?.category}
            </span>
            <span>/</span>
            <span className="text-[var(--sb-ink)] truncate max-w-[200px] sm:max-w-xs font-sans font-bold">
              {activePaper.title}
            </span>
          </div>

          {/* Meta Right indicator */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono font-bold bg-[var(--sb-pill)] border border-[var(--sb-border)]/45 text-[var(--sb-ink-muted)] px-2.5 py-1 rounded-full select-none">
              READ-ONLY MODE
            </span>
          </div>
        </div>

        {/* Paper Document Content View */}
        <div className="flex-1 py-8 px-4 md:px-12 max-w-5xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.article
              key={activePaper.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-8 select-text"
            >
              {/* Paper Header */}
              <header className="space-y-4 border-b border-[var(--sb-border)]/40 pb-6">
                <span className="text-[10px] font-mono bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  {activeGroup?.category} Publication
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--sb-ink)] leading-snug tracking-tight">
                  {activePaper.title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[var(--sb-ink-dim)]">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[var(--sb-ink-dim)]" />
                    <span>{activePaper.authors.join(", ")}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-[var(--sb-ink-dim)]" />
                    <span>{activePaper.date}</span>
                  </div>
                  <div className="font-mono bg-[var(--sb-pill)] px-2 py-0.5 rounded text-[10px] text-[var(--sb-ink-muted)] border border-[var(--sb-border)]/40">
                    DOI: {activePaper.doi}
                  </div>
                  <div className="text-[11px] font-semibold text-indigo-500 font-mono">
                    {activePaper.readTime}
                  </div>
                </div>
              </header>

              {/* Paper Abstract */}
              <div className="bg-[color-mix(in_oklab,var(--sb-pill)_25%,transparent)] border-l-4 border-indigo-500 rounded-r-xl p-5 md:p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--sb-ink)] mb-2">
                  Abstract Summary
                </h3>
                <p className="text-xs md:text-sm text-[var(--sb-ink-muted)] leading-relaxed italic">
                  {activePaper.abstract}
                </p>
              </div>

              {/* Paper Body Content */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--sb-ink-dim)] border-b border-[var(--sb-border)]/40 pb-2">
                  Paper Synthesis & Discussion
                </h3>
                {activePaper.body}
              </div>

              {/* Embedded Visual Figure */}
              {activePaper.figure && (
                <div className="mt-8 border border-[var(--sb-border)]/40 rounded-xl overflow-hidden bg-[color-mix(in_oklab,var(--card-bg)_60%,transparent)] backdrop-blur-sm shadow-md">
                  <div className="border-b border-[var(--sb-border)]/30 bg-[var(--sb-pill)]/35 px-4 py-2.5 flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--sb-ink-dim)]">
                      Interactive Visual Figure
                    </span>
                    <span className="text-[9px] bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 px-2 py-0.5 rounded font-mono font-black">
                      ACTIVE COMPONENT
                    </span>
                  </div>
                  <div className="p-4 md:p-6 overflow-x-auto bg-[var(--card-bg)]/25">
                    {activePaper.figure}
                  </div>
                  <div className="border-t border-[var(--sb-border)]/30 bg-[var(--sb-pill)]/15 px-4 py-3 text-[11px] text-[var(--sb-ink-dim)] leading-relaxed italic">
                    <strong>Figure 1.1:</strong> Live model telemetry representation. Interact with options to review parameter grids, concept structures, or node triggers directly in read-only console view.
                  </div>
                </div>
              )}
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
