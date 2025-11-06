"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardBody } from "@nextui-org/react";
import Link from "next/link";
import jwt from "jsonwebtoken";
import BottomBar from "./Components/BottomBar/BottomBar";
import PdfViewer from "./Components/PdfViewer/PdfViewer";
import HeroBanner from "./Components/Hero/HeroBanner";
import Sidebar from "./Components/Hero/Sidebar";

type EventOccurrence = {
  id: string;
  eventId: string;
  date: string;
  startTime?: string;
  endTime?: string;
};

type Event = {
  id: string;
  title: string;
  description?: string;
  createdBy: {
    name: string;
    email: string;
  };
  status: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  website?: string;
  flyer?: string;
  type?: string;
  interested: number;
  latitude: number;
  longitude: number;
  distance: number;
  address?: string;
  occurrences?: EventOccurrence[];
};

export default function HomePage() {
  const router = useRouter();

  function isPdfUrl(url?: string | null) {
    if (!url) return false;
    return url.toLowerCase().endsWith(".pdf");
  }

  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  useEffect(() => {
    async function fetchApprovedEvents() {
      try {
        const response = await fetch("/api/Event/approved");
        if (!response.ok) return;

        const data = await response.json();
        const allEvents = data.events as Event[];

        allEvents.forEach((ev) => {
          if (ev.occurrences?.length) {
            ev.occurrences.sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            );
            ev.startDate = ev.occurrences[0].date.split("T")[0];
            ev.endDate = ev.occurrences.at(-1)?.date.split("T")[0];
          }
        });

        setEvents(allEvents);
        setFilteredEvents(allEvents);
      } catch (error) {
        console.error("Error fetching approved events:", error);
      }
    }
    fetchApprovedEvents();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwt.decode(token) as { role: string };
      if (decoded?.role === "ADMIN") router.push("/Admin");
      if (decoded?.role === "MEMBER") router.push("/Member");
    } catch (err) {
      console.error("Token decode failed:", err);
    }
  }, [router]);

  return (
    <div className="min-h-screen w-full bg-blue-100 flex flex-col">
      <HeroBanner />
      <div className="flex flex-col md:flex-row w-full">
        <div className="w-full md:w-1/4 p-4">
          <Sidebar />
        </div>

        <div className="content flex-1 p-6">
          {filteredEvents.length === 0 ? (
            <p className="text-center text-lg">No events available.</p>
          ) : (
            <div
              className="grid gap-10 justify-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              style={{ gridAutoRows: "1fr", placeItems: "center" }}
            >
              {filteredEvents.map((event) => (
                <Card
                  key={event.id}
                  className="bg-[#FFF6EF] border border-gray-300 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex flex-col overflow-hidden"
                  style={{ width: "360px", height: "500px" }}
                >
                  <h3 className="text-xl font-semibold text-center text-gray-800 mt-4">
                    {event.title}
                  </h3>

                  <div className="flex justify-center items-center p-4">
                    {event.flyer ? (
                      isPdfUrl(event.flyer) ? (
                        <PdfViewer
                          fileUrl={event.flyer}
                          containerHeight={300}
                        />
                      ) : (
                        <img
                          src={event.flyer}
                          alt={`${event.title} Flyer`}
                          className="w-full h-[300px] object-cover rounded-xl border border-gray-300 shadow-sm"
                        />
                      )
                    ) : (
                      <div className="w-full h-[300px] bg-gray-100 flex items-center justify-center text-gray-400 italic border border-gray-200 rounded-xl">
                        No Flyer Available
                      </div>
                    )}
                  </div>

                  <CardBody className="flex justify-between items-center px-5 pb-5">
                    <p className="text-lg font-semibold text-gray-700 ml-2">
                      {event.startDate
                        ? new Date(event.startDate).toLocaleDateString()
                        : "TBD"}
                      {event.endDate &&
                        event.startDate !== event.endDate &&
                        ` – ${new Date(event.endDate).toLocaleDateString()}`}
                    </p>

                    <Button
                      as={Link}
                      href={`/Event/${event.id}`}
                      className="bg-[#f97b0d] text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-200"
                    >
                      View Details
                    </Button>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <BottomBar />
    </div>
  );
}
