"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded bg-slate-800 px-4 py-2 text-white"
    >
      Sign out
    </button>
  );
}