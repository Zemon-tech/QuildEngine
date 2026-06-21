import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "#/components/ui/dialog";
import { Switch } from "#/components/ui/switch";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Separator } from "#/components/ui/separator";
import { useTheme } from "next-themes";
import {
  Building2,
  User,
  Sliders,
  Palette,
  Sparkles,
  Keyboard,
  CheckSquare,
  Bell,
  Link2,
  Monitor,
  CreditCard,
  ArrowLeft,
  Shield,
  Chrome,
  Smartphone,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "#/lib/utils";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SettingsTab =
  | "organisation"
  | "account"
  | "preferences"
  | "personalization"
  | "assistant"
  | "shortcuts"
  | "tasks"
  | "notifications"
  | "connectors"
  | "sessions"
  | "billing";

const DEFAULT_PROFILE = {
  header: {
    name: "Shivang Kandoi",
    email: "shivangkandoi006@gmail.com",
    username: "shivangkandoi",
    role: "Pro Member",
  },
  settings: {
    profilePublic: true,
    showActivity: true,
    emailNotifications: true,
    pushNotifications: false,
  },
};

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("account");
  const [profile, setProfile] = useState<any>(DEFAULT_PROFILE);
  const { theme, setTheme } = useTheme();

  // Load profile from local storage on mount/open
  useEffect(() => {
    if (open) {
      const saved = localStorage.getItem("quild_profile_data_v1");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Map fields if needed to preserve structure
          setProfile({
            header: {
              name: parsed.header?.name || DEFAULT_PROFILE.header.name,
              email: parsed.header?.email || DEFAULT_PROFILE.header.email,
              username: parsed.header?.username || parsed.header?.github?.split("/").pop() || DEFAULT_PROFILE.header.username,
              role: parsed.header?.role || DEFAULT_PROFILE.header.role,
            },
            settings: {
              profilePublic: parsed.settings?.profilePublic ?? DEFAULT_PROFILE.settings.profilePublic,
              showActivity: parsed.settings?.showActivity ?? DEFAULT_PROFILE.settings.showActivity,
              emailNotifications: parsed.settings?.emailNotifications ?? DEFAULT_PROFILE.settings.emailNotifications,
              pushNotifications: parsed.settings?.pushNotifications ?? DEFAULT_PROFILE.settings.pushNotifications,
            },
          });
        } catch (e) {
          console.error("Error reading profile data", e);
        }
      }
    }
  }, [open]);

  // Sync back to local storage
  const saveToLocalStorage = (newProfile: any) => {
    setProfile(newProfile);
    const saved = localStorage.getItem("quild_profile_data_v1");
    let fullProfile: any = {};
    if (saved) {
      try {
        fullProfile = JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Update fields
    fullProfile.header = {
      ...fullProfile.header,
      name: newProfile.header.name,
      email: newProfile.header.email,
      username: newProfile.header.username,
    };
    fullProfile.settings = {
      ...fullProfile.settings,
      ...newProfile.settings,
    };
    localStorage.setItem("quild_profile_data_v1", JSON.stringify(fullProfile));
    // Trigger storage event to notify profile page
    window.dispatchEvent(new Event("storage"));
  };

  // Edit states for Account values
  const [editingField, setEditingField] = useState<string | null>(null);
  const [fieldValue, setFieldValue] = useState("");

  const startEditing = (field: string, initial: string) => {
    setEditingField(field);
    setFieldValue(initial);
  };

  const saveField = () => {
    if (!editingField) return;
    const updated = { ...profile };
    if (editingField === "name") updated.header.name = fieldValue;
    if (editingField === "username") updated.header.username = fieldValue;
    if (editingField === "email") updated.header.email = fieldValue;
    saveToLocalStorage(updated);
    setEditingField(null);
  };

  const toggleSetting = (key: string) => {
    const updated = { ...profile };
    updated.settings[key] = !updated.settings[key];
    saveToLocalStorage(updated);
  };

  const categories: {
    group: string;
    items: { id: SettingsTab; label: string; icon: any }[];
  }[] = [
      {
        group: "ORGANISATION",
        items: [
          { id: "organisation", label: "Organisation", icon: Building2 },
        ],
      },
      {
        group: "ACCOUNT",
        items: [
          { id: "account", label: "Account", icon: User },
          { id: "preferences", label: "Preferences", icon: Sliders },
          { id: "personalization", label: "Personalization", icon: Palette },
          { id: "assistant", label: "Assistant", icon: Sparkles },
          { id: "shortcuts", label: "Shortcuts", icon: Keyboard },
          { id: "tasks", label: "Tasks", icon: CheckSquare },
          { id: "notifications", label: "Notifications", icon: Bell },
          { id: "connectors", label: "Connectors", icon: Link2 },
          { id: "sessions", label: "Sessions", icon: Monitor },
          { id: "billing", label: "Billing & Usage", icon: CreditCard },
        ],
      },
    ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-0 overflow-hidden flex flex-row border-[var(--sb-border)]"
        style={{
          background: "var(--sb-bg)",
          borderRadius: "16px",
          maxWidth: "80rem",
          width: "98vw",
          height: "90vh",
        }}
      >
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Manage your Quild workspace settings, account details, and notification preferences.
        </DialogDescription>

        {/* Left Sidebar */}
        <aside
          className="w-64 border-r flex flex-col shrink-0"
          style={{
            borderColor: "var(--sb-border)",
            background: "color-mix(in oklab, var(--sb-bg) 95%, black 5%)",
          }}
        >
          {/* Back Button Header */}
          <div className="p-4 border-b" style={{ borderColor: "var(--sb-border)" }}>
            <button
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-2 text-xs font-semibold hover:opacity-75 transition-opacity cursor-pointer"
              style={{ color: "var(--sb-ink)" }}
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
          </div>

          {/* Settings Items Navigation */}
          <div className="flex-1 overflow-y-auto py-4 px-2 space-y-5 select-none">
            {categories.map((group) => (
              <div key={group.group} className="space-y-1">
                <span
                  className="px-3 text-[10px] font-bold tracking-wider"
                  style={{ color: "var(--sb-ink-dim)" }}
                >
                  {group.group}
                </span>

                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setEditingField(null);
                        }}
                        className={cn(
                          "w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg outline-none transition-all cursor-pointer active:scale-[0.98]",
                          isActive
                            ? "bg-[color-mix(in oklab,var(--sb-ink)_8%,transparent)] text-[var(--sb-accent)] font-semibold shadow-sm"
                            : "text-[var(--sb-ink-muted)] hover:bg-[var(--sb-bg-hover)] hover:text-[var(--sb-ink)]"
                        )}
                        style={{
                          backgroundColor: isActive ? "var(--card-bg)" : "",
                          color: isActive ? "var(--page-ink)" : "",
                          border: isActive ? "1px solid var(--card-border)" : "1px solid transparent",
                        }}
                      >
                        <item.icon size={14} className={isActive ? "text-[var(--sb-accent)]" : "text-[var(--sb-ink-muted)]"} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-transparent overflow-y-auto">
          <div className="p-8 max-w-2xl w-full flex flex-col gap-6">
            {/* Header */}
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[var(--page-ink)] capitalize">
                {activeTab === "billing" ? "Billing & Usage" : activeTab}
              </h2>
              <p className="text-xs text-[var(--sb-ink-muted)] mt-1">
                {activeTab === "account" && "Manage your account information and security settings."}
                {activeTab === "organisation" && "Manage organization name, domain, and branding properties."}
                {activeTab === "preferences" && "Manage privacy options and workflow preferences."}
                {activeTab === "personalization" && "Customize your app theme and user experience."}
                {activeTab === "assistant" && "Configure model selections and AI assistant preferences."}
                {activeTab === "shortcuts" && "Quick guide to keyboard navigation shortcuts."}
                {activeTab === "tasks" && "Monitor active learning tasks and certification tracks."}
                {activeTab === "notifications" && "Select how and when you receive email digests or push notifications."}
                {activeTab === "connectors" && "Manage external integrations like Google and GitHub."}
                {activeTab === "sessions" && "Monitor active browser sessions and device history."}
              </p>
            </div>

            <Separator style={{ background: "var(--sb-border)" }} />

            {/* TAB: ACCOUNT */}
            {activeTab === "account" && (
              <div className="space-y-6">
                {/* User Section (Avatar + Name) */}
                <div className="flex items-center gap-4 py-2">
                  <div
                    className="size-16 rounded-full flex items-center justify-center text-2xl font-bold select-none text-white"
                    style={{
                      background: "oklch(0.53 0.18 269.01)", // Beautiful custom purple
                    }}
                  >
                    {profile.header.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-[var(--page-ink)]">
                      {profile.header.name}
                    </h3>
                    <p className="text-xs text-[var(--sb-ink-muted)] mt-0.5">
                      {profile.header.email}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs font-medium cursor-pointer"
                      onClick={() => alert("Avatar uploading simulator")}
                    >
                      Change avatar
                    </Button>
                  </div>
                </div>

                <Separator style={{ background: "var(--sb-border)" }} />

                {/* Edit forms */}
                {editingField ? (
                  <div className="p-4 border rounded-xl flex flex-col gap-3" style={{ borderColor: "var(--sb-border)" }}>
                    <h4 className="text-xs font-semibold text-[var(--page-ink)] uppercase tracking-wider">
                      Update {editingField}
                    </h4>
                    <input
                      type="text"
                      value={fieldValue}
                      onChange={(e) => setFieldValue(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border bg-transparent text-[var(--page-ink)] focus:outline-none focus:ring-1 focus:ring-[var(--sb-accent)]"
                      style={{ borderColor: "var(--sb-border)" }}
                      autoFocus
                    />
                    <div className="flex gap-2 justify-end">
                      <Button size="xs" variant="ghost" onClick={() => setEditingField(null)}>
                        Cancel
                      </Button>
                      <Button size="xs" onClick={saveField}>
                        Save
                      </Button>
                    </div>
                  </div>
                ) : null}

                {/* Account details rows */}
                <div className="space-y-5 text-xs">
                  {/* Row: Full Name */}
                  <div className="flex justify-between items-center py-1">
                    <div>
                      <h4 className="font-semibold text-[var(--page-ink)]">Full Name</h4>
                      <p className="text-[11px] text-[var(--sb-ink-muted)] mt-0.5">
                        {profile.header.name}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs font-medium cursor-pointer"
                      onClick={() => startEditing("name", profile.header.name)}
                    >
                      Change full name
                    </Button>
                  </div>

                  <Separator style={{ background: "var(--sb-border)" }} />

                  {/* Row: Username */}
                  <div className="flex justify-between items-center py-1">
                    <div>
                      <h4 className="font-semibold text-[var(--page-ink)]">Username</h4>
                      <p className="text-[11px] text-[var(--sb-ink-muted)] mt-0.5">
                        {profile.header.username}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs font-medium cursor-pointer"
                      onClick={() => startEditing("username", profile.header.username)}
                    >
                      Change username
                    </Button>
                  </div>

                  <Separator style={{ background: "var(--sb-border)" }} />

                  {/* Row: Email */}
                  <div className="flex justify-between items-center py-1">
                    <div>
                      <h4 className="font-semibold text-[var(--page-ink)]">Email</h4>
                      <p className="text-[11px] text-[var(--sb-ink-muted)] mt-0.5">
                        {profile.header.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[oklch(0.25_0.07_243.83)] text-[oklch(0.85_0.03_243.83)] hover:bg-[oklch(0.25_0.07_243.83)] border-0 text-[10px] font-semibold tracking-wide py-0.5 px-2 rounded-full shadow-none">
                        Google Auth
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator style={{ background: "var(--sb-border)" }} />

                {/* Security Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 font-semibold text-xs text-[var(--page-ink)] uppercase tracking-wider">
                    <Shield size={14} className="text-[var(--sb-ink-muted)]" />
                    <span>Security</span>
                  </div>

                  {/* Password row container */}
                  <div
                    className="p-4 rounded-xl border flex items-center justify-between"
                    style={{ borderColor: "var(--sb-border)" }}
                  >
                    <div>
                      <h4 className="font-semibold text-xs text-[var(--page-ink)]">Password</h4>
                      <p className="text-[11px] text-[var(--sb-ink-muted)] mt-0.5">
                        Change your existing password
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs font-medium cursor-pointer"
                      onClick={() => alert("Password reset workflow simulator")}
                    >
                      Change password
                    </Button>
                  </div>

                  {/* 2FA container */}
                  <div className="flex items-center justify-between py-1">
                    <div>
                      <h4 className="font-semibold text-xs text-[var(--page-ink)]">Two-Factor Authentication</h4>
                      <p className="text-[11px] text-[var(--sb-ink-muted)] mt-0.5">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: PREFERENCES */}
            {activeTab === "preferences" && (
              <div className="space-y-6 text-xs">
                <div className="space-y-4">
                  <h3 className="font-semibold text-xs uppercase tracking-wider text-[var(--sb-ink-muted)]">Privacy & Profile</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-[var(--page-ink)]">Public Profile Visibility</h4>
                      <p className="text-[11px] text-[var(--sb-ink-muted)] mt-0.5">Allow other members to find you and view your portfolio history.</p>
                    </div>
                    <Switch
                      checked={profile.settings.profilePublic}
                      onCheckedChange={() => toggleSetting("profilePublic")}
                    />
                  </div>
                  <Separator style={{ background: "var(--sb-border)" }} />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-[var(--page-ink)]">Display Practice Stats Publicly</h4>
                      <p className="text-[11px] text-[var(--sb-ink-muted)] mt-0.5">Show solved problem stats and streaks on your header card.</p>
                    </div>
                    <Switch
                      checked={profile.settings.showActivity}
                      onCheckedChange={() => toggleSetting("showActivity")}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: PERSONALIZATION */}
            {activeTab === "personalization" && (
              <div className="space-y-6 text-xs">
                <div className="space-y-4">
                  <h3 className="font-semibold text-xs uppercase tracking-wider text-[var(--sb-ink-muted)]">App Theme</h3>
                  <p className="text-[11px] text-[var(--sb-ink-muted)] mt-0.5">Select your preferred app appearance style.</p>

                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <button
                      onClick={() => setTheme("light")}
                      className={cn(
                        "p-4 border rounded-xl flex flex-col items-center gap-2 transition-all cursor-pointer",
                        theme === "light" ? "border-[var(--sb-accent)] bg-[var(--sb-pill)] font-semibold" : "border-[var(--sb-border)] hover:bg-[var(--sb-bg-hover)]"
                      )}
                    >
                      <Sun size={20} className="text-amber-500" />
                      <span>Light</span>
                    </button>
                    <button
                      onClick={() => setTheme("dark")}
                      className={cn(
                        "p-4 border rounded-xl flex flex-col items-center gap-2 transition-all cursor-pointer",
                        theme === "dark" ? "border-[var(--sb-accent)] bg-[var(--sb-pill)] font-semibold" : "border-[var(--sb-border)] hover:bg-[var(--sb-bg-hover)]"
                      )}
                    >
                      <Moon size={20} className="text-indigo-400" />
                      <span>Dark</span>
                    </button>
                    <button
                      onClick={() => setTheme("system")}
                      className={cn(
                        "p-4 border rounded-xl flex flex-col items-center gap-2 transition-all cursor-pointer",
                        theme === "system" ? "border-[var(--sb-accent)] bg-[var(--sb-pill)] font-semibold" : "border-[var(--sb-border)] hover:bg-[var(--sb-bg-hover)]"
                      )}
                    >
                      <Monitor size={20} className="text-zinc-400" />
                      <span>System</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ASSISTANT */}
            {activeTab === "assistant" && (
              <div className="space-y-6 text-xs">
                <div className="space-y-4">
                  <h3 className="font-semibold text-xs uppercase tracking-wider text-[var(--sb-ink-muted)]">AI Engine Model</h3>
                  <div className="flex flex-col gap-2">
                    <label className="font-medium text-[var(--page-ink)]">Model Selection</label>
                    <select
                      className="w-full text-xs px-3 py-2 rounded-lg border bg-transparent text-[var(--page-ink)]"
                      style={{ borderColor: "var(--sb-border)" }}
                      defaultValue="gemini-1.5-pro"
                    >
                      <option value="gemini-1.5-pro">Gemini 1.5 Pro (Recommended)</option>
                      <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                      <option value="gemini-1.0-ultra">Gemini 1.0 Ultra</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <label className="font-medium text-[var(--page-ink)]">Temperature (0.7)</label>
                    <input type="range" min="0" max="1.5" step="0.1" defaultValue="0.7" className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer" />
                    <p className="text-[10px] text-[var(--sb-ink-muted)]">Controls random generation weights: higher means more creative/random replies.</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SHORTCUTS */}
            {activeTab === "shortcuts" && (
              <div className="space-y-6 text-xs">
                <div className="space-y-3">
                  <h3 className="font-semibold text-xs uppercase tracking-wider text-[var(--sb-ink-muted)]">Workspace Key Shortcuts</h3>
                  <div className="border rounded-xl overflow-hidden" style={{ borderColor: "var(--sb-border)" }}>
                    <div className="grid grid-cols-2 p-3 font-semibold border-b text-[var(--page-ink)]" style={{ borderColor: "var(--sb-border)" }}>
                      <span>Action</span>
                      <span>Shortcut</span>
                    </div>
                    <div className="divide-y text-[var(--sb-ink-muted)]" style={{ borderColor: "var(--sb-border)" }}>
                      <div className="grid grid-cols-2 p-3">
                        <span>Toggle Sidebar</span>
                        <span><kbd className="px-1.5 py-0.5 rounded border bg-muted text-[10px] font-mono">⌘ B</kbd> or <kbd className="px-1.5 py-0.5 rounded border bg-muted text-[10px] font-mono">Ctrl B</kbd></span>
                      </div>
                      <div className="grid grid-cols-2 p-3">
                        <span>Open Command Palette</span>
                        <span><kbd className="px-1.5 py-0.5 rounded border bg-muted text-[10px] font-mono">⌘ K</kbd></span>
                      </div>
                      <div className="grid grid-cols-2 p-3">
                        <span>Dismiss Dialogs</span>
                        <span><kbd className="px-1.5 py-0.5 rounded border bg-muted text-[10px] font-mono">Esc</kbd></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ORGANISATION */}
            {activeTab === "organisation" && (
              <div className="space-y-6 text-xs">
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-medium text-[var(--page-ink)]">Organization Name</label>
                    <input
                      type="text"
                      className="w-full text-xs px-3 py-2 rounded-lg border bg-transparent text-[var(--page-ink)]"
                      style={{ borderColor: "var(--sb-border)" }}
                      defaultValue="Quild Software"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-medium text-[var(--page-ink)]">Custom domain</label>
                    <input
                      type="text"
                      className="w-full text-xs px-3 py-2 rounded-lg border bg-transparent text-[var(--page-ink)]"
                      style={{ borderColor: "var(--sb-border)" }}
                      placeholder="e.g. learning.quild.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: TASKS */}
            {activeTab === "tasks" && (
              <div className="space-y-6 text-xs">
                <div className="space-y-3">
                  <h3 className="font-semibold text-xs uppercase tracking-wider text-[var(--sb-ink-muted)]">Active Goals</h3>
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3 p-3 border rounded-xl" style={{ borderColor: "var(--sb-border)" }}>
                      <Switch defaultChecked />
                      <div>
                        <h4 className="font-semibold text-[var(--page-ink)]">DSA Practice Track</h4>
                        <p className="text-[10px] text-[var(--sb-ink-dim)] mt-0.5">Solve 12 Graph challenges before next assessment.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-xl" style={{ borderColor: "var(--sb-border)" }}>
                      <Switch defaultChecked />
                      <div>
                        <h4 className="font-semibold text-[var(--page-ink)]">System Design Seminar</h4>
                        <p className="text-[10px] text-[var(--sb-ink-dim)] mt-0.5">Watch mock webinar recordings on microservices.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: NOTIFICATIONS */}
            {activeTab === "notifications" && (
              <div className="space-y-6 text-xs">
                <div className="space-y-4">
                  <h3 className="font-semibold text-xs uppercase tracking-wider text-[var(--sb-ink-muted)]">Alert Triggers</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-[var(--page-ink)]">Email Digests</h4>
                      <p className="text-[11px] text-[var(--sb-ink-muted)] mt-0.5">Weekly digests on certifications, DSA tests, and news.</p>
                    </div>
                    <Switch
                      checked={profile.settings.emailNotifications}
                      onCheckedChange={() => toggleSetting("emailNotifications")}
                    />
                  </div>
                  <Separator style={{ background: "var(--sb-border)" }} />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-[var(--page-ink)]">Real-time Push Notifications</h4>
                      <p className="text-[11px] text-[var(--sb-ink-muted)] mt-0.5">Get immediate browser banner updates on AI reports.</p>
                    </div>
                    <Switch
                      checked={profile.settings.pushNotifications}
                      onCheckedChange={() => toggleSetting("pushNotifications")}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CONNECTORS */}
            {activeTab === "connectors" && (
              <div className="space-y-6 text-xs">
                <div className="space-y-3">
                  <h3 className="font-semibold text-xs uppercase tracking-wider text-[var(--sb-ink-muted)]">OAuth Providers</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-xl" style={{ borderColor: "var(--sb-border)" }}>
                      <div className="flex items-center gap-2.5">
                        <Link2 size={16} className="text-zinc-400" />
                        <div>
                          <h4 className="font-semibold text-[var(--page-ink)]">Google Auth</h4>
                          <p className="text-[10px] text-[var(--sb-ink-dim)] mt-0.5">Connected as {profile.header.email}</p>
                        </div>
                      </div>
                      <Button size="xs" variant="outline">Disconnect</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-xl" style={{ borderColor: "var(--sb-border)" }}>
                      <div className="flex items-center gap-2.5">
                        <Link2 size={16} className="text-zinc-400" />
                        <div>
                          <h4 className="font-semibold text-[var(--page-ink)]">GitHub account</h4>
                          <p className="text-[10px] text-[var(--sb-ink-dim)] mt-0.5">Connect to sync repositories and build cards</p>
                        </div>
                      </div>
                      <Button size="xs">Connect</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SESSIONS */}
            {activeTab === "sessions" && (
              <div className="space-y-6 text-xs">
                <div className="space-y-3">
                  <h3 className="font-semibold text-xs uppercase tracking-wider text-[var(--sb-ink-muted)]">Active Sessions</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border rounded-xl" style={{ borderColor: "var(--sb-border)" }}>
                      <Chrome size={20} className="text-emerald-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[var(--page-ink)] flex items-center gap-2">
                          <span>Chrome on macOS</span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 rounded-full font-semibold">Active now</span>
                        </h4>
                        <p className="text-[10px] text-[var(--sb-ink-dim)] mt-0.5">IP: 192.168.1.18 · San Francisco, CA</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-xl" style={{ borderColor: "var(--sb-border)" }}>
                      <Smartphone size={20} className="text-zinc-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[var(--page-ink)]">Safari on iPhone</h4>
                        <p className="text-[10px] text-[var(--sb-ink-dim)] mt-0.5">Last active: 2 hours ago · California, USA</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: BILLING & USAGE */}
            {activeTab === "billing" && (
              <div className="space-y-6 text-xs">
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border flex items-center justify-between" style={{ borderColor: "var(--sb-border)" }}>
                    <div>
                      <h4 className="font-semibold text-xs text-[var(--page-ink)]">Current Plan: Pro Member</h4>
                      <p className="text-[11px] text-[var(--sb-ink-muted)] mt-0.5">Enjoy unlimited AI code reviews and course access.</p>
                    </div>
                    <Badge className="bg-[var(--sb-pill)] text-[var(--sb-ink)] hover:bg-[var(--sb-pill)] shadow-none py-1 px-3 text-[11px] font-semibold border border-[var(--sb-border)]">
                      Pro Active
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-[var(--page-ink)]">Billing History</h4>
                      <p className="text-[11px] text-[var(--sb-ink-muted)] mt-0.5">View your receipts and invoice download links.</p>
                    </div>
                    <Button size="sm" variant="outline">View Receipts</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </DialogContent>
    </Dialog>
  );
}
