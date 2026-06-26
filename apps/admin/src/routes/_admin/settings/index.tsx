import { createFileRoute } from "@tanstack/react-router";
import { Bell, Bot, Check, Globe, Save, Settings, Shield } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "#/components/admin/page-header";
import { Button } from "#/components/ui/button";
import { cn } from "#/lib/utils";

export const Route = createFileRoute("/_admin/settings/")({
  component: SettingsPage,
});

type TabId = "general" | "security" | "ai" | "notifications";

function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // General Settings State
  const [appName, setAppName] = useState("Quild Academy");
  const [supportEmail, setSupportEmail] = useState("support@quild.in");
  const [maintenance, setMaintenance] = useState(false);

  // Security Settings State
  const [mfa, setMfa] = useState(true);
  const [timeout, setTimeoutVal] = useState("30");
  const [allowedDomains, setAllowedDomains] = useState("quild.in, quild.com");

  // AI Configuration State
  const [aiModel, setAiModel] = useState("gpt-4o");
  const [temp, setTemp] = useState("0.7");
  const [maxTokens, setMaxTokens] = useState("2048");

  // Notifications State
  const [slackWebhook, setSlackWebhook] = useState(
    "https://hooks.slack.com/services/...",
  );
  const [alertEmails, setAlertEmails] = useState("devops@quild.in");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    setSuccessMsg("Settings updated successfully.");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const tabs = [
    { id: "general" as TabId, label: "General", icon: Globe },
    { id: "security" as TabId, label: "Security", icon: Shield },
    { id: "ai" as TabId, label: "AI Config", icon: Bot },
    { id: "notifications" as TabId, label: "Notifications", icon: Bell },
  ];

  return (
    <div className="p-6 w-full pb-16">
      <PageHeader
        title="Settings"
        description="Configure system preferences, security, API integrations, and notification channels."
        icon={Settings}
        breadcrumbs={[{ label: "Admin" }, { label: "Settings" }]}
      />

      {successMsg && (
        <div
          className="mb-6 p-3 text-xs rounded-xl flex items-center gap-2 border rise-in"
          style={{
            background: "color-mix(in oklab, var(--lagoon) 10%, transparent)",
            color: "var(--lagoon)",
            borderColor: "color-mix(in oklab, var(--lagoon) 20%, transparent)",
          }}
        >
          <Check size={14} />
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        {/* Navigation Sidebar (Tabs) */}
        <div className="md:col-span-1 flex flex-col gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer active:scale-98 text-left",
                activeTab === tab.id
                  ? "bg-[color-mix(in_oklab,var(--sb-ink)_8%,transparent)] text-[var(--sb-ink)]"
                  : "text-[var(--sb-ink-muted)] hover:bg-[color-mix(in_oklab,var(--sb-ink)_3%,transparent)]",
              )}
            >
              <tab.icon
                size={13}
                style={{
                  color:
                    activeTab === tab.id
                      ? "var(--sb-accent)"
                      : "var(--sb-ink-dim)",
                }}
              />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content (Forms) */}
        <div className="md:col-span-3">
          <form
            onSubmit={handleSave}
            className="island-shell rounded-xl p-6 flex flex-col gap-5"
          >
            {/* GENERAL TAB */}
            {activeTab === "general" && (
              <div className="flex flex-col gap-4">
                <h3
                  className="text-xs font-bold uppercase tracking-wider mb-2"
                  style={{ color: "var(--sb-ink-dim)" }}
                >
                  General System Preferences
                </h3>

                {/* App Name */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="appName"
                    className="text-xs font-semibold"
                    style={{ color: "var(--sb-ink-muted)" }}
                  >
                    Platform Name
                  </label>
                  <input
                    id="appName"
                    type="text"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    required
                    className={cn(
                      "w-full rounded-[10px] px-3 py-2 text-xs outline-none transition-all duration-150",
                      "focus-visible:ring-2 focus-visible:ring-[var(--sb-accent)]/30",
                    )}
                    style={{
                      background:
                        "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
                      border: "1px solid var(--sb-border)",
                      color: "var(--sb-ink)",
                    }}
                  />
                </div>

                {/* Support Email */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="supportEmail"
                    className="text-xs font-semibold"
                    style={{ color: "var(--sb-ink-muted)" }}
                  >
                    System Support Email
                  </label>
                  <input
                    id="supportEmail"
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    required
                    className={cn(
                      "w-full rounded-[10px] px-3 py-2 text-xs outline-none transition-all duration-150",
                      "focus-visible:ring-2 focus-visible:ring-[var(--sb-accent)]/30",
                    )}
                    style={{
                      background:
                        "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
                      border: "1px solid var(--sb-border)",
                      color: "var(--sb-ink)",
                    }}
                  />
                </div>

                {/* Maintenance Mode Toggle */}
                <div
                  className="flex items-center justify-between p-3 rounded-lg mt-2 border"
                  style={{ borderColor: "var(--sb-border)" }}
                >
                  <div className="flex flex-col gap-0.5">
                    <span
                      className="text-xs font-semibold"
                      style={{ color: "var(--sb-ink)" }}
                    >
                      Maintenance Mode
                    </span>
                    <span
                      className="text-[10px]"
                      style={{ color: "var(--sb-ink-dim)" }}
                    >
                      Disable public access to the platform with a maintenance
                      screen.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={maintenance}
                    onChange={(e) => setMaintenance(e.target.checked)}
                    className="cursor-pointer size-4"
                  />
                </div>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === "security" && (
              <div className="flex flex-col gap-4">
                <h3
                  className="text-xs font-bold uppercase tracking-wider mb-2"
                  style={{ color: "var(--sb-ink-dim)" }}
                >
                  Security & Authentication Policies
                </h3>

                {/* Session Timeout */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="timeout"
                    className="text-xs font-semibold"
                    style={{ color: "var(--sb-ink-muted)" }}
                  >
                    Inactivity Session Timeout (Minutes)
                  </label>
                  <input
                    id="timeout"
                    type="number"
                    value={timeout}
                    onChange={(e) => setTimeoutVal(e.target.value)}
                    required
                    className={cn(
                      "w-full rounded-[10px] px-3 py-2 text-xs outline-none transition-all duration-150",
                      "focus-visible:ring-2 focus-visible:ring-[var(--sb-accent)]/30",
                    )}
                    style={{
                      background:
                        "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
                      border: "1px solid var(--sb-border)",
                      color: "var(--sb-ink)",
                    }}
                  />
                </div>

                {/* Allowed Domains */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="allowedDomains"
                    className="text-xs font-semibold"
                    style={{ color: "var(--sb-ink-muted)" }}
                  >
                    Allowed Sign-up Email Domains
                  </label>
                  <input
                    id="allowedDomains"
                    type="text"
                    value={allowedDomains}
                    onChange={(e) => setAllowedDomains(e.target.value)}
                    placeholder="e.g. quild.in, quild.com"
                    className={cn(
                      "w-full rounded-[10px] px-3 py-2 text-xs outline-none transition-all duration-150",
                      "focus-visible:ring-2 focus-visible:ring-[var(--sb-accent)]/30",
                    )}
                    style={{
                      background:
                        "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
                      border: "1px solid var(--sb-border)",
                      color: "var(--sb-ink)",
                    }}
                  />
                  <span
                    className="text-[10px]"
                    style={{ color: "var(--sb-ink-dim)" }}
                  >
                    Comma-separated list of domain names allowed to register
                    accounts. Leave empty for all.
                  </span>
                </div>

                {/* Force MFA Toggle */}
                <div
                  className="flex items-center justify-between p-3 rounded-lg mt-2 border"
                  style={{ borderColor: "var(--sb-border)" }}
                >
                  <div className="flex flex-col gap-0.5">
                    <span
                      className="text-xs font-semibold"
                      style={{ color: "var(--sb-ink)" }}
                    >
                      Require Multi-Factor Auth (MFA)
                    </span>
                    <span
                      className="text-[10px]"
                      style={{ color: "var(--sb-ink-dim)" }}
                    >
                      Force administrative accounts to setup MFA on their first
                      sign-in.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={mfa}
                    onChange={(e) => setMfa(e.target.checked)}
                    className="cursor-pointer size-4"
                  />
                </div>
              </div>
            )}

            {/* AI CONFIG TAB */}
            {activeTab === "ai" && (
              <div className="flex flex-col gap-4">
                <h3
                  className="text-xs font-bold uppercase tracking-wider mb-2"
                  style={{ color: "var(--sb-ink-dim)" }}
                >
                  Platform AI Models & Parameters
                </h3>

                {/* Default Model */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="aiModel"
                    className="text-xs font-semibold"
                    style={{ color: "var(--sb-ink-muted)" }}
                  >
                    Default Completion Model
                  </label>
                  <select
                    id="aiModel"
                    value={aiModel}
                    onChange={(e) => setAiModel(e.target.value)}
                    className="w-full rounded-[10px] px-2.5 py-2 text-xs outline-none cursor-pointer"
                    style={{
                      background:
                        "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
                      border: "1px solid var(--sb-border)",
                      color: "var(--sb-ink)",
                    }}
                  >
                    <option value="gpt-4o">GPT-4o (OpenAI)</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo (OpenAI)</option>
                    <option value="claude-3-5-sonnet">
                      Claude 3.5 Sonnet (Anthropic)
                    </option>
                    <option value="gemini-1.5-pro">
                      Gemini 1.5 Pro (Google)
                    </option>
                  </select>
                </div>

                {/* Temperature */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="temp"
                    className="text-xs font-semibold"
                    style={{ color: "var(--sb-ink-muted)" }}
                  >
                    Temperature (Creativity)
                  </label>
                  <input
                    id="temp"
                    type="number"
                    step="0.1"
                    min="0"
                    max="2"
                    value={temp}
                    onChange={(e) => setTemp(e.target.value)}
                    required
                    className={cn(
                      "w-full rounded-[10px] px-3 py-2 text-xs outline-none transition-all duration-150",
                      "focus-visible:ring-2 focus-visible:ring-[var(--sb-accent)]/30",
                    )}
                    style={{
                      background:
                        "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
                      border: "1px solid var(--sb-border)",
                      color: "var(--sb-ink)",
                    }}
                  />
                </div>

                {/* Max Tokens */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="maxTokens"
                    className="text-xs font-semibold"
                    style={{ color: "var(--sb-ink-muted)" }}
                  >
                    Max Tokens limit per request
                  </label>
                  <input
                    id="maxTokens"
                    type="number"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(e.target.value)}
                    required
                    className={cn(
                      "w-full rounded-[10px] px-3 py-2 text-xs outline-none transition-all duration-150",
                      "focus-visible:ring-2 focus-visible:ring-[var(--sb-accent)]/30",
                    )}
                    style={{
                      background:
                        "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
                      border: "1px solid var(--sb-border)",
                      color: "var(--sb-ink)",
                    }}
                  />
                </div>
              </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === "notifications" && (
              <div className="flex flex-col gap-4">
                <h3
                  className="text-xs font-bold uppercase tracking-wider mb-2"
                  style={{ color: "var(--sb-ink-dim)" }}
                >
                  Notification & Alarm Webhooks
                </h3>

                {/* Slack Webhook */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="slack"
                    className="text-xs font-semibold"
                    style={{ color: "var(--sb-ink-muted)" }}
                  >
                    Slack System Alarms Webhook
                  </label>
                  <input
                    id="slack"
                    type="text"
                    value={slackWebhook}
                    onChange={(e) => setSlackWebhook(e.target.value)}
                    placeholder="https://hooks.slack.com/services/..."
                    className={cn(
                      "w-full rounded-[10px] px-3 py-2 text-xs outline-none transition-all duration-150",
                      "focus-visible:ring-2 focus-visible:ring-[var(--sb-accent)]/30",
                    )}
                    style={{
                      background:
                        "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
                      border: "1px solid var(--sb-border)",
                      color: "var(--sb-ink)",
                    }}
                  />
                </div>

                {/* Alert Emails */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="alertEmails"
                    className="text-xs font-semibold"
                    style={{ color: "var(--sb-ink-muted)" }}
                  >
                    Alert Alert Recipient Emails
                  </label>
                  <input
                    id="alertEmails"
                    type="text"
                    value={alertEmails}
                    onChange={(e) => setAlertEmails(e.target.value)}
                    required
                    placeholder="devops@quild.in"
                    className={cn(
                      "w-full rounded-[10px] px-3 py-2 text-xs outline-none transition-all duration-150",
                      "focus-visible:ring-2 focus-visible:ring-[var(--sb-accent)]/30",
                    )}
                    style={{
                      background:
                        "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
                      border: "1px solid var(--sb-border)",
                      color: "var(--sb-ink)",
                    }}
                  />
                  <span
                    className="text-[10px]"
                    style={{ color: "var(--sb-ink-dim)" }}
                  >
                    System failures and critical security alerts will be
                    immediately mailed here.
                  </span>
                </div>
              </div>
            )}

            <div
              className="flex items-center justify-end border-t pt-4 mt-2"
              style={{ borderColor: "var(--sb-border)" }}
            >
              <Button
                type="submit"
                disabled={saving}
                className="w-28 active:scale-95"
              >
                <Save size={13} className="mr-1.5" />
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
