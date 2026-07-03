"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"; 

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-md p-10">
      <h1 className="mb-6 text-3xl font-bold">Log in</h1>

        {error && (
            <p className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</p>
        )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="email" type="email" placeholder="Email" className="w-full rounded border p-3" />
        <input name="password" type="password" placeholder="Password" className="w-full rounded border p-3" />
        
        <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-600 py-3 font-semibold text-white disabled:opacity-50"
        >
            {loading ? "Logging in…" : "Log in"}
        </button>
      </form>
       <p className="mt-4 text-sm">
        No account yet? <a href="/signup" className="text-blue-600 underline">Sign up</a>
      </p>

    </main>
  );
}
