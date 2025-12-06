// app/page.tsx
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
  date: string;
  startTime?: string;
  endTime?: string;
};

type Event = {
  id: string;
  title: string;
  description?: string;
  createdBy: { name: string; email: string };
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

  _nextDate?: string;
  _isUpcoming?: boolean;
};

export default function HomePage() {
  function isPdfUrl(url?: string | null) {
    if (!url) return false;
    const lower = url.toLowerCase();
    return (
      lower.endsWith(".pdf") ||
      lower.startsWith("data:application/pdf") // <-- handle data URLs
    );
  }

  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);

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

  function filterEventsByQuery(query: string, items: Event[]) {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((e) => {
      const haystack = [e.title, e.description, e.address, e.type, e.createdBy?.name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }

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

  function sortByClosestToToday(a: Event, b: Event): number {
    const aDate = a._nextDate ? new Date(a._nextDate).getTime() : Infinity;
    const bDate = b._nextDate ? new Date(b._nextDate).getTime() : Infinity;

    const aUpcoming = a._isUpcoming ?? false;
    const bUpcoming = b._isUpcoming ?? false;

    if (aUpcoming && !bUpcoming) return -1;
    if (!aUpcoming && bUpcoming) return 1;

    if (aUpcoming && bUpcoming) return aDate - bDate;

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
        setFilteredEvents(filterEventsByQuery(searchQuery, sorted).sort(sortByClosestToToday));
      } catch (error) {
        console.error("Error fetching approved events:", error);
      }
    }

    fetchApprovedEvents();
  }, []);

  useEffect(() => {
    setFilteredEvents(filterEventsByQuery(searchQuery, events).sort(sortByClosestToToday));
  }, [searchQuery, events]);

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
<<<<<<< HEAD
    <div className="min-h-screen w-full bg-[#FFF8E7] flex flex-col relative">
      {/* Pass isAdmin so the banner shows Create Event (admin) or WAVA (others) */}
=======
    <div className="min-h-screen w-full bg-blue-100 flex flex-col relative">
>>>>>>> 93fc8eb (Create event/delete event functionality implemented. Date ranges and reoccuring event added to event form. Images upload (need to fix sizing tomorrow).)
      <HeroBanner
        query={searchQuery}
        onQueryChange={setSearchQuery}
        onSubmit={() => {}}
        isAdmin={isAdmin}
      />

      <div className="flex flex-col md:flex-row w-full pt-6">
        <div className="w-full md:w-[30%] lg:w-[28%] xl:w-[25%] p-4 md:p-6">
          <Sidebar />
        </div>

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
                  <div className="text-center text-xl font-semibold text-gray-900 pt-4 pb-2">
                    {event.title}
                  </div>

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

                  <CardBody className="flex justify-between items-center p-4 text-center">
                    <div className="text-gray-800 text-lg font-medium">
                      {formatDateRange(event.startDate, event.endDate)}
                    </div>

<<<<<<< HEAD
                    <Button
                      onClick={() => setSelectedEvent(event)}
                      aria-label={`View details for ${event.title}`}
                      className="
=======
                    <button
                      onClick={() =>
                        isAdmin ? deleteEventById(event.id) : setSelectedEvent(event)
                      }
                      aria-label={
                        isAdmin
                          ? `Delete ${event.title}`
                          : `View details for ${event.title}`
                      }
                      className={`
>>>>>>> 93fc8eb (Create event/delete event functionality implemented. Date ranges and reoccuring event added to event form. Images upload (need to fix sizing tomorrow).)
                        group
                        w-full
                        px-4 py-2
                        rounded-lg
                        bg-[#FFECD1] 
                        border border-black/20
                        text-sm font-semibold
                        text-gray-900
                        text-center
                        transition-all duration-200
                        hover:bg-[#FFE3BC] 
                        hover:border-orange-300
                        hover:shadow-md
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-orange-300
                        focus-visible:ring-offset-2
<<<<<<< HEAD
                        focus-visible:ring-offset-[#FFF7E6]
                      "
                    >
                      <span className="truncate">View Details</span>
                    </Button>
=======
                        ${isAdmin
                          ? " bg-red-600 text-white focus-visible:ring-red-600"
                          : " bg-[#ff8c00] focus-visible:ring-[#ff8c00]"}
                      `}
                    >
                      <span className="text-sm tracking-wide">
                        {isAdmin ? "Delete" : "View Details"}
                      </span>
                      {/* keep ArrowRight if you had it imported; omitted here if not using NextUI Button */}
                    </button>
>>>>>>> 93fc8eb (Create event/delete event functionality implemented. Date ranges and reoccuring event added to event form. Images upload (need to fix sizing tomorrow).)
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
