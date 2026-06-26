import { createFileRoute } from "@tanstack/react-router";
import {
  Check,
  Info,
  Key,
  Save,
  Shield,
  ShieldAlert,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { PageHeader } from "#/components/admin/page-header";
import { Button } from "#/components/ui/button";
import { cn } from "#/lib/utils";

export const Route = createFileRoute("/_admin/roles/")({
  component: RolesPage,
});

const ROLES = [
  {
    id: "superadmin",
    name: "Super Admin",
    count: 2,
    color: "oklch(0.627 0.265 303.9)",
  },
  { id: "admin", name: "Admin", count: 4, color: "oklch(0.75 0.08 220)" },
  { id: "editor", name: "Editor", count: 6, color: "oklch(0.82 0.15 55)" },
  {
    id: "moderator",
    name: "Moderator",
    count: 3,
    color: "oklch(0.72 0.16 142)",
  },
];

const PERMISSIONS = [
  {
    category: "User & Access Management",
    items: [
      {
        key: "users.view",
        name: "View Users",
        desc: "Allows viewing user list, profiles, and basic statistics.",
      },
      {
        key: "users.create",
        name: "Create & Invite",
        desc: "Allows adding new users and sending email invitations.",
      },
      {
        key: "users.edit",
        name: "Edit Details",
        desc: "Allows modifying user names, emails, and user settings.",
      },
      {
        key: "users.roles",
        name: "Manage Roles",
        desc: "Allows promoting, demoting, or modifying user role assignments.",
      },
      {
        key: "users.suspend",
        name: "Suspend & Ban",
        desc: "Allows suspending or permanently banning accounts.",
      },
    ],
  },
  {
    category: "LMS & Course Content",
    items: [
      {
        key: "courses.view",
        name: "View Course Builder",
        desc: "Allows browsing internal course trees and modules.",
      },
      {
        key: "courses.create",
        name: "Create/Modify Courses",
        desc: "Allows editing course outlines, metadata, and adding lessons.",
      },
      {
        key: "courses.publish",
        name: "Publish/Archive",
        desc: "Allows making courses live or archiving them.",
      },
      {
        key: "practice.dsa",
        name: "Manage DSA Problems",
        desc: "Allows adding, deleting, and editing coding questions.",
      },
    ],
  },
  {
    category: "CMS & Platform",
    items: [
      {
        key: "cms.blog",
        name: "Manage Blog",
        desc: "Allows writing, editing, and publishing blog posts.",
      },
      {
        key: "cms.events",
        name: "Organize Events",
        desc: "Allows scheduling and managing platform live events.",
      },
      {
        key: "cms.newsletter",
        name: "Newsletter Broadcasts",
        desc: "Allows managing lists and broadcasting email updates.",
      },
      {
        key: "system.audit",
        name: "View Audit Logs",
        desc: "Grants access to trace security, action, and access logs.",
      },
      {
        key: "system.settings",
        name: "System Settings",
        desc: "Allows updating platform branding, API keys, and environment variables.",
      },
    ],
  },
];

// Initial matrix values
const INITIAL_MATRIX: Record<string, string[]> = {
  "users.view": ["superadmin", "admin", "editor", "moderator"],
  "users.create": ["superadmin", "admin", "moderator"],
  "users.edit": ["superadmin", "admin"],
  "users.roles": ["superadmin"],
  "users.suspend": ["superadmin", "admin", "moderator"],
  "courses.view": ["superadmin", "admin", "editor"],
  "courses.create": ["superadmin", "admin", "editor"],
  "courses.publish": ["superadmin", "admin", "editor"],
  "practice.dsa": ["superadmin", "admin", "editor"],
  "cms.blog": ["superadmin", "admin", "editor"],
  "cms.events": ["superadmin", "admin", "editor"],
  "cms.newsletter": ["superadmin", "admin"],
  "system.audit": ["superadmin", "admin", "moderator"],
  "system.settings": ["superadmin"],
};

function RolesPage() {
  const [matrix, setMatrix] =
    useState<Record<string, string[]>>(INITIAL_MATRIX);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleToggle = (permKey: string, roleId: string) => {
    // Superadmin has all permissions locked
    if (roleId === "superadmin") return;

    setMatrix((prev) => {
      const activeRoles = prev[permKey] || [];
      const isAssigned = activeRoles.includes(roleId);
      const nextRoles = isAssigned
        ? activeRoles.filter((r) => r !== roleId)
        : [...activeRoles, roleId];
      return { ...prev, [permKey]: nextRoles };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg(null);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    setSuccessMsg("Permissions matrix saved successfully.");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="p-6 w-full pb-16">
      <PageHeader
        title="Roles & Permissions"
        description="Configure granular access controls and role-based policies."
        icon={Shield}
        breadcrumbs={[{ label: "Admin" }, { label: "Roles & Permissions" }]}
        actions={[
          {
            label: saving ? "Saving..." : "Save Matrix",
            onClick: handleSave,
            icon: Save,
            variant: "default",
          },
        ]}
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

      {/* Role summaries */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {ROLES.map((role) => (
          <div
            key={role.id}
            className="island-shell rounded-xl p-4 flex flex-col justify-between hover:scale-[1.01] transition-transform duration-200"
          >
            <div>
              <span
                className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider mb-2"
                style={{
                  background: `color-mix(in oklab, ${role.color} 12%, transparent)`,
                  color: role.color,
                }}
              >
                {role.name}
              </span>
              <p
                className="text-[11px] mt-1 leading-relaxed"
                style={{ color: "var(--sb-ink-muted)" }}
              >
                {role.id === "superadmin" &&
                  "Full administrative power, system-level configurations."}
                {role.id === "admin" &&
                  "Manage daily activities, users, and generic LMS functions."}
                {role.id === "editor" &&
                  "Creation and curation of courses, CMS blog posts, and LMS lessons."}
                {role.id === "moderator" &&
                  "Moderates user logs, issues suspensions, monitors audit logs."}
              </p>
            </div>
            <div
              className="flex items-center gap-1.5 mt-4 text-xs font-semibold"
              style={{ color: "var(--sb-ink)" }}
            >
              <Users size={12} style={{ color: "var(--sb-ink-dim)" }} />
              {role.count} {role.count === 1 ? "user" : "users"} assigned
            </div>
          </div>
        ))}
      </div>

      {/* Permissions Matrix */}
      <div className="island-shell rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--sb-border)",
                  background:
                    "color-mix(in oklab, var(--sb-ink) 2%, transparent)",
                }}
              >
                <th
                  className="px-4 py-3 text-left w-1/3 font-semibold uppercase tracking-wider"
                  style={{ color: "var(--sb-ink-dim)" }}
                >
                  Permission Module
                </th>
                {ROLES.map((role) => (
                  <th
                    key={role.id}
                    className="px-4 py-3 text-center font-semibold uppercase tracking-wider"
                    style={{ color: "var(--sb-ink-dim)" }}
                  >
                    {role.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS.map((group) => (
                <optgroup
                  key={group.category}
                  label={group.category}
                  className="not-italic"
                >
                  <tr
                    style={{
                      background:
                        "color-mix(in oklab, var(--sb-ink) 1%, transparent)",
                    }}
                  >
                    <td
                      colSpan={ROLES.length + 1}
                      className="px-4 py-2 font-bold uppercase tracking-wider text-[9px] border-y"
                      style={{
                        color: "var(--sb-ink-muted)",
                        borderColor: "var(--sb-border)",
                      }}
                    >
                      {group.category}
                    </td>
                  </tr>
                  {group.items.map((perm) => (
                    <tr
                      key={perm.key}
                      className="hover:bg-[color-mix(in_oklab,var(--sb-ink)_1.5%,transparent)] transition-colors duration-100"
                      style={{ borderBottom: "1px solid var(--sb-border)" }}
                    >
                      <td className="px-4 py-3.5 max-w-sm">
                        <div className="flex flex-col">
                          <span
                            className="font-semibold flex items-center gap-1.5"
                            style={{ color: "var(--sb-ink)" }}
                          >
                            {perm.name}
                            <span className="group relative cursor-pointer">
                              <Info
                                size={11}
                                style={{ color: "var(--sb-ink-dim)" }}
                              />
                              <span
                                className="pointer-events-none absolute bottom-full left-0 mb-1.5 hidden group-hover:block w-48 p-2 rounded-lg text-[10px] leading-relaxed z-20 shadow-md border"
                                style={{
                                  background: "var(--sb-bg)",
                                  borderColor: "var(--sb-border)",
                                  color: "var(--sb-ink-muted)",
                                }}
                              >
                                {perm.desc}
                              </span>
                            </span>
                          </span>
                          <span
                            className="text-[10px] mt-0.5"
                            style={{ color: "var(--sb-ink-dim)" }}
                          >
                            {perm.key}
                          </span>
                        </div>
                      </td>
                      {ROLES.map((role) => {
                        const isAssigned =
                          (matrix[perm.key] || []).includes(role.id) ||
                          role.id === "superadmin";
                        const isSuper = role.id === "superadmin";
                        return (
                          <td key={role.id} className="px-4 py-3.5 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggle(perm.key, role.id)}
                              disabled={isSuper}
                              className={cn(
                                "mx-auto flex size-6 items-center justify-center rounded-md border transition-all duration-150 active:scale-90",
                                isSuper
                                  ? "cursor-not-allowed bg-color-mix(in oklab, var(--sb-ink) 5%, transparent)"
                                  : "cursor-pointer",
                                isAssigned
                                  ? "border-(--sb-accent)/50 text-(--sb-accent) bg-(--sb-accent)/5"
                                  : "border-transparent text-gray-400 hover:border-gray-300",
                              )}
                            >
                              {isAssigned ? (
                                <Check size={14} strokeWidth={2.5} />
                              ) : (
                                <X
                                  size={14}
                                  className="opacity-30 group-hover:opacity-100"
                                />
                              )}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </optgroup>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
