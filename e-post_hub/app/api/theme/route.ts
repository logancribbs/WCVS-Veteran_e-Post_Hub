import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const validOverrides = new Set([
  "auto",
  "default",
  "fourthOfJuly",
  "christmas",
  "thanksgiving",
  "newYears",
  "veteransDay",
]);

export async function GET() {
  try {
    const [overrideSetting, expiresAtSetting] = await Promise.all([
      prisma.settings.findUnique({
        where: { key: "landing_page_theme_override" },
      }),
      prisma.settings.findUnique({
        where: { key: "landing_page_theme_override_expires_at" },
      }),
    ]);

    return NextResponse.json({
      override: overrideSetting?.value ?? "auto",
      expiresAt: expiresAtSetting?.value ?? null,
    });
  } catch {
    return NextResponse.json({ override: "auto", expiresAt: null }, { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const override = body.override;
    const customDurationDays = body.customDurationDays;

    if (typeof override !== "string" || !validOverrides.has(override)) {
      return NextResponse.json(
        { success: false, message: "Invalid theme override." },
        { status: 400 }
      );
    }

    if (
      customDurationDays !== null &&
      customDurationDays !== undefined &&
      (!Number.isInteger(customDurationDays) || customDurationDays < 1)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid custom duration." },
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

    if (
      override !== "auto" &&
      override !== "default" &&
      Number.isInteger(customDurationDays) &&
      customDurationDays > 0
    ) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + customDurationDays);

      await prisma.settings.upsert({
        where: { key: "landing_page_theme_override_expires_at" },
        update: { value: expiresAt.toISOString() },
        create: {
          key: "landing_page_theme_override_expires_at",
          value: expiresAt.toISOString(),
        },
      });
    } else {
      await prisma.settings.deleteMany({
        where: { key: "landing_page_theme_override_expires_at" },
      });
    }

    return NextResponse.json({ success: true, override });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to save theme override." },
      { status: 500 }
    );
  }
}