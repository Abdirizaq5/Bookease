import { prisma } from "@/lib/prisma"; 

export async function POST(
  request: Request
) {
  const body = await request.json();

  const appointment =
    await prisma.appointment.create({
      data: {
        appointmentDate:
          new Date(body.date),

        userId: body.userId,
      },
    });

  return Response.json(appointment);
}
