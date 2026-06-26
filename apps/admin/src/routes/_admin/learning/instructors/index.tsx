import { createFileRoute } from "@tanstack/react-router";
import {
  Edit2,
  GraduationCap,
  Mail,
  Plus,
  Search,
  Star,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "#/components/admin/empty-state";
import { PageHeader } from "#/components/admin/page-header";
import { Button } from "#/components/ui/button";
import {
  type LmsInstructor,
  useDeleteLmsInstructor,
  useLmsCourses,
  useLmsInstructors,
  useSaveLmsInstructor,
} from "#/hooks/use-lms-state";
import { cn } from "#/lib/utils";

export const Route = createFileRoute("/_admin/learning/instructors/")({
  component: LmsInstructorsPage,
});

const BLANK_INSTRUCTOR: LmsInstructor = {
  id: "",
  name: "",
  email: "",
  bio: "",
  expertise: [],
  avatar: "",
  courseIds: [],
  rating: 5.0,
  studentsCount: 0,
  createdAt: new Date().toISOString(),
};

function LmsInstructorsPage() {
  const { data: instructors = [], isLoading } = useLmsInstructors();
  const { data: courses = [] } = useLmsCourses();
  const saveInstructor = useSaveLmsInstructor();
  const deleteInstructor = useDeleteLmsInstructor();

  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editInstructor, setEditInstructor] =
    useState<LmsInstructor>(BLANK_INSTRUCTOR);

  // Form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formBio, setFormBio] = useState("");
  const [formAvatar, setFormAvatar] = useState("");
  const [formExpertiseRaw, setFormExpertiseRaw] = useState("");
  const [formCourseIds, setFormCourseIds] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return instructors.filter((i) => {
      const q = search.toLowerCase();
      return (
        !search ||
        i.name.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        i.expertise.some((e) => e.toLowerCase().includes(q))
      );
    });
  }, [instructors, search]);

  const openCreate = () => {
    setEditInstructor(BLANK_INSTRUCTOR);
    setFormName("");
    setFormEmail("");
    setFormBio("");
    setFormAvatar("");
    setFormExpertiseRaw("");
    setFormCourseIds([]);
    setDrawerOpen(true);
  };

  const openEdit = (i: LmsInstructor) => {
    setEditInstructor(i);
    setFormName(i.name);
    setFormEmail(i.email);
    setFormBio(i.bio);
    setFormAvatar(i.avatar);
    setFormExpertiseRaw(i.expertise.join(", "));
    setFormCourseIds(i.courseIds || []);
    setDrawerOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim() || !formEmail.trim()) return;

    const savedInstructor: LmsInstructor = {
      ...editInstructor,
      id: editInstructor.id || `i_${Date.now()}`,
      name: formName,
      email: formEmail,
      bio: formBio,
      avatar: formAvatar,
      expertise: formExpertiseRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      courseIds: formCourseIds,
      // Keep old stats if updating, otherwise default
      rating: editInstructor.id ? editInstructor.rating : 5.0,
      studentsCount: editInstructor.id ? editInstructor.studentsCount : 0,
    };

    saveInstructor.mutate(savedInstructor, {
      onSuccess: () => {
        setDrawerOpen(false);
      },
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this instructor?")) {
      deleteInstructor.mutate(id);
    }
  };

  const toggleCourse = (cId: string) => {
    setFormCourseIds((prev) =>
      prev.includes(cId) ? prev.filter((id) => id !== cId) : [...prev, cId],
    );
  };

  return (
    <div className="p-6 w-full pb-16 space-y-8">
      <PageHeader
        title="Instructors Management"
        description="Manage LMS instructors, their profiles, assigned courses, and teaching performance."
        icon={GraduationCap}
        breadcrumbs={[
          { label: "Admin" },
          { label: "Learning" },
          { label: "Instructors" },
        ]}
      />

      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, expertise..."
            className="w-full pl-9 pr-4 py-2 border rounded-lg text-xs focus:outline-none focus:border-ring"
            style={{
              background: "transparent",
              borderColor: "var(--sb-border)",
              color: "var(--sb-ink)",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <Button
          onClick={openCreate}
          className="w-full sm:w-auto text-xs gap-1.5 active:scale-[0.98]"
        >
          <Plus size={14} />
          Add Instructor
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="island-shell rounded-xl p-5 space-y-4 animate-pulse h-48"
              style={{
                background: "transparent",
                border: "1px solid var(--sb-border)",
              }}
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No instructors found"
          description={
            search
              ? "Try adjusting your search terms"
              : "Get started by adding your first instructor profile."
          }
          actionLabel="Add Instructor"
          onAction={openCreate}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((ins) => {
            const assignedCourses = courses.filter((c) =>
              ins.courseIds?.includes(c.id),
            );

            return (
              <div
                key={ins.id}
                className="island-shell rounded-xl p-5 flex flex-col justify-between space-y-4 transition-all hover:shadow-md"
                style={{
                  background: "transparent",
                  border: "1px solid var(--sb-border)",
                }}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {ins.avatar ? (
                        <img
                          src={ins.avatar}
                          alt={ins.name}
                          className="size-12 rounded-full object-cover border shrink-0"
                          style={{ borderColor: "var(--sb-border)" }}
                        />
                      ) : (
                        <div className="size-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-extrabold text-sm shrink-0">
                          {ins.name
                            .split(" ")
                            .map((w) => w.charAt(0))
                            .join("")
                            .substring(0, 2)}
                        </div>
                      )}
                      <div>
                        <h3
                          className="font-semibold text-xs text-foreground"
                          style={{ color: "var(--sb-ink)" }}
                        >
                          {ins.name}
                        </h3>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Mail size={10} />
                          {ins.email}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEdit(ins)}
                        className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="Edit Instructor"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(ins.id)}
                        className="p-1 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                        title="Delete Instructor"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  <p
                    className="mt-3 text-[11px] leading-relaxed line-clamp-3"
                    style={{ color: "var(--sb-ink-dim)" }}
                  >
                    {ins.bio || "No biography provided."}
                  </p>

                  {/* Expertise list */}
                  <div className="mt-4 flex flex-wrap gap-1">
                    {ins.expertise.map((exp) => (
                      <span
                        key={exp}
                        className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-500 text-[9px] font-medium"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  className="pt-4 border-t flex items-center justify-between text-[10px] font-medium"
                  style={{ borderColor: "var(--sb-border)" }}
                >
                  <div
                    className="flex items-center gap-1"
                    style={{ color: "var(--sb-ink)" }}
                  >
                    <Users size={12} className="text-muted-foreground" />
                    <span>{ins.studentsCount?.toLocaleString()} Students</span>
                  </div>
                  <div
                    className="flex items-center gap-1"
                    style={{ color: "var(--sb-ink)" }}
                  >
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span>{ins.rating?.toFixed(1)} Rating</span>
                  </div>
                  <div className="text-muted-foreground">
                    {assignedCourses.length}{" "}
                    {assignedCourses.length === 1 ? "Course" : "Courses"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Drawer Overlay & Content */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer Body */}
          <div
            className="relative w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200"
            style={{ background: "var(--sb-background, #fff)" }}
          >
            {/* Header */}
            <div
              className="px-5 py-4 border-b flex items-center justify-between"
              style={{ borderColor: "var(--sb-border)" }}
            >
              <div>
                <h3
                  className="font-bold text-[13px]"
                  style={{ color: "var(--sb-ink)" }}
                >
                  {editInstructor.id
                    ? "Edit Instructor Profile"
                    : "Add New Instructor"}
                </h3>
                <p className="text-[10px] text-muted-foreground">
                  Provide details about the instructor's expertise and profile.
                </p>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                <span>Instructor Name *</span>
                <input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Dr. Emily Smith"
                  className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-ring font-normal"
                  style={{
                    background: "transparent",
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                />
              </label>

              <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                <span>Email Address *</span>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="e.g. emily@quild.dev"
                  className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-ring font-normal"
                  style={{
                    background: "transparent",
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                />
              </label>

              <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                <span>Avatar URL</span>
                <input
                  value={formAvatar}
                  onChange={(e) => setFormAvatar(e.target.value)}
                  placeholder="e.g. https://example.com/avatar.jpg"
                  className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-ring font-normal"
                  style={{
                    background: "transparent",
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                />
              </label>

              <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                <span>Expertise (comma-separated)</span>
                <input
                  value={formExpertiseRaw}
                  onChange={(e) => setFormExpertiseRaw(e.target.value)}
                  placeholder="e.g. JavaScript, React, System Design"
                  className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-ring font-normal"
                  style={{
                    background: "transparent",
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                />
              </label>

              <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                <span>Biography</span>
                <textarea
                  value={formBio}
                  onChange={(e) => setFormBio(e.target.value)}
                  placeholder="Tell students about the instructor's background and achievements…"
                  rows={4}
                  className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-ring resize-none font-normal"
                  style={{
                    background: "transparent",
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                />
              </label>

              <div className="space-y-2">
                <span className="text-[9px] font-bold uppercase text-muted-foreground block">
                  Assign Courses
                </span>
                <div
                  className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto p-1 border rounded-lg"
                  style={{ borderColor: "var(--sb-border)" }}
                >
                  {courses.length === 0 ? (
                    <div className="text-[10px] text-muted-foreground p-2 text-center">
                      No courses available
                    </div>
                  ) : (
                    courses.map((c) => {
                      const selected = formCourseIds.includes(c.id);
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => toggleCourse(c.id)}
                          className={cn(
                            "flex items-center justify-between p-2 rounded-lg border text-left text-[10px] transition-all cursor-pointer",
                            selected
                              ? "border-indigo-500 bg-indigo-500/[0.03] text-indigo-500"
                              : "hover:border-[var(--sb-ink-dim)]",
                          )}
                          style={{
                            borderColor: selected
                              ? undefined
                              : "var(--sb-border)",
                          }}
                        >
                          <span
                            className="font-medium truncate"
                            style={{
                              color: selected ? undefined : "var(--sb-ink)",
                            }}
                          >
                            {c.title}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-semibold">
                            {c.difficulty}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className="px-5 py-4 border-t flex items-center gap-3 shrink-0"
              style={{ borderColor: "var(--sb-border)" }}
            >
              <Button
                onClick={handleSave}
                disabled={
                  !formName.trim() ||
                  !formEmail.trim() ||
                  saveInstructor.isPending
                }
                className="flex-1 active:scale-[0.98]"
              >
                {saveInstructor.isPending
                  ? "Saving…"
                  : editInstructor.id
                    ? "Update Profile"
                    : "Add Instructor"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setDrawerOpen(false)}
                className="active:scale-[0.98]"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
