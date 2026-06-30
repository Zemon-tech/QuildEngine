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
import { SettingsDialog } from "../settings/settings-dialog";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from "#/components/ui/sidebar";

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

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="w-full text-left rounded-[10px] hover:bg-sb-bg-hover text-sb-ink transition-colors duration-150 data-[state=open]:bg-sb-bg-hover"
                  >
                    <Avatar className="size-7 shrink-0">
                      <AvatarFallback className="text-[11px] font-semibold bg-sb-accent text-sb-accent-foreground">
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                    {!collapsed && (
                      <div className="flex flex-col flex-1 min-w-0 leading-none">
                        <span className="truncate text-[13px] font-medium text-sb-ink">
                          {user.name}
                        </span>
                        <span className="mt-1 truncate text-[11px] text-sb-ink-dim">
                          {user.role}
                        </span>
                      </div>
                    )}
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8} hidden={!collapsed}>
                <span className="text-xs font-medium">{user.name}</span>
              </TooltipContent>
            </Tooltip>

            <DropdownMenuContent
              side={collapsed ? "right" : "top"}
              align={collapsed ? "start" : "end"}
              sideOffset={8}
              className="w-52 bg-sb-bg border border-sb-border text-sb-ink shadow-lg"
            >
              <DropdownMenuLabel className="flex flex-col gap-0.5 py-2">
                <span className="text-[13px] font-medium text-sb-ink">
                  {user.name}
                </span>
                <span className="text-[11px] text-sb-ink-dim">{user.email}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-sb-border" />
              <DropdownMenuItem asChild>
                <Link
                  to="/profile"
                  search={{ tab: "profile" }}
                  className="flex items-center gap-2 text-[13px] w-full cursor-pointer text-sb-ink-muted"
                >
                  <User size={14} />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to="/profile"
                  search={{ tab: "analytics" }}
                  className="flex items-center gap-2 text-[13px] w-full cursor-pointer text-sb-ink-muted"
                >
                  <Trophy size={14} />
                  Achievements
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2 text-[13px] cursor-pointer text-sb-ink-muted"
                onClick={() => setSettingsOpen(true)}
              >
                <Settings size={14} />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-sb-border" />
              <DropdownMenuItem
                className="gap-2 text-[13px] cursor-pointer text-destructive focus:text-destructive"
                onClick={() => alert("Signing out simulator")}
              >
                <LogOut size={14} />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <SidebarMenuAction
            onClick={() => setSettingsOpen(true)}
            className="hover:bg-sb-bg-hover text-sb-ink-muted hover:text-sb-ink cursor-pointer outline-none transition-colors duration-150 rounded-md"
            title="Open Settings"
          >
            <Settings size={14} />
          </SidebarMenuAction>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Global Settings Dialog */}
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
