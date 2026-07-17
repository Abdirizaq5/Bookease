import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Link from "next/link";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { CancelButton } from "@/components/ui/cancel-button";

export default async function AppointmentsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const appointments = await prisma.appointment.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      appointmentDate: "asc",
    },
  });

  return (
    <main className="mx-auto max-w-3xl p-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Appointments</h1>

        <Link
          href="/book"
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Book new
        </Link>
      </div>

      {appointments.length === 0 ? (
        <p className="text-gray-600">
          You have no appointments yet. {" "}
          <Link href="/book" className="text-blue-600 underline">
            Book one
          </Link>
          .
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date &amp; time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {appointments.map((appt) => (
              <TableRow key={appt.id}>
                <TableCell>{appt.appointmentDate.toLocaleString()}</TableCell>
                <TableCell>
                  <StatusBadge status={appt.status} />
                </TableCell>
                <TableCell>{appt.notes ?? "—"}</TableCell>
                <TableCell>
                  {appt.status !== "CANCELLED" && (
                    <CancelButton appointmentId={appt.id} />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </main>
  );
}
