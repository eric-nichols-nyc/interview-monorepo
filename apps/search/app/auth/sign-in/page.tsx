"use client";

import { SignIn } from "@repo/auth/components/sign-in";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignInPage() {
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
          <h1 className="font-bold text-3xl">Welcome Back</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <SignIn
            onError={handleError}
            onSuccess={handleSuccess}
            redirectTo="/"
          />
        </div>

        <p className="text-center text-muted-foreground text-sm">
          Don&apos;t have an account?{" "}
          <Link
            className="font-medium text-primary hover:underline"
            href="/auth/sign-up"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}
