"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
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
  const [defaultEvents, setDefaultEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  // ------------------------------ FETCH EVENTS --------------------------------
  useEffect(() => {
    async function fetchApprovedEvents() {
      try {
        const response = await fetch("/api/Event/approved");
        if (!response.ok) {
          console.error("Failed to fetch approved events:", response.statusText);
          return;
        }

        const data = await response.json();
        const allEvents = data.events as Event[];

        allEvents.forEach((ev) => {
          if (ev.occurrences && ev.occurrences.length > 0) {
            ev.occurrences.sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            );
            const earliest = ev.occurrences[0].date;
            const latest = ev.occurrences[ev.occurrences.length - 1].date;
            ev.startDate = earliest.split("T")[0];
            ev.endDate = latest.split("T")[0];
          }
        });

        const now = new Date();
        const upcoming = allEvents.filter((event) => {
          const endDate = event.endDate ? new Date(event.endDate) : null;
          const startDate = event.startDate ? new Date(event.startDate) : null;
          if (endDate && endDate < now) return false;
          if (!endDate && startDate && startDate < now) return false;
          return true;
        });

        setEvents(allEvents);
        setDefaultEvents(upcoming);
        setFilteredEvents(upcoming);
      } catch (error) {
        console.error("Error fetching approved events:", error);
      }
    }

    fetchApprovedEvents();
  }, []);

  // ------------------------- ROLE REDIRECT -------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwt.decode(token) as { role: string };
        if (decodedToken) {
          if (decodedToken.role === "ADMIN") router.push("/Admin");
          else if (decodedToken.role === "MEMBER") router.push("/Member");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [router]);

  // -------------------- RENDER --------------------
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
              className="
                grid
                gap-10
                justify-center
                sm:grid-cols-1
                md:grid-cols-2
                lg:grid-cols-3
              "
              style={{
                gridAutoRows: "1fr",
                placeItems: "center",
              }}
            >
              {filteredEvents.map((event) => (
                <Card
                  key={event.id}
                  className="
                    bg-[#FFFDF9]
                    border border-gray-300
                    rounded-xl
                    shadow-md
                    hover:shadow-lg
                    flex flex-col
                    overflow-hidden
                    transition-transform
                    hover:scale-[1.02]
                    duration-300
                  "
                  style={{ width: "380px", height: "500px" }}
                >
                  {/* Event flyer image */}
                  {event.flyer ? (
                    isPdfUrl(event.flyer) ? (
                      <a
                        href={event.flyer}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <PdfViewer fileUrl={event.flyer} containerHeight={300} />
                      </a>
                    ) : (
                      <a
                        href={event.flyer}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={event.flyer}
                          alt={`${event.title} Flyer`}
                          className="w-full h-[300px] object-cover rounded-t-xl border-b border-gray-200"
                        />
                      </a>
                    )
                  ) : (
                    <div className="w-full h-[300px] bg-gray-100 flex items-center justify-center text-gray-400 italic border-b border-gray-200 rounded-t-xl">
                      No Flyer Available
                    </div>
                  )}

                  {/* Event Info */}
                  <CardBody className="flex flex-col justify-between items-center p-4 text-center">
                    <div>
                      <h5 className="text-xl font-semibold text-gray-800 mb-2">
                        {event.title}
                      </h5>

                      {/* Show date range */}
                      {event.startDate && event.endDate && (
                        <p className="text-gray-600 mb-4">
                          {new Date(event.startDate).toLocaleDateString()} –{" "}
                          {new Date(event.endDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <Button
                      as={Link}
                      href={`/Event/${event.id}`}
                      className="mt-2 bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-gray-300 text-black font-medium hover:scale-105 transition-transform duration-200"
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

