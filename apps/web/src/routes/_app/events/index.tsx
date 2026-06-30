import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Code2,
  GraduationCap,
  Heart,
  MapPin,
  Mic,
  School,
  Search,
  Sparkles,
  Trophy,
  Users,
  Video,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "#/components/ui/button";
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

export const Route = createFileRoute("/_app/events/")({
  component: EventsHubPage,
});

interface EventCategory {
  id: string;
  name: string;
  description: string;
  count: number;
  upcoming: boolean;
  icon: any;
  gradient: string;
}

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

const categories: EventCategory[] = [
  {
    id: "hackathons",
    name: "Hackathons",
    description:
      "Collaborative event for developers to build innovative solutions",
    count: 3,
    upcoming: true,
    icon: Trophy,
    gradient:
      "from-blue-500/10 to-cyan-500/10 border-blue-500/20 text-blue-500",
  },
  {
    id: "coding-contests",
    name: "Coding Contests",
    description:
      "Competitive programming challenges to test algorithmic skills",
    count: 5,
    upcoming: true,
    icon: Code2,
    gradient: "from-red-500/10 to-orange-500/10 border-red-500/20 text-red-500",
  },
  {
    id: "workshops",
    name: "Workshops",
    description: "Interactive hands-on learning sessions led by tech experts",
    count: 8,
    upcoming: true,
    icon: GraduationCap,
    gradient:
      "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-500",
  },
  {
    id: "webinars",
    name: "Webinars",
    description:
      "Live virtual presentations and seminars on latest tech trends",
    count: 12,
    upcoming: false,
    icon: Video,
    gradient:
      "from-violet-500/10 to-purple-500/10 border-violet-500/20 text-violet-500",
  },
  {
    id: "tech-talks",
    name: "Tech Talks",
    description:
      "Insightful talks on engineering practices, architectures, and tools",
    count: 6,
    upcoming: true,
    icon: Mic,
    gradient:
      "from-amber-500/10 to-yellow-500/10 border-amber-500/20 text-amber-500",
  },
  {
    id: "conferences",
    name: "Conferences",
    description: "Large scale tech conferences, keynotes, and industry panels",
    count: 2,
    upcoming: false,
    icon: Users,
    gradient:
      "from-pink-500/10 to-rose-500/10 border-pink-500/20 text-pink-500",
  },
  {
    id: "college-events",
    name: "College Events",
    description: "Symposiums, projects, and hackfests hosted by universities",
    count: 4,
    upcoming: true,
    icon: School,
    gradient:
      "from-indigo-500/10 to-blue-500/10 border-indigo-500/20 text-indigo-500",
  },
  {
    id: "meetups",
    name: "Community Meetups",
    description: "Local developer community gatherings and informal talks",
    count: 10,
    upcoming: true,
    icon: Heart,
    gradient:
      "from-fuchsia-500/10 to-pink-500/10 border-fuchsia-500/20 text-fuchsia-500",
  },
];

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
      "The premier global conference for developers exploring the future of frontend, backend edge architectures, and compiler-driven UI frameworks.",
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

function EventsHubPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // all, upcoming, registered, recommended, past
  const [events, setEvents] = useState<EventItem[]>(initialEvents);

  const [selectedEventForModal, setSelectedEventForModal] =
    useState<EventItem | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    socialUrl: "",
    experience: "Intermediate",
    motivation: "",
  });

  const handleOpenRegisterModal = (evt: EventItem) => {
    setSelectedEventForModal(evt);
    setFormData({
      fullName: "",
      email: "",
      socialUrl: "",
      experience: "Intermediate",
      motivation: "",
    });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventForModal) return;
    toggleRegistration(selectedEventForModal.id);
    setSelectedEventForModal(null);
  };

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // Search term filter
      const matchesSearch =
        event.name.toLowerCase().includes(search.toLowerCase()) ||
        event.description.toLowerCase().includes(search.toLowerCase()) ||
        event.organizer.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      // Status/Filter Tab filter
      if (activeFilter === "registered") {
        return event.status === "Registered";
      }
      if (activeFilter === "upcoming") {
        return event.status === "Open" || event.status === "Registered";
      }
      if (activeFilter === "recommended") {
        return (
          event.category === "hackathons" || event.category === "workshops"
        );
      }
      if (activeFilter === "past") {
        return event.status === "Closed";
      }

      return true;
    });
  }, [search, activeFilter, events]);

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

  // Calendar dates mock
  const calendarDays = [
    {
      day: "08",
      month: "Jul",
      event: "Why We Rewrote Our Core Engine in Rust",
      type: "Tech Talk",
    },
    {
      day: "12",
      month: "Jul",
      event: "AI Innovation Hackathon 2026",
      type: "Hackathon",
    },
    {
      day: "18",
      month: "Jul",
      event: "Design Engineers Virtual Meetup",
      type: "Meetup",
    },
    {
      day: "20",
      month: "Jul",
      event: "Global Algorithmic Duel",
      type: "Contest",
    },
    {
      day: "25",
      month: "Jul",
      event: "Inter-Collegiate HackFest 2026",
      type: "College Event",
    },
    {
      day: "02",
      month: "Aug",
      event: "Advanced React & Design Patterns",
      type: "Workshop",
    },
  ];

  return (
    <div className="w-full space-y-8 pb-12">
      {/* Header and Summary Panel */}
      <div
        className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b pb-6"
        style={{ borderColor: "var(--sb-border)" }}
      >
        <div>
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{
              color: "var(--sb-ink)",
              fontFamily: "'Fraunces', Georgia, serif",
            }}
          >
            Events Hub
          </h1>
          <p
            className="mt-1.5 text-sm"
            style={{ color: "var(--sb-ink-muted)" }}
          >
            Explore technical hackathons, workshops, webinars, and meetups to
            boost your engineering credentials.
          </p>
        </div>

        {/* Global Event Stats Panel */}
        <div
          className="flex items-center gap-5 rounded-2xl p-5 border shadow-xs min-w-[280px]"
          style={{
            background: "var(--card-bg)",
            borderColor: "var(--card-border)",
          }}
        >
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[var(--sb-accent)]/10 text-[var(--sb-accent)]">
            <Sparkles size={24} />
          </div>
          <div className="flex-1 space-y-0.5">
            <div
              className="text-xs font-semibold"
              style={{ color: "var(--sb-ink-muted)" }}
            >
              Your Attendance
            </div>
            <div
              className="text-lg font-bold"
              style={{ color: "var(--sb-ink)" }}
            >
              {events.filter((e) => e.status === "Registered").length}{" "}
              Registered
            </div>
            <div className="text-xs" style={{ color: "var(--sb-ink-dim)" }}>
              {events.filter((e) => e.status === "Open").length} Available
              events
            </div>
          </div>
        </div>
      </div>

      {/* Main Categories Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CalendarIcon size={18} className="text-[var(--sb-accent)]" />
          <h2 className="text-lg font-bold" style={{ color: "var(--sb-ink)" }}>
            Browse Categories
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <Link
                key={cat.id}
                to="/events/$type"
                params={{ type: cat.id }}
                className="block"
              >
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex h-[210px] flex-col justify-between rounded-2xl border p-5 shadow-xs hover:shadow-md cursor-pointer select-none transition-all relative overflow-hidden"
                  style={{
                    background: "var(--card-bg)",
                    borderColor: "var(--card-border)",
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1.5 pr-2">
                      <h3
                        className="text-base font-bold tracking-tight line-clamp-1"
                        style={{ color: "var(--sb-ink)" }}
                      >
                        {cat.name}
                      </h3>
                      <p
                        className="line-clamp-3 text-xs leading-relaxed"
                        style={{ color: "var(--sb-ink-dim)" }}
                      >
                        {cat.description}
                      </p>
                    </div>

                    <div
                      className={`flex size-11 shrink-0 items-center justify-center rounded-2xl border bg-gradient-to-br ${cat.gradient}`}
                    >
                      <IconComponent size={22} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-[var(--sb-accent)]">
                      {cat.count} Events
                    </div>

                    {cat.upcoming && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Upcoming
                      </span>
                    )}
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Filter and Schedule Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Search & Listing column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            {/* Filter Tabs */}
            <div
              className="flex items-center rounded-xl p-1 border overflow-x-auto self-start"
              style={{
                background: "var(--sb-bg)",
                borderColor: "var(--sb-border)",
              }}
            >
              {["all", "upcoming", "registered", "recommended", "past"].map(
                (tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveFilter(tab)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize cursor-pointer transition-all duration-150 active:scale-95 ${
                      activeFilter === tab
                        ? "bg-[color-mix(in oklab,var(--sb-ink)_6%,transparent)] text-[var(--sb-accent)] font-semibold"
                        : "text-[var(--sb-ink-muted)] hover:bg-[var(--sb-bg-hover)]"
                    }`}
                  >
                    {tab}
                  </button>
                ),
              )}
            </div>

            {/* Search Bar */}
            <div className="relative flex-1 max-w-sm">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--sb-ink-dim)" }}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events, topics, speakers..."
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border bg-transparent outline-none transition-all focus:border-[var(--sb-accent)]/80"
                style={{
                  borderColor: "var(--sb-border)",
                  color: "var(--sb-ink)",
                }}
              />
            </div>
          </div>

          {/* Events List */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredEvents.length === 0 ? (
                <div
                  className="rounded-2xl border p-8 text-center"
                  style={{ borderColor: "var(--sb-border)" }}
                >
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--sb-ink-muted)" }}
                  >
                    No events match your criteria.
                  </p>
                </div>
              ) : (
                filteredEvents.map((evt) => (
                  <motion.div
                    layout
                    key={evt.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border transition-all"
                    style={{
                      background: "var(--card-bg)",
                      borderColor: "var(--card-border)",
                    }}
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border bg-[var(--sb-pill)] text-[var(--sb-ink-dim)] border-[var(--sb-border)]">
                          {evt.category.replace("-", " ")}
                        </span>
                        {evt.status === "Registered" && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            <CheckCircle2 size={10} />
                            Registered
                          </span>
                        )}
                      </div>
                      <h3
                        className="text-base font-bold"
                        style={{ color: "var(--sb-ink)" }}
                      >
                        {evt.name}
                      </h3>
                      <p
                        className="text-xs"
                        style={{ color: "var(--sb-ink-muted)" }}
                      >
                        {evt.description}
                      </p>
                      <div
                        className="flex flex-wrap items-center gap-4 text-xs"
                        style={{ color: "var(--sb-ink-dim)" }}
                      >
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {evt.date} at {evt.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} />
                          {evt.organizer}
                        </span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-stretch gap-2 w-full sm:w-auto shrink-0 self-end sm:self-center">
                      <Link
                        to="/events/$type"
                        params={{ type: evt.category }}
                        className="flex-1 text-center"
                      >
                        <button
                          type="button"
                          className="w-full px-4 py-2 text-xs font-semibold rounded-xl border border-[var(--sb-border)] hover:bg-[var(--sb-bg-hover)] cursor-pointer active:scale-95 transition-all text-[var(--sb-ink)]"
                        >
                          View Details
                        </button>
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          if (evt.status === "Registered") {
                            toggleRegistration(evt.id);
                          } else {
                            handleOpenRegisterModal(evt);
                          }
                        }}
                        className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer active:scale-95 transition-all ${
                          evt.status === "Registered"
                            ? "bg-rose-500/10 text-rose-600 border border-rose-500/20 hover:bg-rose-500/20"
                            : "bg-[var(--sb-accent)] text-white hover:opacity-90 shadow-xs"
                        }`}
                      >
                        {evt.status === "Registered"
                          ? "Cancel RSVP"
                          : "Register"}
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Schedule Calendar widget */}
        <div className="space-y-6">
          <div
            className="rounded-2xl border p-5 space-y-4"
            style={{
              background: "var(--card-bg)",
              borderColor: "var(--card-border)",
            }}
          >
            <h3
              className="text-sm font-bold uppercase tracking-wider"
              style={{ color: "var(--sb-ink)" }}
            >
              Schedule Calendar
            </h3>

            <div className="space-y-3.5">
              {calendarDays.map((item) => (
                <div
                  key={item.day}
                  className="flex gap-4 items-start border-b pb-3.5 last:border-b-0 last:pb-0"
                  style={{ borderColor: "var(--sb-border)" }}
                >
                  <div
                    className="flex flex-col items-center justify-center size-11 shrink-0 rounded-xl border"
                    style={{
                      borderColor: "var(--sb-border)",
                      background: "var(--sb-bg-hover)",
                    }}
                  >
                    <span className="text-[10px] uppercase font-bold text-[var(--sb-ink-dim)]">
                      {item.month}
                    </span>
                    <span className="text-base font-bold text-[var(--sb-ink)] -mt-1">
                      {item.day}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="inline-block text-[9px] uppercase font-bold tracking-wide px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-600">
                      {item.type}
                    </span>
                    <h4
                      className="text-xs font-bold leading-tight line-clamp-1"
                      style={{ color: "var(--sb-ink)" }}
                    >
                      {item.event}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Event Registration Dialog */}
      <Dialog
        open={selectedEventForModal !== null}
        onOpenChange={(open) => !open && setSelectedEventForModal(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="text-[var(--sb-accent)]" size={18} />
              Register for Event
            </DialogTitle>
            <DialogDescription className="text-xs">
              Confirm your registration for{" "}
              <span className="font-semibold text-[var(--sb-ink)]">
                {selectedEventForModal?.name}
              </span>
              . Please provide your details below.
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
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                }
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
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
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
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    socialUrl: e.target.value,
                  }))
                }
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
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, experience: level }))
                    }
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
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    motivation: e.target.value,
                  }))
                }
                className="focus-visible:ring-[var(--sb-accent)]/20"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedEventForModal(null)}
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
