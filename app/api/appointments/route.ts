import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { bookingSchema } from "@/lib/validations/appointment";

export async function POST(request: Request): Promise<Response> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json(
        {
          success: false,
          error: "You must be logged in to book an appointment",
        },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => null);

    const parsed = bookingSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message ?? "Invalid data",
        },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        appointmentDate: new Date(parsed.data.date),
        userId: session.user.id,
        notes: parsed.data.notes || undefined,
      },
    });

    return Response.json(
      {
        success: true,
        data: appointment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating appointment:", error);

    return Response.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}


export async function GET(): Promise<Response> {
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

    const isAdmin = session.user.role === "ADMIN";

    const appointments = await prisma.appointment.findMany({
      where: isAdmin ? {} : { userId: session.user.id },
      orderBy: {
        appointmentDate: "asc",
      },
      include: isAdmin
        ? {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          }
        : undefined,
    });

    return Response.json(
      {
        success: true,
        data: appointments,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error listing appointments:", error);

    return Response.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}




















// import { prisma } from "@/lib/prisma";
// import type { Appointment } from "@/app/generated/prisma";


// // Request body type
// interface CreateAppointmentRequest {
//   userId: string;
//   date: string; // ISO 8601 date string
//   notes?: string;
// }

// // Response type
// interface CreateAppointmentResponse {
//   success: boolean;
//   data?: Appointment;
//   error?: string;
// }

// export async function POST(
//   request: Request
// ): Promise<Response> {
//   try {
//     // Parse and validate request body
//     let body: unknown;
//     try {
//       body = await request.json();
//     } catch {
//       return Response.json(
//         { success: false, error: "Invalid JSON in request body" },
//         { status: 400 }
//       );
//     }

//     // Type guard and validation
//     if (!body || typeof body !== "object") {
//       return Response.json(
//         { success: false, error: "Request body must be an object" },
//         { status: 400 }
//       );
//     }

//     const typedBody = body as Record<string, unknown>;

//     // Validate required fields
//     if (!typedBody.userId || typeof typedBody.userId !== "string") {
//       return Response.json(
//         { success: false, error: "userId is required and must be a string" },
//         { status: 400 }
//       );
//     }

//     if (!typedBody.date || typeof typedBody.date !== "string") {
//       return Response.json(
//         { success: false, error: "date is required and must be a string" },
//         { status: 400 }
//       );
//     }

//     // Validate date format
//     const appointmentDate = new Date(typedBody.date);
//     if (isNaN(appointmentDate.getTime())) {
//       return Response.json(
//         { success: false, error: "date must be a valid ISO 8601 date string" },
//         { status: 400 }
//       );
//     }

//     // Validate date is in the future
//     if (appointmentDate <= new Date()) {
//       return Response.json(
//         { success: false, error: "Appointment date must be in the future" },
//         { status: 400 }
//       );
//     }

//     // Verify user exists
//     const user = await prisma.user.findUnique({
//       where: { id: typedBody.userId },
//     });

//     if (!user) {
//       return Response.json(
//         { success: false, error: "User not found" },
//         { status: 404 }
//       );
//     }

//     // Create appointment
//     const appointment = await prisma.appointment.create({
//       data: {
//         appointmentDate,
//         userId: typedBody.userId,
//         notes: typeof typedBody.notes === "string" ? typedBody.notes : undefined,
//       },
//     });

//     const response: CreateAppointmentResponse = {
//       success: true,
//       data: appointment,
//     };

//     return Response.json(response, { status: 201 });
//   } catch (error) {
//     console.error("Error creating appointment:", error);

//     return Response.json(
//       {
//         success: false,
//         error:
//           error instanceof Error ? error.message : "Internal server error",
//       },
//       { status: 500 }
//     );
//   }
// }
