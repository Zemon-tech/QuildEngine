import { Bell, Check, Eye, Settings, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";

interface ProfileSettingsProps {
  settings: {
    profilePublic: boolean;
    showActivity: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
  };
  onUpdateSettings: (settings: ProfileSettingsProps["settings"]) => void;
}

export function ProfileSettings({
  settings,
  onUpdateSettings,
}: ProfileSettingsProps) {
  const [profilePublic, setProfilePublic] = useState(settings.profilePublic);
  const [showActivity, setShowActivity] = useState(settings.showActivity);
  const [emailNotifications, setEmailNotifications] = useState(
    settings.emailNotifications,
  );
  const [pushNotifications, setPushNotifications] = useState(
    settings.pushNotifications,
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    onUpdateSettings({
      profilePublic,
      showActivity,
      emailNotifications,
      pushNotifications,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  }

  return (
    <div
      className="p-6 rounded-2xl border flex flex-col gap-6"
      style={{
        background: "var(--card-bg)",
        borderColor: "var(--card-border)",
      }}
    >
      <div>
        <h2
          className="text-lg font-bold tracking-tight flex items-center gap-2"
          style={{
            color: "var(--page-ink)",
            fontFamily: "'Fraunces', Georgia, serif",
          }}
        >
          <Settings size={17} className="text-[var(--sb-accent)]" />
          Settings & Preferences
        </h2>
        <p className="text-xs text-[var(--sb-ink-muted)] mt-1">
          Configure your account, privacy status, and notification options.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="flex flex-col gap-5 text-[13px] leading-relaxed"
      >
        {/* Account Details */}
        <div className="flex flex-col gap-3">
          <h3
            className="text-xs font-bold uppercase tracking-wider text-[var(--sb-ink-dim)] flex items-center gap-1.5 border-b pb-1.5"
            style={{ borderColor: "var(--card-border)" }}
          >
            <ShieldAlert size={13} />
            Account Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-[var(--sb-ink-muted)] mb-1 block">
                Account Email
              </label>
              <input
                type="email"
                disabled
                value="alex@example.com"
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border bg-transparent opacity-60 cursor-not-allowed"
                style={{
                  borderColor: "var(--card-border)",
                  color: "var(--page-ink)",
                }}
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[var(--sb-ink-muted)] mb-1 block">
                Membership Status
              </label>
              <input
                type="text"
                disabled
                value="Pro Member"
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border bg-transparent opacity-60 cursor-not-allowed font-medium text-[var(--sb-accent)]"
                style={{ borderColor: "var(--card-border)" }}
              />
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="flex flex-col gap-3 mt-1">
          <h3
            className="text-xs font-bold uppercase tracking-wider text-[var(--sb-ink-dim)] flex items-center gap-1.5 border-b pb-1.5"
            style={{ borderColor: "var(--card-border)" }}
          >
            <Eye size={13} />
            Privacy Options
          </h3>

          <div className="flex flex-col gap-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={profilePublic}
                onChange={(e) => setProfilePublic(e.target.checked)}
                className="mt-0.5 rounded border-gray-300 text-[var(--sb-accent)] focus:ring-[var(--sb-accent)]"
              />
              <div>
                <p
                  className="font-semibold text-xs"
                  style={{ color: "var(--sb-ink)" }}
                >
                  Public Profile Visibility
                </p>
                <p className="text-[11px] text-[var(--sb-ink-dim)] mt-0.5">
                  Allow other members to find you and view your portfolio,
                  certifications, and history.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={showActivity}
                onChange={(e) => setShowActivity(e.target.checked)}
                className="mt-0.5 rounded border-gray-300 text-[var(--sb-accent)] focus:ring-[var(--sb-accent)]"
              />
              <div>
                <p
                  className="font-semibold text-xs"
                  style={{ color: "var(--sb-ink)" }}
                >
                  Display Practice Stats publicly
                </p>
                <p className="text-[11px] text-[var(--sb-ink-dim)] mt-0.5">
                  Show your solved problems count and learning streak stats on
                  your public profile header.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Notifications */}
        <div className="flex flex-col gap-3 mt-1">
          <h3
            className="text-xs font-bold uppercase tracking-wider text-[var(--sb-ink-dim)] flex items-center gap-1.5 border-b pb-1.5"
            style={{ borderColor: "var(--card-border)" }}
          >
            <Bell size={13} />
            Notification Preferences
          </h3>

          <div className="flex flex-col gap-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="mt-0.5 rounded border-gray-300 text-[var(--sb-accent)] focus:ring-[var(--sb-accent)]"
              />
              <div>
                <p
                  className="font-semibold text-xs"
                  style={{ color: "var(--sb-ink)" }}
                >
                  Email Digests
                </p>
                <p className="text-[11px] text-[var(--sb-ink-dim)] mt-0.5">
                  Receive weekly digests on upcoming mock tests, hackathons, and
                  certifications.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={pushNotifications}
                onChange={(e) => setPushNotifications(e.target.checked)}
                className="mt-0.5 rounded border-gray-300 text-[var(--sb-accent)] focus:ring-[var(--sb-accent)]"
              />
              <div>
                <p
                  className="font-semibold text-xs"
                  style={{ color: "var(--sb-ink)" }}
                >
                  Real-time Notifications
                </p>
                <p className="text-[11px] text-[var(--sb-ink-dim)] mt-0.5">
                  Receive push alerts immediately when an AI assistant report is
                  completed or an event is starting.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-3 pt-2">
          <Button
            type="submit"
            style={{
              background: "var(--sb-accent)",
              color: "var(--sb-accent-foreground)",
            }}
            className="w-full sm:w-auto"
          >
            {saveSuccess ? (
              <span className="flex items-center gap-1">
                <Check size={14} />
                Saved Preferences
              </span>
            ) : (
              "Save Settings"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
