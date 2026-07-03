"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

async function handleSubmit(event: 
React.FormEvent<HTMLFormElement>) { 
    event.preventDefault();
    setError(""); 
    setLoading(true);

const formData = new FormData(event.currentTarget);
const payload = Object.fromEntries(formData.entries());

const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload), 
});

const data = await res.json();
setLoading(false);

if (!res.ok) {
    setError(data.error ?? "Something went wrong");
    return; 
}

    router.push("/login"); 
}

return ( 
    <main className="mx-auto max-w-md p-10">
        <h1 className="mb-6 text-3xl font-bold">Create your account</h1>
        {/* Show the error message if there is one */}
        {error && (
            <p className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
            <input name="firstName" placeholder="First Name" className="w-full rounded border p-3" />
            <input name="lastName" placeholder="Last name" className="w-full rounded border p-3" />
            <input name="email" type="email" placeholder="Email" className="w-full rounded border p-3" />
            <input name="phone" placeholder="Phone" className="w-full rounded border p-3" />
            <input name="address" placeholder="Address" className="w-full rounded border p-3" />
            <input name="password" type="password" placeholder="Password (min 8 chars)" className="w-full rounded border p-3" />
            <button
                type="submit"
                disabled={loading}
                className="w-full rounded bg-blue-600 py-3 font-semibold text-white disabled:opacity-50"
            >
                {loading ? "Creating account..." : "Create account"}
            </button>
        </form>

        <p className="mt-4 text-sm">Already have an account? <a href="/login" className="text-blue-600 underline">Log in</a>
        </p>
    </main>
);
}
