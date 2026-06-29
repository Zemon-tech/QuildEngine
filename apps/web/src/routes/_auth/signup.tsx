import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SignUpForm } from "../../auth/components/SignUpForm.js";
import { useAuth } from "../../auth/hooks/useAuth.js";

export const Route = createFileRoute("/_auth/signup")({
  component: SignUpPage,
});

function SignUpPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleSignUpSuccess = () => {
    // Redirect to login after successful signup
    navigate({ to: "/login", replace: true });
  };

  return (
    <SignUpForm
      onSignUp={signUp}
      onSuccess={handleSignUpSuccess}
      signInPath="/login"
    />
  );
}
