import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { SignOutButton } from "@/components/ui/sign-out-button";

export async function NavBar() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-5xl items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold text-blue-600">
          BookEase
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {session ? (
            <>
              <Link href="/book" className="hover:underline">
                Book
              </Link>

              <Link href="/appointments" className="hover:underline">
                My Appointments
              </Link>

              {isAdmin && (
                <Link href="/dashboard" className="hover:underline">
                  Admin
                </Link>
              )}

              <span className="text-gray-500">
                {session.user?.name}
              </span>

              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                Log in
              </Link>

              <Link
                href="/signup"
                className="rounded bg-blue-600 px-3 py-1 text-white"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}