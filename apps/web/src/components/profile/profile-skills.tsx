import { Award, ExternalLink, Hammer, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";

export interface CertItem {
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

interface ProfileSkillsProps {
  skills: {
    technical: string[];
    soft: string[];
    tooling: string[];
  };
  certifications: CertItem[];
  onUpdateSkills: (skills: ProfileSkillsProps["skills"]) => void;
  onUpdateCertifications: (certs: CertItem[]) => void;
}

export function ProfileSkills({
  skills,
  certifications,
  onUpdateSkills,
  onUpdateCertifications,
}: ProfileSkillsProps) {
  // Modal states
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);

  // Skill form state
  const [skillName, setSkillName] = useState("");
  const [skillCategory, setSkillCategory] = useState<
    "technical" | "soft" | "tooling"
  >("technical");

  // Cert form state
  const [certName, setCertName] = useState("");
  const [certIssuer, setCertIssuer] = useState("");
  const [certDate, setCertDate] = useState("");
  const [certUrl, setCertUrl] = useState("");

  function handleAddSkill(e: React.FormEvent) {
    e.preventDefault();
    const name = skillName.trim();
    if (!name) return;

    const currentList = skills[skillCategory];
    if (!currentList.includes(name)) {
      onUpdateSkills({
        ...skills,
        [skillCategory]: [...currentList, name],
      });
    }

    setSkillName("");
    setShowSkillModal(false);
  }

  function handleRemoveSkill(
    category: "technical" | "soft" | "tooling",
    name: string,
  ) {
    onUpdateSkills({
      ...skills,
      [category]: skills[category].filter((s) => s !== name),
    });
  }

  function handleAddCert(e: React.FormEvent) {
    e.preventDefault();
    if (!certName || !certIssuer || !certDate) return;

    const newItem: CertItem = {
      name: certName,
      issuer: certIssuer,
      date: certDate,
      credentialUrl: certUrl.trim() || undefined,
    };

    onUpdateCertifications([newItem, ...certifications]);

    // Reset Form
    setCertName("");
    setCertIssuer("");
    setCertDate("");
    setCertUrl("");
    setShowCertModal(false);
  }

  function handleRemoveCert(index: number) {
    onUpdateCertifications(certifications.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Skills Card */}
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
            <Hammer size={17} className="text-[var(--sb-accent)]" />
            Skills & Expertise
          </h2>
          <Button
            size="xs"
            variant="outline"
            onClick={() => setShowSkillModal(true)}
            className="gap-1 text-xs border"
          >
            <Plus size={13} />
            <span>Add Skill</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Technical Skills */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--sb-ink-dim)]">
              Technical & Languages
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skills.technical.length === 0 ? (
                <span className="text-xs text-[var(--sb-ink-muted)]">
                  No skills listed.
                </span>
              ) : (
                skills.technical.map((s) => (
                  <span
                    key={s}
                    className="group flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full border bg-[var(--page-bg)]"
                    style={{
                      borderColor: "var(--card-border)",
                      color: "var(--sb-ink)",
                    }}
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill("technical", s)}
                      className="text-destructive font-bold hover:scale-110 ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Soft Skills */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--sb-ink-dim)]">
              Soft Skills & Leadership
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skills.soft.length === 0 ? (
                <span className="text-xs text-[var(--sb-ink-muted)]">
                  No skills listed.
                </span>
              ) : (
                skills.soft.map((s) => (
                  <span
                    key={s}
                    className="group flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full border bg-[var(--page-bg)]"
                    style={{
                      borderColor: "var(--card-border)",
                      color: "var(--sb-ink)",
                    }}
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill("soft", s)}
                      className="text-destructive font-bold hover:scale-110 ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Tooling */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--sb-ink-dim)]">
              Tools, Git & DevOps
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skills.tooling.length === 0 ? (
                <span className="text-xs text-[var(--sb-ink-muted)]">
                  No tools listed.
                </span>
              ) : (
                skills.tooling.map((s) => (
                  <span
                    key={s}
                    className="group flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full border bg-[var(--page-bg)]"
                    style={{
                      borderColor: "var(--card-border)",
                      color: "var(--sb-ink)",
                    }}
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill("tooling", s)}
                      className="text-destructive font-bold hover:scale-110 ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Certifications Card */}
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
            <Award size={17} className="text-[var(--sb-accent)]" />
            Certifications
          </h2>
          <Button
            size="xs"
            variant="outline"
            onClick={() => setShowCertModal(true)}
            className="gap-1 text-xs border"
          >
            <Plus size={13} />
            <span>Add Certificate</span>
          </Button>
        </div>

        {certifications.length === 0 ? (
          <p className="text-sm text-[var(--sb-ink-muted)] text-center py-4">
            No certifications earned yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certifications.map((cert, index) => (
              <div
                key={`${cert.name}-${index}`}
                className="group relative p-4 rounded-xl border flex flex-col gap-1.5 text-[13px] transition-all hover:shadow-xs"
                style={{
                  background: "var(--page-bg)",
                  borderColor: "var(--card-border)",
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3
                      className="font-semibold text-sm"
                      style={{ color: "var(--sb-ink)" }}
                    >
                      {cert.name}
                    </h3>
                    <p
                      className="font-medium text-xs mt-0.5 animate-fade-in"
                      style={{ color: "var(--sb-ink-muted)" }}
                    >
                      {cert.issuer}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className="text-[11px]"
                      style={{ color: "var(--sb-ink-dim)" }}
                    >
                      {cert.date}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCert(index)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-destructive hover:scale-105 transition-all"
                      title="Delete certificate"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-medium hover:underline text-[var(--sb-accent)] mt-1"
                  >
                    <ExternalLink size={12} />
                    Verify Credential
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Skill Add Modal */}
      {showSkillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
          <div
            className="w-full max-w-sm rounded-2xl border p-5 flex flex-col gap-4 shadow-xl"
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
              Add Skill
            </h3>
            <form
              onSubmit={handleAddSkill}
              className="flex flex-col gap-3.5 text-sm"
            >
              <div>
                <label className="text-[11px] font-semibold text-[var(--sb-ink-muted)] mb-1 block">
                  Skill Name
                </label>
                <input
                  type="text"
                  required
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="e.g. TypeScript"
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border bg-transparent outline-none focus:border-[var(--sb-accent)]"
                  style={{
                    borderColor: "var(--card-border)",
                    color: "var(--page-ink)",
                  }}
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--sb-ink-muted)] mb-1 block">
                  Category
                </label>
                <select
                  value={skillCategory}
                  onChange={(e) => setSkillCategory(e.target.value as any)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border bg-transparent outline-none focus:border-[var(--sb-accent)]"
                  style={{
                    borderColor: "var(--card-border)",
                    color: "var(--page-ink)",
                    background: "var(--card-bg)",
                  }}
                >
                  <option value="technical">Technical & Languages</option>
                  <option value="soft">Soft Skills & Leadership</option>
                  <option value="tooling">Tools, Git & DevOps</option>
                </select>
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
                  Add Skill
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  type="button"
                  onClick={() => setShowSkillModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Add Modal */}
      {showCertModal && (
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
              Add Certification
            </h3>
            <form
              onSubmit={handleAddCert}
              className="flex flex-col gap-3.5 text-sm"
            >
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-[var(--sb-ink-muted)] mb-1 block">
                    Certificate Name
                  </label>
                  <input
                    type="text"
                    required
                    value={certName}
                    onChange={(e) => setCertName(e.target.value)}
                    placeholder="e.g. AWS Solutions Architect"
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border bg-transparent outline-none focus:border-[var(--sb-accent)]"
                    style={{
                      borderColor: "var(--card-border)",
                      color: "var(--page-ink)",
                    }}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[var(--sb-ink-muted)] mb-1 block">
                    Issuing Organization
                  </label>
                  <input
                    type="text"
                    required
                    value={certIssuer}
                    onChange={(e) => setCertIssuer(e.target.value)}
                    placeholder="e.g. Amazon Web Services"
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border bg-transparent outline-none focus:border-[var(--sb-accent)]"
                    style={{
                      borderColor: "var(--card-border)",
                      color: "var(--page-ink)",
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-[var(--sb-ink-muted)] mb-1 block">
                    Issue Date
                  </label>
                  <input
                    type="text"
                    required
                    value={certDate}
                    onChange={(e) => setCertDate(e.target.value)}
                    placeholder="e.g. Nov 2025"
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border bg-transparent outline-none focus:border-[var(--sb-accent)]"
                    style={{
                      borderColor: "var(--card-border)",
                      color: "var(--page-ink)",
                    }}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[var(--sb-ink-muted)] mb-1 block">
                    Credential URL
                  </label>
                  <input
                    type="url"
                    value={certUrl}
                    onChange={(e) => setCertUrl(e.target.value)}
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
                  Add Certification
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  type="button"
                  onClick={() => setShowCertModal(false)}
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
