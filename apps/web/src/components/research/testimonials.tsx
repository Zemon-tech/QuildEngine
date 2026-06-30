import { Quote, Sparkles } from "lucide-react";
import { GlassCard, SpotlightEffect } from "./spotlight";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  institution: string;
  glow: string;
}

export function TestimonialCard() {
  const testimonials: Testimonial[] = [
    {
      quote:
        "The knowledge graph mapping drastically accelerated my literature review process. The connections and correlation discoveries it flagged across 140 papers led to our team's main thesis validation.",
      name: "Dr. Sarah Jenkins",
      role: "PhD Candidate",
      institution: "Stanford University",
      glow: "rgba(99, 102, 241, 0.1)",
    },
    {
      quote:
        "Structuring complex biochemical data and papers is finally seamless. AlphaFold coordinates compile accurately, and the citations matching tool is incredibly precise. Worth every penny.",
      name: "Prof. David Miller",
      role: "Senior AI Researcher",
      institution: "MIT CSAIL",
      glow: "rgba(6, 182, 212, 0.1)",
    },
    {
      quote:
        "Collaborating with our global engineering nodes in real-time while the AI structures notes, links definitions, and lists contradictions has slashed compile and report times by 60%.",
      name: "Dr. Lisa Wong",
      role: "Principal Scientist",
      institution: "DeepMind Labs",
      glow: "rgba(168, 85, 247, 0.1)",
    },
  ];

  return (
    <section className="relative w-full max-w-7xl mx-auto px-6 py-12 md:py-16">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--sb-ink)] tracking-tight mb-4 flex items-center justify-center gap-2 display-title">
          <Sparkles className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />
          Endorsed by Leading Minds
        </h2>
        <p className="text-[var(--sb-ink-muted)] text-sm md:text-base">
          Powering breakthroughs in academic institutions, commercial labs, and
          engineering collectives globally.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {testimonials.map((test, idx) => (
          <SpotlightEffect key={idx} glowColor={test.glow} glowSize={300}>
            <GlassCard className="p-6 md:p-8 h-[260px] flex flex-col justify-between border-[var(--sb-border)]/40 dark:border-white/[0.06] hover:border-[var(--sb-border)]/80 dark:hover:border-white/[0.12] transition-colors relative group">
              {/* Quote icon */}
              <div className="absolute top-6 right-6 opacity-[0.02] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
                <Quote className="w-20 h-20 text-[var(--sb-ink)]" />
              </div>

              <p className="text-xs sm:text-sm text-[var(--sb-ink-muted)] leading-relaxed italic relative z-10">
                "{test.quote}"
              </p>

              <div className="border-t border-[var(--sb-border)]/40 dark:border-white/5 pt-4 mt-6 flex items-center gap-3 relative z-10">
                {/* Visual Avatar */}
                <div className="w-10 h-10 rounded-full bg-[var(--sb-pill)] border border-[var(--sb-border)]/60 flex items-center justify-center font-bold text-[var(--sb-ink-muted)] font-mono text-xs select-none">
                  {test.name
                    .split(" ")
                    .map(
                      (n) =>
                        n.replace("Dr.", "").replace("Prof.", "").trim()[0],
                    )
                    .join("")}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[var(--sb-ink)]">
                    {test.name}
                  </h4>
                  <p className="text-[10px] text-[var(--sb-ink-dim)] font-mono">
                    {test.role} •{" "}
                    <span className="text-[var(--sb-ink-muted)] font-medium">
                      {test.institution}
                    </span>
                  </p>
                </div>
              </div>
            </GlassCard>
          </SpotlightEffect>
        ))}
      </div>
    </section>
  );
}
