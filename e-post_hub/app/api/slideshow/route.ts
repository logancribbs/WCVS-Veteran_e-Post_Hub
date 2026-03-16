import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const setting = await prisma.settings.findFirst({
      where: { key: "homepage_slideshow" },
    });

    if (!setting) {
      return NextResponse.json({ images: [] });
    }

    return NextResponse.json({
      images: JSON.parse(setting.value),
    });
  } catch {
    return NextResponse.json({ images: [] });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const images = body.images;

    const existing = await prisma.settings.findFirst({
      where: { key: "homepage_slideshow" },
    });

    if (existing) {
      await prisma.settings.update({
        where: { id: existing.id },
        data: {
          value: JSON.stringify(images),
        },
      });
    } else {
      await prisma.settings.create({
        data: {
          key: "homepage_slideshow",
          value: JSON.stringify(images),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}