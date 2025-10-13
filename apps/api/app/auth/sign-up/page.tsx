"use client";

import { SignUp } from "@repo/auth/components/sign-up";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/");
    router.refresh();
  };

  const handleError = (error: string) => {
    console.error("Sign up error:", error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-muted-foreground mt-2">
            Sign up for a new account to get started
          </p>
        </div>

        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <SignUp
            onSuccess={handleSuccess}
            onError={handleError}
            redirectTo="/"
          />
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/auth/sign-in"
            className="font-medium text-primary hover:underline"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}