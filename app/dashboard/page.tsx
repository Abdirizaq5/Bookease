import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { StatusBadge } from "@/components/ui/status-badge";
import { SignOutButton } from "@/components/ui/sign-out-button";
import { AdminActions } from "@/components/ui/admin-actions";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  // Admin guard
  if (!session) redirect("/login");
  if (session.user?.role !== "ADMIN") redirect("/");

  // Load all appointments with customer details
  const appointments = await prisma.appointment.findMany({
    orderBy: {
      appointmentDate: "asc",
    },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  // Customer count
  const customerCount = await prisma.user.count({
    where: {
      role: "CUSTOMER",
    },
  });

  // Appointment stats
  const pending = appointments.filter(
    (a) => a.status === "PENDING"
  ).length;

  const confirmed = appointments.filter(
    (a) => a.status === "CONFIRMED"
  ).length;

  return (
    <div className="p-10">


      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <div className="flex items-center gap-4">
          <span>
            Signed in as {session.user?.name}
          </span>

          <SignOutButton />
        </div>
      </div>


      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label="Total appointments"
          value={appointments.length}
        />

        <StatCard
          label="Pending"
          value={pending}
        />

        <StatCard
          label="Confirmed"
          value={confirmed}
        />

        <StatCard
          label="Customers"
          value={customerCount}
        />
      </div>


      {appointments.length === 0 ? (
        <p className="text-gray-600">
          No appointments yet.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                Customer
              </TableHead>

              <TableHead>
                Date &amp; Time
              </TableHead>

              <TableHead>
                Status
              </TableHead>

              <TableHead>
                Notes
              </TableHead>

              <TableHead>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>


          <TableBody>
            {appointments.map((appt) => (
              <TableRow key={appt.id}>

                <TableCell>
                  {appt.user.firstName}{" "}
                  {appt.user.lastName}
                </TableCell>


                <TableCell>
                  {appt.appointmentDate.toLocaleString()}
                </TableCell>


                <TableCell>
                  <StatusBadge status={appt.status} />
                </TableCell>


                <TableCell>
                  {appt.notes ?? "—"}
                </TableCell>


                <TableCell>
                  <AdminActions
                    appointmentId={appt.id}
                    status={appt.status}
                  />
                </TableCell>

              </TableRow>
            ))}
          </TableBody>

        </Table>
      )}

    </div>
  );
}



function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="text-2xl font-bold">
        {value}
      </p>
    </div>
  );
}
