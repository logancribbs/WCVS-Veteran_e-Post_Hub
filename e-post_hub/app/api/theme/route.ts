import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const validOverrides = new Set(["auto", "default", "fourthOfJuly", "christmas"]);

export async function GET() {
  try {
    const setting = await prisma.settings.findUnique({
      where: { key: "landing_page_theme_override" },
    });

    return NextResponse.json({
      override: setting?.value ?? "auto",
    });
  } catch {
    return NextResponse.json({ override: "auto" }, { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const override = body.override;

    if (typeof override !== "string" || !validOverrides.has(override)) {
      return NextResponse.json(
        { success: false, message: "Invalid theme override." },
        { status: 400 }
      );
    }

    await prisma.settings.upsert({
      where: { key: "landing_page_theme_override" },
      update: { value: override },
      create: {
        key: "landing_page_theme_override",
        value: override,
      },
    });

    return NextResponse.json({ success: true, override });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to save theme override." },
      { status: 500 }
    );
  }
}