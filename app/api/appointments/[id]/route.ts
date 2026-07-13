import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { updateAppointmentSchema } from "@/lib/validations/appointment";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json(
        {
          success: false,
          error: "You must be logged in",
        },
        { status: 401 }
      );
    }

    const { id } = await params;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      return Response.json(
        {
          success: false,
          error: "Appointment not found",
        },
        { status: 404 }
      );
    }

    const isAdmin = session.user.role === "ADMIN";
    const isOwner = appointment.userId === session.user.id;

    if (!isAdmin && !isOwner) {
      return Response.json(
        {
          success: false,
          error: "You are not allowed to change this appointment",
        },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => null);

    const parsed = updateAppointmentSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message ?? "Invalid data",
        },
        { status: 400 }
      );
    }

    if (!isAdmin && parsed.data.status === "CONFIRMED") {
      return Response.json(
        {
          success: false,
          error: "Only an admin can confirm an appointment",
        },
        { status: 403 }
      );
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        status: parsed.data.status ?? undefined,
        appointmentDate: parsed.data.date
          ? new Date(parsed.data.date)
          : undefined,
      },
    });

    return Response.json(
      {
        success: true,
        data: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating appointment:", error);

    return Response.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
