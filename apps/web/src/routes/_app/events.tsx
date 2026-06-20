import { createFileRoute } from "@tanstack/react-router";
import { Calendar } from "lucide-react";
import { useUpcomingEvents } from "#/hooks/use-dashboard";

export const Route = createFileRoute("/_app/events")({ component: EventsPage });

function EventsPage() {
  const { data: events } = useUpcomingEvents();
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: "var(--sb-ink)", fontFamily: "'Fraunces', Georgia, serif" }}>Events</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--sb-ink-muted)" }}>Webinars, workshops, and hackathons to level up.</p>
      </div>
      <div className="flex flex-col gap-3">
        {events?.map((event) => (
          <div key={event.id} className="stagger-item flex items-center gap-4 rounded-xl px-4 py-3.5" style={{ background: "oklch(1 0 0 / 0.04)", border: "1px solid oklch(1 0 0 / 0.08)" }}>
            <Calendar size={16} style={{ color: "var(--sb-accent)" }} />
            <div>
              <p className="font-semibold" style={{ color: "var(--sb-ink)" }}>{event.title}</p>
              <p className="text-xs capitalize" style={{ color: "var(--sb-ink-muted)" }}>{event.type} · {event.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
