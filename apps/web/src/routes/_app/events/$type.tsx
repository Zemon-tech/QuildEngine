import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  Clock,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#/components/ui/dialog";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/_app/events/$type")({
  component: EventCategoryPage,
});

interface EventItem {
  id: string;
  name: string;
  category: string;
  date: string;
  time: string;
  organizer: string;
  status: "Registered" | "Open" | "Closed";
  description: string;
  agenda: string[];
  speakers: string[];
}

const initialEvents: EventItem[] = [
  {
    id: "ai-hackathon",
    name: "AI Innovation Hackathon 2026",
    category: "hackathons",
    date: "July 12-14, 2026",
    time: "09:00 AM EST",
    organizer: "Quild AI Tech Group",
    status: "Open",
    description:
      "Collaborate with developers, designers, and AI engineers to build the next generation of intelligent tools using large language models.",
    agenda: [
      "Day 1: Kickoff & Team Formation",
      "Day 2: Hacking & Mentorship Sessions",
      "Day 3: Project Submission & Pitch Presentations",
    ],
    speakers: [
      "Dr. Sarah Chen (AI Researcher)",
      "David Miller (Principal Architect)",
    ],
  },
  {
    id: "algo-contest",
    name: "Global Algorithmic Duel",
    category: "coding-contests",
    date: "July 20, 2026",
    time: "02:00 PM UTC",
    organizer: "Competitive Programming Club",
    status: "Registered",
    description:
      "Showcase your problem-solving speed and algorithmic precision in this high-intensity 3-hour competitive coding duel.",
    agenda: [
      "14:00 - Contest Starts & Problem Set Released",
      "17:00 - Contest Ends & Leaderboard Locked",
      "17:15 - Live Editorial and Solution Explanations",
    ],
    speakers: ["Alexey Volkov (Competitive Programming Grandmaster)"],
  },
  {
    id: "react-workshop",
    name: "Advanced React & Design Patterns",
    category: "workshops",
    date: "August 02, 2026",
    time: "10:00 AM PST",
    organizer: "Frontend Masters League",
    status: "Open",
    description:
      "A hands-on workshop focused on custom hook optimization, state management architectures, and implementing micro-animations.",
    agenda: [
      "Session 1: Custom Hook Optimization & Render Control",
      "Session 2: Framer Motion and Spring Physics in React UI",
      "Session 3: Building Resilient SSR Applications",
    ],
    speakers: ["Emil Kowalski (Design Engineer)", "Sophie Dubois (Lead Dev)"],
  },
  {
    id: "webinar-typescript",
    name: "TypeScript v6.0 Deep Dive",
    category: "webinars",
    date: "June 28, 2026",
    time: "04:00 PM EST",
    organizer: "TypeScript Core Team Fan Club",
    status: "Registered",
    description:
      "An online seminar walking through the newest features in TypeScript, compiler optimizations, and advanced type gymnastics.",
    agenda: [
      "16:00 - Introduction & Keynote",
      "16:15 - New Features & Syntax Updates",
      "16:45 - Live Q&A Panel with Contributors",
    ],
    speakers: [
      "Anders Hejlsberg (Distinguished Engineer)",
      "Ryan Cavanaugh (Dev Manager)",
    ],
  },
  {
    id: "talk-rust",
    name: "Why We Rewrote Our Core Engine in Rust",
    category: "tech-talks",
    date: "July 08, 2026",
    time: "06:30 PM EST",
    organizer: "Systems Engineering Meetup",
    status: "Open",
    description:
      "A comprehensive look at the memory safety, concurrency models, and performance improvements achieved during rewrite.",
    agenda: [
      "18:30 - Opening remarks",
      "18:40 - Main Presentation & Performance Graphs",
      "19:20 - Audience Q&A & Virtual Mixer",
    ],
    speakers: ["Marcus Vance (VP of Systems Engineering)"],
  },
  {
    id: "conf-nextgen",
    name: "NextGen Web Conference 2026",
    category: "conferences",
    date: "Sept 15, 2026",
    time: "08:00 AM EST",
    organizer: "Web Platform Alliance",
    status: "Open",
    description:
      "The premier global conference for developers exploring the future of frontend, edge architectures, and compiler-driven UI frameworks.",
    agenda: [
      "Day 1: Keynotes, Framework Trends & Networking",
      "Day 2: Technical Tracks, Panels & Community Meetups",
    ],
    speakers: ["Guillermo Rauch (CEO Vercel)", "Dan Abramov (React Core Team)"],
  },
  {
    id: "college-hack",
    name: "Inter-Collegiate HackFest 2026",
    category: "college-events",
    date: "July 25-26, 2026",
    time: "09:00 AM IST",
    organizer: "National Institute of Tech",
    status: "Open",
    description:
      "The largest national inter-collegiate hackathon bringing together students to pitch creative engineering ideas.",
    agenda: [
      "Day 1: Pitch Deck Workshop & Prototype Design",
      "Day 2: Final Demos & Awards Ceremony",
    ],
    speakers: ["Prof. Alan Turing Jr. (Dean of Computer Science)"],
  },
  {
    id: "meetup-design",
    name: "Design Engineers Virtual Meetup",
    category: "meetups",
    date: "July 18, 2026",
    time: "07:00 PM CET",
    organizer: "Design Eng Quild",
    status: "Open",
    description:
      "Connect with design engineers around the globe to discuss UI craft, animation curves, and interactive prototyping tools.",
    agenda: [
      "19:00 - Introduction & Virtual Meet-and-Greet",
      "19:20 - Lightning Talks on Micro-interactions",
      "20:00 - Open Discussion & Show-and-Tell",
    ],
    speakers: ["Emil Kowalski (Design Engineer)"],
  },
];

const categoryNames: Record<string, string> = {
  hackathons: "Hackathons",
  "coding-contests": "Coding Contests",
  workshops: "Workshops",
  webinars: "Webinars",
  "tech-talks": "Tech Talks",
  conferences: "Conferences",
  "college-events": "College Events",
  meetups: "Community Meetups",
};

function EventCategoryPage() {
  const { type } = Route.useParams();
  const [events, setEvents] = useState<EventItem[]>(initialEvents);

  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    socialUrl: "",
    experience: "Intermediate",
    motivation: "",
  });

  const handleOpenRegisterModal = () => {
    setFormData({
      fullName: "",
      email: "",
      socialUrl: "",
      experience: "Intermediate",
      motivation: "",
    });
    setIsRegisterDialogOpen(true);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEvent) return;
    toggleRegistration(activeEvent.id);
    setIsRegisterDialogOpen(false);
  };

  const categoryEvents = useMemo(() => {
    return events.filter((evt) => evt.category === type);
  }, [events, type]);

  const [selectedEventId, setSelectedEventId] = useState<string | null>(
    categoryEvents[0]?.id || null,
  );

  const activeEvent = useMemo(() => {
    return (
      categoryEvents.find((e) => e.id === selectedEventId) ||
      categoryEvents[0] ||
      null
    );
  }, [categoryEvents, selectedEventId]);

  const toggleRegistration = (id: string) => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id === id) {
          return {
            ...evt,
            status: evt.status === "Registered" ? "Open" : "Registered",
          };
        }
        return evt;
      }),
    );
  };

  const formattedCategory = categoryNames[type] || type.replace("-", " ");

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Back button and Category Header */}
      <div className="space-y-4">
        <Link
          to="/events"
          className="inline-flex items-center gap-1 text-xs font-semibold hover:opacity-75 transition-all text-[var(--sb-ink-muted)]"
        >
          <ChevronLeft size={14} />
          Back to Events Hub
        </Link>

        <h1
          className="text-2xl font-bold tracking-tight capitalize"
          style={{
            color: "var(--sb-ink)",
            fontFamily: "'Fraunces', Georgia, serif",
          }}
        >
          {formattedCategory}
        </h1>
      </div>

      {categoryEvents.length === 0 ? (
        <div
          className="rounded-2xl border p-12 text-center"
          style={{ borderColor: "var(--sb-border)" }}
        >
          <p
            className="text-sm font-medium"
            style={{ color: "var(--sb-ink-muted)" }}
          >
            No upcoming events found under this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left: Events List */}
          <div className="space-y-3">
            <h2
              className="text-xs uppercase font-bold tracking-wider"
              style={{ color: "var(--sb-ink-dim)" }}
            >
              Select Event
            </h2>
            <div className="space-y-2.5">
              {categoryEvents.map((evt) => {
                const isSelected = activeEvent?.id === evt.id;
                return (
                  <button
                    key={evt.id}
                    type="button"
                    onClick={() => setSelectedEventId(evt.id)}
                    className={`w-full text-left p-4 rounded-xl border cursor-pointer transition-all duration-150 active:scale-[0.98] ${
                      isSelected
                        ? "bg-[color-mix(in oklab,var(--sb-ink)_4%,transparent)] border-[var(--sb-accent)] shadow-xs"
                        : "bg-transparent border-[var(--card-border)] hover:bg-[var(--sb-bg-hover)]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h3
                        className={`text-sm font-bold line-clamp-1 ${
                          isSelected
                            ? "text-[var(--sb-accent)]"
                            : "text-[var(--sb-ink)]"
                        }`}
                      >
                        {evt.name}
                      </h3>
                      {evt.status === "Registered" && (
                        <span
                          className="size-2 rounded-full bg-emerald-500 shrink-0"
                          title="Registered"
                        />
                      )}
                    </div>
                    <div
                      className="flex items-center gap-3 text-xs"
                      style={{ color: "var(--sb-ink-dim)" }}
                    >
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {evt.date.split(",")[0]}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={11} />
                        {evt.organizer.split(" ")[0]}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Active Event Details Panel */}
          {activeEvent && (
            <div
              className="lg:col-span-2 rounded-2xl border p-6 space-y-6"
              style={{
                background: "var(--card-bg)",
                borderColor: "var(--card-border)",
              }}
            >
              {/* Heading Section */}
              <div
                className="border-b pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                style={{ borderColor: "var(--sb-border)" }}
              >
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-[var(--sb-pill)] text-[var(--sb-ink-dim)] border-[var(--sb-border)]">
                    {activeEvent.category.replace("-", " ")}
                  </span>
                  <h2
                    className="text-xl font-bold"
                    style={{ color: "var(--sb-ink)" }}
                  >
                    {activeEvent.name}
                  </h2>
                  <p className="text-xs" style={{ color: "var(--sb-ink-dim)" }}>
                    Hosted by{" "}
                    <span className="font-semibold">
                      {activeEvent.organizer}
                    </span>
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {activeEvent.status === "Registered" ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      <CheckCircle2 size={12} />
                      Registered
                    </span>
                  ) : activeEvent.status === "Open" ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                      <AlertCircle size={12} />
                      Registration Open
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-500/10 text-zinc-500 border border-zinc-500/20">
                      Closed
                    </span>
                  )}
                </div>
              </div>

              {/* Event Metadata (Schedule, Map) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  className="flex gap-3 items-center p-3 rounded-xl border"
                  style={{
                    borderColor: "var(--sb-border)",
                    background: "var(--sb-bg-hover)",
                  }}
                >
                  <CalendarIcon
                    className="text-[var(--sb-accent)] shrink-0"
                    size={18}
                  />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[var(--sb-ink-dim)]">
                      Date & Time
                    </p>
                    <p
                      className="text-xs font-bold"
                      style={{ color: "var(--sb-ink)" }}
                    >
                      {activeEvent.date}
                    </p>
                    <p
                      className="text-[10px]"
                      style={{ color: "var(--sb-ink-muted)" }}
                    >
                      {activeEvent.time}
                    </p>
                  </div>
                </div>

                <div
                  className="flex gap-3 items-center p-3 rounded-xl border"
                  style={{
                    borderColor: "var(--sb-border)",
                    background: "var(--sb-bg-hover)",
                  }}
                >
                  <MapPin
                    className="text-[var(--sb-accent)] shrink-0"
                    size={18}
                  />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[var(--sb-ink-dim)]">
                      Location
                    </p>
                    <p
                      className="text-xs font-bold"
                      style={{ color: "var(--sb-ink)" }}
                    >
                      Virtual / Online
                    </p>
                    <p
                      className="text-[10px]"
                      style={{ color: "var(--sb-ink-muted)" }}
                    >
                      RSVP to access links
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3
                  className="text-xs uppercase font-bold tracking-wider"
                  style={{ color: "var(--sb-ink-dim)" }}
                >
                  About the Event
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--sb-ink-muted)" }}
                >
                  {activeEvent.description}
                </p>
              </div>

              {/* Agenda (Timeline) */}
              <div className="space-y-4">
                <h3
                  className="text-xs uppercase font-bold tracking-wider"
                  style={{ color: "var(--sb-ink-dim)" }}
                >
                  Agenda
                </h3>
                <div
                  className="space-y-3.5 pl-2 relative border-l"
                  style={{ borderColor: "var(--sb-border)" }}
                >
                  {activeEvent.agenda.map((item) => (
                    <div key={item} className="relative pl-4">
                      {/* Timeline dot */}
                      <span
                        className="absolute size-2 rounded-full -left-[18px] top-1.5 border"
                        style={{
                          background: "var(--card-bg)",
                          borderColor: "var(--sb-accent)",
                        }}
                      />
                      <p
                        className="text-xs font-bold"
                        style={{ color: "var(--sb-ink)" }}
                      >
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Speakers */}
              {activeEvent.speakers && activeEvent.speakers.length > 0 && (
                <div className="space-y-3">
                  <h3
                    className="text-xs uppercase font-bold tracking-wider"
                    style={{ color: "var(--sb-ink-dim)" }}
                  >
                    Speakers & Hosts
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {activeEvent.speakers.map((speaker) => (
                      <div
                        key={speaker}
                        className="flex items-center gap-3 p-3 rounded-xl border"
                        style={{ borderColor: "var(--sb-border)" }}
                      >
                        <div className="flex size-9 items-center justify-center rounded-full bg-[var(--sb-pill)] text-[var(--sb-accent)] shrink-0 font-bold text-sm">
                          {speaker.charAt(0)}
                        </div>
                        <div>
                          <p
                            className="text-xs font-bold"
                            style={{ color: "var(--sb-ink)" }}
                          >
                            {speaker}
                          </p>
                          <p
                            className="text-[10px]"
                            style={{ color: "var(--sb-ink-dim)" }}
                          >
                            Featured Guest
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Registration Button */}
              <div
                className="border-t pt-5 flex items-center justify-end gap-3"
                style={{ borderColor: "var(--sb-border)" }}
              >
                <button
                  type="button"
                  onClick={() => {
                    if (activeEvent.status === "Registered") {
                      toggleRegistration(activeEvent.id);
                    } else {
                      handleOpenRegisterModal();
                    }
                  }}
                  className={`px-5 py-2.5 text-xs font-semibold rounded-xl cursor-pointer active:scale-95 transition-all shadow-xs ${
                    activeEvent.status === "Registered"
                      ? "bg-rose-500/10 text-rose-600 border border-rose-500/20 hover:bg-rose-500/20"
                      : "bg-[var(--sb-accent)] text-white hover:opacity-90"
                  }`}
                >
                  {activeEvent.status === "Registered"
                    ? "Cancel RSVP"
                    : "Register For Event"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Event Registration Dialog */}
      <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="text-[var(--sb-accent)]" size={18} />
              Register for Event
            </DialogTitle>
            <DialogDescription className="text-xs">
              Confirm your registration for <span className="font-semibold text-[var(--sb-ink)]">{activeEvent?.name}</span>. Please provide your details below.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRegisterSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--sb-ink)]">
                Full Name
              </label>
              <Input
                type="text"
                required
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                className="h-9 focus-visible:ring-[var(--sb-accent)]/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--sb-ink)]">
                Email Address
              </label>
              <Input
                type="email"
                required
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="h-9 focus-visible:ring-[var(--sb-accent)]/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--sb-ink)]">
                GitHub / LinkedIn URL (Optional)
              </label>
              <Input
                type="url"
                placeholder="https://github.com/username"
                value={formData.socialUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, socialUrl: e.target.value }))}
                className="h-9 focus-visible:ring-[var(--sb-accent)]/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--sb-ink)] block mb-1">
                Experience Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["Beginner", "Intermediate", "Advanced"].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, experience: level }))}
                    className={`px-3 py-2 text-xs font-medium rounded-lg border text-center transition-all cursor-pointer ${
                      formData.experience === level
                        ? "border-[var(--sb-accent)] bg-[var(--sb-accent)]/5 text-[var(--sb-accent)] font-semibold"
                        : "border-[var(--sb-border)] text-[var(--sb-ink-muted)] hover:bg-[var(--sb-bg-hover)]"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--sb-ink)]">
                Why do you want to attend?
              </label>
              <Textarea
                placeholder="Tell us about your interests and what you hope to learn..."
                value={formData.motivation}
                onChange={(e) => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
                className="focus-visible:ring-[var(--sb-accent)]/20"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRegisterDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[var(--sb-accent)] text-white hover:opacity-90 border-0"
              >
                Complete RSVP
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
