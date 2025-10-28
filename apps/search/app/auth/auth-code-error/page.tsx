import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6 text-center">
        <div>
          <h1 className="font-bold text-3xl text-red-600">
            Authentication Error
          </h1>
          <p className="mt-2 text-muted-foreground">
            Sorry, we couldn't verify your email. This could be because:
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-left shadow-sm">
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li>• The verification link has expired</li>
            <li>• The link has already been used</li>
            <li>• There was an issue with the verification process</li>
          </ul>
        </div>

        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Please try signing up again or contact support if the problem
            persists.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground transition-opacity hover:opacity-90"
              href="/auth/sign-up"
            >
              Try Again
            </Link>
            <Link
              className="rounded-md border border-border px-4 py-2 transition-colors hover:bg-muted"
              href="/auth/sign-in"
            >
              Sign In Instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
