"use client";

import { useEffect, useRef, useState } from "react"; // useRef - remembers which button opened the modal
import { Button, Card, CardBody } from "@nextui-org/react";
import jwt from "jsonwebtoken";
import BottomBar from "./Components/BottomBar/BottomBar";
import PdfViewer from "./Components/PdfViewer/PdfViewer";
import HeroBanner from "./Components/Hero/HeroBanner";
import Sidebar from "./Components/Hero/Sidebar";
import { ArrowRight } from "lucide-react";
import { useLandingTheme } from "./themes";

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
  const { theme, themeOverride, setThemeOverride } = useLandingTheme();

  function isPdfUrl(url?: string | null) {
    if (!url) return false;
    const lower = url.toLowerCase();
    return lower.endsWith(".pdf") || lower.startsWith("data:application/pdf");
  }

  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role =
      typeof window !== "undefined" ? localStorage.getItem("role") : null;
    if (role) {
      setIsAdmin(role === "ADMIN");
      return;
    }
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
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
      const haystack = [
        e.title,
        e.description,
        e.address,
        e.type,
        e.createdBy?.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }

  function computeNextAnchor(ev: Event): {
    nextDate?: string;
    isUpcoming: boolean;
  } {
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
        if (!response.ok) return;

        const data = await response.json();
        const allEvents = (data.events as Event[]) || [];

        allEvents.forEach((ev) => {
          if (ev.occurrences?.length) {
            ev.occurrences.sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            );
            ev.startDate = ev.occurrences[0].date.split("T")[0];
            ev.endDate =
              ev.occurrences[ev.occurrences.length - 1].date.split("T")[0];

            const { nextDate, isUpcoming } = computeNextAnchor(ev);
            ev._nextDate = nextDate;
            ev._isUpcoming = isUpcoming;
          }
        });

        const sorted = [...allEvents].sort(sortByClosestToToday);
        setEvents(sorted);
        setFilteredEvents(sorted);
      } catch {}
    }

    fetchApprovedEvents();
  }, []);

  const handleCloseModal = () => 
  {
    setSelectedEvent(null);
    setTimeout(() => {
      modalTriggerRef.current?.focus()
    }, 0);
  } // When the model closes, the keyboard user should land back on the button they originally used.

  useEffect(() => {
    setFilteredEvents(
      filterEventsByQuery(searchQuery, events).sort(sortByClosestToToday)
    );
  }, [searchQuery, events]);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedEvent]); // Does two things: 1. moves focus into the modal when it opens 2. allow user to press escape to close it.

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
      if (!res.ok) return;
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      setFilteredEvents((prev) => prev.filter((e) => e.id !== eventId));
      if (selectedEvent?.id === eventId) setSelectedEvent(null);
    } catch {}
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col relative"
      style={{
        backgroundColor: theme.pageBackgroundColor,
        backgroundImage: theme.pageBackgroundImage,
        backgroundRepeat: theme.pageBackgroundRepeat,
        backgroundSize: theme.pageBackgroundSize,
        backgroundPosition: theme.pageBackgroundPosition,
      }}
    >
      <HeroBanner
        query={searchQuery}
        onQueryChange={setSearchQuery}
        onSubmit={() => {}}
        isAdmin={isAdmin}
        theme={theme}
      />

      <div className="flex flex-col md:flex-row w-full pt-6">
        <div className="w-full md:w-[30%] lg:w-[28%] xl:w-[25%] p-4 md:p-6">
          <Sidebar
            theme={theme}
            themeOverride={themeOverride}
            onThemeSaved={setThemeOverride}
          />
        </div>

        <div className="content flex-1 p-6 md:pl-8 lg:pl-12">
          {filteredEvents.length === 0 ? (
            <p className="text-center text-lg">No events available.</p>
          ) : (
            <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {filteredEvents.map((event) => (
                <Card
                  key={event.id}
                  className="
                    relative
                    rounded-2xl
                    shadow-[0_12px_28px_rgba(0,0,0,0.42)]
                    hover:shadow-[0_16px_36px_rgba(0,0,0,0.48)]
                    flex flex-col overflow-hidden
                    transition-transform hover:scale-[1.03]
                    hover:ring-4 hover:ring-orange-300
                    duration-300 w-full max-w-[380px] h-[520px]
                    after:absolute after:inset-0
                    after:bg-[linear-gradient(135deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04),transparent)]
                    after:pointer-events-none
                  "
                  style={{
                    backgroundColor: theme.eventCardBackground,
                    border: `3px solid ${theme.eventCardBorder}`,
                  }}
                >
                  <div
                    className="text-center text-xl font-semibold pt-4 pb-2"
                    style={{ color: theme.eventTitleColor }}
                  >
                    {event.title}
                  </div>

                  <div
                    className="flex justify-center items-center cursor-pointer px-3"
                    onClick={() => setSelectedEvent(event)}
                  >
                    {event.flyer ? (
                      isPdfUrl(event.flyer) ? (
                        <div className="w-full rounded-xl border-2 border-white/30 bg-white p-2 shadow-sm">
                          <PdfViewer
                            fileUrl={event.flyer}
                            containerHeight={340}
                          />
                        </div>
                      ) : (
                        <img
                          src={event.flyer}
                          alt="Flyer"
                          className="w-full h-[350px] object-cover rounded-xl border-2 border-white/30 shadow-sm bg-white"
                        />
                      )
                    ) : (
                      <div className="w-full h-[350px] bg-white flex items-center justify-center text-gray-600 italic border-2 border-white/30 rounded-xl shadow-sm">
                        No Flyer Available
                      </div>
                    )}
                  </button>

                  <CardBody className="flex justify-between items-center p-4 text-center">
                    <div
                      className="text-lg font-medium"
                      style={{ color: theme.eventDateColor }}
                    >
                      {formatDateRange(event.startDate, event.endDate)}
                    </div>

                    <Button
                      onClick={() =>
                        isAdmin
                          ? deleteEventById(event.id)
                          : setSelectedEvent(event)
                      }
                      aria-label={
                        isAdmin
                          ? `Delete ${event.title}`
                          : `View details for ${event.title}`
                      }
                      className={`
                        group inline-flex items-center justify-center gap-2
                        px-16 py-2.5 rounded-xl
                        text-sm font-semibold tracking-wide
                        transition-all duration-200
                        shadow-sm hover:shadow-md
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-offset-2
                        ${
                          isAdmin
                            ? `
                              bg-red-600 text-white
                              border border-red-700
                              hover:bg-red-700
                              focus-visible:ring-red-600
                            `
                            : `
                              hover:bg-white
                              focus-visible:ring-orange-300
                            `
                        }
                      `}
                      style={
                        isAdmin
                          ? undefined
                          : {
                              backgroundColor: theme.eventButtonBackground,
                              color: theme.eventButtonText,
                              border: `1px solid ${theme.eventButtonBorder}`,
                            }
                      }
                    >
                      <span>{isAdmin ? "Delete" : "View Details"}</span>
                      {!isAdmin && (
                        <ArrowRight
                          className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                          style={{ color: theme.eventButtonText }}
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

      {selectedEvent && (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4
                bg-black/60 backdrop-blur-md
                animate-in fade-in duration-200">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="event-preview-title"
          className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-2xl
           transition-all duration-200 ease-out
           opacity-0 scale-95 animate-[fadeInScale_0.2s_ease-out_forwards]"
        >
          <div className="w-full flex items-center justify-between px-5 py-4 border-b border-slate-200">
            <h2
              id="event-preview-title"
              className="text-xl md:text-2xl font-semibold text-gray-900"
            >
              {selectedEvent.title}
            </h2>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={handleCloseModal}
              aria-label="Close event preview"
              className="inline-flex items-center rounded-md bg-[#243560] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1d2b4d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700 focus-visible:outline-offset-2"
            >
              Close
            </button>
          </div>
          <div className="w-full overflow-y-auto bg-slate-50 p-5 flex justify-center">
            {selectedEvent.flyer ? (
              isPdfUrl(selectedEvent.flyer) ? (
                <PdfViewer
                  fileUrl={selectedEvent.flyer}
                  containerHeight={700}
                  altText={`${selectedEvent.title} flyer preview`}
                />
              ) : (
                <div className="w-full rounded-xl border-2 border-black/10 bg-white p-2 shadow-sm">
                  <img
                    src={selectedEvent.flyer}
                    alt="Flyer"
                    className="w-full h-[700px] object-contain rounded-lg"
                  />
                </div>
              )
            ) : (
              <p className="text-gray-600 italic text-lg">No flyer available</p>
            )}
          </div>
        </div>
      </div>
    )}

      <BottomBar />
    </div>
  );
}
