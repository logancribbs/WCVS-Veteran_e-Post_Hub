"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardBody } from "@nextui-org/react";
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
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

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

        setFilteredEvents(allEvents);
      } catch (error) {
        console.error("Error fetching approved events:", error);
      }
    }

    fetchApprovedEvents();
  }, []);

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

  const handleCloseModal = () => setSelectedEvent(null);

  const formatDateRange = (startDate?: string, endDate?: string) => {
    if (!startDate) return "";
    const start = new Date(startDate).toLocaleDateString();
    if (!endDate || startDate === endDate) return start;
    const end = new Date(endDate).toLocaleDateString();
    return `${start} - ${end}`;
  };

  return (
    <div className="min-h-screen w-full bg-blue-100 flex flex-col relative">
      <HeroBanner />

      <div className="flex flex-col md:flex-row w-full">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 p-4">
          <Sidebar />
        </div>

        {/* Event Cards */}
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
              style={{ gridAutoRows: "1fr", placeItems: "center" }}
            >
              {filteredEvents.map((event) => (
                <Card
                  key={event.id}
                  className="
                    bg-[#FFF7E6]
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
                  style={{ width: "380px", height: "520px" }}
                >
                  {/* Title */}
                  <div className="text-center text-xl font-semibold text-gray-800 pt-4 pb-2">
                    {event.title}
                  </div>

                  {/* Flyer */}
                  <div
                    className="flex justify-center items-center cursor-pointer px-3"
                    onClick={() => setSelectedEvent(event)}
                  >
                    {event.flyer ? (
                      isPdfUrl(event.flyer) ? (
                        <PdfViewer fileUrl={event.flyer} containerHeight={340} />
                      ) : (
                        <img
                          src={event.flyer}
                          alt={`${event.title} Flyer`}
                          className="w-full h-[350px] object-cover rounded-lg border border-gray-300"
                        />
                      )
                    ) : (
                      <div className="w-full h-[350px] bg-gray-100 flex items-center justify-center text-gray-400 italic border border-gray-300 rounded-lg">
                        No Flyer Available
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <CardBody className="flex justify-between items-center p-4 text-center">
                    <div className="text-gray-700 text-lg font-medium">
                      {formatDateRange(event.startDate, event.endDate)}
                    </div>

                    <Button
                      onClick={() => setSelectedEvent(event)}
                      className="bg-[#ff8c00] border border-gray-300 text-black font-semibold px-4 py-2 rounded-md hover:scale-105 transition-transform duration-200"
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

      {/* Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50">
          {/* Back button */}
          <button
            onClick={handleCloseModal}
            className="absolute top-6 left-6 bg-[#ff8c00] text-white px-6 py-3 text-lg rounded-md shadow-lg hover:scale-105 transition-transform duration-200"
          >
            Back
          </button>

          {/* Enlarged Flyer */}
          <div className="relative bg-white rounded-lg shadow-2xl max-w-6xl w-full mx-6 flex justify-center items-center p-6">
            {selectedEvent.flyer ? (
              isPdfUrl(selectedEvent.flyer) ? (
                <PdfViewer fileUrl={selectedEvent.flyer} containerHeight={700} />
              ) : (
                <img
                  src={selectedEvent.flyer}
                  alt={`${selectedEvent.title} Flyer`}
                  className="max-h-[90vh] object-contain rounded-lg"
                />
              )
            ) : (
              <p className="text-gray-600 italic text-lg">No flyer available</p>
            )}
          </div>
        </div>
      )}

      <BottomBar />
    </div>
  );
}
