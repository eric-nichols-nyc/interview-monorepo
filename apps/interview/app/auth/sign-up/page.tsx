"use client";

import { SignUp } from "@repo/auth/components/sign-up";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/");
    router.refresh();
  };

  const handleError = (_error: string) => {};

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="font-bold text-3xl">Create Account</h1>
          <p className="mt-2 text-muted-foreground">
            Sign up for a new account to get started
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <SignUp
            onError={handleError}
            onSuccess={handleSuccess}
            redirectTo="/"
          />
        </div>

        <p className="text-center text-muted-foreground text-sm">
          Already have an account?{" "}
          <Link
            className="font-medium text-primary hover:underline"
            href="/auth/sign-in"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
