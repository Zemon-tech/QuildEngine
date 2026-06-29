import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { loginSchema } from "@quild/contracts";
import { Button } from "#/components/ui/button.js";
import { Input } from "#/components/ui/input.js";
import { Switch } from "#/components/ui/switch.js";
import { Spinner } from "#/components/ui/spinner.js";
import { Mail, Lock, Eye, EyeOff, Shield, Github, Chrome, Compass } from "lucide-react";

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSuccess: () => void;
  signUpPath?: string;
  forgotPasswordPath?: string;
}

export function LoginForm({
  onLogin,
  onSuccess,
  signUpPath = "/admin/signup",
  forgotPasswordPath = "/admin/forgot-password",
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    onSubmit: async ({ value }) => {
      setError(null);
      setIsSubmitting(true);
      
      const result = loginSchema.safeParse(value);
      if (!result.success) {
        setError(result.error.issues[0]?.message || "Invalid input values");
        setIsSubmitting(false);
        return;
      }

      try {
        await onLogin(result.data.email, result.data.password);
        onSuccess();
      } catch (err: any) {
        setError(err.message || "Invalid email or password. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="flex w-full max-w-[900px] overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xl transition-all duration-300 md:min-h-[550px]">
      {/* Left Column: Form */}
      <div className="flex flex-1 flex-col justify-between p-8 md:p-12">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <span
              className="flex size-10 items-center justify-center rounded-xl text-lg font-bold shadow-md shadow-primary/10 select-none cursor-default"
              style={{
                background: "color-mix(in oklab, var(--sb-accent) 12%, transparent)",
                color: "var(--sb-accent)",
                fontFamily: "'Outfit', 'Inter', sans-serif",
              }}
            >
              Q
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground font-semibold">
                Welcome back
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Login to your account
              </p>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="flex flex-col gap-4"
          >
            {/* Email Field */}
            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return "Email is required";
                  if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email address";
                  return undefined;
                },
              }}
              children={(field) => (
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label htmlFor={field.name} className="text-xs font-semibold text-muted-foreground/80">
                      Email Address
                    </label>
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 size-4 pointer-events-none" />
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="m@example.com"
                      className="pl-9 bg-muted/20 border-border focus-visible:ring-1 focus-visible:ring-primary/40"
                      type="email"
                      required
                      autoComplete="email"
                    />
                  </div>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-[11px] text-destructive font-medium">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Password Field */}
            <form.Field
              name="password"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return "Password is required";
                  return undefined;
                },
              }}
              children={(field) => (
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label htmlFor={field.name} className="text-xs font-semibold text-muted-foreground/80">
                      Password
                    </label>
                    <a
                      href={forgotPasswordPath}
                      className="text-xs font-medium text-primary hover:underline transition-colors"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 size-4 pointer-events-none" />
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="••••••••"
                      className="pl-9 pr-9 bg-muted/20 border-border focus-visible:ring-1 focus-visible:ring-primary/40"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground/80 transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-[11px] text-destructive font-medium">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Remember Me */}
            <form.Field
              name="rememberMe"
              children={(field) => (
                <div className="flex items-center gap-2 mt-1">
                  <Switch
                    id={field.name}
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(checked)}
                  />
                  <label htmlFor={field.name} className="text-xs text-muted-foreground cursor-pointer select-none">
                    Remember me on this device
                  </label>
                </div>
              )}
            />

            {/* Error Message */}
            {error && (
              <div className="text-xs rounded-xl p-3 border border-destructive/20 bg-destructive/10 text-destructive text-center font-medium animate-pulse">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 transition-transform duration-100 active:scale-[0.98] font-medium"
            >
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2 size-4 text-primary-foreground animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          {/* Socials Divider */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/80" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-3 text-muted-foreground text-[10px] font-semibold tracking-wider">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-3 gap-3">
            <Button variant="outline" type="button" className="transition-transform active:scale-[0.97]" disabled={isSubmitting}>
              <Github className="size-4" />
            </Button>
            <Button variant="outline" type="button" className="transition-transform active:scale-[0.97]" disabled={isSubmitting}>
              <Chrome className="size-4" />
            </Button>
            <Button variant="outline" type="button" className="transition-transform active:scale-[0.97]" disabled={isSubmitting}>
              <Compass className="size-4" />
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex flex-col items-center gap-4 text-center">
          <p className="text-xs text-muted-foreground">
            Don't have an account?{" "}
            <a href={signUpPath} className="text-primary font-semibold hover:underline">
              Sign up
            </a>
          </p>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
            <Shield className="size-3" />
            Secure authentication verified by Supabase Guard.
          </div>
        </div>
      </div>

      {/* Right Column: Visual Brand Card */}
      <div className="relative hidden w-[42%] flex-col justify-between overflow-hidden bg-zinc-950 p-8 md:flex select-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--sb-accent)/35,transparent_55%),radial-gradient(ellipse_at_bottom_left,var(--sb-primary)/25,transparent_55%),linear-gradient(135deg,rgba(15,15,18,0.95),rgba(20,20,25,0.95))]" />
        
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)",
            backgroundSize: "20px 20px"
          }}
        />

        <div className="relative z-10">
          <span className="text-sm font-bold text-white tracking-widest uppercase opacity-75">Quild Admin</span>
        </div>

        <div className="relative z-10 flex flex-col gap-4">
          <blockquote className="text-2xl font-bold tracking-tight text-white leading-snug">
            “The Operating System for Teams That Ship.”
          </blockquote>
          <p className="text-xs text-white/60 max-w-[280px]">
            Manage users, courses, roadmaps, and moderate community queries.
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between text-[11px] text-white/40">
          <span>Quild_Engine</span>
          <span className="font-semibold tracking-wider">v1.0.0</span>
        </div>
      </div>
    </div>
  );
}
