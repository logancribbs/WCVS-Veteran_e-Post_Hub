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
  } catch (error) {
    console.error("GET /api/resource-links error:", error);
    return NextResponse.json({ links: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const links = body.links;

    if (!Array.isArray(links)) {
      return NextResponse.json(
        { success: false, message: "Invalid links payload." },
        { status: 400 }
      );
    }

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

    return NextResponse.json({ success: true, links });
  } catch (error) {
    console.error("POST /api/resource-links error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save resource links." },
      { status: 500 }
    );
  }
}