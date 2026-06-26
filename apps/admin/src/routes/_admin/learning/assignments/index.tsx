import { createFileRoute } from "@tanstack/react-router";
import {
  Calendar,
  CheckCircle,
  Clock,
  Edit2,
  FileText,
  FileUp,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "#/components/admin/empty-state";
import { PageHeader } from "#/components/admin/page-header";
import { Button } from "#/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import {
  type LmsAssignment,
  type SubmissionType,
  useDeleteLmsAssignment,
  useLmsAssignments,
  useLmsCourses,
  useLmsLessons,
  useLmsModules,
  useSaveLmsAssignment,
} from "#/hooks/use-lms-state";
import { cn } from "#/lib/utils";

export const Route = createFileRoute("/_admin/learning/assignments/")({
  component: LmsAssignmentsPage,
});

const BLANK_ASSIGNMENT: LmsAssignment = {
  id: "",
  lessonId: "",
  title: "",
  description: "",
  dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000)
    .toISOString()
    .split("T")[0],
  submissionType: "text",
  evaluationCriteria: "",
  autoGrading: false,
  status: "draft",
  submissionsCount: 0,
  createdAt: new Date().toISOString(),
};

function LmsAssignmentsPage() {
  const { data: assignments = [], isLoading } = useLmsAssignments();
  const { data: lessons = [] } = useLmsLessons();
  const { data: modules = [] } = useLmsModules();
  const { data: courses = [] } = useLmsCourses();
  const saveAssignment = useSaveLmsAssignment();
  const deleteAssignment = useDeleteLmsAssignment();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editAssignment, setEditAssignment] =
    useState<LmsAssignment>(BLANK_ASSIGNMENT);

  // Form fields
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formDueDate, setFormDueDate] = useState("");
  const [formSubType, setFormSubType] = useState<SubmissionType>("text");
  const [formCriteria, setFormCriteria] = useState("");
  const [formAutoGrading, setFormAutoGrading] = useState(false);
  const [formLessonId, setFormLessonId] = useState("");
  const [formStatus, setFormStatus] = useState<"published" | "draft">("draft");

  // Map lesson to module and course for list display
  const lessonMap = useMemo(() => {
    const map = new Map<string, { lessonTitle: string; path: string }>();
    for (const l of lessons) {
      const mod = modules.find((m) => m.id === l.moduleId);
      const crs = mod ? courses.find((c) => c.id === mod.courseId) : null;
      map.set(l.id, {
        lessonTitle: l.title,
        path: crs && mod ? `${crs.title} ➔ ${mod.title}` : "",
      });
    }
    return map;
  }, [lessons, modules, courses]);

  const filtered = useMemo(() => {
    return assignments.filter((a) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q);
      const matchType = !typeFilter || a.submissionType === typeFilter;
      const matchStatus = !statusFilter || a.status === statusFilter;
      return matchSearch && matchType && matchStatus;
    });
  }, [assignments, search, typeFilter, statusFilter]);

  const openCreate = () => {
    setEditAssignment(BLANK_ASSIGNMENT);
    setFormTitle("");
    setFormDesc("");
    setFormDueDate(
      new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split("T")[0],
    );
    setFormSubType("text");
    setFormCriteria("");
    setFormAutoGrading(false);
    setFormLessonId(lessons[0]?.id || "");
    setFormStatus("draft");
    setDrawerOpen(true);
  };

  const openEdit = (a: LmsAssignment) => {
    setEditAssignment(a);
    setFormTitle(a.title);
    setFormDesc(a.description);
    setFormDueDate(a.dueDate ? a.dueDate.split("T")[0] : "");
    setFormSubType(a.submissionType);
    setFormCriteria(a.evaluationCriteria);
    setFormAutoGrading(a.autoGrading);
    setFormLessonId(a.lessonId);
    setFormStatus(a.status);
    setDrawerOpen(true);
  };

  const handleSave = () => {
    if (!formTitle.trim() || !formLessonId) return;

    const saved: LmsAssignment = {
      ...editAssignment,
      id: editAssignment.id || `a_${Date.now()}`,
      title: formTitle,
      description: formDesc,
      dueDate: formDueDate,
      submissionType: formSubType,
      evaluationCriteria: formCriteria,
      autoGrading: formAutoGrading,
      lessonId: formLessonId,
      status: formStatus,
      submissionsCount: editAssignment.id ? editAssignment.submissionsCount : 0,
    };

    saveAssignment.mutate(saved, {
      onSuccess: () => {
        setDrawerOpen(false);
      },
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this assignment?")) {
      deleteAssignment.mutate(id);
    }
  };

  return (
    <div className="p-6 w-full pb-16 space-y-8">
      <PageHeader
        title="Assignments Management"
        description="Design homework assignments, set submission requirements, and configure auto-grading."
        icon={CheckCircle}
        breadcrumbs={[
          { label: "Admin" },
          { label: "Learning" },
          { label: "Assignments" },
        ]}
      />

      {/* Top Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assignments..."
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <select
            value={typeFilter || ""}
            onChange={(e) => setTypeFilter(e.target.value || null)}
            className="border rounded-lg px-3 py-2 text-xs bg-background focus:outline-none focus:border-ring"
            style={{ borderColor: "var(--sb-border)", color: "var(--sb-ink)" }}
          >
            <option value="">All Formats</option>
            <option value="text">Text Response</option>
            <option value="code">Code Submission</option>
            <option value="file">File Upload</option>
          </select>

          <select
            value={statusFilter || ""}
            onChange={(e) => setStatusFilter(e.target.value || null)}
            className="border rounded-lg px-3 py-2 text-xs bg-background focus:outline-none focus:border-ring"
            style={{ borderColor: "var(--sb-border)", color: "var(--sb-ink)" }}
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <Button
          onClick={openCreate}
          className="w-full sm:w-auto text-xs gap-1.5 active:scale-[0.98]"
        >
          <Plus size={14} />
          Create Assignment
        </Button>
      </div>

      {/* Table view */}
      {isLoading ? (
        <div
          className="border rounded-xl p-8 space-y-4 animate-pulse"
          style={{ borderColor: "var(--sb-border)" }}
        >
          <div className="h-6 bg-muted rounded w-1/4" />
          <div className="h-20 bg-muted rounded" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No assignments found"
          description={
            search
              ? "Try adjusting your filters."
              : "Create assignments for your lessons and manage student homework."
          }
          actionLabel="Create Assignment"
          onAction={openCreate}
        />
      ) : (
        <div
          className="overflow-x-auto border rounded-xl"
          style={{ borderColor: "var(--sb-border)", background: "transparent" }}
        >
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr
                className="border-b text-[10px] font-bold uppercase tracking-wider"
                style={{
                  borderColor: "var(--sb-border)",
                  color: "var(--sb-ink-dim)",
                  background: "var(--sb-overlay, rgba(0,0,0,0.02))",
                }}
              >
                <th className="p-4 font-semibold">Assignment details</th>
                <th className="p-4 font-semibold">Lesson Context</th>
                <th className="p-4 font-semibold">Submission format</th>
                <th className="p-4 font-semibold">Due Date</th>
                <th className="p-4 font-semibold">Submissions</th>
                <th className="p-4 font-semibold">Grading</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody
              className="divide-y"
              style={{ divideColor: "var(--sb-border)" }}
            >
              {filtered.map((a) => {
                const info = lessonMap.get(a.lessonId);
                const isOverdue =
                  new Date(a.dueDate) < new Date() && a.status === "published";

                return (
                  <tr
                    key={a.id}
                    className="hover:bg-muted/50 transition-colors"
                    style={{ color: "var(--sb-ink)" }}
                  >
                    <td className="p-4">
                      <div>
                        <div className="font-semibold text-xs">{a.title}</div>
                        <div
                          className="text-[10px] text-muted-foreground truncate max-w-xs mt-0.5"
                          title={a.description}
                        >
                          {a.description || "No description provided."}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {info ? (
                        <div>
                          <div className="font-medium text-foreground">
                            {info.lessonTitle}
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">
                            {info.path}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic text-[10px]">
                          Unlinked Lesson
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-medium inline-flex items-center gap-1",
                          a.submissionType === "code"
                            ? "bg-purple-500/10 text-purple-500"
                            : a.submissionType === "file"
                              ? "bg-amber-500/10 text-amber-500"
                              : "bg-blue-500/10 text-blue-500",
                        )}
                      >
                        {a.submissionType === "code" && <Clock size={10} />}
                        {a.submissionType === "file" && <FileUp size={10} />}
                        {a.submissionType === "text" && <FileText size={10} />}
                        <span className="capitalize">{a.submissionType}</span>
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar
                          size={12}
                          className="text-muted-foreground shrink-0"
                        />
                        <span
                          className={cn(
                            isOverdue && "text-red-500 font-semibold",
                          )}
                        >
                          {a.dueDate
                            ? new Date(a.dueDate).toLocaleDateString()
                            : "No deadline"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-foreground">
                      {a.submissionsCount ?? 0}
                    </td>
                    <td className="p-4">
                      {a.autoGrading ? (
                        <span className="text-emerald-500 font-medium">
                          Auto-Graded
                        </span>
                      ) : (
                        <span className="text-muted-foreground">
                          Manual review
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide",
                          a.status === "published"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-zinc-500/10 text-zinc-400",
                        )}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded"
                          >
                            <MoreHorizontal size={14} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="text-xs">
                          <DropdownMenuItem
                            onClick={() => openEdit(a)}
                            className="cursor-pointer gap-1.5 text-xs"
                          >
                            <Edit2 size={12} />
                            Edit Assignment
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(a.id)}
                            className="cursor-pointer gap-1.5 text-xs text-red-600 hover:text-red-600 focus:text-red-600 focus:bg-red-500/10"
                          >
                            <Trash2 size={12} />
                            Delete Assignment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Drawer overlay & panel */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />

          <div
            className="relative w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200"
            style={{ background: "var(--sb-background, #fff)" }}
          >
            {/* Drawer Header */}
            <div
              className="px-5 py-4 border-b flex items-center justify-between"
              style={{ borderColor: "var(--sb-border)" }}
            >
              <div>
                <h3
                  className="font-bold text-[13px]"
                  style={{ color: "var(--sb-ink)" }}
                >
                  {editAssignment.id ? "Edit Assignment" : "New Assignment"}
                </h3>
                <p className="text-[10px] text-muted-foreground">
                  Define tasks and parameters for students to submit.
                </p>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable fields */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                <span>Assignment Title *</span>
                <input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Write a Scope Explorer"
                  className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-ring font-normal"
                  style={{
                    background: "transparent",
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                />
              </label>

              <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                <span>Description</span>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Explain instructions and assignment tasks clearly…"
                  rows={3}
                  className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-ring resize-none font-normal"
                  style={{
                    background: "transparent",
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                />
              </label>

              <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                <span>Target Lesson *</span>
                <select
                  value={formLessonId}
                  onChange={(e) => setFormLessonId(e.target.value)}
                  className="mt-1 block w-full border rounded-lg px-3 py-2 bg-background focus:outline-none focus:border-ring font-normal"
                  style={{
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                >
                  {lessons.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.title} ({lessonMap.get(l.id)?.path || "Unmapped"})
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                  <span>Submission Format</span>
                  <select
                    value={formSubType}
                    onChange={(e) =>
                      setFormSubType(e.target.value as SubmissionType)
                    }
                    className="mt-1 block w-full border rounded-lg px-3 py-2 bg-background focus:outline-none focus:border-ring font-normal"
                    style={{
                      borderColor: "var(--sb-border)",
                      color: "var(--sb-ink)",
                    }}
                  >
                    <option value="text">Text Response</option>
                    <option value="code">Code Submission</option>
                    <option value="file">File Upload</option>
                  </select>
                </label>

                <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                  <span>Due Date</span>
                  <input
                    type="date"
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-ring font-normal"
                    style={{
                      background: "transparent",
                      borderColor: "var(--sb-border)",
                      color: "var(--sb-ink)",
                    }}
                  />
                </label>
              </div>

              <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                <span>Evaluation Criteria</span>
                <textarea
                  value={formCriteria}
                  onChange={(e) => setFormCriteria(e.target.value)}
                  placeholder="Explain how submissions will be evaluated (e.g. correctness, styling)…"
                  rows={3}
                  className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-ring resize-none font-normal"
                  style={{
                    background: "transparent",
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                  <span>Status</span>
                  <select
                    value={formStatus}
                    onChange={(e) =>
                      setFormStatus(e.target.value as "published" | "draft")
                    }
                    className="mt-1 block w-full border rounded-lg px-3 py-2 bg-background focus:outline-none focus:border-ring font-normal"
                    style={{
                      borderColor: "var(--sb-border)",
                      color: "var(--sb-ink)",
                    }}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </label>

                <label className="flex items-center gap-2 cursor-pointer mt-4">
                  <input
                    type="checkbox"
                    checked={formAutoGrading}
                    onChange={(e) => setFormAutoGrading(e.target.checked)}
                    className="rounded"
                  />
                  <div>
                    <span
                      className="text-[10px] font-semibold block"
                      style={{ color: "var(--sb-ink)" }}
                    >
                      Auto-Grading
                    </span>
                    <span className="text-[9px] text-muted-foreground block">
                      Assess code outputs instantly
                    </span>
                  </div>
                </label>
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
                  !formTitle.trim() || !formLessonId || saveAssignment.isPending
                }
                className="flex-1 active:scale-[0.98]"
              >
                {saveAssignment.isPending
                  ? "Saving…"
                  : editAssignment.id
                    ? "Update Assignment"
                    : "Create Assignment"}
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
