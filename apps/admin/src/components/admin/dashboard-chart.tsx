import { useEffect, useRef, useState } from "react";
import { cn } from "#/lib/utils";

interface ChartDataPoint {
  date?: string;
  label?: string;
  // biome-ignore lint/suspicious/noExplicitAny: generic chart data index signatures
  [key: string]: any;
}

interface DashboardChartProps {
  data: ChartDataPoint[];
  dataKey: string;
  labelKey?: string;
  type?: "line" | "bar";
  color?: string; // Hex, OKLCH, or CSS variable
  height?: number;
  className?: string;
}

export function DashboardChart({
  data = [],
  dataKey,
  labelKey = "date",
  type = "line",
  color = "var(--sb-accent)",
  height = 220,
  className,
}: DashboardChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [containerWidth, setContainerWidth] = useState(500);

  // Keep track of container width for responsive scaling
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    setContainerWidth(containerRef.current.getBoundingClientRect().width);
    return () => observer.disconnect();
  }, []);

  if (!data || data.length === 0) {
    return (
      <div className="flex h-48 w-full items-center justify-center text-xs text-muted-foreground border border-dashed rounded-lg">
        No data available
      </div>
    );
  }

  const values = data.map((d) => Number(d[dataKey] || 0));
  const labels = data.map((d) => String(d[labelKey] || ""));
  const maxValue = Math.max(...values, 10);
  const minValue = 0; // Baseline at 0

  // Layout boundaries inside SVG
  const paddingLeft = 45;
  const paddingRight = 15;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = containerWidth - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Grid ticks
  const yTicksCount = 4;
  const yTicks = Array.from({ length: yTicksCount }).map((_, i) => {
    const val = minValue + ((maxValue - minValue) * i) / (yTicksCount - 1);
    const y = paddingTop + chartHeight - (chartHeight * i) / (yTicksCount - 1);
    return { val, y };
  });

  // Calculate coordinates
  const points = data.map((d, index) => {
    const val = Number(d[dataKey] || 0);
    const x = paddingLeft + (index / (data.length - 1)) * chartWidth;
    const y =
      paddingTop +
      chartHeight -
      ((val - minValue) / (maxValue - minValue)) * chartHeight;
    return { x, y, val, label: labels[index] };
  });

  // Line path description
  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  // Closed path for background gradient fill
  const areaD =
    points.length > 0
      ? `${pathD} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
      : "";

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    // Find closest point by X coordinate
    let closestIndex = 0;
    let minDiff = Infinity;
    points.forEach((p, idx) => {
      const diff = Math.abs(p.x - mouseX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = idx;
      }
    });

    setHoveredIndex(closestIndex);
    setTooltipPos({
      x: points[closestIndex].x,
      y: points[closestIndex].y - 10,
    });
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full overflow-visible select-none", className)}
      style={{ height }}
    >
      <svg
        className="w-full h-full overflow-visible"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        role="img"
        aria-label="Dashboard Chart"
      >
        <title>Dashboard Chart</title>
        <defs>
          <linearGradient
            id={`gradient-${dataKey}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor={color} stopOpacity="0.24" />
            <stop offset="100%" stopColor={color} stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Y Axis Grid Lines & Labels */}
        {yTicks.map((tick) => (
          <g key={`y-tick-${tick.val}-${tick.y}`} className="opacity-60">
            <line
              x1={paddingLeft}
              y1={tick.y}
              x2={containerWidth - paddingRight}
              y2={tick.y}
              stroke="var(--line)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <text
              x={paddingLeft - 8}
              y={tick.y + 4}
              textAnchor="end"
              className="text-[10px] font-medium fill-muted-foreground tabular-nums"
            >
              {Math.round(tick.val).toLocaleString()}
            </text>
          </g>
        ))}

        {/* X Axis Labels */}
        {points.map((p, i) => {
          // Reduce label density for narrow viewports
          const shouldShowLabel =
            data.length <= 7 ||
            i === 0 ||
            i === data.length - 1 ||
            (data.length > 7 && i % Math.ceil(data.length / 5) === 0);

          if (!shouldShowLabel) return null;

          return (
            <text
              key={`x-label-${p.label || p.x}`}
              x={p.x}
              y={height - 10}
              textAnchor="middle"
              className="text-[10px] font-medium fill-muted-foreground opacity-80"
            >
              {p.label}
            </text>
          );
        })}

        {/* Hover Guide Line */}
        {hoveredIndex !== null && (
          <line
            x1={points[hoveredIndex].x}
            y1={paddingTop}
            x2={points[hoveredIndex].x}
            y2={paddingTop + chartHeight}
            stroke={color}
            strokeWidth="1.5"
            strokeDasharray="3 3"
            className="opacity-60"
          />
        )}

        {/* Chart Renderings */}
        {type === "line" && points.length > 0 && (
          <>
            {/* Area Fill */}
            <path
              d={areaD}
              fill={`url(#gradient-${dataKey})`}
              className="transition-all duration-300 ease-out"
            />

            {/* Line Path */}
            <path
              d={pathD}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300 ease-out"
            />

            {/* Individual Data Points */}
            {points.map((p) => (
              <circle
                key={`point-${p.label || p.x}`}
                cx={p.x}
                cy={p.y}
                r={
                  hoveredIndex !== null && points[hoveredIndex].x === p.x
                    ? 5
                    : 3.5
                }
                fill={
                  hoveredIndex !== null && points[hoveredIndex].x === p.x
                    ? color
                    : "var(--card-bg)"
                }
                stroke={color}
                strokeWidth="1.5"
                className="transition-all duration-150 cursor-pointer"
              />
            ))}
          </>
        )}

        {type === "bar" &&
          points.map((p) => {
            const barWidth = Math.max(
              4,
              Math.min(32, (chartWidth / data.length) * 0.6),
            );
            const barX = p.x - barWidth / 2;
            const barY = p.y;
            const barHeight = Math.max(2, paddingTop + chartHeight - p.y);

            return (
              <g key={`bar-${p.label || p.x}`}>
                <rect
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  fill={color}
                  rx="3"
                  className={cn(
                    "transition-all duration-200 cursor-pointer",
                    hoveredIndex !== null && points[hoveredIndex].x === p.x
                      ? "opacity-100"
                      : "opacity-75",
                  )}
                />
              </g>
            );
          })}
      </svg>

      {/* HTML Tooltip Overlay */}
      {hoveredIndex !== null && (
        <div
          className="absolute z-10 pointer-events-none rounded-lg border border-[var(--sb-border)] px-2.5 py-1.5 text-xs shadow-md transition-all duration-75 ease-out animate-in fade-in zoom-in-95"
          style={{
            background: "var(--card-bg)",
            borderColor: "var(--card-border)",
            color: "var(--sb-ink)",
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="font-semibold text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
            {points[hoveredIndex].label}
          </div>
          <div className="font-bold flex items-center gap-1.5 text-xs tabular-nums">
            <span
              className="inline-block size-2 rounded-full"
              style={{ backgroundColor: color }}
            />
            {points[hoveredIndex].val.toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}
