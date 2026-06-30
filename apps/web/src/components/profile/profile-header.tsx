import {
  Download,
  Edit2,
  Eye,
  FileText,
  Github,
  Globe,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";

interface ProfileHeaderProps {
  data: {
    name: string;
    headline: string;
    location: string;
    website: string;
    github: string;
    linkedin: string;
    leetcode: string;
    email: string;
    resumeName: string | null;
  };
  onUpdate: (fields: Partial<ProfileHeaderProps["data"]>) => void;
  onPreviewResume: () => void;
}

export function ProfileHeader({
  data,
  onUpdate,
  onPreviewResume,
}: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(data.name);
  const [editHeadline, setEditHeadline] = useState(data.headline);
  const [editLocation, setEditLocation] = useState(data.location);
  const [editWebsite, setEditWebsite] = useState(data.website);
  const [editGithub, setEditGithub] = useState(data.github);
  const [editLinkedin, setEditLinkedin] = useState(data.linkedin);
  const [editLeetcode, setEditLeetcode] = useState(data.leetcode);

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
      leetcode: editLeetcode,
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
    <div className="relative overflow-hidden rounded-2xl border border-card-border bg-card-bg">
      {/* Cover Banner */}
      <div
        className="h-36 w-full relative"
        style={{
          background:
            "linear-gradient(135deg, var(--sb-accent) 0%, oklch(0.25 0.05 200) 100%)",
          opacity: 0.85,
        }}
      >
        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      {/* Profile info section */}
      <div className="px-6 pb-6 pt-0 relative flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        {/* Avatar overlay */}
        <div className="relative -mt-16 z-10 size-28 rounded-full border-4 border-card-bg overflow-hidden shrink-0">
          <Avatar className="size-full">
            <AvatarImage
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
              alt={data.name}
            />
            <AvatarFallback className="text-xl font-bold bg-[var(--sb-accent-glow)] text-[var(--sb-accent)]">
              {data.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 mt-2 md:mt-0">
          {!isEditing ? (
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight truncate text-page-ink font-serif">
                  {data.name}
                </h1>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="p-1 rounded-md hover:bg-sb-bg-hover text-sb-ink-muted transition-colors"
                  title="Edit Profile Details"
                >
                  <Edit2 size={14} />
                </button>
              </div>

              <p className="text-sm font-medium mt-0.5 text-sb-ink">
                {data.headline}
              </p>

              {/* Badges/Details row */}
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-xs text-sb-ink-muted">
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-sb-ink-dim" />
                  {data.location}
                </span>
                {data.website && (
                  <a
                    href={data.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 hover:underline hover:text-sb-accent"
                  >
                    <Globe size={13} className="text-sb-ink-dim" />
                    Portfolio
                  </a>
                )}
                <span className="flex items-center gap-1">
                  <Mail size={13} className="text-sb-ink-dim" />
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
                    className="p-2 rounded-md border border-card-border hover:bg-sb-bg-hover text-sb-ink-muted hover:text-sb-ink transition-all"
                  >
                    <Github size={15} />
                  </a>
                )}
                {data.linkedin && (
                  <a
                    href={data.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-md border border-card-border hover:bg-sb-bg-hover text-sb-ink-muted hover:text-sb-ink transition-all"
                  >
                    <Linkedin size={15} />
                  </a>
                )}
                {data.leetcode && (
                  <a
                    href={data.leetcode}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-md border border-card-border hover:bg-sb-bg-hover text-sb-ink-muted hover:text-sb-ink transition-all"
                    title="LeetCode Profile"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width={15}
                      height={15}
                      fill="currentColor"
                    >
                      <path d="M13.483 0a1.374 1.374 0 0 0-.961.414l-9.777 9.778a1.375 1.375 0 0 0 0 1.943l1.157 1.157a1.375 1.375 0 0 0 1.943 0L14.9 4.257l.007-.007a1.35 1.35 0 0 1 1.912 0l1.354 1.354a1.343 1.343 0 0 1 0 1.911l-9.712 9.713a1.378 1.378 0 0 0-.353.597L7.02 21.61a1.35 1.35 0 0 0 1.637 1.637l3.782-1.092a1.378 1.378 0 0 0 .597-.353l9.713-9.712a1.379 1.379 0 0 0 0-1.943l-8.304-8.304A1.365 1.365 0 0 0 13.483 0z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-w-xl">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-sb-ink-muted">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="h-8 border-card-border text-page-ink focus-visible:ring-sb-accent/20"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-sb-ink-muted">
                    Location
                  </label>
                  <Input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="h-8 border-card-border text-page-ink focus-visible:ring-sb-accent/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-sb-ink-muted">
                  Headline
                </label>
                <Input
                  type="text"
                  value={editHeadline}
                  onChange={(e) => setEditHeadline(e.target.value)}
                  className="h-8 border-card-border text-page-ink focus-visible:ring-sb-accent/20"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-sb-ink-muted">
                    Website
                  </label>
                  <Input
                    type="text"
                    value={editWebsite}
                    onChange={(e) => setEditWebsite(e.target.value)}
                    className="h-8 border-card-border text-page-ink focus-visible:ring-sb-accent/20"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-sb-ink-muted">
                    GitHub
                  </label>
                  <Input
                    type="text"
                    value={editGithub}
                    onChange={(e) => setEditGithub(e.target.value)}
                    className="h-8 border-card-border text-page-ink focus-visible:ring-sb-accent/20"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-sb-ink-muted">
                    LinkedIn
                  </label>
                  <Input
                    type="text"
                    value={editLinkedin}
                    onChange={(e) => setEditLinkedin(e.target.value)}
                    className="h-8 border-card-border text-page-ink focus-visible:ring-sb-accent/20"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-sb-ink-muted">
                    LeetCode
                  </label>
                  <Input
                    type="text"
                    value={editLeetcode}
                    onChange={(e) => setEditLeetcode(e.target.value)}
                    className="h-8 border-card-border text-page-ink focus-visible:ring-sb-accent/20"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                <Button
                  size="xs"
                  onClick={handleSave}
                  className="bg-sb-accent text-sb-accent-foreground"
                >
                  Save Changes
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
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
            <div className="flex flex-col gap-2 p-3 rounded-xl border border-card-border">
              <div className="flex items-center gap-2">
                <FileText size={15} className="text-sb-accent" />
                <div className="min-w-0 max-w-[150px]">
                  <p className="text-xs font-semibold truncate text-sb-ink">
                    {data.resumeName}
                  </p>
                  <p className="text-[10px] text-sb-ink-dim">PDF document</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 mt-1">
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={onPreviewResume}
                  className="h-7 px-2 text-[11px]"
                >
                  <Eye size={12} className="mr-1" />
                  View
                </Button>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={handleDownloadResume}
                  className="h-7 px-2 text-[11px]"
                >
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
              className="gap-2 text-[13px] border border-card-border hover:bg-sb-bg-hover"
            >
              {uploading ? (
                <>
                  <Loader2 size={14} className="animate-spin text-sb-accent" />
                  <span>Uploading {uploadProgress}%</span>
                </>
              ) : (
                <>
                  <Upload size={14} className="text-sb-ink-muted" />
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
