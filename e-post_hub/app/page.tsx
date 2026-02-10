// e-post_hub/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Button, Card, CardBody } from "@nextui-org/react";
import jwt from "jsonwebtoken";
import BottomBar from "./Components/BottomBar/BottomBar";
import PdfViewer from "./Components/PdfViewer/PdfViewer";
import HeroBanner from "./Components/Hero/HeroBanner";
import Sidebar from "./Components/Hero/Sidebar";
import { ArrowRight } from "lucide-react";

type EventOccurrence = {
  id: string;
  eventId: string;
  date: string;        // ISO string
  startTime?: string;
  endTime?: string;
};

type Event = {
  id: string;
  title: string;
  description?: string;
  createdBy: { name: string; email: string };
  status: string;
  startDate?: string;   // derived for display
  endDate?: string;     // derived for display
  startTime?: string;
  endTime?: string;
  website?: string;
  flyer?: string;       // can be http(s) URL or data: URL
  type?: string;
  interested: number;
  latitude: number;
  longitude: number;
  distance: number;
  address?: string;
  occurrences?: EventOccurrence[];

  // local derived props for sorting/positioning
  _nextDate?: string;   // YYYY-MM-DD of the next relevant occurrence
  _isUpcoming?: boolean;
};

export default function HomePage() {
  function isPdfUrl(url?: string | null) {
    if (!url) return false;
    const lower = url.toLowerCase();
    return lower.endsWith(".pdf") || lower.startsWith("data:application/pdf");
  }

  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // controls Create Event vs WAVA in HeroBanner
  const [isAdmin, setIsAdmin] = useState(false);

  // Read role (prefer saved role, fallback to JWT)
  useEffect(() => {
    const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;
    if (role) {
      setIsAdmin(role === "ADMIN");
      return;
    }
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      try {
        const decoded = jwt.decode(token) as { role?: string } | null;
        setIsAdmin(decoded?.role === "ADMIN");
      } catch {
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  }, []);

  // Compute anchor date (the first upcoming occurrence; if none upcoming, use last)
  function computeNextAnchor(ev: Event): { nextDate?: string; isUpcoming: boolean } {
    const occ = ev.occurrences ?? [];
    if (occ.length === 0) return { nextDate: undefined, isUpcoming: false };

    const sorted = [...occ].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMs = today.getTime();

    for (const o of sorted) {
      const d = new Date(o.date);
      d.setHours(0, 0, 0, 0);
      if (d.getTime() >= todayMs) {
        return { nextDate: d.toISOString().slice(0, 10), isUpcoming: true };
      }
    }

    const last = sorted[sorted.length - 1];
    const lastDate = new Date(last.date);
    lastDate.setHours(0, 0, 0, 0);
    return { nextDate: lastDate.toISOString().slice(0, 10), isUpcoming: false };
  }

  // Sort logic: upcoming first, then nearest date; past items by most recent last date
  function sortByClosestToToday(a: Event, b: Event): number {
    const aDate = a._nextDate ? new Date(a._nextDate).getTime() : Infinity;
    const bDate = b._nextDate ? new Date(b._nextDate).getTime() : Infinity;

    const aUpcoming = a._isUpcoming ?? false;
    const bUpcoming = b._isUpcoming ?? false;

    if (aUpcoming && !bUpcoming) return -1;
    if (!aUpcoming && bUpcoming) return 1;

    if (aUpcoming && bUpcoming) return aDate - bDate;

    // both past: show more recent past first (descending)
    return bDate - aDate;
  }

  useEffect(() => {
    async function fetchApprovedEvents() {
      try {
        const response = await fetch("/api/Event/approved");
        if (!response.ok) {
          console.error("Failed to fetch approved events:", response.statusText);
          return;
        }

        const data = await response.json();
        const allEvents = (data.events as Event[]) || [];

        // Normalize occurrences, compute display date range and sorting anchors
        allEvents.forEach((ev) => {
          if (ev.occurrences?.length) {
            ev.occurrences.sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            );
            const earliest = ev.occurrences[0].date;
            const latest = ev.occurrences[ev.occurrences.length - 1].date;
            ev.startDate = earliest.split("T")[0];
            ev.endDate = latest.split("T")[0];

            const { nextDate, isUpcoming } = computeNextAnchor(ev);
            ev._nextDate = nextDate;
            ev._isUpcoming = isUpcoming;
          } else {
            ev._nextDate = undefined;
            ev._isUpcoming = false;
          }
        });

        const sorted = [...allEvents].sort(sortByClosestToToday);

        setEvents(sorted);
        setFilteredEvents(sorted);
      } catch (error) {
        console.error("Error fetching approved events:", error);
      }
    }

    fetchApprovedEvents();
  }, []);

  const handleCloseModal = () => setSelectedEvent(null);

  const formatDateRange = (startDate?: string, endDate?: string) => {
    if (!startDate) return "";
    const start = new Date(startDate).toLocaleDateString();
    if (!endDate || startDate === endDate) return start;
    const end = new Date(endDate).toLocaleDateString();
    return `${start} - ${end}`;
  };

  async function deleteEventById(eventId: string) {
    try {
      const res = await fetch(`/api/Event/${eventId}`, { method: "DELETE" });
      if (!res.ok) {
        console.error("Delete failed:", res.status);
        return;
      }
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      setFilteredEvents((prev) => prev.filter((e) => e.id !== eventId));
      if (selectedEvent?.id === eventId) setSelectedEvent(null);
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#FAF7F2] flex flex-col relative">
      {/* Pass isAdmin so the banner shows Create Event (admin) or WAVA (others) */}
      <HeroBanner isAdmin={isAdmin} />

      <div className="flex flex-col md:flex-row w-full pt-6">
        {/* Sidebar */}
        <div className="w-full md:w-[30%] lg:w-[28%] xl:w-[25%] p-4 md:p-6">
          <Sidebar />
        </div>

        {/* Event Grid */}
        <div className="content flex-1 p-6 md:pl-8 lg:pl-12">
          {filteredEvents.length === 0 ? (
            <p className="text-center text-lg">No events available.</p>
          ) : (
            <div
              className="
                grid
                gap-10
                sm:grid-cols-1
                md:grid-cols-2
                lg:grid-cols-3
                2xl:grid-cols-4
              "
            >
              {filteredEvents.map((event) => (
                <Card
                  key={event.id}
                  className="
                    bg-[#FFEBC4]
                    border-2 border-gray-500
                    rounded-2xl
                    shadow-md
                    hover:shadow-xl
                    flex flex-col
                    overflow-hidden
                    transition-transform
                    hover:scale-[1.03]
                    hover:ring-4 hover:ring-orange-300
                    duration-300
                    w-full max-w-[380px]
                    h-[520px]
                  "
                >
                  {/* Title */}
                  <div className="text-center text-xl font-semibold text-gray-900 pt-4 pb-2">
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
                          alt="Flyer"
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
                    <div className="text-gray-800 text-lg font-medium">
                      {formatDateRange(event.startDate, event.endDate)}
                    </div>

                    <Button
                      onClick={() =>
                        isAdmin ? deleteEventById(event.id) : setSelectedEvent(event)
                      }
                      aria-label={
                        isAdmin
                          ? `Delete ${event.title}`
                          : `View details for ${event.title}`
                      }
                      className={`
                        group
                        inline-flex items-center justify-center gap-2
                        px-16 py-2.5
                        rounded-xl
                        
                        text-sm font-semibold tracking-wide
                        transition-all duration-200
                        shadow-sm hover:shadow-md
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-offset-2

                        ${isAdmin
                          ? `
                            bg-red-600 text-white
                            border border-red-700
                            hover:bg-red-700
                            focus-visible:ring-red-600
                          `
                          : `
                            bg-[#FFECD1]
                            border border-orange-300/70
                            text-gray-900
                            hover:bg-[#FFE3BC]
                            hover:border-orange-400
                            focus-visible:ring-orange-300
                          `
                        }
                      `}
                    >
                      <span>
                      {isAdmin ? "Delete" : "View Details"}
                    </span>

                    {/* Icon animates only for non-admin mode */}
                    {!isAdmin && (
                      <ArrowRight
                        className="
                          w-4 h-4 text-gray-800
                          transition-transform duration-200
                          group-hover:translate-x-1
                        "
                      />
                    )}
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
          <button
            onClick={handleCloseModal}
            className="absolute top-6 left-6 bg-[#ff8c00] text-white px-6 py-3 text-lg rounded-md shadow-lg hover:scale-105 transition-transform duration-200"
          >
            Back
          </button>

          <div className="relative bg-white rounded-lg shadow-2xl max-w-6xl w-full mx-6 flex justify-center items-center p-6">
            {selectedEvent.flyer ? (
              isPdfUrl(selectedEvent.flyer) ? (
                <PdfViewer fileUrl={selectedEvent.flyer} containerHeight={700} />
              ) : (
                <img
                  src={selectedEvent.flyer}
                  alt="Flyer"
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
