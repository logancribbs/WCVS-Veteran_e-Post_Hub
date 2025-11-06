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
  const [defaultEvents, setDefaultEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

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
                    w-full max-w-[380px] h-[500px]
                  "
                >
                  {/* Title Section */}
                  <div className="text-center p-4 border-b border-gray-200">
                    <h5 className="text-xl font-semibold text-gray-800">
                      {event.title}
                    </h5>
                  </div>

                  {/* Flyer Image */}
                  {event.flyer ? (
                    isPdfUrl(event.flyer) ? (
                      <div
                        className="cursor-pointer w-full"
                        onClick={() => setSelectedEvent(event)}
                      >
                        <PdfViewer
                          fileUrl={event.flyer}
                          containerHeight={300}
                        />
                      </div>
                    ) : (
                      <img
                        src={event.flyer}
                        alt={`${event.title} Flyer`}
                        onClick={() => setSelectedEvent(event)}
                        className="w-full h-[300px] object-cover cursor-pointer border-y border-gray-200"
                      />
                    )
                  ) : (
                    <div className="w-full h-[300px] bg-gray-100 flex items-center justify-center text-gray-400 italic border-y border-gray-200">
                      No Flyer Available
                    </div>
                  )}

                  {/* Footer with Date + Button */}
                  <CardBody className="flex flex-row justify-between items-center p-4">
                    {event.startDate && (
                      <p className="text-gray-700 font-medium text-base">
                        {event.endDate && event.startDate !== event.endDate
                          ? `${new Date(
                              event.startDate
                            ).toLocaleDateString()} - ${new Date(
                              event.endDate
                            ).toLocaleDateString()}`
                          : new Date(event.startDate).toLocaleDateString()}
                      </p>
                    )}

                    <Button
                      onClick={() => setSelectedEvent(event)}
                      className="bg-[#f7960d] text-black font-semibold border border-gray-400 hover:scale-105 transition-transform"
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

      {/* MODAL VIEWER */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50">
          {/* Back Button */}
          <button
            onClick={() => setSelectedEvent(null)}
            className="fixed top-6 left-6 px-6 py-3 bg-[#e48a24] text-black font-semibold rounded-md shadow hover:scale-105 transition-transform"
          >
            ← Back
          </button>

          {/* Modal Content */}
          <div className="max-w-4xl w-full p-6 bg-white rounded-xl shadow-xl border border-gray-300 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">{selectedEvent.title}</h2>

            {selectedEvent.flyer &&
              (isPdfUrl(selectedEvent.flyer) ? (
                <PdfViewer
                  fileUrl={selectedEvent.flyer}
                  containerHeight={600}
                />
              ) : (
                <img
                  src={selectedEvent.flyer}
                  alt="Flyer"
                  className="w-full max-h-[600px] object-contain rounded-md"
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
