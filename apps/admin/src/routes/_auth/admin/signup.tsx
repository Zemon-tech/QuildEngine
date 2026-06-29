import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SignUpForm } from "../../../auth/components/SignUpForm.js";
import { useAuth } from "../../../auth/hooks/useAuth.js";

export const Route = createFileRoute("/_auth/admin/signup")({
  component: AdminSignUpPage,
});

function AdminSignUpPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleSignUpSuccess = () => {
    navigate({ to: "/admin/login", replace: true });
  };

  const handleSignUp = async (fullName: string, email: string, password: string, invitationToken: string) => {
    const { supabase } = await import("../../../auth/services/supabase.js");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          invitation_token: invitationToken,
          role: "admin",
        },
      },
    });
    if (error) throw error;
  };

  return (
    <div className="flex min-h-screen w-screen items-center justify-center p-4 md:p-8 bg-background">
      <SignUpForm
        onSignUp={handleSignUp}
        onSuccess={handleSignUpSuccess}
        signInPath="/admin/login"
      />
    </div>
  );
}
