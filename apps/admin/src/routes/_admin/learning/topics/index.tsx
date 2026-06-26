import { createFileRoute } from "@tanstack/react-router";
import {
  Code2,
  Edit2,
  FileText,
  MoreHorizontal,
  Plus,
  Search,
  Tag,
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
  type LmsTopic,
  useDeleteLmsTopic,
  useLmsLessons,
  useLmsTopics,
  useSaveLmsTopic,
} from "#/hooks/use-lms-state";

export const Route = createFileRoute("/_admin/learning/topics/")({
  component: TopicsPage,
});

const BLANK: LmsTopic = {
  id: "",
  lessonId: "",
  title: "",
  concepts: "",
  examples: "",
  exercises: "",
  notes: "",
  codeSnippets: [],
  resources: [],
  order: 1,
  createdAt: new Date().toISOString(),
};

function TopicsPage() {
  const { data: topics = [], isLoading } = useLmsTopics();
  const { data: lessons = [] } = useLmsLessons();
  const saveTopic = useSaveLmsTopic();
  const deleteTopic = useDeleteLmsTopic();

  const [search, setSearch] = useState("");
  const [lessonFilter, setLessonFilter] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [edit, setEdit] = useState<LmsTopic>(BLANK);

  const [formTitle, setFormTitle] = useState("");
  const [formLessonId, setFormLessonId] = useState("");
  const [formConcepts, setFormConcepts] = useState("");
  const [formExamples, setFormExamples] = useState("");
  const [formExercises, setFormExercises] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formSnippetsRaw, setFormSnippetsRaw] = useState("");
  const [formResourcesRaw, setFormResourcesRaw] = useState("");
  const [formOrder, setFormOrder] = useState(1);

  const filtered = useMemo(() => {
    return topics.filter((t) => {
      const q = search.toLowerCase();
      const matchSearch = !search || t.title.toLowerCase().includes(q);
      const matchLesson = !lessonFilter || t.lessonId === lessonFilter;
      return matchSearch && matchLesson;
    });
  }, [topics, search, lessonFilter]);

  const openCreate = (lessonId?: string) => {
    setEdit(BLANK);
    setFormTitle("");
    setFormLessonId(lessonId ?? "");
    setFormConcepts("");
    setFormExamples("");
    setFormExercises("");
    setFormNotes("");
    setFormSnippetsRaw("");
    setFormResourcesRaw("");
    setFormOrder(1);
    setDrawerOpen(true);
  };

  const openEdit = (t: LmsTopic) => {
    setEdit(t);
    setFormTitle(t.title);
    setFormLessonId(t.lessonId);
    setFormConcepts(t.concepts);
    setFormExamples(t.examples);
    setFormExercises(t.exercises);
    setFormNotes(t.notes);
    setFormSnippetsRaw(t.codeSnippets.join("\n---\n"));
    setFormResourcesRaw(t.resources.join("\n"));
    setFormOrder(t.order);
    setDrawerOpen(true);
  };

  const handleSave = () => {
    const topic: LmsTopic = {
      ...edit,
      id: edit.id || `t${Date.now()}`,
      title: formTitle,
      lessonId: formLessonId,
      concepts: formConcepts,
      examples: formExamples,
      exercises: formExercises,
      notes: formNotes,
      codeSnippets: formSnippetsRaw
        .split("\n---\n")
        .map((s) => s.trim())
        .filter(Boolean),
      resources: formResourcesRaw
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      order: formOrder,
    };
    saveTopic.mutate(topic, { onSuccess: () => setDrawerOpen(false) });
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this topic?")) deleteTopic.mutate(id);
  };

  const lessonMap = useMemo(
    () => new Map(lessons.map((l) => [l.id, l])),
    [lessons],
  );

  return (
    <div className="p-6 w-full pb-16">
      <PageHeader
        title="Topics"
        description={`${topics.length} topics covering ${lessons.length} lessons.`}
        icon={Tag}
        breadcrumbs={[
          { label: "Admin" },
          { label: "Learning" },
          { label: "Topics" },
        ]}
        actions={[
          {
            label: "New Topic",
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
            placeholder="Search topics…"
            className="pl-8 pr-3 py-2 text-xs rounded-[10px] outline-none w-56"
            style={{
              background: "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
              border: "1px solid var(--sb-border)",
              color: "var(--sb-ink)",
            }}
          />
        </div>
        <select
          value={lessonFilter ?? ""}
          onChange={(e) => setLessonFilter(e.target.value || null)}
          className="px-3 py-2 text-xs rounded-[10px] outline-none"
          style={{
            background: "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
            border: "1px solid var(--sb-border)",
            color: "var(--sb-ink)",
          }}
        >
          <option value="">All Lessons</option>
          {lessons.map((l) => (
            <option key={l.id} value={l.id}>
              {l.title}
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
          icon={Tag}
          title="No topics found"
          description="Create your first topic."
          action={{
            label: "Clear filters",
            onClick: () => {
              setSearch("");
              setLessonFilter(null);
            },
          }}
        />
      ) : (
        <div className="island-shell rounded-xl overflow-hidden">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--sb-border)",
                  background:
                    "color-mix(in oklab, var(--sb-ink) 2%, transparent)",
                }}
              >
                {[
                  "#",
                  "Topic",
                  "Parent Lesson",
                  "Has Code",
                  "Resources",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-[9px]"
                    style={{ color: "var(--sb-ink-dim)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((topic) => {
                const lesson = lessonMap.get(topic.lessonId);
                return (
                  <tr
                    key={topic.id}
                    className="hover:bg-[color-mix(in_oklab,var(--sb-ink)_1.5%,transparent)] transition-colors"
                    style={{ borderBottom: "1px solid var(--sb-border)" }}
                  >
                    <td className="px-4 py-3.5">
                      <span
                        className="text-[10px] font-bold"
                        style={{ color: "var(--sb-ink-muted)" }}
                      >
                        {topic.order}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="flex size-7 items-center justify-center rounded-lg shrink-0"
                          style={{
                            background:
                              "color-mix(in oklab, #a78bfa 12%, transparent)",
                            color: "#a78bfa",
                          }}
                        >
                          <Tag size={11} />
                        </span>
                        <div>
                          <div
                            className="font-semibold"
                            style={{ color: "var(--sb-ink)" }}
                          >
                            {topic.title}
                          </div>
                          <div
                            className="text-[10px] mt-0.5 line-clamp-1"
                            style={{ color: "var(--sb-ink-dim)" }}
                          >
                            {topic.concepts}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div
                        className="flex items-center gap-1.5"
                        style={{ color: "var(--sb-ink-muted)" }}
                      >
                        <FileText size={11} />
                        <span className="text-[10px]">
                          {lesson?.title ?? topic.lessonId}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      {topic.codeSnippets.length > 0 ? (
                        <div className="flex items-center gap-1 text-emerald-500">
                          <Code2 size={11} />
                          <span className="text-[10px] font-medium">
                            {topic.codeSnippets.length} snippet
                            {topic.codeSnippets.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      ) : (
                        <span
                          className="text-[10px]"
                          style={{ color: "var(--sb-ink-dim)" }}
                        >
                          None
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className="text-[10px]"
                        style={{ color: "var(--sb-ink-muted)" }}
                      >
                        {topic.resources.length}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="flex size-7 items-center justify-center rounded-[7px] outline-none cursor-pointer hover:bg-[var(--sb-bg-hover)] active:scale-95 mx-auto"
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
                            onClick={() => openEdit(topic)}
                          >
                            <Edit2 size={12} /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-xs cursor-pointer gap-2 text-red-500"
                            onClick={() => handleDelete(topic.id)}
                          >
                            <Trash2 size={12} /> Delete
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
            className="w-[500px] h-full flex flex-col border-l overflow-hidden"
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
                {edit.id ? "Edit Topic" : "New Topic"}
              </span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="size-7 flex items-center justify-center rounded-lg hover:bg-[var(--sb-bg-hover)] cursor-pointer active:scale-95"
                style={{ color: "var(--sb-ink-dim)" }}
              >
                <X size={14} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 text-xs">
              <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                <span>Topic Title</span>
                <input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Topic title…"
                  className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none font-normal"
                  style={{
                    background: "transparent",
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                  <span>Parent Lesson</span>
                  <select
                    value={formLessonId}
                    onChange={(e) => setFormLessonId(e.target.value)}
                    className="mt-1 block w-full border rounded-lg px-3 py-2 bg-background focus:outline-none font-normal"
                    style={{
                      borderColor: "var(--sb-border)",
                      color: "var(--sb-ink)",
                    }}
                  >
                    <option value="">— Select —</option>
                    {lessons.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.title}
                      </option>
                    ))}
                  </select>
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
                <span>Key Concepts</span>
                <textarea
                  value={formConcepts}
                  onChange={(e) => setFormConcepts(e.target.value)}
                  placeholder="Core concept explanation…"
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
                <span>Examples</span>
                <textarea
                  value={formExamples}
                  onChange={(e) => setFormExamples(e.target.value)}
                  placeholder="Code examples and explanations…"
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
                <span>Exercises</span>
                <textarea
                  value={formExercises}
                  onChange={(e) => setFormExercises(e.target.value)}
                  placeholder="Practice exercises…"
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
                <span>Notes</span>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Additional notes…"
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
                <span>Code Snippets (separate with ---)</span>
                <textarea
                  value={formSnippetsRaw}
                  onChange={(e) => setFormSnippetsRaw(e.target.value)}
                  placeholder={"const x = 5;\n---\nconst y = x * 2;"}
                  rows={4}
                  className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none resize-none font-mono text-[10px] leading-relaxed font-normal"
                  style={{
                    background:
                      "color-mix(in oklab, var(--sb-ink) 3%, transparent)",
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                />
              </label>
              <label className="block text-[9px] font-bold uppercase text-muted-foreground">
                <span>Resources (one per line)</span>
                <textarea
                  value={formResourcesRaw}
                  onChange={(e) => setFormResourcesRaw(e.target.value)}
                  placeholder="MDN Closures Guide"
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
                  !formTitle.trim() || !formLessonId || saveTopic.isPending
                }
                className="flex-1 active:scale-[0.98]"
              >
                {saveTopic.isPending
                  ? "Saving…"
                  : edit.id
                    ? "Update Topic"
                    : "Create Topic"}
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
