import { useState, useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, BookOpen, Menu, X } from "lucide-react";
import {
  MeshGradientBackground,
  AnimatedGrid,
  HeroResearchSection,
  ResearchWorkspacePreview,
  FeatureCard,
  KnowledgeGraph,
  ResearchCollectionCard,
  ResearchCategoryCard,
  WorkflowTimeline,
  PublicationCard,
  InsightCard,
  CollaborationPreview,
  TestimonialCard,
  CTASection,
} from "#/components/research";

export const Route = createFileRoute("/_app/research")({
  component: ResearchPage,
});

interface Chapter {
  id: string;
  title: string;
  component: (props: any) => React.ReactNode;
}

function ResearchPage() {
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const contentContainerRef = useRef<HTMLDivElement>(null);

  const chapters: Chapter[] = [
    {
      id: "hero",
      title: "Welcome & Overview",
      component: (props) => (
        <HeroResearchSection
          onStartResearch={props.onStartResearch}
          onExploreResearch={props.onExploreResearch}
        />
      ),
    },
    {
      id: "workspace",
      title: "Interactive Workspace",
      component: () => <ResearchWorkspacePreview />,
    },
    {
      id: "features",
      title: "Advanced AI Features",
      component: () => <FeatureCard />,
    },
    {
      id: "graph",
      title: "Interactive Concept Map",
      component: () => <KnowledgeGraph />,
    },
    {
      id: "collections",
      title: "Research Collections",
      component: () => <ResearchCollectionCard />,
    },
    {
      id: "methodology",
      title: "Research Methodology",
      component: () => <WorkflowTimeline />,
    },
    {
      id: "categories",
      title: "Scientific Channels",
      component: () => <ResearchCategoryCard />,
    },
    {
      id: "publications",
      title: "Publications Library",
      component: () => <PublicationCard />,
    },
    {
      id: "insights",
      title: "AI Insights Analysis",
      component: () => <InsightCard />,
    },
    {
      id: "collaboration",
      title: "Multiplayer Collaboration",
      component: () => <CollaborationPreview />,
    },
    {
      id: "testimonials",
      title: "Academic Endorsements",
      component: () => <TestimonialCard />,
    },
    {
      id: "cta",
      title: "Get Started today",
      component: (props) => (
        <CTASection
          onStartResearch={props.onStartResearch}
          onRequestDemo={props.onStartResearch}
        />
      ),
    },
  ];

  // Navigate to specific workspace chapter
  const navigateToWorkspace = () => {
    setActiveChapterIdx(1); // Index 1 is workspace
  };

  // Navigate to specific publications chapter
  const navigateToPublications = () => {
    setActiveChapterIdx(7); // Index 7 is publications
  };

  // Scroll to top when changing chapters
  useEffect(() => {
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTop = 0;
    }
  }, [activeChapterIdx]);

  const handleNext = () => {
    if (activeChapterIdx < chapters.length - 1) {
      setActiveChapterIdx(activeChapterIdx + 1);
    }
  };

  const handlePrev = () => {
    if (activeChapterIdx > 0) {
      setActiveChapterIdx(activeChapterIdx - 1);
    }
  };

  const activeChapter = chapters[activeChapterIdx];

  return (
    <div className="flex h-full w-full bg-[var(--background)] text-[var(--sb-ink)] relative overflow-hidden font-sans border-0 outline-none select-none">
      {/* Background lights & grid patterns */}
      <MeshGradientBackground />
      <AnimatedGrid />

      {/* Left Sidebar Layout: W3Schools Navigation Index (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-[var(--sb-border)]/40 bg-[color-mix(in_oklab,var(--sb-bg)_30%,transparent)] backdrop-blur-md h-full shrink-0 select-none">
        <div className="h-14 flex items-center gap-2 border-b border-[var(--sb-border)]/40 px-4 shrink-0">
          <BookOpen className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--sb-ink-dim)]">
            Research Chapters
          </span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1 scrollbar-none">
          {chapters.map((chap, idx) => {
            const isActive = activeChapterIdx === idx;
            return (
              <button
                key={chap.id}
                onClick={() => setActiveChapterIdx(idx)}
                className={`w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg transition-all cursor-pointer font-medium ${
                  isActive
                    ? "bg-[color-mix(in_oklab,var(--sb-ink)_6%,transparent)] text-[var(--sb-accent)] font-semibold border-l-2 border-indigo-500"
                    : "text-[var(--sb-ink-muted)] hover:bg-[var(--sb-bg-hover)] hover:text-[var(--sb-ink)]"
                }`}
              >
                <span className="w-5 font-mono text-[10px] text-[var(--sb-ink-dim)]">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="truncate">{chap.title}</span>
              </button>
            );
          })}
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
              className="fixed top-0 bottom-0 left-0 w-64 bg-[var(--card-bg)] border-r border-[var(--sb-border)] z-50 p-4 flex flex-col md:hidden"
            >
              <div className="flex justify-between items-center pb-4 border-b border-[var(--sb-border)]/60 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--sb-ink-dim)]">
                  Research Chapters
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 hover:bg-[var(--sb-bg-hover)] rounded cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto space-y-1">
                {chapters.map((chap, idx) => {
                  const isActive = activeChapterIdx === idx;
                  return (
                    <button
                      key={chap.id}
                      onClick={() => {
                        setActiveChapterIdx(idx);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg cursor-pointer ${
                        isActive
                          ? "bg-[color-mix(in_oklab,var(--sb-ink)_6%,transparent)] text-[var(--sb-accent)] font-semibold border-l-2 border-indigo-500"
                          : "text-[var(--sb-ink-muted)] hover:bg-[var(--sb-bg-hover)]"
                      }`}
                    >
                      <span className="font-mono text-[10px] text-[var(--sb-ink-dim)]">
                        {idx + 1}
                      </span>
                      <span>{chap.title}</span>
                    </button>
                  );
                })}
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
        {/* Top Header / Nav controller (W3Schools style) */}
        <div className="sticky top-0 z-30 h-14 bg-[color-mix(in_oklab,var(--card-bg)_80%,transparent)] border-b border-[var(--sb-border)]/40 px-4 md:px-6 flex items-center justify-between backdrop-blur-md">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex md:hidden items-center justify-center p-2 border border-[var(--sb-border)]/65 rounded-lg text-[var(--sb-ink-muted)] hover:text-[var(--sb-ink)] hover:bg-[var(--sb-bg-hover)] cursor-pointer"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Active section info */}
          <div className="flex items-center gap-2 ml-2 md:ml-0">
            <span className="text-[10px] font-mono font-bold bg-[var(--sb-pill)] border border-[var(--sb-border)]/40 text-[var(--sb-ink-muted)] px-2 py-0.5 rounded-full select-none">
              Chapter {activeChapterIdx + 1} of {chapters.length}
            </span>
            <span className="text-xs font-bold text-[var(--sb-ink)] hidden sm:inline-block">
              / {activeChapter.title}
            </span>
          </div>

          {/* Top Previous/Next Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={activeChapterIdx === 0}
              className="py-1.5 px-3 border border-[var(--sb-border)] text-xs font-bold rounded-lg flex items-center gap-1 transition-all select-none enabled:hover:bg-[var(--sb-bg-hover)] enabled:cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              « Prev
            </button>
            <button
              onClick={handleNext}
              disabled={activeChapterIdx === chapters.length - 1}
              className="py-1.5 px-3 bg-[var(--sb-accent)] text-[var(--sb-accent-foreground)] border border-[var(--sb-border)] text-xs font-bold rounded-lg flex items-center gap-1 transition-all select-none enabled:hover:opacity-90 enabled:cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next »
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Core Component Frame view */}
        <div className="flex-1 py-8 px-4 md:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeChapter.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full flex flex-col justify-between"
            >
              {/* Renders active chapter */}
              {activeChapter.component({
                onStartResearch: navigateToWorkspace,
                onExploreResearch: navigateToPublications,
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Navigation Buttons (W3Schools style) */}
        <div className="bg-[var(--sb-pill)]/30 border-t border-[var(--sb-border)]/40 py-6 px-4 md:px-8 flex justify-between items-center">
          <button
            onClick={handlePrev}
            disabled={activeChapterIdx === 0}
            className="py-2 px-4 border border-[var(--sb-border)] text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all select-none enabled:hover:bg-[var(--sb-bg-hover)] enabled:cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            « Previous Chapter
          </button>

          <span className="text-[10px] font-mono text-[var(--sb-ink-dim)] hidden sm:inline-block">
            {activeChapter.title} ({activeChapterIdx + 1}/{chapters.length})
          </span>

          <button
            onClick={handleNext}
            disabled={activeChapterIdx === chapters.length - 1}
            className="py-2 px-4 bg-[var(--sb-accent)] text-[var(--sb-accent-foreground)] border border-[var(--sb-border)] text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all select-none enabled:hover:opacity-90 enabled:cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next Chapter »
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
