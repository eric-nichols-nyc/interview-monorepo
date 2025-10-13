import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6 text-center">
        <div>
          <h1 className="text-3xl font-bold text-red-600">Authentication Error</h1>
          <p className="text-muted-foreground mt-2">
            Sorry, we couldn't verify your email. This could be because:
          </p>
        </div>

        <div className="bg-card p-6 rounded-lg border shadow-sm text-left">
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• The verification link has expired</li>
            <li>• The link has already been used</li>
            <li>• There was an issue with the verification process</li>
          </ul>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Please try signing up again or contact support if the problem persists.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/sign-up"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
            >
              Try Again
            </Link>
            <Link
              href="/auth/sign-in"
              className="border border-border px-4 py-2 rounded-md hover:bg-muted transition-colors"
            >
              Sign In Instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}