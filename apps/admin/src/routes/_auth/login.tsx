import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Lock, Mail, Shield } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { Button } from "#/components/ui/button";
import { cn } from "#/lib/utils";

export const Route = createFileRoute("/_auth/login")({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  component: LoginPage,
});

function LoginPage() {
  const { redirect: redirectTo } = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Set a mock admin session cookie for testing/development
      const mockUser = {
        id: "mock-admin-id",
        email: email || "admin@quild.in",
        role: "superadmin",
      };
      const mockToken = {
        access_token: "mock-access-token",
        refresh_token: "mock-refresh-token",
        user: mockUser,
      };
      const encodedCookie = encodeURIComponent(JSON.stringify(mockToken));
      document.cookie = `sb-auth-token=${encodedCookie}; path=/; max-age=3600; SameSite=Lax`;

      await new Promise((r) => setTimeout(r, 800)); // placeholder
      navigate({ to: redirectTo ?? "/overview", replace: true });
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rise-in w-full max-w-sm">
      {/* Card */}
      <div className="island-shell rounded-2xl p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <span
            className="flex size-12 items-center justify-center rounded-2xl text-lg font-bold"
            style={{
              background: "color-mix(in oklab, var(--sb-ink) 7%, transparent)",
              color: "var(--sb-ink)",
              fontFamily: "'Fraunces', Georgia, serif",
            }}
          >
            Q
          </span>
          <div>
            <h1
              className="text-xl font-bold tracking-tight"
              style={{
                color: "var(--sb-ink)",
                fontFamily: "'Fraunces', Georgia, serif",
              }}
            >
              Quild Admin
            </h1>
            <p
              className="mt-1 text-xs"
              style={{ color: "var(--sb-ink-muted)" }}
            >
              Sign in to access the admin panel
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-xs font-medium"
              style={{ color: "var(--sb-ink-muted)" }}
            >
              Email address
            </label>
            <div className="relative">
              <Mail
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "var(--sb-ink-dim)" }}
              />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@quild.in"
                className={cn(
                  "w-full rounded-[10px] pl-9 pr-3 py-2.5 text-sm outline-none",
                  "transition-all duration-150",
                  "focus-visible:ring-2 focus-visible:ring-(--sb-accent)/30",
                  "placeholder:text-(--sb-ink-dim)",
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

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-xs font-medium"
              style={{ color: "var(--sb-ink-muted)" }}
            >
              Password
            </label>
            <div className="relative">
              <Lock
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "var(--sb-ink-dim)" }}
              />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className={cn(
                  "w-full rounded-[10px] pl-9 pr-3 py-2.5 text-sm outline-none",
                  "transition-all duration-150",
                  "focus-visible:ring-2 focus-visible:ring-(--sb-accent)/30",
                  "placeholder:text-(--sb-ink-dim)",
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

          {/* Error */}
          {error && (
            <p
              className="text-xs rounded-lg px-3 py-2 text-center"
              style={{
                background: "oklch(0.58 0.24 27 / 0.1)",
                color: "oklch(0.58 0.24 27)",
                border: "1px solid oklch(0.58 0.24 27 / 0.2)",
              }}
            >
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-1 active:scale-95"
          >
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        {/* Footer note */}
        <div
          className="flex items-center gap-1.5 text-center justify-center text-[11px]"
          style={{ color: "var(--sb-ink-dim)" }}
        >
          <Shield size={11} />
          Admin access only. Unauthorized access will be logged.
        </div>
      </div>
    </div>
  );
}
