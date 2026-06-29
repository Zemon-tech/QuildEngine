import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Brain,
  Sparkles,
  Link,
  ChevronRight,
  Database,
  Search,
  FolderOpen,
  Pin,
  CheckCircle,
} from "lucide-react";
import { GlassCard, SpotlightEffect } from "./spotlight";

// Interface for Mock Documents
interface MockDocument {
  id: string;
  title: string;
  type: string;
  sourceName: string;
  date: string;
  content: React.ReactNode;
  summary: string;
  citations: string[];
  relatedTopics: string[];
  insights: { title: string; text: string }[];
}

export function ResearchWorkspacePreview() {
  const mockDocs: MockDocument[] = [
    {
      id: "transformer",
      title: "Attention Is All You Need",
      type: "pdf",
      sourceName: "Vaswani et al. (2017)",
      date: "Dec 2017",
      summary: "Introduces the Transformer model, relying solely on self-attention mechanisms, dispensing with recurrent or convolutional networks entirely.",
      content: (
        <div className="space-y-4 text-[var(--sb-ink-muted)] text-sm font-sans leading-relaxed">
          <p>
            The dominant sequence transduction models are based on complex recurrent or convolutional neural networks in an encoder-decoder configuration. The best performing models also connect the encoder and decoder through an attention mechanism.
          </p>
          <p className="bg-indigo-500/10 border-l-2 border-indigo-500 px-3 py-2 text-indigo-700 dark:text-indigo-200">
            We propose a new simple network architecture, the <strong className="text-[var(--sb-ink)]">Transformer</strong>, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train.
          </p>
          <p>
            An attention function can be described as mapping a query and a set of key-value pairs to an output, where the query, keys, values, and output are all vectors. The output is computed as a weighted sum of the values, where the weight assigned to each value is computed by a compatibility function of the query with the corresponding key.
          </p>
        </div>
      ),
      citations: [
        "Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., ... & Polosukhin, I. (2017). Attention is all you need.",
        "Bahdanau, D., Cho, K., & Bengio, Y. (2014). Neural machine translation by jointly learning to align and translate.",
      ],
      relatedTopics: ["Self-Attention", "Deep Learning", "Transformer Encoder", "NLP", "Machine Translation"],
      insights: [
        {
          title: "Parallel Execution",
          text: "Unlike LSTMs, Transformers process entire sequences simultaneously, decreasing training time exponentially.",
        },
        {
          title: "Multi-Head Attention",
          text: "Enables the model to jointly attend to information from different representation subspaces at different positions.",
        },
      ],
    },
    {
      id: "alphafold",
      title: "Accurate Structure Prediction of Biomolecular Complexes",
      type: "paper",
      sourceName: "Abramson et al. (2024)",
      date: "May 2024",
      summary: "Introduces AlphaFold 3, expanding molecular structure prediction to proteins, nucleic acids, small molecule ligands, and chemical modifications.",
      content: (
        <div className="space-y-4 text-[var(--sb-ink-muted)] text-sm font-sans leading-relaxed">
          <p>
            The prediction of biomolecular interactions is crucial for molecular biology and drug design. Previous computational methods, including AlphaFold 2, were limited to predicting the structures of proteins.
          </p>
          <p className="bg-cyan-500/10 border-l-2 border-cyan-500 px-3 py-2 text-cyan-700 dark:text-cyan-200">
            Here we describe <strong className="text-[var(--sb-ink)]">AlphaFold 3</strong>, an AI model that predicts the structures of complexes formed by proteins, nucleic acids, small molecules, ions, and chemical modifications. The model achieves high accuracy across a broad spectrum of biomolecular interaction tests.
          </p>
          <p>
            By utilizing a unified diffusion module, the system models raw coordinates directly rather than relying on structural templates or contact maps. This unlocks predicting protein-ligand and protein-nucleic acid structures with atomic accuracy.
          </p>
        </div>
      ),
      citations: [
        "Abramson, J., Adler, J., Dunger, J., Evans, R., Green, T., Pritzel, A., ... & Hassabis, D. (2024). Accurate structure prediction of biomolecular complexes.",
        "Jumper, J., Evans, R., Pritzel, A., Green, T., Figurnov, M., Ronneberger, O., ... & Hassabis, D. (2021). Highly accurate protein structure prediction with AlphaFold.",
      ],
      relatedTopics: ["AlphaFold 3", "Structural Biology", "Molecular Docking", "Diffusion Models", "Biochemistry"],
      insights: [
        {
          title: "Unified Coordinate Modeling",
          text: "AlphaFold 3 uses a diffusion model directly on coordinates, avoiding intermediate contact maps entirely.",
        },
        {
          title: "Ligand Interactions",
          text: "Achieves remarkable accuracy in drug discovery tests, predicting how chemical compound ligands bind to targeted active protein sites.",
        },
      ],
    },
    {
      id: "quantum",
      title: "Quantum Supremacy Using a Superconducting Processor",
      type: "dataset",
      sourceName: "Arute et al. (2019)",
      date: "Oct 2019",
      summary: "Reports quantum supremacy using a programmable superconducting processor with 53 qubits, executing a benchmark calculation in 200 seconds.",
      content: (
        <div className="space-y-4 text-[var(--sb-ink-muted)] text-sm font-sans leading-relaxed">
          <p>
            One of the guiding promises of quantum computing is that quantum processors can perform certain tasks exponentially faster than classical supercomputers.
          </p>
          <p className="bg-purple-500/10 border-l-2 border-purple-500 px-3 py-2 text-purple-700 dark:text-purple-200">
            We describe the use of a programmable superconducting processor with 53 qubits, named <strong className="text-[var(--sb-ink)]">Sycamore</strong>, to run quantum circuits. The processor took about 200 seconds to sample one instance of a quantum circuit a million times—a task that would take the state-of-the-art supercomputer approximately 10,000 years.
          </p>
          <p>
            This quantum experiment establishes a vital computing milestone (Quantum Supremacy) and lays down critical calibration benchmarks for building future fault-tolerant quantum computers.
          </p>
        </div>
      ),
      citations: [
        "Arute, F., Arya, K., Babbush, R., Bacon, D., Bardin, J. C., Barends, R., ... & Martinis, J. M. (2019). Quantum supremacy using a programmable superconducting processor.",
        "Nielsen, M. A., & Chuang, I. L. (2010). Quantum computation and quantum information.",
      ],
      relatedTopics: ["Quantum Supremacy", "Superconducting Qubits", "Quantum Gate Arrays", "Sycamore Processor"],
      insights: [
        {
          title: "Sycamore Execution",
          text: "Sycamore processor resolves complex cross-entropy benchmark distributions in 200 seconds, showcasing quantum parallelism.",
        },
        {
          title: "Error Scaling",
          text: "Demonstrates that error rates scale predictably with system scale, supporting the roadmap for quantum error correction.",
        },
      ],
    },
  ];

  const [selectedDocId, setSelectedDocId] = useState("transformer");
  const activeDoc = mockDocs.find((doc) => doc.id === selectedDocId) || mockDocs[0];

  return (
    <div className="relative w-full rounded-xl overflow-hidden">
      {/* Main Interactive Screen */}
      <SpotlightEffect glowColor="rgba(99,102,241,0.08)" glowSize={600}>
        <GlassCard className="flex flex-col lg:flex-row h-[650px] overflow-hidden border-[var(--sb-border)]/60 dark:border-white/[0.08] min-w-[960px]">
          
          {/* Left Sidebar: Sources */}
          <div className="w-full lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-[var(--sb-border)]/40 dark:border-white/5 bg-[color-mix(in_oklab,var(--sb-bg)_30%,transparent)] p-4 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center gap-2 mb-4 px-2">
                <FolderOpen className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                <span className="text-xs font-semibold text-[var(--sb-ink-muted)] uppercase tracking-wider">
                  Collections & Sources
                </span>
              </div>

              {/* Collections List */}
              <div className="space-y-1.5 mb-6">
                <div className="flex items-center justify-between text-xs px-2.5 py-1.5 text-[var(--sb-ink-muted)] bg-[var(--sb-pill)] rounded-md border border-[var(--sb-border)]/40">
                  <span className="flex items-center gap-2 font-medium text-[var(--sb-ink)]">
                    <Database className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                    AI & Computing
                  </span>
                  <span className="text-[10px] bg-[var(--card-bg)] border border-[var(--sb-border)]/60 text-[var(--sb-ink-muted)] px-1.5 py-0.5 rounded font-mono">
                    3
                  </span>
                </div>
              </div>

              {/* Source List */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[var(--sb-ink-dim)] uppercase tracking-widest px-2.5 block mb-2">
                  Documents
                </span>

                {mockDocs.map((doc) => {
                  const isActive = doc.id === selectedDocId;
                  return (
                    <button
                      key={doc.id}
                      onClick={() => setSelectedDocId(doc.id)}
                      className={`w-full text-left flex items-start gap-2.5 px-2.5 py-2.5 rounded-lg transition-all duration-200 group/btn cursor-pointer ${
                        isActive
                          ? "bg-indigo-500/10 border border-indigo-500/30 text-indigo-700 dark:text-indigo-200 font-semibold"
                          : "border border-transparent text-[var(--sb-ink-muted)] hover:text-[var(--sb-ink)] hover:bg-[var(--sb-bg-hover)]"
                      }`}
                    >
                      <FileText
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          isActive ? "text-indigo-500 dark:text-indigo-400" : "text-[var(--sb-ink-dim)] group-hover/btn:text-[var(--sb-ink-muted)]"
                        }`}
                      />
                      <div className="truncate">
                        <p className="text-xs font-semibold truncate text-[var(--sb-ink)]">
                          {doc.title}
                        </p>
                        <p className="text-[10px] text-[var(--sb-ink-dim)] truncate mt-0.5">
                          {doc.sourceName}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Status Bar */}
            <div className="border-t border-[var(--sb-border)]/40 dark:border-white/5 pt-4 text-[10px] text-[var(--sb-ink-dim)] flex items-center justify-between px-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-cyan-500 dark:text-cyan-400" />
                Context Sync
              </span>
              <span className="font-mono">v1.4.0</span>
            </div>
          </div>

          {/* Center Workspace: Doc View */}
          <div className="flex-1 bg-[color-mix(in_oklab,var(--card-bg)_80%,transparent)] p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              {/* Document Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--sb-border)]/40 dark:border-white/5 pb-4 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full uppercase font-mono font-bold">
                      {activeDoc.type}
                    </span>
                    <span className="text-[10px] text-[var(--sb-ink-dim)] font-mono">
                      Published {activeDoc.date}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[var(--sb-ink)] mt-1.5 leading-snug">
                    {activeDoc.title}
                  </h3>
                </div>
                
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-[var(--card-bg)] border border-[var(--sb-border)] text-[var(--sb-ink-muted)] hover:text-[var(--sb-ink)] text-xs rounded-md transition-colors flex items-center gap-1.5 cursor-pointer">
                    <Pin className="w-3.5 h-3.5" />
                    Pin Selection
                  </button>
                </div>
              </div>

              {/* Document Text Body */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDoc.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 max-w-none"
                >
                  {activeDoc.content}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Simulated Workspace Controls */}
            <div className="border-t border-[var(--sb-border)]/40 dark:border-white/5 pt-6 mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 bg-[var(--sb-pill)] border border-[var(--sb-border)]/60 rounded-lg px-3 py-2 w-full sm:max-w-md">
                <Search className="w-4 h-4 text-[var(--sb-ink-dim)] shrink-0" />
                <input
                  type="text"
                  placeholder="Ask AI about this workspace..."
                  disabled
                  className="bg-transparent border-none text-xs text-[var(--sb-ink)] focus:outline-none placeholder-[var(--sb-ink-dim)] w-full cursor-not-allowed"
                />
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 animate-pulse shrink-0" />
              </div>

              <div className="text-[11px] text-[var(--sb-ink-dim)] flex gap-4 shrink-0">
                <span>Reading speed: <strong>320 wpm</strong></span>
                <span>Extract accuracy: <strong>99.8%</strong></span>
              </div>
            </div>
          </div>

          {/* Right Sidebar: AI Analysis */}
          <div className="w-full lg:w-72 shrink-0 border-t lg:border-t-0 lg:border-l border-[var(--sb-border)]/40 dark:border-white/5 bg-[color-mix(in_oklab,var(--sb-bg)_30%,transparent)] p-4 overflow-y-auto space-y-6">
            {/* Summary */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--sb-ink)]">
                <Sparkles className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
                <span>AI Core Summary</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeDoc.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs text-[var(--sb-ink-muted)] leading-relaxed bg-[var(--sb-pill)] p-3 rounded-lg border border-[var(--sb-border)]/40"
                >
                  {activeDoc.summary}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Smart Insights */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--sb-ink)]">
                <Brain className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                <span>Extracted Insights</span>
              </div>

              <div className="space-y-2">
                <AnimatePresence mode="wait">
                  {activeDoc.insights.map((insight, idx) => (
                    <motion.div
                      key={`${activeDoc.id}-insight-${idx}`}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2, delay: idx * 0.05 }}
                      className="p-3 bg-[var(--card-bg)]/80 rounded-lg border border-[var(--sb-border)]/60 hover:border-[var(--sb-border)] transition-colors"
                    >
                      <h4 className="text-xs font-bold text-[var(--sb-ink)] flex items-center gap-1.5">
                        <ChevronRight className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                        {insight.title}
                      </h4>
                      <p className="text-[11px] text-[var(--sb-ink-muted)] mt-1 pl-5">
                        {insight.text}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Citations & Related Topics */}
            <div className="space-y-4">
              {/* Related topics */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-[var(--sb-ink-dim)] uppercase tracking-widest block">
                  Related Topics
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <AnimatePresence mode="wait">
                    {activeDoc.relatedTopics.map((topic, index) => (
                      <motion.span
                        key={`${activeDoc.id}-topic-${index}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-[10px] bg-[var(--sb-pill)] border border-[var(--sb-border)]/40 text-[var(--sb-ink-muted)] px-2 py-0.5 rounded"
                      >
                        {topic}
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Citations List */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-[var(--sb-ink-dim)] uppercase tracking-widest block">
                  Citations Used ({activeDoc.citations.length})
                </span>
                <div className="space-y-2">
                  <AnimatePresence mode="wait">
                    {activeDoc.citations.map((cite, index) => (
                      <motion.div
                        key={`${activeDoc.id}-cite-${index}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-start gap-1.5 text-[10px] text-[var(--sb-ink-muted)] bg-[var(--sb-bg)] p-2 rounded border border-[var(--sb-border)]/40"
                      >
                        <Link className="w-3 h-3 text-[var(--sb-ink-dim)] shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{cite}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>

          </div>
        </GlassCard>
      </SpotlightEffect>
    </div>
  );
}
