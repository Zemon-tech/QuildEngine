import { AnimatePresence, motion } from "framer-motion";
import { BrainCircuit, Info, Network, Sparkles } from "lucide-react";
import { useState } from "react";
import { GlassCard, SpotlightEffect } from "./spotlight";

interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  size: number;
  color: string;
  category: string;
  insight: string;
  details: string;
}

interface GraphLink {
  source: string;
  target: string;
}

export function KnowledgeGraph() {
  const nodes: GraphNode[] = [
    {
      id: "self_attention",
      label: "Self-Attention",
      x: 400,
      y: 225,
      size: 28,
      color: "#818cf8", // indigo
      category: "Core Engine",
      insight:
        "Computes representation by comparing each word to all other words.",
      details:
        "Self-attention is the key driver of the Transformer model. It enables sequence elements to interact dynamically, assigning weight scores to relevant positions across arbitrary context distances.",
    },
    {
      id: "multi_head",
      label: "Multi-Head Attention",
      x: 270,
      y: 130,
      size: 20,
      color: "#22d3ee", // cyan
      category: "Feature Subspaces",
      insight:
        "Allows the model to attend to multiple representation structures.",
      details:
        "Splits Queries, Keys, and Values into multiple projections, performing attention computations in parallel to capture distinct relationships like grammar, semantics, and syntactic structure.",
    },
    {
      id: "qkv_matrices",
      label: "QKV Projections",
      x: 400,
      y: 80,
      size: 16,
      color: "#a855f7", // purple
      category: "Mathematical Foundations",
      insight:
        "Query, Key, and Value matrices mapping inputs to dynamic attention spaces.",
      details:
        "Linear projections of input embeddings. Dot product of Queries and Keys outputs similarity scores, weighting Value matrices to synthesize the final output context.",
    },
    {
      id: "ffn",
      label: "Feed-Forward Net",
      x: 530,
      y: 130,
      size: 18,
      color: "#ec4899", // pink
      category: "Core Engine",
      insight:
        "Applies two linear transformations with a ReLU/GELU activation in between.",
      details:
        "Processed independently for each token position. Crucial for mapping attention outputs into deeper non-linear classification dimensions.",
    },
    {
      id: "pos_encoding",
      label: "Positional Encoding",
      x: 230,
      y: 280,
      size: 18,
      color: "#10b981", // green
      category: "Input Pipeline",
      insight: "Injects sequence order coordinates directly into word vectors.",
      details:
        "Since Transformers discard recurrence, positional vectors are added to input embeddings using sine/cosine functions to preserve relative word distance sequences.",
    },
    {
      id: "layer_norm",
      label: "Layer Normalization",
      x: 570,
      y: 280,
      size: 16,
      color: "#f59e0b", // yellow
      category: "Optimization",
      insight:
        "Stabilizes training by normalizing embedding columns across layers.",
      details:
        "Normalization applied before feed-forward blocks, smoothing loss gradients and enabling deeper model stack sizes without gradient explosion.",
    },
    {
      id: "masked_attn",
      label: "Masked Attention",
      x: 400,
      y: 370,
      size: 18,
      color: "#f43f5e", // red
      category: "Decoder Stack",
      insight: "Prevents positions from attending to subsequent future words.",
      details:
        "Used in autoregressive decoders. Replaces downstream weight maps with negative infinity, forcing the model to generate text token-by-token predicting only future targets.",
    },
    {
      id: "encoder_stack",
      label: "Encoder Stack",
      x: 160,
      y: 200,
      size: 22,
      color: "#0ea5e9", // sky
      category: "Structural Blocks",
      insight:
        "Processes source sequences into abstract key-value attention pairs.",
      details:
        "Contains layers of self-attention followed by feed-forward blocks. Resolves incoming text sequences into semantic summaries.",
    },
    {
      id: "decoder_stack",
      label: "Decoder Stack",
      x: 640,
      y: 200,
      size: 22,
      color: "#fb7185", // rose
      category: "Structural Blocks",
      insight: "Synthesizes final target outputs using cross-attention feeds.",
      details:
        "Combines masked self-attention over target history with multi-head cross-attention over encoder output keys/values to perform text generation.",
    },
  ];

  const links: GraphLink[] = [
    { source: "self_attention", target: "multi_head" },
    { source: "self_attention", target: "qkv_matrices" },
    { source: "self_attention", target: "ffn" },
    { source: "self_attention", target: "pos_encoding" },
    { source: "self_attention", target: "layer_norm" },
    { source: "self_attention", target: "masked_attn" },
    { source: "multi_head", target: "qkv_matrices" },
    { source: "ffn", target: "layer_norm" },
    { source: "encoder_stack", target: "pos_encoding" },
    { source: "encoder_stack", target: "multi_head" },
    { source: "decoder_stack", target: "masked_attn" },
    { source: "decoder_stack", target: "layer_norm" },
    { source: "decoder_stack", target: "self_attention" },
  ];

  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] =
    useState<string>("self_attention");

  const activeNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];
  const hoveredNode = nodes.find((n) => n.id === hoveredNodeId);

  // Check if a link should be highlighted
  const isLinkHighlighted = (link: GraphLink) => {
    if (!hoveredNodeId) return false;
    return link.source === hoveredNodeId || link.target === hoveredNodeId;
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto px-6 py-12 md:py-16">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--sb-ink)] tracking-tight mb-4 flex items-center justify-center gap-2 display-title">
          <Network className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />
          Interactive Knowledge Graph
        </h2>
        <p className="text-[var(--sb-ink-muted)] text-sm md:text-base">
          Hover over nodes to trace connections and see AI insights. Click to
          explore deeper details of each concept.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* SVG Concept Map Canvas */}
        <div className="lg:col-span-2 relative bg-[color-mix(in_oklab,var(--card-bg)_65%,transparent)] rounded-xl border border-[var(--sb-border)]/60 dark:border-white/[0.08] p-4 overflow-hidden h-[480px]">
          {/* Subtle Grid Pattern inside canvas */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.04),transparent)] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.08),transparent)]" />

          <svg
            className="w-full h-full"
            viewBox="0 0 800 450"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Draw connection lines */}
            {links.map((link, idx) => {
              const sourceNode = nodes.find((n) => n.id === link.source);
              const targetNode = nodes.find((n) => n.id === link.target);
              if (!sourceNode || !targetNode) return null;

              const isHighlighted = isLinkHighlighted(link);

              return (
                <line
                  key={idx}
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={isHighlighted ? "#a855f7" : "var(--sb-border)"}
                  strokeOpacity={isHighlighted ? 0.9 : 0.15}
                  strokeWidth={isHighlighted ? 2.5 : 1}
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Draw nodes */}
            {nodes.map((node) => {
              const isHovered = hoveredNodeId === node.id;
              const isSelected = selectedNodeId === node.id;

              return (
                <g
                  key={node.id}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  onClick={() => setSelectedNodeId(node.id)}
                >
                  {/* Outer Pulsing Aura */}
                  {(isHovered || isSelected) && (
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r={node.size + 10}
                      fill="none"
                      stroke={node.color}
                      strokeWidth="1.5"
                      initial={{ scale: 0.8, opacity: 0.8 }}
                      animate={{ scale: 1.2, opacity: 0 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.8,
                        ease: "easeOut",
                      }}
                    />
                  )}

                  {/* Core Node Circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.size}
                    fill={node.color}
                    fillOpacity={isSelected ? 0.35 : 0.18}
                    stroke={node.color}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    className="transition-all duration-200"
                  />

                  {/* Tiny Node Center Dot */}
                  <circle cx={node.x} cy={node.y} r={4} fill={node.color} />

                  {/* Label */}
                  <text
                    x={node.x}
                    y={node.y + node.size + 16}
                    fill={
                      isHovered || isSelected
                        ? "var(--sb-ink)"
                        : "var(--sb-ink-muted)"
                    }
                    textAnchor="middle"
                    className="text-[10px] font-semibold tracking-wide font-sans select-none pointer-events-none transition-colors"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Quick Floating Tooltip for Hover */}
          <AnimatePresence>
            {hoveredNode && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute pointer-events-none p-3 bg-[var(--card-bg)] border border-[var(--sb-border)] rounded-lg shadow-xl max-w-xs"
                style={{
                  left:
                    hoveredNode.x > 500
                      ? hoveredNode.x - 220
                      : hoveredNode.x + 30,
                  top: hoveredNode.y - 40,
                }}
              >
                <div className="flex items-center gap-1.5 text-[10px] text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3 h-3" />
                  <span>AI Insight ({hoveredNode.category})</span>
                </div>
                <p className="text-[11px] text-[var(--sb-ink-muted)] leading-snug">
                  {hoveredNode.insight}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Selected Node Details Dashboard */}
        <div className="h-full">
          <SpotlightEffect glowColor="rgba(168,85,247,0.12)" glowSize={350}>
            <GlassCard className="p-6 h-[480px] flex flex-col justify-between border-[var(--sb-border)]/60 dark:border-white/[0.08]">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[var(--sb-border)]/40 dark:border-white/5 pb-4">
                  <div className="flex items-center gap-2.5">
                    <BrainCircuit className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                    <div>
                      <h3 className="text-sm font-bold text-[var(--sb-ink)]">
                        AI Node Analyst
                      </h3>
                      <p className="text-[10px] text-[var(--sb-ink-dim)] font-mono">
                        Synchronized with paper contexts
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-[var(--sb-pill)] border border-[var(--sb-border)]/40 text-[var(--sb-ink-muted)] px-2 py-0.5 rounded font-medium">
                    {activeNode.category}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] text-[var(--sb-ink-dim)] font-mono uppercase tracking-wider block">
                      Concept Title
                    </span>
                    <h4
                      className="text-lg font-bold mt-1"
                      style={{ color: activeNode.color }}
                    >
                      {activeNode.label}
                    </h4>
                  </div>

                  <div>
                    <span className="text-[10px] text-[var(--sb-ink-dim)] font-mono uppercase tracking-wider block mb-1.5">
                      Synthesized Insight
                    </span>
                    <p className="text-xs text-[var(--sb-ink-muted)] leading-relaxed bg-[var(--sb-pill)] border border-[var(--sb-border)]/40 p-3 rounded-lg">
                      {activeNode.insight}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] text-[var(--sb-ink-dim)] font-mono uppercase tracking-wider block mb-1">
                      Technical Details
                    </span>
                    <p className="text-xs text-[var(--sb-ink-muted)] leading-relaxed">
                      {activeNode.details}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="border-t border-[var(--sb-border)]/40 dark:border-white/5 pt-4 flex gap-3">
                <button className="flex-1 py-2 bg-[var(--card-bg)] border border-[var(--sb-border)] text-[var(--sb-ink-muted)] hover:text-[var(--sb-ink)] rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors">
                  <Info className="w-3.5 h-3.5" />
                  View References
                </button>
              </div>
            </GlassCard>
          </SpotlightEffect>
        </div>
      </div>
    </section>
  );
}
