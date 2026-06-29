import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { LoginForm } from "../../auth/components/LoginForm.js";
import { useAuth } from "../../auth/hooks/useAuth.js";

export const Route = createFileRoute("/_auth/login")({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  component: LoginPage,
});

function LoginPage() {
  const search = Route.useSearch() as { redirect?: string };
  const redirectTo = search.redirect;
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLoginSuccess = () => {
    // Navigate to original destination or default dashboard page
    navigate({ to: redirectTo ?? "/dashboard", replace: true });
  };

  return (
    <LoginForm
      onLogin={login}
      onSuccess={handleLoginSuccess}
      signUpPath="/signup"
      forgotPasswordPath="/forgot-password"
    />
  );
}
