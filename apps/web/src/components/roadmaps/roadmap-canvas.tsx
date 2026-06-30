import {
  Background,
  Controls,
  type Edge,
  MiniMap,
  type Node,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { useCallback, useEffect, useMemo } from "react";
import "@xyflow/react/dist/style.css";
import * as Icons from "lucide-react";
import type { Roadmap, UserProgress } from "../../types/roadmaps";
import { RoadmapNode } from "./roadmap-node";

interface RoadmapCanvasProps {
  roadmap: Roadmap;
  progress: UserProgress;
  onSelectNode: (nodeId: string) => void;
}

export function RoadmapCanvas({
  roadmap,
  progress,
  onSelectNode,
}: RoadmapCanvasProps) {
  // Define custom node types for React Flow
  const nodeTypes = useMemo(() => ({ roadmapNode: RoadmapNode }), []);

  // Map backend custom nodes to React Flow node structures
  const initialNodes: Node[] = useMemo(() => {
    return roadmap.nodes.map((node) => {
      // Resolve dynamic node progress state from the user's progress arrays
      const isCompleted = progress.completedNodes.includes(node.id);

      // Determine if a node should be locked
      // Lock nodes if they have inbound edges, and none of those source nodes are completed.
      // This is a great staff-engineer validation rule computed client-side for UX!
      let isLocked = false;
      const inboundEdges = roadmap.edges.filter((e) => e.target === node.id);
      if (inboundEdges.length > 0) {
        const anySourceCompleted = inboundEdges.some((e) =>
          progress.completedNodes.includes(e.source),
        );
        if (!anySourceCompleted) {
          isLocked = true;
        }
      }

      const status = isCompleted
        ? "completed"
        : isLocked
          ? "locked"
          : progress.lastVisitedNode === node.id
            ? "in_progress"
            : "not_started";

      return {
        id: node.id,
        type: "roadmapNode",
        position: node.position,
        data: {
          ...node.data,
          status,
        },
      };
    });
  }, [roadmap.nodes, roadmap.edges, progress]);

  // Map backend edges to React Flow edge structures
  const initialEdges: Edge[] = useMemo(() => {
    return roadmap.edges.map((edge) => {
      // Animate edge if source node is completed
      const isSourceCompleted = progress.completedNodes.includes(edge.source);

      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        animated: isSourceCompleted || edge.animated,
        style: {
          stroke: isSourceCompleted ? "var(--sb-accent)" : "var(--card-border)",
          strokeWidth: isSourceCompleted ? 2 : 1.5,
          transition: "stroke 300ms ease, stroke-width 300ms ease",
        },
      };
    });
  }, [roadmap.edges, progress.completedNodes]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync state if roadmap or progress updates
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Node Selection Handler
  const handleNodeClick = useCallback(
    (_e: React.MouseEvent, node: Node) => {
      // Find the custom node model configuration
      const customNode = roadmap.nodes.find((n) => n.id === node.id);
      if (customNode) {
        onSelectNode(node.id);
      }
    },
    [roadmap.nodes, onSelectNode],
  );

  return (
    <div className="relative w-full h-[600px] md:h-[750px] rounded-2xl border border-[var(--card-border)] overflow-hidden bg-[var(--page-bg)] select-none">
      {/* Background Dot Grid */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        nodesDraggable={false}
        nodesConnectable={false}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.5}
        maxZoom={1.5}
        defaultMarkerColor="var(--card-border)"
        proOptions={{ hideAttribution: true }}
      >
        <Background color="var(--card-border)" gap={16} size={1} />

        {/* Floating MiniMap */}
        <MiniMap
          zoomable
          pannable
          className="!bg-[var(--card-bg)] !border !border-[var(--card-border)] !rounded-xl !shadow-lg hidden md:block"
          maskColor="rgba(var(--sb-bg-rgb), 0.5)"
          nodeColor={() => "var(--sb-accent)"}
        />

        {/* Custom Styled Controls */}
        <Controls
          showInteractive={false}
          className="!flex !flex-col !gap-1 !p-1.5 !bg-[var(--card-bg)] !border !border-[var(--card-border)] !rounded-xl !shadow-lg"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
          }}
        />

        {/* Dynamic Canvas Header Overlay */}
        <Panel position="top-left" className="pointer-events-none">
          <div
            className="p-3.5 rounded-xl border border-[var(--card-border)]/50 backdrop-blur-md flex items-center gap-3 shadow-md"
            style={{
              background: "rgba(var(--card-bg-rgb), 0.9)",
              border: "1px solid var(--card-border)",
            }}
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-[var(--sb-accent)]/10 text-[var(--sb-accent)]">
              <Icons.GitFork size={15} />
            </span>
            <div>
              <h3 className="text-xs font-bold text-[var(--sb-ink)]">
                {roadmap.title}
              </h3>
              <p className="text-[10px] text-[var(--sb-ink-dim)] mt-0.5">
                Drag to explore. Click any node to view studying guides.
              </p>
            </div>
          </div>
        </Panel>

        {/* Canvas Guide Legend overlay */}
        <Panel position="bottom-center">
          <div
            className="flex items-center gap-4 px-4 py-2 rounded-full border border-[var(--card-border)]/50 backdrop-blur-md shadow-md text-[10px] font-semibold text-[var(--sb-ink-muted)]"
            style={{
              background: "rgba(var(--card-bg-rgb), 0.9)",
              border: "1px solid var(--card-border)",
            }}
          >
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span>Beginner</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-blue-500" />
              <span>Intermediate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-purple-500" />
              <span>Advanced</span>
            </div>
            <div className="h-3 w-[1px] bg-[var(--card-border)]" />
            <div className="flex items-center gap-1.5">
              <Icons.Check size={11} className="text-emerald-500" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icons.Lock size={10} className="text-[var(--sb-ink-dim)]" />
              <span>Locked</span>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
export default RoadmapCanvas;
