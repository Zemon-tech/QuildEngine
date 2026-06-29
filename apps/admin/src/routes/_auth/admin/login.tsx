import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { LoginForm } from "../../../auth/components/LoginForm.js";
import { useAuth } from "../../../auth/hooks/useAuth.js";

export const Route = createFileRoute("/_auth/admin/login")({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const search = Route.useSearch() as { redirect?: string };
  const redirectTo = search.redirect;
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLoginSuccess = () => {
    navigate({ to: redirectTo ?? "/overview", replace: true });
  };

  return (
    <div className="flex min-h-screen w-screen items-center justify-center p-4 md:p-8 bg-background">
      <LoginForm
        onLogin={login}
        onSuccess={handleLoginSuccess}
        signUpPath="/admin/signup"
        forgotPasswordPath="#"
      />
    </div>
  );
}
