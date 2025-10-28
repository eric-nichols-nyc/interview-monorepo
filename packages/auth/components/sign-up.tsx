"use client";

import { useState } from "react";
import { createClient } from "../client";

type SignUpProps = {
  redirectTo?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
};

export const SignUp = ({
  redirectTo = "/",
  onSuccess,
  onError,
}: SignUpProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}${redirectTo}`,
      },
    });

    setLoading(false);

    if (signUpError) {
      const errorMessage = signUpError.message;
      setError(errorMessage);
      onError?.(errorMessage);
    } else {
      setMessage("Check your email for the confirmation link!");
      onSuccess?.();
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-600">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded border border-green-200 bg-green-50 px-4 py-3 text-green-600">
          {message}
        </div>
      )}

      <div>
        <label className="mb-2 block font-medium text-sm" htmlFor="email">
          Email
        </label>
        <input
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
          id="email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          required
          type="email"
          value={email}
        />
      </div>

      <div>
        <label className="mb-2 block font-medium text-sm" htmlFor="password">
          Password
        </label>
        <input
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
          id="password"
          minLength={6}
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          required
          type="password"
          value={password}
        />
        <p className="mt-1 text-gray-500 text-sm">
          Password must be at least 6 characters long
        </p>
      </div>

      <button
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={loading}
        type="submit"
      >
        {loading ? "Creating account..." : "Sign Up"}
      </button>
    </form>
  );
};
