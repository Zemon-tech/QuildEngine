import { useState, useRef } from "react";
import {
  MapPin,
  Globe,
  Github,
  Linkedin,
  Edit2,
  Mail,
  FileText,
  Upload,
  Download,
  Eye,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { Button } from "#/components/ui/button";

interface ProfileHeaderProps {
  data: {
    name: string;
    headline: string;
    location: string;
    website: string;
    github: string;
    linkedin: string;
    email: string;
    resumeName: string | null;
  };
  onUpdate: (fields: Partial<ProfileHeaderProps["data"]>) => void;
  onPreviewResume: () => void;
}

export function ProfileHeader({ data, onUpdate, onPreviewResume }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(data.name);
  const [editHeadline, setEditHeadline] = useState(data.headline);
  const [editLocation, setEditLocation] = useState(data.location);
  const [editWebsite, setEditWebsite] = useState(data.website);
  const [editGithub, setEditGithub] = useState(data.github);
  const [editLinkedin, setEditLinkedin] = useState(data.linkedin);

  // Resume upload state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleSave() {
    onUpdate({
      name: editName,
      headline: editHeadline,
      location: editLocation,
      website: editWebsite,
      github: editGithub,
      linkedin: editLinkedin,
    });
    setIsEditing(false);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(10);

    const interval = setInterval(() => {
      setUploadProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onUpdate({ resumeName: file.name });
            setUploading(false);
            setUploadProgress(0);
          }, 300);
          return 100;
        }
        return p + 20;
      });
    }, 150);
  }

  function handleDownloadResume() {
    if (!data.resumeName) return;
    
    // Simulate resume download
    const link = document.createElement("a");
    link.href = "#";
    link.download = data.resumeName;
    document.body.appendChild(link);
    // In demo, we just alert or show a clean visual feedback
    const originalText = data.resumeName;
    alert(`Downloading ${originalText}...`);
    document.body.removeChild(link);
  }

  return (
    <div
      className="relative overflow-hidden rounded-2xl border"
      style={{
        background: "var(--card-bg)",
        borderColor: "var(--card-border)",
      }}
    >
      {/* Cover Banner */}
      <div
        className="h-36 w-full relative"
        style={{
          background: "linear-gradient(135deg, var(--sb-accent) 0%, oklch(0.25 0.05 200) 100%)",
          opacity: 0.85,
        }}
      >
        {/* Subtle grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-10" 
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "20px 20px"
          }}
        />
      </div>

      {/* Profile info section */}
      <div className="px-6 pb-6 pt-0 relative flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        {/* Avatar overlay */}
        <div className="relative -mt-16 z-10 size-28 rounded-full border-4 overflow-hidden shrink-0" style={{ borderColor: "var(--card-bg)" }}>
          <Avatar className="size-full">
            <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" alt={data.name} />
            <AvatarFallback className="text-xl font-bold bg-[var(--sb-accent-glow)] text-[var(--sb-accent)]">
              {data.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 mt-2 md:mt-0">
          {!isEditing ? (
            <div>
              <div className="flex items-center gap-2">
                <h1
                  className="text-2xl font-bold tracking-tight truncate"
                  style={{ color: "var(--page-ink)", fontFamily: "'Fraunces', Georgia, serif" }}
                >
                  {data.name}
                </h1>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="p-1 rounded-md hover:bg-[var(--sb-bg-hover)] text-[var(--sb-ink-muted)] transition-colors"
                  title="Edit Profile Details"
                >
                  <Edit2 size={14} />
                </button>
              </div>

              <p className="text-sm font-medium mt-0.5" style={{ color: "var(--sb-ink)" }}>
                {data.headline}
              </p>

              {/* Badges/Details row */}
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-xs" style={{ color: "var(--sb-ink-muted)" }}>
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-[var(--sb-ink-dim)]" />
                  {data.location}
                </span>
                {data.website && (
                  <a
                    href={data.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 hover:underline hover:text-[var(--sb-accent)]"
                  >
                    <Globe size={13} className="text-[var(--sb-ink-dim)]" />
                    Portfolio
                  </a>
                )}
                <span className="flex items-center gap-1">
                  <Mail size={13} className="text-[var(--sb-ink-dim)]" />
                  {data.email}
                </span>
              </div>

              {/* Social links */}
              <div className="flex items-center gap-2 mt-4">
                {data.github && (
                  <a
                    href={data.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-md border hover:bg-[var(--sb-bg-hover)] text-[var(--sb-ink-muted)] hover:text-[var(--sb-ink)] transition-all"
                    style={{ borderColor: "var(--card-border)" }}
                  >
                    <Github size={15} />
                  </a>
                )}
                {data.linkedin && (
                  <a
                    href={data.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-md border hover:bg-[var(--sb-bg-hover)] text-[var(--sb-ink-muted)] hover:text-[var(--sb-ink)] transition-all"
                    style={{ borderColor: "var(--card-border)" }}
                  >
                    <Linkedin size={15} />
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-w-xl">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-[var(--sb-ink-muted)]">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full text-sm px-2.5 py-1.5 rounded-lg border bg-transparent outline-none focus:border-[var(--sb-accent)]"
                    style={{ borderColor: "var(--card-border)", color: "var(--page-ink)" }}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[var(--sb-ink-muted)]">Location</label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full text-sm px-2.5 py-1.5 rounded-lg border bg-transparent outline-none focus:border-[var(--sb-accent)]"
                    style={{ borderColor: "var(--card-border)", color: "var(--page-ink)" }}
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--sb-ink-muted)]">Headline</label>
                <input
                  type="text"
                  value={editHeadline}
                  onChange={(e) => setEditHeadline(e.target.value)}
                  className="w-full text-sm px-2.5 py-1.5 rounded-lg border bg-transparent outline-none focus:border-[var(--sb-accent)]"
                  style={{ borderColor: "var(--card-border)", color: "var(--page-ink)" }}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-[var(--sb-ink-muted)]">Website</label>
                  <input
                    type="text"
                    value={editWebsite}
                    onChange={(e) => setEditWebsite(e.target.value)}
                    className="w-full text-xs px-2 py-1.5 rounded-lg border bg-transparent outline-none focus:border-[var(--sb-accent)]"
                    style={{ borderColor: "var(--card-border)", color: "var(--page-ink)" }}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[var(--sb-ink-muted)]">GitHub</label>
                  <input
                    type="text"
                    value={editGithub}
                    onChange={(e) => setEditGithub(e.target.value)}
                    className="w-full text-xs px-2 py-1.5 rounded-lg border bg-transparent outline-none focus:border-[var(--sb-accent)]"
                    style={{ borderColor: "var(--card-border)", color: "var(--page-ink)" }}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[var(--sb-ink-muted)]">LinkedIn</label>
                  <input
                    type="text"
                    value={editLinkedin}
                    onChange={(e) => setEditLinkedin(e.target.value)}
                    className="w-full text-xs px-2 py-1.5 rounded-lg border bg-transparent outline-none focus:border-[var(--sb-accent)]"
                    style={{ borderColor: "var(--card-border)", color: "var(--page-ink)" }}
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                <Button size="xs" onClick={handleSave} style={{ background: "var(--sb-accent)", color: "var(--sb-accent-foreground)" }}>
                  Save Changes
                </Button>
                <Button size="xs" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Resume Actions Container */}
        <div className="flex flex-col gap-2 shrink-0 md:self-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            className="hidden"
          />

          {data.resumeName ? (
            <div className="flex flex-col gap-2 p-3 rounded-xl border" style={{ borderColor: "var(--card-border)" }}>
              <div className="flex items-center gap-2">
                <FileText size={15} className="text-[var(--sb-accent)]" />
                <div className="min-w-0 max-w-[150px]">
                  <p className="text-xs font-semibold truncate" style={{ color: "var(--sb-ink)" }}>
                    {data.resumeName}
                  </p>
                  <p className="text-[10px] text-[var(--sb-ink-dim)]">PDF document</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 mt-1">
                <Button size="xs" variant="ghost" onClick={onPreviewResume} className="h-7 px-2 text-[11px]">
                  <Eye size={12} className="mr-1" />
                  View
                </Button>
                <Button size="xs" variant="ghost" onClick={handleDownloadResume} className="h-7 px-2 text-[11px]">
                  <Download size={12} className="mr-1" />
                  Get
                </Button>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-7 px-2 text-[11px] text-destructive hover:text-destructive"
                >
                  <Upload size={12} className="mr-1" />
                  New
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="gap-2 text-[13px] border hover:bg-[var(--sb-bg-hover)]"
              style={{ borderColor: "var(--card-border)" }}
            >
              {uploading ? (
                <>
                  <Loader2 size={14} className="animate-spin text-[var(--sb-accent)]" />
                  <span>Uploading {uploadProgress}%</span>
                </>
              ) : (
                <>
                  <Upload size={14} className="text-[var(--sb-ink-muted)]" />
                  <span>Upload Resume</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
