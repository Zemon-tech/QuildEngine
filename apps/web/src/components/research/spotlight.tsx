import type React from "react";
import { useRef, useState } from "react";
import { cn } from "#/lib/utils";

interface SpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glowColor?: string;
  glowSize?: number;
}

export function SpotlightEffect({
  children,
  className,
  glowColor = "rgba(139, 92, 246, 0.15)",
  glowSize = 350,
  ...props
}: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={cn("relative overflow-hidden group", className)}
      {...props}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(${glowSize}px circle at ${position.x}px ${position.y}px, ${glowColor}, transparent 80%)`,
        }}
      />
      {children}
    </div>
  );
}

export function GlassCard({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--sb-border)]/40 dark:border-white/[0.08] bg-[color-mix(in_oklab,var(--card-bg)_40%,transparent)] backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-[var(--sb-border)]/80 dark:hover:border-white/[0.15]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
