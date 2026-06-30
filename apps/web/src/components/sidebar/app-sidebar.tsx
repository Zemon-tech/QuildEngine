import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Code2,
  FlaskConical,
  LayoutDashboard,
  Mail,
  Menu,
  Monitor,
  Moon,
  Sparkles,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { GlobalSearchTrigger } from "#/components/search/global-search";
import { Button } from "#/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { Input } from "#/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "#/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "#/components/ui/tooltip";
import { cn } from "#/lib/utils";
import { AIAssistant } from "./ai-assistant";
import { SidebarHeader as CustomSidebarHeader } from "./sidebar-header";
import { UserNav } from "./user-nav";

export function AppSidebar() {
  const { state, toggleSidebar, setOpenMobile } = useSidebar();
  const [aiOpen, setAiOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { theme, setTheme } = useTheme();

  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");
  const [newsletterDialogOpen, setNewsletterDialogOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isSubscribed =
        localStorage.getItem("quild_newsletter_subscribed") === "true";
      setSubscribed(isSubscribed);
    }
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    localStorage.setItem("quild_newsletter_subscribed", "true");
    setSubscribed(true);
    setNewsletterDialogOpen(false);
    setEmail("");
  };

  const isActive = (path: string) =>
    currentPath === path || currentPath.startsWith(path + "/");

  const navItems = [
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "Learn", to: "/learn", icon: BookOpen },
    { label: "Practice", to: "/practice", icon: Code2 },
    { label: "Research", to: "/research", icon: FlaskConical },
    { label: "Events", to: "/events", icon: Calendar },
  ];

  return (
    <>
      {/* Mobile hamburger (only visible on small screens) */}
      <button
        type="button"
        onClick={() => setOpenMobile(true)}
        aria-label="Open navigation"
        className={cn(
          "fixed left-4 top-4 z-40 flex size-9 items-center justify-center rounded-[10px] md:hidden",
          "transition-opacity duration-150 hover:opacity-70 cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sb-accent)]/60",
          "bg-sb-bg border border-sb-border text-sb-ink-muted",
        )}
      >
        <Menu size={16} />
      </button>

      {/* Main Sidebar */}
      <Sidebar collapsible="icon" className="border-r border-sb-border">
        <SidebarHeader className="p-0">
          <CustomSidebarHeader
            collapsed={state === "collapsed"}
            onToggle={toggleSidebar}
          />
        </SidebarHeader>

        <SidebarContent className="px-2 py-2 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <SidebarMenu>
              <SidebarMenuItem className="mb-2">
                <GlobalSearchTrigger />
              </SidebarMenuItem>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.to)}
                    tooltip={item.label}
                    className="rounded-[10px] px-2.5 py-[7px]"
                  >
                    <Link
                      to={item.to}
                      className={cn(
                        "flex items-center gap-2.5 w-full text-sm font-medium transition-colors",
                        isActive(item.to)
                          ? "text-[var(--sb-accent)] font-semibold"
                          : "text-[var(--sb-ink-muted)] hover:text-[var(--sb-ink)]",
                      )}
                    >
                      <item.icon size={16} />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Collapsed state newsletter sign up icon */}
              {state === "collapsed" && (
                <SidebarMenuItem>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      {subscribed ? (
                        <div className="flex size-8 items-center justify-center rounded-[10px] text-emerald-600 dark:text-emerald-500 bg-emerald-500/5">
                          <CheckCircle2 size={16} />
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setNewsletterDialogOpen(true)}
                          className="flex size-8 items-center justify-center rounded-[10px] text-[var(--sb-ink-muted)] hover:bg-[var(--sb-bg-hover)] hover:text-[var(--sb-ink)] outline-none transition-all cursor-pointer"
                        >
                          <Mail size={16} />
                        </button>
                      )}
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={8}>
                      <span>
                        {subscribed
                          ? "Subscribed to Newsletter"
                          : "Subscribe to Newsletter"}
                      </span>
                    </TooltipContent>
                  </Tooltip>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </div>

          {/* Expanded state newsletter card at bottom of Content */}
          {state !== "collapsed" && (
            <div className="mt-auto p-3 rounded-xl border border-sb-border/60 bg-sb-bg-hover/30 mx-1 mb-2 flex flex-col gap-2.5">
              <div className="flex flex-col gap-1">
                <h4 className="text-xs font-semibold text-sb-ink flex items-center gap-1.5">
                  <Mail size={14} className="text-sb-accent" />
                  Join Newsletter
                </h4>
                <p className="text-[11px] leading-relaxed text-sb-ink-dim">
                  Get deep tech tutorials, roadmaps, and event updates.
                </p>
              </div>
              {subscribed ? (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-emerald-600 dark:text-emerald-500 text-xs">
                  <CheckCircle2 size={14} className="shrink-0" />
                  <span className="truncate font-medium">
                    Subscribed to Quild
                  </span>
                </div>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  className="flex flex-col gap-2"
                >
                  <Input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-8 text-xs rounded-lg px-2 bg-transparent border-sb-border focus-visible:ring-sb-accent/20"
                  />
                  <Button
                    type="submit"
                    className="w-full text-xs h-8 bg-sb-accent hover:opacity-90 text-white rounded-lg transition-all border-0 shadow-none font-medium cursor-pointer"
                  >
                    Subscribe
                  </Button>
                </form>
              )}
            </div>
          )}
        </SidebarContent>

        <SidebarFooter className="p-2 gap-2 border-t border-[var(--sb-border)]">
          {/* AI Assistant and Theme Toggle Icon buttons on top of User profile avatar */}
          <div
            className={cn(
              "flex gap-2 items-center justify-center",
              state === "collapsed" ? "flex-col" : "flex-row px-1",
            )}
          >
            {/* AI Assistant button */}
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setAiOpen(!aiOpen)}
                  className={cn(
                    "relative flex items-center justify-center rounded-[10px] size-8 outline-none transition-all duration-150 cursor-pointer active:scale-95",
                    "hover:bg-sb-bg-hover",
                    aiOpen
                      ? "bg-[var(--sb-pill)] text-sb-accent"
                      : "text-sb-ink-muted",
                  )}
                >
                  <Sparkles size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                <span>AI Assistant</span>
              </TooltipContent>
            </Tooltip>
 
            {/* Theme Toggle */}
            <DropdownMenu>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "relative flex items-center justify-center rounded-[10px] size-8 outline-none transition-all duration-150 cursor-pointer active:scale-95",
                        "hover:bg-sb-bg-hover text-sb-ink-muted",
                      )}
                    >
                      {theme === "light" ? (
                        <Sun size={16} />
                      ) : theme === "dark" ? (
                        <Moon size={16} />
                      ) : (
                        <Monitor size={16} />
                      )}
                    </button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  <span>
                    Theme:{" "}
                    {theme
                      ? theme.charAt(0).toUpperCase() + theme.slice(1)
                      : "System"}
                  </span>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent
                side="right"
                align="end"
                sideOffset={8}
                className="w-36 bg-sb-bg border border-sb-border text-sb-ink shadow-lg"
              >
                <DropdownMenuItem
                  onClick={() => setTheme("light")}
                  className="cursor-pointer gap-2 text-xs"
                >
                  <Sun size={14} /> Light
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme("dark")}
                  className="cursor-pointer gap-2 text-xs"
                >
                  <Moon size={14} /> Dark
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme("system")}
                  className="cursor-pointer gap-2 text-xs"
                >
                  <Monitor size={14} /> System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* User Nav Avatar */}
          <div className="pt-1">
            <UserNav collapsed={state === "collapsed"} />
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* AI Assistant floating panel */}
      <AIAssistant open={aiOpen} onClose={() => setAiOpen(false)} />

      {/* Newsletter Subscription Dialog for collapsed state */}
      <Dialog
        open={newsletterDialogOpen}
        onOpenChange={setNewsletterDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="text-[var(--sb-accent)]" size={18} />
              Subscribe to Quild Newsletter
            </DialogTitle>
            <DialogDescription>
              Get the latest deep tech tutorials, roadmaps, and event
              notifications delivered directly to your inbox.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-sb-ink">
                Email Address
              </label>
              <Input
                type="email"
                required
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus-visible:ring-sb-accent/20"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setNewsletterDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-sb-accent text-sb-accent-foreground hover:opacity-90 border-0"
              >
                Subscribe
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
