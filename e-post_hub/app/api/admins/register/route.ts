import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { message: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    const {
      name,
      officeNumber,
      officeHours,
      officeLocation,
      email,
      password,
      creatorCode,
    } = body as {
      name?: string;
      officeNumber?: string;
      officeHours?: string;
      officeLocation?: string;
      email?: string;
      password?: string;
      creatorCode?: string;
    };

    if (!name || !email || !password || !creatorCode) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Creator code check (default matches your Prisma schema default)
    const expectedCreatorCode =
      process.env.ADMIN_CREATOR_CODE || "wc_create_admin";

    if (creatorCode !== expectedCreatorCode) {
      return NextResponse.json(
        { message: "Invalid creator code" },
        { status: 403 }
      );
    }

    // Prevent duplicate emails
    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 409 }
      );
    }

    // Create user + linked admin profile
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "ADMIN",
        admin: {
          create: {
            officeNumber: officeNumber || null,
            officeHours: officeHours || null,
            officeLocation: officeLocation || null,
            creatorCode, // store what was used
          },
        },
      },
      select: { id: true, email: true, name: true, role: true },
    });

    // Issue a JWT like your login route does
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, name: user.name },
      (process.env.JWT_SECRET as string) || "dev-secret"
    );

    return NextResponse.json(
      { message: "Admin registered successfully", token, role: user.role },
      { status: 201 }
    );
  } catch (error: any) {
    // Prisma unique constraint (backup)
    if (error?.code === "P2002") {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 409 }
      );
    }

    console.error("Error registering admin:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
