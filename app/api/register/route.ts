import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";


export async function POST(request: Request): Promise<Response> {
  try {
const body = await request.json().catch(() => null);
if (!body || typeof body !== "object") {
    return Response.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
    );
}

const { firstName, lastName, email, phone, address, password } =
      body as Record<string, unknown>;


const fields = { firstName, lastName, email, phone, address, password };
for (const [key, value] of Object.entries(fields)) {
    if (typeof value !== "string" || value.trim() === "") {
        return Response.json(
          { success: false, error: `${key} is required` },
          { status: 400 }
        );
      }
    }

    if ((password as string).length < 8) {
      return Response.json(
        { success: false, error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

const existing = await prisma.user.findUnique({
    where: { 
        email: email as string 
    },
});
if (existing) {
    return Response.json(
        { 
            success: false, 
            error: "An account with this email already exists" 
        },
        { 
            status: 409 
        } // 409 = Conflict
    );
}

const passwordHash = await bcrypt.hash(password as string, 10);

const user = await prisma.user.create({
      data: {
        firstName: firstName as string,
        lastName: lastName as string,
        email: email as string,
        phone: phone as string,
        address: address as string,
        password: passwordHash,
    },
});

return Response.json(
      { success: true, data: { id: user.id, email: user.email } },
      { status: 201 } // 201 = Created
    );
  } catch (error) {
    console.error("Register error:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
