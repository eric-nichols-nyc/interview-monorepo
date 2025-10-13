"use client";

import { SignIn } from "@repo/auth/components/sign-in";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/");
    router.refresh();
  };

  const handleError = (error: string) => {
    console.error("Sign in error:", error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to your account to continue
          </p>
        </div>

        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <SignIn
            onSuccess={handleSuccess}
            onError={handleError}
            redirectTo="/"
          />
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/sign-up"
            className="font-medium text-primary hover:underline"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}