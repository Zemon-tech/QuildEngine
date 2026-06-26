import { createFileRoute } from "@tanstack/react-router";
import {
  ChevronRight,
  Clock,
  Edit2,
  FileText,
  Layers,
  Link as LinkIcon,
  MoreHorizontal,
  Paperclip,
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
  type LmsLesson,
  useDeleteLmsLesson,
  useLmsLessons,
  useLmsModules,
  useSaveLmsLesson,
} from "#/hooks/use-lms-state";

export const Route = createFileRoute("/_admin/learning/lessons/")({
  component: LessonsPage,
});

const BLANK: LmsLesson = {
  id: "",
  moduleId: "",
  title: "",
  description: "",
  videoUrl: "",
  notes: "",
  resources: [],
  attachments: [],
  estimatedDuration: 30,
  order: 1,
  createdAt: new Date().toISOString(),
};

function LessonsPage() {
  const { data: lessons = [], isLoading } = useLmsLessons();
  const { data: modules = [] } = useLmsModules();
  const saveLesson = useSaveLmsLesson();
  const deleteLesson = useDeleteLmsLesson();

  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [edit, setEdit] = useState<LmsLesson>(BLANK);

  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formModuleId, setFormModuleId] = useState("");
  const [formVideoUrl, setFormVideoUrl] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formDuration, setFormDuration] = useState(30);
  const [formOrder, setFormOrder] = useState(1);
  const [formResourcesRaw, setFormResourcesRaw] = useState("");
  const [formAttachmentsRaw, setFormAttachmentsRaw] = useState("");

  const filtered = useMemo(() => {
    return lessons.filter((l) => {
      const q = search.toLowerCase();
      const matchSearch = !search || l.title.toLowerCase().includes(q);
      const matchModule = !moduleFilter || l.moduleId === moduleFilter;
      return matchSearch && matchModule;
    });
  }, [lessons, search, moduleFilter]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof lessons>();
    for (const l of filtered) {
      const existing = map.get(l.moduleId) ?? [];
      map.set(
        l.moduleId,
        [...existing, l].sort((a, b) => a.order - b.order),
      );
    }
    return map;
  }, [filtered]);

  const openCreate = (moduleId?: string) => {
    setEdit(BLANK);
    setFormTitle("");
    setFormDesc("");
    setFormModuleId(moduleId ?? "");
    setFormVideoUrl("");
    setFormNotes("");
    setFormDuration(30);
    setFormOrder(1);
    setFormResourcesRaw("");
    setFormAttachmentsRaw("");
    setDrawerOpen(true);
  };

  const openEdit = (l: LmsLesson) => {
    setEdit(l);
    setFormTitle(l.title);
    setFormDesc(l.description);
    setFormModuleId(l.moduleId);
    setFormVideoUrl(l.videoUrl);
    setFormNotes(l.notes);
    setFormDuration(l.estimatedDuration);
    setFormOrder(l.order);
    setFormResourcesRaw(l.resources.join("\n"));
    setFormAttachmentsRaw(l.attachments.join("\n"));
    setDrawerOpen(true);
  };

  const handleSave = () => {
    const lesson: LmsLesson = {
      ...edit,
      id: edit.id || `l${Date.now()}`,
      title: formTitle,
      description: formDesc,
      moduleId: formModuleId,
      videoUrl: formVideoUrl,
      notes: formNotes,
      estimatedDuration: formDuration,
      order: formOrder,
      resources: formResourcesRaw
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      attachments: formAttachmentsRaw
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    saveLesson.mutate(lesson, { onSuccess: () => setDrawerOpen(false) });
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this lesson?")) deleteLesson.mutate(id);
  };

  return (
    <div className="p-6 w-full pb-16">
      <PageHeader
        title="Lessons"
        description={`${lessons.length} lessons across ${modules.length} modules.`}
        icon={FileText}
        breadcrumbs={[
          { label: "Admin" },
          { label: "Learning" },
          { label: "Lessons" },
        ]}
        actions={[
          {
            label: "New Lesson",
            onClick: () => openCreate(),
            icon: Plus,
            variant: "default",
          },
        ]}
      />

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
            placeholder="Search lessons…"
            className="pl-8 pr-3 py-2 text-xs rounded-[10px] outline-none w-56"
            style={{
              background: "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
              border: "1px solid var(--sb-border)",
              color: "var(--sb-ink)",
            }}
          />
        </div>
        <select
          value={moduleFilter ?? ""}
          onChange={(e) => setModuleFilter(e.target.value || null)}
          className="px-3 py-2 text-xs rounded-[10px] outline-none"
          style={{
            background: "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
            border: "1px solid var(--sb-border)",
            color: "var(--sb-ink)",
          }}
        >
          <option value="">All Modules</option>
          {modules.map((m) => (
            <option key={m.id} value={m.id}>
              {m.title}
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
          icon={FileText}
          title="No lessons found"
          description="Create your first lesson."
          action={{
            label: "Clear filters",
            onClick: () => {
              setSearch("");
              setModuleFilter(null);
            },
          }}
        />
      ) : (
        <div className="space-y-4">
          {Array.from(grouped.entries()).map(([moduleId, lsns]) => {
            const mod = modules.find((m) => m.id === moduleId);
            return (
              <div
                key={moduleId}
                className="island-shell rounded-xl overflow-hidden"
              >
                <div
                  className="flex items-center justify-between px-4 py-3 border-b"
                  style={{
                    borderColor: "var(--sb-border)",
                    background:
                      "color-mix(in oklab, var(--sb-ink) 2%, transparent)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Layers size={13} style={{ color: "var(--sb-ink-dim)" }} />
                    <span
                      className="text-xs font-semibold"
                      style={{ color: "var(--sb-ink)" }}
                    >
                      {mod?.title ?? moduleId}
                    </span>
                    <ChevronRight
                      size={12}
                      style={{ color: "var(--sb-ink-dim)" }}
                    />
                    <span
                      className="text-[10px]"
                      style={{ color: "var(--sb-ink-dim)" }}
                    >
                      {lsns.length} lesson{lsns.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openCreate(moduleId)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium cursor-pointer hover:bg-(--sb-bg-hover) active:scale-95 transition-all"
                    style={{
                      color: "var(--sb-ink-muted)",
                      border: "1px solid var(--sb-border)",
                    }}
                  >
                    <Plus size={10} /> Add Lesson
                  </button>
                </div>
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--sb-border)" }}>
                      {[
                        "#",
                        "Lesson",
                        "Video",
                        "Duration",
                        "Resources",
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
                    {lsns.map((lesson) => (
                      <tr
                        key={lesson.id}
                        className="hover:bg-[color-mix(in_oklab,var(--sb-ink)_1.5%,transparent)] transition-colors"
                        style={{ borderBottom: "1px solid var(--sb-border)" }}
                      >
                        <td className="px-4 py-3.5">
                          <span
                            className="text-[10px] font-bold"
                            style={{ color: "var(--sb-ink-muted)" }}
                          >
                            {lesson.order}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div>
                            <div
                              className="font-semibold"
                              style={{ color: "var(--sb-ink)" }}
                            >
                              {lesson.title}
                            </div>
                            <div
                              className="text-[10px] mt-0.5 line-clamp-1"
                              style={{ color: "var(--sb-ink-dim)" }}
                            >
                              {lesson.description}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          {lesson.videoUrl ? (
                            <a
                              href={lesson.videoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-[10px] text-indigo-500 hover:underline"
                            >
                              <LinkIcon size={10} /> Video
                            </a>
                          ) : (
                            <span
                              className="text-[10px]"
                              style={{ color: "var(--sb-ink-dim)" }}
                            >
                              No video
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <div
                            className="flex items-center gap-1"
                            style={{ color: "var(--sb-ink-muted)" }}
                          >
                            <Clock size={11} />
                            <span className="text-[10px]">
                              {lesson.estimatedDuration} min
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div
                            className="flex items-center gap-1"
                            style={{ color: "var(--sb-ink-muted)" }}
                          >
                            <Paperclip size={11} />
                            <span className="text-[10px]">
                              {lesson.resources.length +
                                lesson.attachments.length}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
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
                                onClick={() => openEdit(lesson)}
                              >
                                <Edit2 size={12} /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-xs cursor-pointer gap-2 text-red-500"
                                onClick={() => handleDelete(lesson.id)}
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
                {edit.id ? "Edit Lesson" : "New Lesson"}
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
                <span>Lesson Title</span>
                <input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Lesson title…"
                  className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none font-normal"
                  style={{
                    background: "transparent",
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                />
              </label>
              <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                <span>Parent Module</span>
                <select
                  value={formModuleId}
                  onChange={(e) => setFormModuleId(e.target.value)}
                  className="mt-1 block w-full border rounded-lg px-3 py-2 bg-background focus:outline-none font-normal"
                  style={{
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                >
                  <option value="">— Select Module —</option>
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                <span>Description</span>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="What this lesson covers…"
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
                <span>Video URL</span>
                <input
                  value={formVideoUrl}
                  onChange={(e) => setFormVideoUrl(e.target.value)}
                  placeholder="https://example.com/video"
                  className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none font-normal"
                  style={{
                    background: "transparent",
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                />
              </label>
              <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                <span>Lesson Notes</span>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Key notes for students…"
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
              </div>
              <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                <span>Resources (one URL per line)</span>
                <textarea
                  value={formResourcesRaw}
                  onChange={(e) => setFormResourcesRaw(e.target.value)}
                  placeholder={"MDN Docs\nhttps://javascript.info"}
                  rows={2}
                  className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none resize-none font-normal"
                  style={{
                    background: "transparent",
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                />
              </label>
              <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                <span>Attachments (one URL per line)</span>
                <textarea
                  value={formAttachmentsRaw}
                  onChange={(e) => setFormAttachmentsRaw(e.target.value)}
                  placeholder="slides.pdf"
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
                  !formTitle.trim() || !formModuleId || saveLesson.isPending
                }
                className="flex-1 active:scale-[0.98]"
              >
                {saveLesson.isPending
                  ? "Saving…"
                  : edit.id
                    ? "Update Lesson"
                    : "Create Lesson"}
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
