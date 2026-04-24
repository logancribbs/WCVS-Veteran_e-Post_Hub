// This route is used when creating a new event

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    let role = "GUEST";
    let userId: string | null = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as {
          role: string;
          userId: string;
        };
        role = decodedToken.role;
        userId = decodedToken.userId;
      } catch (error) {
        console.warn("Invalid token, treating as guest:", error);
      }
    }

    const {
      website,
      title,
      description,
      flyer,
      type,
      address,
      latitude,
      longitude,
      eventOccurrences,
      time,
      organizer,
    } = await req.json();

    let resolvedLatitude = latitude;
    let resolvedLongitude = longitude;

    if (address && (!latitude || !longitude)) {
      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (apiKey) {
          const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
          const response = await fetch(geoUrl);
          const geoData = await response.json();
          if (geoData.status === "OK" && geoData.results.length > 0) {
            resolvedLatitude = geoData.results[0].geometry.location.lat;
            resolvedLongitude = geoData.results[0].geometry.location.lng;
          }
        }
      } catch (error) {
        console.error("Error fetching geolocation:", error);
      }
    }

    if (!title && !flyer) {
      return NextResponse.json({ message: 'Either title or flyer is required' }, { status: 400 });
    }

    const newEvent = await prisma.event.create({
      data: {
        createdById: userId || undefined,
        website: website || null,
        title: title || null,
        description: description || null,
        flyer: flyer || null,
        type: type || null,
        address: address || null,
        latitude: resolvedLatitude ?? null,
        longitude: resolvedLongitude ?? null,
        status: 'APPROVED',
        time: time || null,
        organizer: organizer || null,
      },
    });

    if (Array.isArray(eventOccurrences)) {
      for (const occ of eventOccurrences) {
        const dateObj = new Date(occ.date);
        await prisma.eventOccurrence.create({
          data: {
            eventId: newEvent.id,
            date: dateObj,
            startTime: occ.startTime || null,
            endTime: occ.endTime || null,
          },
        });
      }
    }

    return NextResponse.json(
      { message: "Event created successfully", event: newEvent },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
