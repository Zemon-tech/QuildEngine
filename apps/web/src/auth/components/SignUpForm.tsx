import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { signupSchema } from "@quild/contracts";
import { Button } from "#/components/ui/button.js";
import { Input } from "#/components/ui/input.js";
import { Spinner } from "#/components/ui/spinner.js";
import { Mail, Lock, Eye, EyeOff, Shield, Github, Chrome, Compass, User } from "lucide-react";

interface SignUpFormProps {
  onSignUp: (fullName: string, email: string, password: string) => Promise<void>;
  onSuccess: () => void;
  signInPath?: string;
}

export function SignUpForm({
  onSignUp,
  onSuccess,
  signInPath = "/login",
}: SignUpFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      setError(null);
      setSuccessMsg(null);
      setIsSubmitting(true);

      const result = signupSchema.safeParse(value);
      if (!result.success) {
        setError(result.error.issues[0]?.message || "Invalid input values");
        setIsSubmitting(false);
        return;
      }

      try {
        await onSignUp(result.data.fullName, result.data.email, result.data.password);
        setSuccessMsg("Account created successfully! Check your email to confirm registration.");
        setTimeout(() => {
          onSuccess();
        }, 3000);
      } catch (err: any) {
        setError(err.message || "Failed to create account. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="flex w-full max-w-[900px] overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xl transition-all duration-300 md:min-h-[550px]">
      {/* Left Column: Form */}
      <div className="flex flex-1 flex-col justify-between p-8 md:p-12">
        <div className="flex flex-col gap-5">
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
                Create your account
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Fill in the form below to create your account
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
            className="flex flex-col gap-3.5"
          >
            {/* Full Name Field */}
            <form.Field
              name="fullName"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return "Full name is required";
                  if (value.length < 2) return "Name must be at least 2 characters";
                  return undefined;
                },
              }}
              children={(field) => (
                <div className="flex flex-col gap-1">
                  <label htmlFor={field.name} className="text-xs font-semibold text-muted-foreground/80">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 size-4 pointer-events-none" />
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="John Doe"
                      className="pl-9 bg-muted/20 border-border focus-visible:ring-1 focus-visible:ring-primary/40"
                      type="text"
                      required
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
                <div className="flex flex-col gap-1">
                  <label htmlFor={field.name} className="text-xs font-semibold text-muted-foreground/80">
                    Email
                  </label>
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
                  if (value.length < 6) return "Password must be at least 6 characters";
                  return undefined;
                },
              }}
              children={(field) => (
                <div className="flex flex-col gap-1">
                  <label htmlFor={field.name} className="text-xs font-semibold text-muted-foreground/80">
                    Password
                  </label>
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

            {/* Confirm Password Field */}
            <form.Field
              name="confirmPassword"
              children={(field) => (
                <div className="flex flex-col gap-1">
                  <label htmlFor={field.name} className="text-xs font-semibold text-muted-foreground/80">
                    Confirm Password
                  </label>
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
                      type={showConfirmPassword ? "text" : "password"}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground/80 transition-colors focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
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

            {/* Error Message */}
            {error && (
              <div className="text-xs rounded-xl p-3 border border-destructive/20 bg-destructive/10 text-destructive text-center font-medium animate-pulse">
                {error}
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="text-xs rounded-xl p-3 border border-green-500/20 bg-green-500/10 text-green-500 text-center font-medium">
                {successMsg}
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
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Socials Divider */}
          <div className="relative my-1">
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
            Already have an account?{" "}
            <a href={signInPath} className="text-primary font-semibold hover:underline">
              Sign in
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
        {/* Sunset backdrop gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--sb-accent)/35,transparent_55%),radial-gradient(ellipse_at_bottom_left,var(--sb-primary)/25,transparent_55%),linear-gradient(135deg,rgba(15,15,18,0.95),rgba(20,20,25,0.95))]" />
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)",
            backgroundSize: "20px 20px"
          }}
        />

        <div className="relative z-10">
          <span className="text-sm font-bold text-white tracking-widest uppercase opacity-75">Quild</span>
        </div>

        <div className="relative z-10 flex flex-col gap-4">
          <blockquote className="text-2xl font-bold tracking-tight text-white leading-snug">
            “The Operating System for Teams That Ship.”
          </blockquote>
          <p className="text-xs text-white/60 max-w-[280px]">
            Master DSA, map your learning roadmaps, and solve system design challenges in a single workspace.
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
