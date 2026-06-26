import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Clock,
  Copy,
  Edit2,
  Eye,
  FileText,
  History,
  Plus,
  Save,
  Search,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";
import { PageHeader } from "#/components/admin/page-header";
import { StatusBadge } from "#/components/admin/status-badge";
import {
  type CaseStudy,
  type CaseStudyVersion,
  useCaseStudies,
  useDeleteCaseStudy,
  useSaveCaseStudy,
} from "#/hooks/use-practice-state";

export const Route = createFileRoute("/_admin/practice/case-studies/")({
  component: CaseStudiesPage,
});

// Markdown parser helpers
function parseInlineMarkdown(text: string) {
  if (!text) return "";
  const boldParts = text.split("**");
  return boldParts.map((part, bIdx) => {
    const isBold = bIdx % 2 !== 0;
    const codeParts = part.split("`");
    const renderedCodeParts = codeParts.map((subPart, cIdx) => {
      const isCode = cIdx % 2 !== 0;
      if (isCode) {
        return (
          <code
            // biome-ignore lint/suspicious/noArrayIndexKey: inline code mapping stable key
            key={`code-${bIdx}-${cIdx}`}
            className="px-1 py-0.5 bg-neutral-800 text-indigo-300 rounded font-mono text-[10px] border border-neutral-700"
          >
            {subPart}
          </code>
        );
      }
      return subPart;
    });

    if (isBold) {
      return (
        <strong
          // biome-ignore lint/suspicious/noArrayIndexKey: inline bold mapping stable key
          key={`bold-${bIdx}`}
          className="font-bold text-foreground"
        >
          {renderedCodeParts}
        </strong>
      );
    }
    return (
      <span
        // biome-ignore lint/suspicious/noArrayIndexKey: inline text mapping stable key
        key={`text-${bIdx}`}
      >
        {renderedCodeParts}
      </span>
    );
  });
}

function parseMarkdown(md: string) {
  if (!md) {
    return (
      <p className="text-muted-foreground italic text-xs">
        No content provided yet. Start typing markdown...
      </p>
    );
  }

  const lines = md.split("\n");
  return lines.map((line, idx) => {
    if (line.startsWith("### ")) {
      return (
        <h5
          // biome-ignore lint/suspicious/noArrayIndexKey: line index is stable
          key={`h5-${idx}`}
          className="text-xs font-bold mt-4 mb-1 text-indigo-400"
        >
          {line.slice(4)}
        </h5>
      );
    }
    if (line.startsWith("## ")) {
      return (
        <h4
          // biome-ignore lint/suspicious/noArrayIndexKey: line index is stable
          key={`h4-${idx}`}
          className="text-sm font-extrabold mt-5 mb-2 border-b border-neutral-800 pb-1 text-foreground"
        >
          {line.slice(3)}
        </h4>
      );
    }
    if (line.startsWith("# ")) {
      return (
        <h3
          // biome-ignore lint/suspicious/noArrayIndexKey: line index is stable
          key={`h3-${idx}`}
          className="text-base font-black mt-6 mb-3 text-indigo-500"
        >
          {line.slice(2)}
        </h3>
      );
    }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      return (
        <li
          // biome-ignore lint/suspicious/noArrayIndexKey: line index is stable
          key={`li-${idx}`}
          className="ml-4 list-disc text-xs text-muted-foreground my-1 leading-relaxed"
        >
          {parseInlineMarkdown(line.slice(2))}
        </li>
      );
    }
    if (line.startsWith("> ")) {
      return (
        <blockquote
          // biome-ignore lint/suspicious/noArrayIndexKey: line index is stable
          key={`bq-${idx}`}
          className="border-l-4 border-indigo-500 bg-neutral-900/40 pl-3 py-2 my-3 text-xs italic text-muted-foreground rounded-r"
        >
          {parseInlineMarkdown(line.slice(2))}
        </blockquote>
      );
    }
    return (
      <p
        // biome-ignore lint/suspicious/noArrayIndexKey: line index is stable
        key={`p-${idx}`}
        className="text-xs text-muted-foreground leading-relaxed min-h-[1rem] my-1.5"
      >
        {parseInlineMarkdown(line)}
      </p>
    );
  });
}

function CaseStudiesPage() {
  const { data: caseStudies = [], isLoading } = useCaseStudies();
  const saveCaseStudyMutation = useSaveCaseStudy();
  const deleteCaseStudyMutation = useDeleteCaseStudy();

  // Navigation State
  // "list" | "editor"
  const [viewMode, setViewMode] = useState<"list" | "editor">("list");
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Form Editor fields
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<
    "Technical" | "Startup" | "Product" | "Industry"
  >("Technical");
  const [formStatus, setFormStatus] = useState<"published" | "draft">("draft");
  const [formTags, setFormTags] = useState("");
  const [formResources, setFormResources] = useState("");

  // Editor content section tab
  const [activeSection, setActiveSection] = useState<
    "overview" | "problemStatement" | "analysis" | "solutions" | "outcomes"
  >("overview");

  // Section content state
  const [formOverview, setFormOverview] = useState("");
  const [formProblemStatement, setFormProblemStatement] = useState("");
  const [formAnalysis, setFormAnalysis] = useState("");
  const [formSolutions, setFormSolutions] = useState("");
  const [formOutcomes, setFormOutcomes] = useState("");

  // Version History list
  const [formVersions, setFormVersions] = useState<CaseStudyVersion[]>([]);
  const [newVersionChanges, setNewVersionChanges] = useState("");
  const [newVersionAuthor, setNewVersionAuthor] = useState("Admin Author");

  const filteredStudies = caseStudies.filter((study) => {
    const matchesSearch =
      study.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      study.overview.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || study.category === categoryFilter;
    const matchesStatus =
      statusFilter === "All" || study.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Action: Open Create Form
  const handleOpenCreate = () => {
    setSelectedStudy(null);
    setFormTitle("");
    setFormCategory("Technical");
    setFormStatus("draft");
    setFormTags("");
    setFormResources("");

    setFormOverview("");
    setFormProblemStatement("");
    setFormAnalysis("");
    setFormSolutions("");
    setFormOutcomes("");

    setFormVersions([]);
    setNewVersionChanges("");
    setActiveSection("overview");
    setViewMode("editor");
  };

  // Action: Open Edit Form
  const handleOpenEdit = (study: CaseStudy) => {
    setSelectedStudy(study);
    setFormTitle(study.title);
    setFormCategory(study.category);
    setFormStatus(study.status);
    setFormTags(study.tags.join(", "));
    setFormResources(study.resources.join("\n"));

    setFormOverview(study.overview || "");
    setFormProblemStatement(study.problemStatement || "");
    setFormAnalysis(study.analysis || "");
    setFormSolutions(study.solutions || "");
    setFormOutcomes(study.outcomes || "");

    setFormVersions(study.versionHistory || []);
    setNewVersionChanges("");
    setActiveSection("overview");
    setViewMode("editor");
  };

  // Action: Duplicate Case Study
  const handleDuplicate = (study: CaseStudy) => {
    const duplicated: CaseStudy = {
      ...study,
      id: `cs-${Date.now()}`,
      title: `${study.title} (Copy)`,
      status: "draft",
      versionHistory: [
        {
          version: 1,
          date: new Date().toISOString().split("T")[0],
          author: "System (Duplicated)",
          changes: `Duplicated from ${study.title}`,
        },
      ],
    };
    saveCaseStudyMutation.mutate(duplicated);
  };

  // Action: Delete Case Study
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this case study?")) {
      deleteCaseStudyMutation.mutate(id);
    }
  };

  // Form Action: Add Version History entry
  const handleAddVersion = () => {
    if (!newVersionChanges.trim()) return;

    const nextVerNum =
      formVersions.length > 0
        ? formVersions[formVersions.length - 1].version + 1
        : 1;
    const newVer: CaseStudyVersion = {
      version: nextVerNum,
      date: new Date().toISOString().split("T")[0],
      author: newVersionAuthor || "Anonymous Admin",
      changes: newVersionChanges.trim(),
    };

    setFormVersions([...formVersions, newVer]);
    setNewVersionChanges("");
  };

  // Save Case Study Form
  const handleSaveStudy = () => {
    if (!formTitle.trim()) {
      alert("Please provide a title.");
      return;
    }

    const targetId = selectedStudy ? selectedStudy.id : `cs-${Date.now()}`;
    const tagsArray = formTags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    const resourcesArray = formResources
      .split("\n")
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    // Auto append initial version log if history is empty
    const updatedHistory = [...formVersions];
    if (updatedHistory.length === 0) {
      updatedHistory.push({
        version: 1,
        date: new Date().toISOString().split("T")[0],
        author: newVersionAuthor || "Admin Author",
        changes: selectedStudy
          ? "Modified case study structure."
          : "Initial draft creation.",
      });
    }

    const updatedStudy: CaseStudy = {
      id: targetId,
      title: formTitle.trim(),
      category: formCategory,
      overview: formOverview,
      problemStatement: formProblemStatement,
      analysis: formAnalysis,
      solutions: formSolutions,
      outcomes: formOutcomes,
      resources: resourcesArray,
      tags: tagsArray,
      status: formStatus,
      versionHistory: updatedHistory,
    };

    saveCaseStudyMutation.mutate(updatedStudy, {
      onSuccess: () => {
        setViewMode("list");
        setSelectedStudy(null);
      },
    });
  };

  return (
    <div className="p-6 w-full max-w-[1600px] mx-auto space-y-6">
      {viewMode === "list" ? (
        // ==========================================
        // LIST VIEW (CMS MANAGER)
        // ==========================================
        <div className="space-y-6 stagger-item">
          <PageHeader
            title="Case Study CMS"
            description="Manage technical architecture case studies, product conversions, and industrial templates for student practice."
            icon={Briefcase}
            breadcrumbs={[
              { label: "Admin" },
              { label: "Practice" },
              { label: "Case Studies" },
            ]}
            actions={[
              {
                label: "Create Case Study",
                onClick: handleOpenCreate,
                icon: Plus,
              },
            ]}
          />

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="island-shell rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground">
                  Total Case Studies
                </span>
                <h4
                  className="text-xl font-bold mt-1"
                  style={{ color: "var(--sb-ink)" }}
                >
                  {caseStudies.length}
                </h4>
              </div>
              <Briefcase size={20} className="text-indigo-500" />
            </div>
            <div className="island-shell rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground">
                  Published Live
                </span>
                <h4 className="text-xl font-bold mt-1 text-emerald-500">
                  {caseStudies.filter((c) => c.status === "published").length}
                </h4>
              </div>
              <CheckCircle2 size={20} className="text-emerald-500" />
            </div>
            <div className="island-shell rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground">
                  Drafts CMS
                </span>
                <h4 className="text-xl font-bold mt-1 text-amber-500">
                  {caseStudies.filter((c) => c.status === "draft").length}
                </h4>
              </div>
              <FileText size={20} className="text-amber-500" />
            </div>
            <div className="island-shell rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground">
                  Revision Versions
                </span>
                <h4
                  className="text-xl font-bold mt-1"
                  style={{ color: "var(--sb-ink)" }}
                >
                  {caseStudies.reduce(
                    (sum, c) => sum + (c.versionHistory?.length || 0),
                    0,
                  )}
                </h4>
              </div>
              <History size={20} className="text-indigo-400" />
            </div>
          </div>

          {/* Filtering Line */}
          <div className="island-shell rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search case studies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded-lg text-xs outline-none focus:border-ring transition-all"
                style={{
                  background: "transparent",
                  borderColor: "var(--sb-border)",
                  color: "var(--sb-ink)",
                }}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Category Select */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-muted-foreground font-semibold">
                  Category:
                </span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="border rounded px-2.5 py-1.5 bg-background text-xs font-semibold focus:outline-none focus:border-ring"
                  style={{
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                >
                  <option value="All">All Categories</option>
                  <option value="Technical">Technical</option>
                  <option value="Startup">Startup</option>
                  <option value="Product">Product</option>
                  <option value="Industry">Industry</option>
                </select>
              </div>

              {/* Status Select */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-muted-foreground font-semibold">
                  Status:
                </span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border rounded px-2.5 py-1.5 bg-background text-xs font-semibold focus:outline-none focus:border-ring"
                  style={{
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                >
                  <option value="All">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
          </div>

          {/* List Table */}
          <div className="island-shell rounded-xl overflow-hidden border border-[var(--sb-border)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr
                    className="border-b border-[var(--sb-border)]"
                    style={{ background: "rgba(var(--sb-accent-rgb), 0.02)" }}
                  >
                    <th className="p-4 font-bold text-muted-foreground">
                      Title & Summary
                    </th>
                    <th className="p-4 font-bold text-muted-foreground w-36">
                      Category
                    </th>
                    <th className="p-4 font-bold text-muted-foreground w-28">
                      Status
                    </th>
                    <th className="p-4 font-bold text-muted-foreground w-48">
                      Tags
                    </th>
                    <th className="p-4 font-bold text-muted-foreground w-28 text-center">
                      Version
                    </th>
                    <th className="p-4 font-bold text-muted-foreground w-36 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--sb-border)]">
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-8 text-center text-muted-foreground"
                      >
                        Loading studies...
                      </td>
                    </tr>
                  ) : filteredStudies.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-8 text-center text-muted-foreground"
                      >
                        No case studies found matching filters.
                      </td>
                    </tr>
                  ) : (
                    filteredStudies.map((study) => (
                      <tr
                        key={study.id}
                        className="hover:bg-muted/30 transition-all"
                      >
                        <td className="p-4">
                          <div
                            className="font-bold flex items-center gap-1.5"
                            style={{ color: "var(--sb-ink)" }}
                          >
                            <BookOpen size={13} className="text-indigo-500" />
                            {study.title}
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-0.5 max-w-md truncate">
                            {study.overview}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="bg-indigo-500/10 text-indigo-500 text-[10px] font-bold px-2 py-0.5 rounded">
                            {study.category}
                          </span>
                        </td>
                        <td className="p-4">
                          <StatusBadge
                            status={
                              study.status === "published"
                                ? "success"
                                : "warning"
                            }
                          >
                            {study.status}
                          </StatusBadge>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {study.tags.map((t) => (
                              <span
                                key={t}
                                className="bg-neutral-800 text-neutral-300 text-[9px] px-1.5 py-0.5 rounded border border-neutral-700"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 text-center font-semibold text-muted-foreground">
                          v
                          {study.versionHistory?.length
                            ? study.versionHistory[
                                study.versionHistory.length - 1
                              ].version
                            : 1}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(study)}
                              className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-all active:scale-[0.98]"
                              title="Edit Content"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDuplicate(study)}
                              className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-all active:scale-[0.98]"
                              title="Duplicate Draft"
                            >
                              <Copy size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(study.id)}
                              className="p-1.5 hover:bg-red-500/10 rounded text-red-500 transition-all active:scale-[0.98]"
                              title="Delete Study"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        // ==========================================
        // WORKSPACE EDITOR VIEW (SPLIT-SCREEN MARKDOWN)
        // ==========================================
        <div className="space-y-6 stagger-item">
          {/* Editor Header Bar */}
          <div className="island-shell rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className="p-2 border rounded-lg hover:bg-muted transition-all active:scale-[0.98]"
                style={{ borderColor: "var(--sb-border)" }}
              >
                <ArrowLeft size={14} className="text-muted-foreground" />
              </button>
              <div>
                <span className="text-[10px] text-muted-foreground font-bold tracking-wider">
                  {selectedStudy
                    ? `Edit Case Study (v${formVersions.length > 0 ? formVersions[formVersions.length - 1].version : 1})`
                    : "Create New Case Study"}
                </span>
                <h3
                  className="text-sm font-bold"
                  style={{ color: "var(--sb-ink)" }}
                >
                  {formTitle || "Untitled Document"}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-muted-foreground">
                  Status:
                </span>
                <select
                  value={formStatus}
                  onChange={(e) =>
                    setFormStatus(e.target.value as "published" | "draft")
                  }
                  className="border rounded px-2.5 py-1.5 bg-background text-[10px] font-bold focus:outline-none focus:border-ring"
                  style={{
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleSaveStudy}
                className="flex items-center gap-1.5 px-4 py-2 bg-[var(--sb-accent)] text-white text-[11px] font-bold rounded-lg shadow-sm hover:opacity-95 transition-all active:scale-[0.98]"
              >
                <Save size={13} />
                Save Changes
              </button>
            </div>
          </div>

          {/* Form Settings and Tags Panel */}
          <div className="island-shell rounded-xl p-5 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-bold text-muted-foreground block">
                <span>Document Title</span>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="E.g. E-Commerce Cart Optimization..."
                  className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-ring mt-1 block"
                  style={{
                    background: "transparent",
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                />
              </label>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-bold text-muted-foreground block">
                <span>Category</span>
                <select
                  value={formCategory}
                  onChange={(e) =>
                    setFormCategory(
                      e.target.value as
                        | "Technical"
                        | "Startup"
                        | "Product"
                        | "Industry",
                    )
                  }
                  className="w-full border rounded-lg px-3 py-2 bg-background text-xs focus:outline-none focus:border-ring mt-1 block"
                  style={{
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                >
                  <option value="Technical">Technical</option>
                  <option value="Startup">Startup</option>
                  <option value="Product">Product</option>
                  <option value="Industry">Industry</option>
                </select>
              </label>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-bold text-muted-foreground block">
                <span>Search Tags (Comma separated)</span>
                <input
                  type="text"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  placeholder="UX, scale, database..."
                  className="w-full border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-ring mt-1 block"
                  style={{
                    background: "transparent",
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                />
              </label>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-bold text-muted-foreground block">
                <span>Resources & References (Line separated)</span>
                <textarea
                  value={formResources}
                  onChange={(e) => setFormResources(e.target.value)}
                  placeholder="Whitepaper PDF link..."
                  rows={1}
                  className="w-full border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-ring resize-y font-mono text-[10px] mt-1 block"
                  style={{
                    background: "transparent",
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                />
              </label>
            </div>
          </div>

          {/* Section tab controllers */}
          <div className="flex border-b border-[var(--sb-border)] gap-1 scrollbar-none overflow-x-auto pb-px">
            {(
              [
                { id: "overview", label: "1. Overview & Summary" },
                { id: "problemStatement", label: "2. Problem Statement" },
                { id: "analysis", label: "3. Systems Analysis" },
                { id: "solutions", label: "4. Proposed Solutions" },
                { id: "outcomes", label: "5. Outcomes & Metrics" },
              ] as const
            ).map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSection(sec.id)}
                className="px-4 py-2.5 text-xs font-bold border-b-2 transition-all relative active:scale-[0.98]"
                style={{
                  borderColor:
                    activeSection === sec.id
                      ? "var(--sb-accent)"
                      : "transparent",
                  color:
                    activeSection === sec.id
                      ? "var(--sb-ink)"
                      : "var(--sb-ink-dim)",
                }}
              >
                {sec.label}
              </button>
            ))}
          </div>

          {/* SPLIT-SCREEN WORKSPACE */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Left Workspace Panel: Markdown Editor */}
            <div className="island-shell rounded-xl p-5 flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-muted-foreground tracking-wider flex items-center gap-1">
                  <FileText size={12} className="text-indigo-500" />
                  Markdown Editor ({activeSection})
                </span>
                <span className="text-[9px] text-muted-foreground">
                  Supports bold `**bold**`, inline code `` `code` ``, lists `-`,
                  headers `#`.
                </span>
              </div>

              {activeSection === "overview" && (
                <textarea
                  value={formOverview}
                  onChange={(e) => setFormOverview(e.target.value)}
                  className="flex-1 w-full border rounded-lg p-3 text-xs outline-none focus:border-ring font-mono min-h-[300px] resize-y"
                  style={{
                    background: "transparent",
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                  placeholder="# Summary overview..."
                />
              )}

              {activeSection === "problemStatement" && (
                <textarea
                  value={formProblemStatement}
                  onChange={(e) => setFormProblemStatement(e.target.value)}
                  className="flex-1 w-full border rounded-lg p-3 text-xs outline-none focus:border-ring font-mono min-h-[300px] resize-y"
                  style={{
                    background: "transparent",
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                  placeholder="# Define checkout drop-offs or scaling blocks..."
                />
              )}

              {activeSection === "analysis" && (
                <textarea
                  value={formAnalysis}
                  onChange={(e) => setFormAnalysis(e.target.value)}
                  className="flex-1 w-full border rounded-lg p-3 text-xs outline-none focus:border-ring font-mono min-h-[300px] resize-y"
                  style={{
                    background: "transparent",
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                  placeholder="# Analyze metrics, tracing traces or CPU profiles..."
                />
              )}

              {activeSection === "solutions" && (
                <textarea
                  value={formSolutions}
                  onChange={(e) => setFormSolutions(e.target.value)}
                  className="flex-1 w-full border rounded-lg p-3 text-xs outline-none focus:border-ring font-mono min-h-[300px] resize-y"
                  style={{
                    background: "transparent",
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                  placeholder="# Outline the key strategies & system redesigns..."
                />
              )}

              {activeSection === "outcomes" && (
                <textarea
                  value={formOutcomes}
                  onChange={(e) => setFormOutcomes(e.target.value)}
                  className="flex-1 w-full border rounded-lg p-3 text-xs outline-none focus:border-ring font-mono min-h-[300px] resize-y"
                  style={{
                    background: "transparent",
                    borderColor: "var(--sb-border)",
                    color: "var(--sb-ink)",
                  }}
                  placeholder="# Document the conversion rates or load time decreases..."
                />
              )}
            </div>

            {/* Right Workspace Panel: Live Preview */}
            <div className="island-shell rounded-xl p-5 flex flex-col space-y-3 bg-neutral-950/40">
              <div className="flex items-center justify-between border-b border-[var(--sb-border)] pb-2">
                <span className="text-[10px] font-extrabold text-muted-foreground tracking-wider flex items-center gap-1">
                  <Eye size={12} className="text-emerald-500" />
                  Live Preview
                </span>
                <span className="bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded text-[8px] font-bold">
                  Rendered Layout
                </span>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[400px] text-left pr-1 scrollbar-thin">
                {activeSection === "overview" && parseMarkdown(formOverview)}
                {activeSection === "problemStatement" &&
                  parseMarkdown(formProblemStatement)}
                {activeSection === "analysis" && parseMarkdown(formAnalysis)}
                {activeSection === "solutions" && parseMarkdown(formSolutions)}
                {activeSection === "outcomes" && parseMarkdown(formOutcomes)}
              </div>
            </div>
          </div>

          {/* Document Revisions & Version History Panel */}
          <div className="island-shell rounded-xl p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Version logger input form */}
            <div className="md:col-span-1 space-y-3.5">
              <div className="flex items-center gap-2">
                <History className="size-4 text-indigo-500" />
                <h4
                  className="text-xs font-bold"
                  style={{ color: "var(--sb-ink)" }}
                >
                  Submit Document Revision
                </h4>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1 text-left">
                  <label className="text-[9px] font-bold text-muted-foreground block">
                    <span>Revision Author</span>
                    <input
                      type="text"
                      value={newVersionAuthor}
                      onChange={(e) => setNewVersionAuthor(e.target.value)}
                      placeholder="Staff author..."
                      className="w-full border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-ring mt-1 block"
                      style={{
                        background: "transparent",
                        borderColor: "var(--sb-border)",
                        color: "var(--sb-ink)",
                      }}
                    />
                  </label>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[9px] font-bold text-muted-foreground block">
                    <span>Change Log Description</span>
                    <textarea
                      value={newVersionChanges}
                      onChange={(e) => setNewVersionChanges(e.target.value)}
                      placeholder="Describe edits made to the case study sections..."
                      rows={2}
                      className="w-full border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-ring resize-none mt-1 block"
                      style={{
                        background: "transparent",
                        borderColor: "var(--sb-border)",
                        color: "var(--sb-ink)",
                      }}
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleAddVersion}
                  className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-bold text-[10px] transition-all active:scale-[0.98]"
                >
                  Commit Revision Log
                </button>
              </div>
            </div>

            {/* Version log items list */}
            <div className="md:col-span-2 space-y-3">
              <span className="text-[10px] font-bold text-muted-foreground block">
                Version Audit History Log ({formVersions.length})
              </span>

              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                {formVersions.length === 0 ? (
                  <div className="text-center p-6 text-[11px] text-muted-foreground bg-muted/20 border rounded-lg">
                    No version history entries present. An initial entry will be
                    created upon save.
                  </div>
                ) : (
                  [...formVersions].reverse().map((ver, _idx) => (
                    <div
                      key={ver.version}
                      className="p-3 bg-muted/40 rounded-lg border border-[var(--sb-border)] flex items-center justify-between text-xs text-left"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-indigo-500 bg-indigo-500/10 px-1.5 py-0.5 rounded text-[9px]">
                            v{ver.version}
                          </span>
                          <span className="font-semibold text-muted-foreground truncate max-w-[120px] flex items-center gap-1">
                            <User size={10} /> {ver.author}
                          </span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock size={10} /> {ver.date}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-[10px] pt-1">
                          {ver.changes}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
