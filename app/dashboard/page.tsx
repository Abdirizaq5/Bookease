import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/ui/sign-out-button";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user?.role !== "ADMIN") redirect("/");

  return (
    <div className="p-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <span>Signed in as {session.user?.name}</span>
          <SignOutButton />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="border p-4">Today's Appointments</div>
        <div className="border p-4">Customers</div>
        <div className="border p-4">Revenue</div>
      </div>
    </div>
  );
}
