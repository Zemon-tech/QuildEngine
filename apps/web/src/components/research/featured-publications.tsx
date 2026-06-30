import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  Check,
  ChevronRight,
  Copy,
  ExternalLink,
  User,
} from "lucide-react";
import { useState } from "react";
import { GlassCard, SpotlightEffect } from "./spotlight";

interface Publication {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  date: string;
  category: string;
  readTime: string;
  fullBody: React.ReactNode;
  bibtex: string;
  doi: string;
}

export function PublicationCard() {
  const publications: Publication[] = [
    {
      id: "scaling_laws",
      title: "Scaling Laws for Autoregressive Generative Models",
      abstract:
        "We study the empirical scaling laws for language model performance on cross-entropy loss. Loss scales as a power-law with parameter count, dataset size, and compute budgets, showing minimal dependence on hyper-parameters.",
      authors: ["J. Kaplan", "S. McCandlish", "T. Henighan", "D. Amodei"],
      date: "Jan 2020",
      category: "LLMs & Scaling",
      readTime: "8 min read",
      doi: "10.48550/arXiv.2001.08361",
      bibtex: `@article{kaplan2020scaling,
  title={Scaling laws for autoregressive generative models},
  author={Kaplan, Jared and McCandlish, Sam and Henighan, Tom and Brown, Tom B and Chess, Benjamin and Child, Rewon and Gray, Scott and Radford, Alec and Wu, Jeffrey and Amodei, Dario},
  journal={arXiv preprint arXiv:2001.08361},
  year={2020}
}`,
      fullBody: (
        <div className="space-y-6 text-[var(--sb-ink-muted)] text-sm leading-relaxed">
          <div>
            <h4 className="text-[var(--sb-ink)] font-bold mb-2">
              Introduction & Overview
            </h4>
            <p>
              We investigate empirical scaling laws for the cross-entropy loss
              of language models. We find that the loss scales smoothly as a
              power-law with parameter counts, dataset sizes, and total training
              compute budgets over ranges spanning up to seven orders of
              magnitude.
            </p>
          </div>
          <div>
            <h4 className="text-[var(--sb-ink)] font-bold mb-2">
              Key Scaling Empirical Rules
            </h4>
            <ul className="list-disc pl-5 space-y-1.5 text-[var(--sb-ink-muted)]">
              <li>
                Performance scales primarily as a power-law with model size $N$,
                dataset size $D$, and training compute $C$.
              </li>
              <li>
                Network width or depth changes yield negligible performance
                impacts when model capacity is held constant.
              </li>
              <li>
                Overfitting is avoided predictably if parameters $N$ scale in
                tandem with token counts $D$.
              </li>
            </ul>
          </div>
          <div className="bg-[var(--bg-base)] p-4 border border-[var(--sb-border)]/40 rounded-lg">
            <h5 className="text-[var(--sb-ink)] text-xs font-bold mb-2">
              Core Equation
            </h5>
            <code className="text-purple-600 dark:text-purple-400 text-xs block font-mono">
              {"L(N, D) \\approx (N_c/N)^{\\alpha_N} + (D_c/D)^{\\alpha_D}"}
            </code>
          </div>
        </div>
      ),
    },
    {
      id: "emergent_abilities",
      title: "Emergent Abilities of Large Language Models",
      abstract:
        "Emergence represents abilities that are absent in smaller models but appear dramatically in large parameter scales. We document emergent capabilities across multiple prompting benchmarks and discuss model scaling implications.",
      authors: ["J. Wei", "Y. Tay", "R. Bommasani", "C. Raffel", "Q. Le"],
      date: "Jun 2022",
      category: "Cognitive Emergence",
      readTime: "12 min read",
      doi: "10.1162/tacl_a_00528",
      bibtex: `@article{wei2022emergent,
  title={Emergent abilities of large language models},
  author={Wei, Jason and Tay, Yi and Bommasani, Rishi and Raffel, Colin and Zoph, Barret and Borgeaud, Sebastian and Yogatama, Dani and Bosma, Maarten and Zhou, Denny and Metzler, Donald and others},
  journal={Transactions on Association for Computational Linguistics},
  volume={10},
  pages={1371--1385},
  year={2022}
}`,
      fullBody: (
        <div className="space-y-6 text-[var(--sb-ink-muted)] text-sm leading-relaxed">
          <div>
            <h4 className="text-[var(--sb-ink)] font-bold mb-2">
              What is Emergence?
            </h4>
            <p>
              An ability is emergent if it is not present in smaller models but
              is present in larger models. We define emergent abilities
              mathematically as when a scale parameter (like parameter count or
              FLOPs) shifts model prediction performance from random guess to
              high accuracy abruptly.
            </p>
          </div>
          <div>
            <h4 className="text-[var(--sb-ink)] font-bold mb-2">
              Primary Findings
            </h4>
            <p>
              We analyze performance across task libraries like BIG-bench.
              Emergent benchmarks include multi-step reasoning, mathematical
              word problems, symbol translation, and instruction following,
              which often manifest above 10^22 FLOPs of scale.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "deep_residual",
      title: "Deep Residual Learning for Image Recognition",
      abstract:
        "Presents a residual learning framework to ease training of deep neural networks. We reformulate layers as learning residual functions with reference to inputs, achieving state-of-the-art accuracy at 152 layers.",
      authors: ["K. He", "X. Zhang", "S. Ren", "J. Sun"],
      date: "Dec 2015",
      category: "Computer Vision",
      readTime: "9 min read",
      doi: "10.1109/CVPR.2016.90",
      bibtex: `@inproceedings{he2016deep,
  title={Deep residual learning for image recognition},
  author={He, Kaiming and Zhang, Xiangyu={Zhang} and Ren, Shaoqing and Sun, Jian},
  booktitle={Proceedings of IEEE conference on computer vision and pattern recognition},
  pages={770--778},
  year={2016}
}`,
      fullBody: (
        <div className="space-y-6 text-[var(--sb-ink-muted)] text-sm leading-relaxed">
          <div>
            <h4 className="text-[var(--sb-ink)] font-bold mb-2">
              The Degradation Problem
            </h4>
            <p>
              When deeper networks start converging, an accuracy degradation
              problem is exposed: with network depth increasing, accuracy
              saturates and then degrades rapidly. This is not caused by
              overfitting, and adding more layers leads to higher training
              errors.
            </p>
          </div>
          <div>
            <h4 className="text-[var(--sb-ink)] font-bold mb-2">
              Residual Learning Framework
            </h4>
            <p>
              {
                "Instead of hoping stacked layers fit a desired underlying mapping $\\mathcal{H}(x)$, we explicitly let these layers fit a residual mapping $\\mathcal{F}(x) := \\mathcal{H}(x) - x$. The original mapping is reformulated into $\\mathcal{F}(x) + x$, realized via feed-forward skip connections."
              }
            </p>
          </div>
        </div>
      ),
    },
  ];

  const [activePubId, setActivePubId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activePub = publications.find((p) => p.id === activePubId);

  const handleCopyBibtex = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto px-6 py-12 md:py-16">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--sb-ink)] tracking-tight mb-4 display-title">
          Featured Research Publications
        </h2>
        <p className="text-[var(--sb-ink-muted)] text-sm md:text-base">
          Academic findings and engineering articles compiled by our core
          research laboratories.
        </p>
      </div>

      {/* Publications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {publications.map((pub) => (
          <SpotlightEffect
            key={pub.id}
            glowColor="rgba(99,102,241,0.1)"
            glowSize={350}
          >
            <GlassCard className="p-6 h-[340px] flex flex-col justify-between border-[var(--sb-border)]/40 dark:border-white/[0.06] hover:border-[var(--sb-border)]/85 dark:hover:border-white/[0.12] group">
              <div>
                {/* Meta details */}
                <div className="flex items-center justify-between text-[10px] text-[var(--sb-ink-muted)] font-mono mb-4">
                  <span className="bg-[var(--sb-pill)] border border-[var(--sb-border)]/40 text-[var(--sb-ink-muted)] px-2 py-0.5 rounded font-medium">
                    {pub.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[var(--sb-ink-dim)]" />
                    {pub.date}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-[var(--sb-ink)] group-hover:text-[var(--sb-ink)] transition-colors line-clamp-2 mb-3">
                  {pub.title}
                </h3>

                {/* Abstract Preview */}
                <p className="text-xs text-[var(--sb-ink-muted)] leading-relaxed line-clamp-3 mb-4">
                  {pub.abstract}
                </p>

                {/* Authors Section */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <User className="w-3.5 h-3.5 text-[var(--sb-ink-dim)]" />
                  <span className="text-[10px] text-[var(--sb-ink-dim)]">
                    {pub.authors.join(", ")}
                  </span>
                </div>
              </div>

              {/* Action row */}
              <div className="border-t border-[var(--sb-border)]/40 dark:border-white/5 pt-4 flex items-center justify-between">
                <span className="text-[10px] text-[var(--sb-ink-dim)] font-mono">
                  {pub.readTime}
                </span>
                <button
                  onClick={() => setActivePubId(pub.id)}
                  className="py-1.5 px-3 bg-[var(--card-bg)] hover:bg-[var(--sb-bg-hover)] border border-[var(--sb-border)] text-xs font-bold text-[var(--sb-ink-muted)] hover:text-[var(--sb-ink)] rounded-lg flex items-center gap-1 cursor-pointer transition-all duration-200"
                >
                  Read Publication
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          </SpotlightEffect>
        ))}
      </div>

      {/* Slide-out Drawer / Overlay for Reading Paper */}
      <AnimatePresence>
        {activePubId && activePub && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePubId(null)}
              className="fixed inset-0 bg-black/40 dark:bg-black/70 z-50 backdrop-blur-sm cursor-pointer"
            />

            {/* Document Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[540px] md:w-[640px] bg-[var(--card-bg)] border-l border-[var(--sb-border)]/60 dark:border-white/10 z-50 p-6 md:p-8 flex flex-col justify-between shadow-2xl overflow-y-auto"
            >
              <div className="space-y-8">
                {/* Header */}
                <div className="flex justify-between items-start border-b border-[var(--sb-border)]/40 dark:border-white/5 pb-6">
                  <div>
                    <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">
                      {activePub.category}
                    </span>
                    <h3 className="text-xl font-extrabold text-[var(--sb-ink)] mt-3 leading-snug">
                      {activePub.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--sb-ink-muted)] mt-2 font-mono">
                      <span>{activePub.date}</span>
                      <span>•</span>
                      <span>DOI: {activePub.doi}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setActivePubId(null)}
                    className="p-1.5 hover:bg-[var(--sb-bg-hover)] border border-transparent hover:border-[var(--sb-border)]/60 rounded-lg text-[var(--sb-ink-dim)] hover:text-[var(--sb-ink)] cursor-pointer transition-all"
                  >
                    ✕
                  </button>
                </div>

                {/* Authors block */}
                <div>
                  <h4 className="text-[10px] text-[var(--sb-ink-dim)] font-mono uppercase tracking-widest mb-2">
                    Authors & Affiliations
                  </h4>
                  <p className="text-sm font-semibold text-[var(--sb-ink)]">
                    {activePub.authors.join(", ")}
                  </p>
                  <p className="text-xs text-[var(--sb-ink-muted)] mt-0.5">
                    Antigravity AI Research Labs & Joint Partners
                  </p>
                </div>

                {/* Abstract */}
                <div className="bg-[var(--sb-pill)] border border-[var(--sb-border)]/40 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-[var(--sb-ink)] flex items-center gap-1.5 mb-2">
                    <BookOpen className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                    Abstract
                  </h4>
                  <p className="text-xs text-[var(--sb-ink-muted)] leading-relaxed italic">
                    {activePub.abstract}
                  </p>
                </div>

                {/* Full Body Text */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-[10px] text-[var(--sb-ink-dim)] font-mono uppercase tracking-widest border-b border-[var(--sb-border)]/40 dark:border-white/5 pb-2">
                    Full Paper Synthesis
                  </h4>
                  {activePub.fullBody}
                </div>

                {/* Citation block */}
                <div className="space-y-3 pt-4">
                  <h4 className="text-[10px] text-[var(--sb-ink-dim)] font-mono uppercase tracking-widest">
                    Export Citation (BibTeX)
                  </h4>
                  <div className="relative bg-[var(--bg-base)] p-4 border border-[var(--sb-border)]/40 rounded-lg flex items-start justify-between group">
                    <pre className="text-[10px] text-[var(--sb-ink-muted)] font-mono whitespace-pre-wrap flex-1 overflow-x-auto select-all leading-relaxed">
                      {activePub.bibtex}
                    </pre>
                    <button
                      onClick={() =>
                        handleCopyBibtex(activePub.bibtex, activePub.id)
                      }
                      className="p-1.5 bg-[var(--card-bg)] border border-[var(--sb-border)] hover:border-zinc-400 dark:hover:border-zinc-700 text-[var(--sb-ink-muted)] hover:text-[var(--sb-ink)] rounded-md shrink-0 cursor-pointer ml-3 transition-colors"
                      title="Copy to clipboard"
                    >
                      {copiedId === activePub.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer inside drawer */}
              <div className="border-t border-[var(--sb-border)]/40 dark:border-white/5 pt-6 mt-12 flex justify-between items-center text-xs">
                <span className="text-[var(--sb-ink-dim)]">
                  Read time: {activePub.readTime}
                </span>
                <a
                  href={`https://doi.org/${activePub.doi}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-semibold flex items-center gap-1 text-xs"
                >
                  Open External Source
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
