import { useState } from "react";
import { Briefcase, GraduationCap, Plus, Trash2, BookOpen, Award } from "lucide-react";
import { Button } from "#/components/ui/button";

export interface ExperienceItem {
  company: string;
  role: string;
  type: string;
  duration: string;
  description: string;
  tech: string[];
}

export interface EducationItem {
  school: string;
  degree: string;
  duration: string;
  gpa: string;
  courses: string;
}

interface ProfileExperienceProps {
  experience: ExperienceItem[];
  education: EducationItem[];
  onUpdateExperience: (items: ExperienceItem[]) => void;
  onUpdateEducation: (items: EducationItem[]) => void;
}

export function ProfileExperience({
  experience,
  education,
  onUpdateExperience,
  onUpdateEducation,
}: ProfileExperienceProps) {
  // Modal states
  const [showExpModal, setShowExpModal] = useState(false);
  const [showEduModal, setShowEduModal] = useState(false);

  // Experience form state
  const [expCompany, setExpCompany] = useState("");
  const [expRole, setExpRole] = useState("");
  const [expType, setExpType] = useState("Full-time");
  const [expDuration, setExpDuration] = useState("");
  const [expDesc, setExpDesc] = useState("");
  const [expTechInput, setExpTechInput] = useState("");

  // Education form state
  const [eduSchool, setEduSchool] = useState("");
  const [eduDegree, setEduDegree] = useState("");
  const [eduDuration, setEduDuration] = useState("");
  const [eduGpa, setEduGpa] = useState("");
  const [eduCourses, setEduCourses] = useState("");

  function handleAddExperience(e: React.FormEvent) {
    e.preventDefault();
    if (!expCompany || !expRole || !expDuration) return;

    const newItem: ExperienceItem = {
      company: expCompany,
      role: expRole,
      type: expType,
      duration: expDuration,
      description: expDesc,
      tech: expTechInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
    };

    onUpdateExperience([newItem, ...experience]);
    
    // Reset Form
    setExpCompany("");
    setExpRole("");
    setExpType("Full-time");
    setExpDuration("");
    setExpDesc("");
    setExpTechInput("");
    setShowExpModal(false);
  }

  function handleAddEducation(e: React.FormEvent) {
    e.preventDefault();
    if (!eduSchool || !eduDegree || !eduDuration) return;

    const newItem: EducationItem = {
      school: eduSchool,
      degree: eduDegree,
      duration: eduDuration,
      gpa: eduGpa,
      courses: eduCourses,
    };

    onUpdateEducation([newItem, ...education]);

    // Reset Form
    setEduSchool("");
    setEduDegree("");
    setEduDuration("");
    setEduGpa("");
    setEduCourses("");
    setShowEduModal(false);
  }

  function handleRemoveExperience(index: number) {
    onUpdateExperience(experience.filter((_, i) => i !== index));
  }

  function handleRemoveEducation(index: number) {
    onUpdateEducation(education.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Work Experience Card */}
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
            style={{ color: "var(--page-ink)", fontFamily: "'Fraunces', Georgia, serif" }}
          >
            <Briefcase size={16} className="text-[var(--sb-accent)]" />
            Experience
          </h2>
          <Button
            size="xs"
            variant="outline"
            onClick={() => setShowExpModal(true)}
            className="gap-1 text-xs border"
          >
            <Plus size={13} />
            <span>Add Role</span>
          </Button>
        </div>

        {experience.length === 0 ? (
          <p className="text-sm text-[var(--sb-ink-muted)] text-center py-4">No experience items added yet.</p>
        ) : (
          <div className="flex flex-col gap-6 relative pl-4 border-l" style={{ borderColor: "var(--card-border)" }}>
            {experience.map((item, index) => (
              <div key={`${item.company}-${item.role}-${index}`} className="relative group flex flex-col gap-1 text-[13px]">
                {/* Timeline node */}
                <div
                  className="absolute -left-[21px] top-1.5 size-2.5 rounded-full border bg-[var(--card-bg)]"
                  style={{ borderColor: "var(--sb-accent)" }}
                />

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-sm" style={{ color: "var(--sb-ink)" }}>
                      {item.role}
                    </h3>
                    <p className="font-medium text-xs mt-0.5" style={{ color: "var(--sb-ink-muted)" }}>
                      {item.company} · {item.type}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px]" style={{ color: "var(--sb-ink-dim)" }}>
                      {item.duration}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExperience(index)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-destructive hover:scale-105 transition-all"
                      title="Delete experience"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <p className="mt-1 leading-relaxed" style={{ color: "var(--sb-ink)" }}>
                  {item.description}
                </p>

                {item.tech && item.tech.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 text-[10px] font-medium rounded bg-[var(--sb-bg-hover)] border"
                        style={{ borderColor: "var(--card-border)", color: "var(--sb-ink-muted)" }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Education Card */}
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
            style={{ color: "var(--page-ink)", fontFamily: "'Fraunces', Georgia, serif" }}
          >
            <GraduationCap size={17} className="text-[var(--sb-accent)]" />
            Education
          </h2>
          <Button
            size="xs"
            variant="outline"
            onClick={() => setShowEduModal(true)}
            className="gap-1 text-xs border"
          >
            <Plus size={13} />
            <span>Add Education</span>
          </Button>
        </div>

        {education.length === 0 ? (
          <p className="text-sm text-[var(--sb-ink-muted)] text-center py-4">No education history added yet.</p>
        ) : (
          <div className="flex flex-col gap-6 relative pl-4 border-l" style={{ borderColor: "var(--card-border)" }}>
            {education.map((item, index) => (
              <div key={`${item.school}-${item.degree}-${index}`} className="relative group flex flex-col gap-1 text-[13px]">
                {/* Timeline node */}
                <div
                  className="absolute -left-[21px] top-1.5 size-2.5 rounded-full border bg-[var(--card-bg)]"
                  style={{ borderColor: "var(--sb-accent)" }}
                />

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-sm" style={{ color: "var(--sb-ink)" }}>
                      {item.school}
                    </h3>
                    <p className="font-medium text-xs mt-0.5" style={{ color: "var(--sb-ink-muted)" }}>
                      {item.degree}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px]" style={{ color: "var(--sb-ink-dim)" }}>
                      {item.duration}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(index)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-destructive hover:scale-105 transition-all"
                      title="Delete education"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1 mt-1 text-xs" style={{ color: "var(--sb-ink-muted)" }}>
                  {item.gpa && (
                    <span className="flex items-center gap-1">
                      <Award size={12} className="text-[var(--sb-ink-dim)]" />
                      GPA: <b>{item.gpa}</b>
                    </span>
                  )}
                  {item.courses && (
                    <span className="flex items-start gap-1">
                      <BookOpen size={12} className="text-[var(--sb-ink-dim)] mt-0.5 shrink-0" />
                      <span>Relevant Coursework: {item.courses}</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Experience Add Modal */}
      {showExpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
          <div
            className="w-full max-w-lg rounded-2xl border p-5 flex flex-col gap-4 shadow-xl"
            style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
          >
            <h3
              className="text-base font-bold"
              style={{ color: "var(--page-ink)", fontFamily: "'Fraunces', Georgia, serif" }}
            >
              Add Work Experience
            </h3>
            <form onSubmit={handleAddExperience} className="flex flex-col gap-3.5 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-[var(--sb-ink-muted)] mb-1 block">Company Name</label>
                  <input
                    type="text"
                    required
                    value={expCompany}
                    onChange={(e) => setExpCompany(e.target.value)}
                    placeholder="e.g. Google"
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border bg-transparent outline-none focus:border-[var(--sb-accent)]"
                    style={{ borderColor: "var(--card-border)", color: "var(--page-ink)" }}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[var(--sb-ink-muted)] mb-1 block">Role / Title</label>
                  <input
                    type="text"
                    required
                    value={expRole}
                    onChange={(e) => setExpRole(e.target.value)}
                    placeholder="e.g. Software Engineer Intern"
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border bg-transparent outline-none focus:border-[var(--sb-accent)]"
                    style={{ borderColor: "var(--card-border)", color: "var(--page-ink)" }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-[var(--sb-ink-muted)] mb-1 block">Employment Type</label>
                  <select
                    value={expType}
                    onChange={(e) => setExpType(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border bg-transparent outline-none focus:border-[var(--sb-accent)]"
                    style={{ borderColor: "var(--card-border)", color: "var(--page-ink)", background: "var(--card-bg)" }}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[var(--sb-ink-muted)] mb-1 block">Duration</label>
                  <input
                    type="text"
                    required
                    value={expDuration}
                    onChange={(e) => setExpDuration(e.target.value)}
                    placeholder="e.g. Jun 2025 - Present"
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border bg-transparent outline-none focus:border-[var(--sb-accent)]"
                    style={{ borderColor: "var(--card-border)", color: "var(--page-ink)" }}
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--sb-ink-muted)] mb-1 block">Role Description</label>
                <textarea
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  placeholder="Describe your responsibilities, metrics achieved..."
                  rows={3}
                  className="w-full text-xs px-2.5 py-2 rounded-lg border bg-transparent outline-none focus:border-[var(--sb-accent)] resize-none"
                  style={{ borderColor: "var(--card-border)", color: "var(--page-ink)", fontFamily: "inherit" }}
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--sb-ink-muted)] mb-1 block">Technologies Used (comma separated)</label>
                <input
                  type="text"
                  value={expTechInput}
                  onChange={(e) => setExpTechInput(e.target.value)}
                  placeholder="e.g. React, Next.js, Python, OKLCH"
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border bg-transparent outline-none focus:border-[var(--sb-accent)]"
                  style={{ borderColor: "var(--card-border)", color: "var(--page-ink)" }}
                />
              </div>

              <div className="flex gap-2 justify-end mt-2">
                <Button size="xs" type="submit" style={{ background: "var(--sb-accent)", color: "var(--sb-accent-foreground)" }}>
                  Add Experience
                </Button>
                <Button size="xs" variant="outline" type="button" onClick={() => setShowExpModal(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Education Add Modal */}
      {showEduModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
          <div
            className="w-full max-w-lg rounded-2xl border p-5 flex flex-col gap-4 shadow-xl"
            style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
          >
            <h3
              className="text-base font-bold"
              style={{ color: "var(--page-ink)", fontFamily: "'Fraunces', Georgia, serif" }}
            >
              Add Education Details
            </h3>
            <form onSubmit={handleAddEducation} className="flex flex-col gap-3.5 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-[var(--sb-ink-muted)] mb-1 block">School / University</label>
                  <input
                    type="text"
                    required
                    value={eduSchool}
                    onChange={(e) => setEduSchool(e.target.value)}
                    placeholder="e.g. Stanford University"
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border bg-transparent outline-none focus:border-[var(--sb-accent)]"
                    style={{ borderColor: "var(--card-border)", color: "var(--page-ink)" }}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[var(--sb-ink-muted)] mb-1 block">Degree / Major</label>
                  <input
                    type="text"
                    required
                    value={eduDegree}
                    onChange={(e) => setEduDegree(e.target.value)}
                    placeholder="e.g. B.S. in Computer Science"
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border bg-transparent outline-none focus:border-[var(--sb-accent)]"
                    style={{ borderColor: "var(--card-border)", color: "var(--page-ink)" }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-[var(--sb-ink-muted)] mb-1 block">Duration</label>
                  <input
                    type="text"
                    required
                    value={eduDuration}
                    onChange={(e) => setEduDuration(e.target.value)}
                    placeholder="e.g. 2021 - 2025"
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border bg-transparent outline-none focus:border-[var(--sb-accent)]"
                    style={{ borderColor: "var(--card-border)", color: "var(--page-ink)" }}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[var(--sb-ink-muted)] mb-1 block">CGPA / Grade</label>
                  <input
                    type="text"
                    value={eduGpa}
                    onChange={(e) => setEduGpa(e.target.value)}
                    placeholder="e.g. 3.92 / 4.0"
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border bg-transparent outline-none focus:border-[var(--sb-accent)]"
                    style={{ borderColor: "var(--card-border)", color: "var(--page-ink)" }}
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--sb-ink-muted)] mb-1 block">Relevant Coursework</label>
                <textarea
                  value={eduCourses}
                  onChange={(e) => setEduCourses(e.target.value)}
                  placeholder="e.g. Data Structures, Analysis of Algorithms, Databases, Machine Learning..."
                  rows={2}
                  className="w-full text-xs px-2.5 py-2 rounded-lg border bg-transparent outline-none focus:border-[var(--sb-accent)] resize-none"
                  style={{ borderColor: "var(--card-border)", color: "var(--page-ink)", fontFamily: "inherit" }}
                />
              </div>

              <div className="flex gap-2 justify-end mt-2">
                <Button size="xs" type="submit" style={{ background: "var(--sb-accent)", color: "var(--sb-accent-foreground)" }}>
                  Add Education
                </Button>
                <Button size="xs" variant="outline" type="button" onClick={() => setShowEduModal(false)}>
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
