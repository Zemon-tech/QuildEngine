import { Link } from "@tanstack/react-router";
import { LogOut, Settings, Shield, User } from "lucide-react";
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

interface AdminUserNavProps {
  collapsed?: boolean;
}

// Placeholder user — will be replaced once auth is wired up
const PLACEHOLDER_USER = {
  name: "Admin User",
  email: "admin@quild.in",
  initials: "AU",
  role: "superadmin",
};

export function AdminUserNav({ collapsed = false }: AdminUserNavProps) {
  const user = PLACEHOLDER_USER;

  const trigger = (
    <div
      className={cn(
        "group flex w-full items-center rounded-[10px] px-2 py-1.5 outline-none",
        "transition-colors duration-150",
        "hover:bg-(--sb-bg-hover)",
        "focus-visible:ring-2 focus-visible:ring-(--sb-accent)/60",
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
                className="mt-0.5 truncate text-[11px] leading-none capitalize"
                style={{ color: "var(--sb-ink-dim)" }}
              >
                {user.role}
              </span>
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
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
            to="/settings"
            className="flex items-center gap-2 text-[13px] w-full cursor-pointer"
            style={{ color: "var(--sb-ink-muted)" }}
          >
            <User size={14} />
            My Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            to="/roles"
            className="flex items-center gap-2 text-[13px] w-full cursor-pointer"
            style={{ color: "var(--sb-ink-muted)" }}
          >
            <Shield size={14} />
            Roles & Permissions
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            to="/settings"
            className="flex items-center gap-2 text-[13px] w-full cursor-pointer"
            style={{ color: "var(--sb-ink-muted)" }}
          >
            <Settings size={14} />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator style={{ background: "var(--sb-border)" }} />
        <DropdownMenuItem
          className="gap-2 text-[13px] cursor-pointer"
          style={{ color: "oklch(0.65 0 0)" }}
          onClick={() => {
            // TODO: wire up Supabase sign out
            window.location.href = "/login";
          }}
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
    </>
  );
}
