import {
  ExternalLink,
  FileText,
  FlaskConical,
  FolderGit2,
  Github,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";

export interface ProjectItem {
  name: string;
  description: string;
  tech: string[];
  github?: string;
  demo?: string;
  image?: string;
}

export interface ResearchItem {
  title: string;
  summary: string;
  link?: string;
  date: string;
}

interface ProfileProjectsProps {
  projects: ProjectItem[];
  research: ResearchItem[];
  onUpdateProjects: (items: ProjectItem[]) => void;
  onUpdateResearch: (items: ResearchItem[]) => void;
}

export function ProfileProjects({
  projects,
  research,
  onUpdateProjects,
  onUpdateResearch,
}: ProfileProjectsProps) {
  // Modal states
  const [showProjModal, setShowProjModal] = useState(false);
  const [showResModal, setShowResModal] = useState(false);

  // Project form state
  const [projName, setProjName] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projTechInput, setProjTechInput] = useState("");
  const [projGithub, setProjGithub] = useState("");
  const [projDemo, setProjDemo] = useState("");

  // Research form state
  const [resTitle, setResTitle] = useState("");
  const [resSummary, setResSummary] = useState("");
  const [resLink, setResLink] = useState("");
  const [resDate, setResDate] = useState("");

  function handleAddProject(e: React.FormEvent) {
    e.preventDefault();
    if (!projName || !projDesc) return;

    const newItem: ProjectItem = {
      name: projName,
      description: projDesc,
      tech: projTechInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
      github: projGithub.trim() || undefined,
      demo: projDemo.trim() || undefined,
    };

    onUpdateProjects([newItem, ...projects]);

    // Reset Form
    setProjName("");
    setProjDesc("");
    setProjTechInput("");
    setProjGithub("");
    setProjDemo("");
    setShowProjModal(false);
  }

  function handleAddResearch(e: React.FormEvent) {
    e.preventDefault();
    if (!resTitle || !resSummary) return;

    const newItem: ResearchItem = {
      title: resTitle,
      summary: resSummary,
      link: resLink.trim() || undefined,
      date:
        resDate ||
        new Date().toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
        }),
    };

    onUpdateResearch([newItem, ...research]);

    // Reset Form
    setResTitle("");
    setResSummary("");
    setResLink("");
    setResDate("");
    setShowResModal(false);
  }

  function handleRemoveProject(index: number) {
    onUpdateProjects(projects.filter((_, i) => i !== index));
  }

  function handleRemoveResearch(index: number) {
    onUpdateResearch(research.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Projects Grid Card */}
      <div
        className="p-6 rounded-2xl border flex flex-col gap-5"
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--card-border)",
        }}
      >
        <div className="flex items-center justify-between">
          <h2
            className="text-lg font-bold tracking-tight flex items-center gap-2"
            style={{
              color: "var(--page-ink)",
              fontFamily: "'Fraunces', Georgia, serif",
            }}
          >
            <FolderGit2 size={17} className="text-[var(--sb-accent)]" />
            Projects
          </h2>
          <Button
            size="xs"
            variant="outline"
            onClick={() => setShowProjModal(true)}
            className="gap-1 text-xs border"
          >
            <Plus size={13} />
            <span>Add Project</span>
          </Button>
        </div>

        {projects.length === 0 ? (
          <p className="text-sm text-[var(--sb-ink-muted)] text-center py-4">
            No projects added yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj, index) => (
              <div
                key={`${proj.name}-${index}`}
                className="group relative p-4 rounded-xl border flex flex-col justify-between gap-3 text-[13px] transition-all hover:shadow-sm"
                style={{
                  background: "var(--page-bg)",
                  borderColor: "var(--card-border)",
                }}
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <h3
                      className="font-semibold text-sm"
                      style={{ color: "var(--sb-ink)" }}
                    >
                      {proj.name}
                    </h3>
                    <button
                      type="button"
                      onClick={() => handleRemoveProject(index)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-destructive hover:scale-105 transition-all shrink-0"
                      title="Delete project"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <p
                    className="mt-1.5 leading-relaxed"
                    style={{ color: "var(--sb-ink-muted)" }}
                  >
                    {proj.description}
                  </p>
                </div>

                <div className="flex flex-col gap-2.5 mt-2">
                  {proj.tech && proj.tech.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {proj.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-[var(--card-bg)] border"
                          style={{
                            borderColor: "var(--card-border)",
                            color: "var(--sb-ink-dim)",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-1">
                    {proj.github && (
                      <a
                        href={proj.github}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-medium hover:underline"
                        style={{ color: "var(--sb-ink)" }}
                      >
                        <Github size={12} />
                        GitHub
                      </a>
                    )}
                    {proj.demo && (
                      <a
                        href={proj.demo}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-medium hover:underline text-[var(--sb-accent)]"
                      >
                        <ExternalLink size={12} />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Research Portfolio Card */}
      <div
        className="p-6 rounded-2xl border flex flex-col gap-5"
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--card-border)",
        }}
      >
        <div className="flex items-center justify-between">
          <h2
            className="text-lg font-bold tracking-tight flex items-center gap-2"
            style={{
              color: "var(--page-ink)",
              fontFamily: "'Fraunces', Georgia, serif",
            }}
          >
            <FlaskConical size={17} className="text-[var(--sb-accent)]" />
            Research Portfolio
          </h2>
          <Button
            size="xs"
            variant="outline"
            onClick={() => setShowResModal(true)}
            className="gap-1 text-xs border"
          >
            <Plus size={13} />
            <span>Add Research</span>
          </Button>
        </div>

        {research.length === 0 ? (
          <p className="text-sm text-[var(--sb-ink-muted)] text-center py-4">
            No research publications added yet.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {research.map((res, index) => (
              <div
                key={`${res.title}-${index}`}
                className="group relative p-4 rounded-xl border flex flex-col gap-1.5 text-[13px] transition-all hover:shadow-xs"
                style={{
                  background: "var(--page-bg)",
                  borderColor: "var(--card-border)",
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <FileText
                      size={15}
                      className="text-[var(--sb-accent)] shrink-0"
                    />
                    <h3
                      className="font-semibold text-sm"
                      style={{ color: "var(--sb-ink)" }}
                    >
                      {res.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className="text-[11px]"
                      style={{ color: "var(--sb-ink-dim)" }}
                    >
                      {res.date}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveResearch(index)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-destructive hover:scale-105 transition-all"
                      title="Delete research"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <p
                  className="leading-relaxed pl-5"
                  style={{ color: "var(--sb-ink-muted)" }}
                >
                  {res.summary}
                </p>

                {res.link && (
                  <a
                    href={res.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-medium hover:underline text-[var(--sb-accent)] pl-5 mt-1"
                  >
                    <ExternalLink size={12} />
                    Read Article / Report
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Project Add Modal */}
      {showProjModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
          <div
            className="w-full max-w-lg rounded-2xl border p-5 flex flex-col gap-4 shadow-xl"
            style={{
              background: "var(--card-bg)",
              borderColor: "var(--card-border)",
            }}
          >
            <h3
              className="text-base font-bold"
              style={{
                color: "var(--page-ink)",
                fontFamily: "'Fraunces', Georgia, serif",
              }}
            >
              Add Project
            </h3>
            <form
              onSubmit={handleAddProject}
              className="flex flex-col gap-3.5 text-sm"
            >
              <div>
                <label className="text-[11px] font-semibold text-[var(--sb-ink-muted)] mb-1 block">
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  value={projName}
                  onChange={(e) => setProjName(e.target.value)}
                  placeholder="e.g. QuildEngine App"
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border bg-transparent outline-none focus:border-[var(--sb-accent)]"
                  style={{
                    borderColor: "var(--card-border)",
                    color: "var(--page-ink)",
                  }}
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--sb-ink-muted)] mb-1 block">
                  Description
                </label>
                <textarea
                  required
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  placeholder="What does it solve? What is the main value?"
                  rows={3}
                  className="w-full text-xs px-2.5 py-2 rounded-lg border bg-transparent outline-none focus:border-[var(--sb-accent)] resize-none"
                  style={{
                    borderColor: "var(--card-border)",
                    color: "var(--page-ink)",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--sb-ink-muted)] mb-1 block">
                  Tech Stack (comma separated)
                </label>
                <input
                  type="text"
                  value={projTechInput}
                  onChange={(e) => setProjTechInput(e.target.value)}
                  placeholder="e.g. React, Next.js, Framer Motion"
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border bg-transparent outline-none focus:border-[var(--sb-accent)]"
                  style={{
                    borderColor: "var(--card-border)",
                    color: "var(--page-ink)",
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-[var(--sb-ink-muted)] mb-1 block">
                    GitHub Repository URL
                  </label>
                  <input
                    type="url"
                    value={projGithub}
                    onChange={(e) => setProjGithub(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border bg-transparent outline-none focus:border-[var(--sb-accent)]"
                    style={{
                      borderColor: "var(--card-border)",
                      color: "var(--page-ink)",
                    }}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[var(--sb-ink-muted)] mb-1 block">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={projDemo}
                    onChange={(e) => setProjDemo(e.target.value)}
                    placeholder="https://..."
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border bg-transparent outline-none focus:border-[var(--sb-accent)]"
                    style={{
                      borderColor: "var(--card-border)",
                      color: "var(--page-ink)",
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end mt-2">
                <Button
                  size="xs"
                  type="submit"
                  style={{
                    background: "var(--sb-accent)",
                    color: "var(--sb-accent-foreground)",
                  }}
                >
                  Add Project
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  type="button"
                  onClick={() => setShowProjModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Research Add Modal */}
      {showResModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
          <div
            className="w-full max-w-lg rounded-2xl border p-5 flex flex-col gap-4 shadow-xl"
            style={{
              background: "var(--card-bg)",
              borderColor: "var(--card-border)",
            }}
          >
            <h3
              className="text-base font-bold"
              style={{
                color: "var(--page-ink)",
                fontFamily: "'Fraunces', Georgia, serif",
              }}
            >
              Add Research Publication
            </h3>
            <form
              onSubmit={handleAddResearch}
              className="flex flex-col gap-3.5 text-sm"
            >
              <div>
                <label className="text-[11px] font-semibold text-[var(--sb-ink-muted)] mb-1 block">
                  Publication / Report Title
                </label>
                <input
                  type="text"
                  required
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  placeholder="e.g. AI-First Learning Models in CS Curriculums"
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border bg-transparent outline-none focus:border-[var(--sb-accent)]"
                  style={{
                    borderColor: "var(--card-border)",
                    color: "var(--page-ink)",
                  }}
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--sb-ink-muted)] mb-1 block">
                  Summary
                </label>
                <textarea
                  required
                  value={resSummary}
                  onChange={(e) => setResSummary(e.target.value)}
                  placeholder="Briefly summarize the findings, research methodology, or conclusions..."
                  rows={3}
                  className="w-full text-xs px-2.5 py-2 rounded-lg border bg-transparent outline-none focus:border-[var(--sb-accent)] resize-none"
                  style={{
                    borderColor: "var(--card-border)",
                    color: "var(--page-ink)",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-[var(--sb-ink-muted)] mb-1 block">
                    Publication Date
                  </label>
                  <input
                    type="text"
                    value={resDate}
                    onChange={(e) => setResDate(e.target.value)}
                    placeholder="e.g. Oct 2025"
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border bg-transparent outline-none focus:border-[var(--sb-accent)]"
                    style={{
                      borderColor: "var(--card-border)",
                      color: "var(--page-ink)",
                    }}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[var(--sb-ink-muted)] mb-1 block">
                    Article / File Link
                  </label>
                  <input
                    type="url"
                    value={resLink}
                    onChange={(e) => setResLink(e.target.value)}
                    placeholder="https://..."
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border bg-transparent outline-none focus:border-[var(--sb-accent)]"
                    style={{
                      borderColor: "var(--card-border)",
                      color: "var(--page-ink)",
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end mt-2">
                <Button
                  size="xs"
                  type="submit"
                  style={{
                    background: "var(--sb-accent)",
                    color: "var(--sb-accent-foreground)",
                  }}
                >
                  Add Research
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  type="button"
                  onClick={() => setShowResModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
