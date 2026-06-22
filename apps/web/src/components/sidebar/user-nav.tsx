import { Link } from "@tanstack/react-router";
import { LogOut, Settings, Trophy, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "#/components/ui/tooltip";
import { cn } from "#/lib/utils";
import { SettingsDialog } from "../settings/settings-dialog";

interface UserNavProps {
  collapsed?: boolean;
}

export function UserNav({ collapsed = false }: UserNavProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [user, setUser] = useState({
    name: "Alex Johnson",
    email: "alex@example.com",
    initials: "AJ",
    role: "Pro Member",
  });

  // Function to load latest user profile data from local storage
  const loadUser = () => {
    const saved = localStorage.getItem("quild_profile_data_v1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const name = parsed.header?.name || "Alex Johnson";
        const email = parsed.header?.email || "alex@example.com";
        const initials = name
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
        const role = parsed.header?.role || "Pro Member";
        setUser({ name, email, initials, role });
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    loadUser();
    // Listen for local updates
    window.addEventListener("storage", loadUser);
    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  const trigger = (
    <div
      className={cn(
        "group flex w-full items-center rounded-[10px] px-2 py-1.5 outline-none",
        "transition-colors duration-150",
        "hover:bg-[var(--sb-bg-hover)]",
        "focus-visible:ring-2 focus-visible:ring-[var(--sb-accent)]/60",
        collapsed && "justify-center px-1.5",
      )}
    >
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center flex-1 min-w-0 text-left outline-none cursor-pointer"
        >
          <Avatar className="size-7 shrink-0">
            <AvatarFallback
              className="text-[11px] font-semibold"
              style={{
                background: "var(--sb-accent)",
                color: "var(--sb-accent-foreground)",
              }}
            >
              {user.initials}
            </AvatarFallback>
          </Avatar>

          {!collapsed && (
            <div className="ml-2 flex min-w-0 flex-1 flex-col text-left">
              <span
                className="truncate text-[13px] font-medium leading-none"
                style={{ color: "var(--sb-ink)" }}
              >
                {user.name}
              </span>
              <span
                className="mt-0.5 truncate text-[11px] leading-none"
                style={{ color: "var(--sb-ink-dim)" }}
              >
                {user.role}
              </span>
            </div>
          )}
        </button>
      </DropdownMenuTrigger>

      {!collapsed && (
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          className="ml-auto p-1 rounded-md hover:bg-[color-mix(in oklab,var(--sb-ink)_10%,transparent)] text-[var(--sb-ink-muted)] hover:text-[var(--sb-ink)] cursor-pointer outline-none transition-colors duration-150"
          title="Open Settings"
        >
          <Settings size={14} />
        </button>
      )}
    </div>
  );

  const menu = (
    <DropdownMenu>
      {trigger}
      <DropdownMenuContent
        side={collapsed ? "right" : "top"}
        align={collapsed ? "start" : "end"}
        sideOffset={8}
        className="w-52"
        style={{
          background: "var(--sb-bg)",
          border: "1px solid var(--sb-border)",
          color: "var(--sb-ink)",
        }}
      >
        <DropdownMenuLabel className="flex flex-col gap-0.5 py-2">
          <span
            className="text-[13px] font-medium"
            style={{ color: "var(--sb-ink)" }}
          >
            {user.name}
          </span>
          <span className="text-[11px]" style={{ color: "var(--sb-ink-dim)" }}>
            {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator style={{ background: "var(--sb-border)" }} />
        <DropdownMenuItem asChild>
          <Link
            to="/profile"
            search={{ tab: "profile" }}
            className="flex items-center gap-2 text-[13px] w-full cursor-pointer"
            style={{ color: "var(--sb-ink-muted)" }}
          >
            <User size={14} />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            to="/profile"
            search={{ tab: "analytics" }}
            className="flex items-center gap-2 text-[13px] w-full cursor-pointer"
            style={{ color: "var(--sb-ink-muted)" }}
          >
            <Trophy size={14} />
            Achievements
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-2 text-[13px] cursor-pointer"
          style={{ color: "var(--sb-ink-muted)" }}
          onClick={() => setSettingsOpen(true)}
        >
          <Settings size={14} />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator style={{ background: "var(--sb-border)" }} />
        <DropdownMenuItem
          className="gap-2 text-[13px] cursor-pointer"
          style={{ color: "oklch(0.65 0 0)" }}
          onClick={() => alert("Signing out simulator")}
        >
          <LogOut size={14} />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
      {collapsed ? (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <div>{menu}</div>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            <span className="text-xs font-medium">{user.name}</span>
          </TooltipContent>
        </Tooltip>
      ) : (
        menu
      )}

      {/* Global Settings Dialog */}
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
