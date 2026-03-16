import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const setting = await prisma.settings.findUnique({
      where: { key: "sidebar_resource_links" },
    });

    if (!setting) {
      return NextResponse.json({ links: [] });
    }

    return NextResponse.json({
      links: JSON.parse(setting.value),
    });
  } catch {
    return NextResponse.json({ links: [] });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const links = body.links;

    await prisma.settings.upsert({
      where: { key: "sidebar_resource_links" },
      update: {
        value: JSON.stringify(links),
      },
      create: {
        key: "sidebar_resource_links",
        value: JSON.stringify(links),
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}