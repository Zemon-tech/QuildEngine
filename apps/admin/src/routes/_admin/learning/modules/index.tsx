import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  ChevronRight,
  Edit2,
  Layers,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import {
  type LmsModule,
  useDeleteLmsModule,
  useLmsCourses,
  useLmsModules,
  useSaveLmsModule,
} from "#/hooks/use-lms-state";
import { cn } from "#/lib/utils";

export const Route = createFileRoute("/_admin/learning/modules/")({
  component: ModulesPage,
});

const BLANK: LmsModule = {
  id: "",
  courseId: "",
  title: "",
  description: "",
  order: 1,
  outcomes: [],
  durationMinutes: 60,
  status: "draft",
  prerequisites: [],
  createdAt: new Date().toISOString(),
};

function ModulesPage() {
  const { data: modules = [], isLoading } = useLmsModules();
  const { data: courses = [] } = useLmsCourses();
  const saveModule = useSaveLmsModule();
  const deleteModule = useDeleteLmsModule();

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [edit, setEdit] = useState<LmsModule>(BLANK);

  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formCourseId, setFormCourseId] = useState("");
  const [formOrder, setFormOrder] = useState(1);
  const [formDuration, setFormDuration] = useState(60);
  const [formStatus, setFormStatus] = useState<"published" | "draft">("draft");
  const [formOutcomesRaw, setFormOutcomesRaw] = useState("");
  const [formPrereqsRaw, setFormPrereqsRaw] = useState("");

  const filtered = useMemo(() => {
    return modules.filter((m) => {
      const q = search.toLowerCase();
      const matchSearch = !search || m.title.toLowerCase().includes(q);
      const matchCourse = !courseFilter || m.courseId === courseFilter;
      return matchSearch && matchCourse;
    });
  }, [modules, search, courseFilter]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof modules>();
    for (const m of filtered) {
      const existing = map.get(m.courseId) ?? [];
      map.set(
        m.courseId,
        [...existing, m].sort((a, b) => a.order - b.order),
      );
    }
    return map;
  }, [filtered]);

  const openCreate = (courseId?: string) => {
    setEdit(BLANK);
    setFormTitle("");
    setFormDesc("");
    setFormCourseId(courseId ?? "");
    setFormOrder(1);
    setFormDuration(60);
    setFormStatus("draft");
    setFormOutcomesRaw("");
    setFormPrereqsRaw("");
    setDrawerOpen(true);
  };

  const openEdit = (m: LmsModule) => {
    setEdit(m);
    setFormTitle(m.title);
    setFormDesc(m.description);
    setFormCourseId(m.courseId);
    setFormOrder(m.order);
    setFormDuration(m.durationMinutes);
    setFormStatus(m.status);
    setFormOutcomesRaw(m.outcomes.join("\n"));
    setFormPrereqsRaw(m.prerequisites.join("\n"));
    setDrawerOpen(true);
  };

  const handleSave = () => {
    const mod: LmsModule = {
      ...edit,
      id: edit.id || `m${Date.now()}`,
      title: formTitle,
      description: formDesc,
      courseId: formCourseId,
      order: formOrder,
      durationMinutes: formDuration,
      status: formStatus,
      outcomes: formOutcomesRaw
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      prerequisites: formPrereqsRaw
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    saveModule.mutate(mod, { onSuccess: () => setDrawerOpen(false) });
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this module?")) deleteModule.mutate(id);
  };

  const handleReorder = (mod: LmsModule, dir: "up" | "down") => {
    const courseModules = modules
      .filter((m) => m.courseId === mod.courseId)
      .sort((a, b) => a.order - b.order);
    const idx = courseModules.findIndex((m) => m.id === mod.id);
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= courseModules.length) return;
    const swap = courseModules[swapIdx];
    saveModule.mutate({ ...mod, order: swap.order });
    saveModule.mutate({ ...swap, order: mod.order });
  };

  return (
    <div className="p-6 w-full pb-16">
      <PageHeader
        title="Modules"
        description={`${modules.length} modules across ${courses.length} courses.`}
        icon={Layers}
        breadcrumbs={[
          { label: "Admin" },
          { label: "Learning" },
          { label: "Modules" },
        ]}
        actions={[
          {
            label: "New Module",
            onClick: () => openCreate(),
            icon: Plus,
            variant: "default",
          },
        ]}
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--sb-ink-dim)" }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search modules…"
            className="pl-8 pr-3 py-2 text-xs rounded-[10px] outline-none w-56"
            style={{
              background: "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
              border: "1px solid var(--sb-border)",
              color: "var(--sb-ink)",
            }}
          />
        </div>
        <select
          value={courseFilter ?? ""}
          onChange={(e) => setCourseFilter(e.target.value || null)}
          className="px-3 py-2 text-xs rounded-[10px] outline-none"
          style={{
            background: "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
            border: "1px solid var(--sb-border)",
            color: "var(--sb-ink)",
          }}
        >
          <option value="">All Courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div
          className="island-shell rounded-xl p-8 text-center text-xs"
          style={{ color: "var(--sb-ink-dim)" }}
        >
          Loading…
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No modules found"
          description="Create your first module."
          action={{
            label: "Clear filters",
            onClick: () => {
              setSearch("");
              setCourseFilter(null);
            },
          }}
        />
      ) : (
        <div className="space-y-4">
          {Array.from(grouped.entries()).map(([courseId, mods]) => {
            const course = courses.find((c) => c.id === courseId);
            return (
              <div
                key={courseId}
                className="island-shell rounded-xl overflow-hidden"
              >
                {/* Course Group Header */}
                <div
                  className="flex items-center justify-between px-4 py-3 border-b"
                  style={{
                    borderColor: "var(--sb-border)",
                    background:
                      "color-mix(in oklab, var(--sb-ink) 2%, transparent)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <BookOpen
                      size={13}
                      style={{ color: "var(--sb-ink-dim)" }}
                    />
                    <span
                      className="text-xs font-semibold"
                      style={{ color: "var(--sb-ink)" }}
                    >
                      {course?.title ?? courseId}
                    </span>
                    <ChevronRight
                      size={12}
                      style={{ color: "var(--sb-ink-dim)" }}
                    />
                    <span
                      className="text-[10px]"
                      style={{ color: "var(--sb-ink-dim)" }}
                    >
                      {mods.length} module{mods.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openCreate(courseId)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium cursor-pointer hover:bg-(--sb-bg-hover) active:scale-95 transition-all"
                    style={{
                      color: "var(--sb-ink-muted)",
                      border: "1px solid var(--sb-border)",
                    }}
                  >
                    <Plus size={10} /> Add Module
                  </button>
                </div>
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--sb-border)" }}>
                      {[
                        "#",
                        "Module",
                        "Outcomes",
                        "Duration",
                        "Status",
                        "",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-2.5 text-left font-semibold uppercase tracking-wider text-[9px]"
                          style={{ color: "var(--sb-ink-dim)" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mods.map((mod, idx) => (
                      <tr
                        key={mod.id}
                        className="hover:bg-[color-mix(in_oklab,var(--sb-ink)_1.5%,transparent)] transition-colors"
                        style={{ borderBottom: "1px solid var(--sb-border)" }}
                      >
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-0.5">
                            <button
                              type="button"
                              onClick={() => handleReorder(mod, "up")}
                              disabled={idx === 0}
                              className="cursor-pointer disabled:opacity-20 hover:opacity-70 active:scale-95 transition-all"
                              style={{ color: "var(--sb-ink-dim)" }}
                            >
                              <ArrowUp size={11} />
                            </button>
                            <span
                              className="text-[10px] font-bold text-center"
                              style={{ color: "var(--sb-ink-muted)" }}
                            >
                              {mod.order}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleReorder(mod, "down")}
                              disabled={idx === mods.length - 1}
                              className="cursor-pointer disabled:opacity-20 hover:opacity-70 active:scale-95 transition-all"
                              style={{ color: "var(--sb-ink-dim)" }}
                            >
                              <ArrowDown size={11} />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <div
                              className="font-semibold"
                              style={{ color: "var(--sb-ink)" }}
                            >
                              {mod.title}
                            </div>
                            <div
                              className="text-[10px] mt-0.5 line-clamp-1"
                              style={{ color: "var(--sb-ink-dim)" }}
                            >
                              {mod.description}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="text-[10px]"
                            style={{ color: "var(--sb-ink-muted)" }}
                          >
                            {mod.outcomes.length} outcome
                            {mod.outcomes.length !== 1 ? "s" : ""}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="text-[10px]"
                            style={{ color: "var(--sb-ink-muted)" }}
                          >
                            {mod.durationMinutes} min
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide",
                              mod.status === "published"
                                ? "bg-emerald-500/10 text-emerald-500"
                                : "bg-zinc-500/10 text-zinc-400",
                            )}
                          >
                            {mod.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                type="button"
                                className="flex size-7 items-center justify-center rounded-[7px] outline-none cursor-pointer hover:bg-(--sb-bg-hover) active:scale-95 mx-auto"
                                style={{ color: "var(--sb-ink-dim)" }}
                              >
                                <MoreHorizontal size={14} />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-40"
                              style={{
                                background: "var(--sb-bg)",
                                border: "1px solid var(--sb-border)",
                              }}
                            >
                              <DropdownMenuItem
                                className="text-xs cursor-pointer gap-2"
                                onClick={() => openEdit(mod)}
                              >
                                <Edit2 size={12} /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-xs cursor-pointer gap-2 text-red-500"
                                onClick={() => handleDelete(mod.id)}
                              >
                                <Trash2 size={12} /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}

      {/* Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <button
            type="button"
            className="flex-1 bg-black/40 cursor-pointer"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close"
          />
          <div
            className="w-[480px] h-full flex flex-col border-l overflow-hidden"
            style={{
              background: "var(--sb-bg)",
              borderColor: "var(--sb-border)",
            }}
          >
            <div
              className="flex items-center justify-between px-5 py-4 border-b shrink-0"
              style={{ borderColor: "var(--sb-border)" }}
            >
              <span
                className="text-sm font-bold"
                style={{ color: "var(--sb-ink)" }}
              >
                {edit.id ? "Edit Module" : "New Module"}
              </span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="size-7 flex items-center justify-center rounded-lg hover:bg-(--sb-bg-hover) cursor-pointer active:scale-95"
                style={{ color: "var(--sb-ink-dim)" }}
              >
                <X size={14} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 text-xs">
              <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                <span>Module Title</span>
                <input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Module title…"
                  className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none font-normal"
                  style={{
                    background: "transparent",
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                />
              </label>
              <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                <span>Parent Course</span>
                <select
                  value={formCourseId}
                  onChange={(e) => setFormCourseId(e.target.value)}
                  className="mt-1 block w-full border rounded-lg px-3 py-2 bg-background focus:outline-none font-normal"
                  style={{
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                >
                  <option value="">— Select Course —</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                <span>Description</span>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="What this module covers…"
                  rows={3}
                  className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none resize-none font-normal"
                  style={{
                    background: "transparent",
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                  <span>Order</span>
                  <input
                    type="number"
                    value={formOrder}
                    onChange={(e) => setFormOrder(Number(e.target.value))}
                    min={1}
                    className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none font-normal"
                    style={{
                      background: "transparent",
                      borderColor: "var(--sb-border)",
                      color: "var(--sb-ink)",
                    }}
                  />
                </label>
                <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                  <span>Duration (min)</span>
                  <input
                    type="number"
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    min={1}
                    className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none font-normal"
                    style={{
                      background: "transparent",
                      borderColor: "var(--sb-border)",
                      color: "var(--sb-ink)",
                    }}
                  />
                </label>
              </div>
              <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                <span>Status</span>
                <select
                  value={formStatus}
                  onChange={(e) =>
                    setFormStatus(e.target.value as "published" | "draft")
                  }
                  className="mt-1 block w-full border rounded-lg px-3 py-2 bg-background focus:outline-none font-normal"
                  style={{
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>
              <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                <span>Learning Outcomes (one per line)</span>
                <textarea
                  value={formOutcomesRaw}
                  onChange={(e) => setFormOutcomesRaw(e.target.value)}
                  placeholder={"Master closures\nWrite async code"}
                  rows={3}
                  className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none resize-none font-normal"
                  style={{
                    background: "transparent",
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                />
              </label>
              <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                <span>Prerequisites (module IDs, one per line)</span>
                <textarea
                  value={formPrereqsRaw}
                  onChange={(e) => setFormPrereqsRaw(e.target.value)}
                  placeholder="m1"
                  rows={2}
                  className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none resize-none font-normal"
                  style={{
                    background: "transparent",
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                />
              </label>
            </div>
            <div
              className="px-5 py-4 border-t flex gap-3 shrink-0"
              style={{ borderColor: "var(--sb-border)" }}
            >
              <Button
                onClick={handleSave}
                disabled={
                  !formTitle.trim() || !formCourseId || saveModule.isPending
                }
                className="flex-1 active:scale-[0.98]"
              >
                {saveModule.isPending
                  ? "Saving…"
                  : edit.id
                    ? "Update Module"
                    : "Create Module"}
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
