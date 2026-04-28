"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Card, CardBody } from "@nextui-org/react";
import jwt from "jsonwebtoken";
import BottomBar from "./Components/BottomBar/BottomBar";
import PdfViewer from "./Components/PdfViewer/PdfViewer";
import HeroBanner from "./Components/Hero/HeroBanner";
import Sidebar from "./Components/Hero/Sidebar";
import {
  ArrowRight,
  ExternalLink,
  MapPin,
  CalendarDays,
  Clock,
  FileText,
  Download,
} from "lucide-react";
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
  time?: string;
  organizer?: string;
};

export default function HomePage() {
  const { theme, themeOverride, setThemeOverride } = useLandingTheme();
  const detailCloseButtonRef = useRef<HTMLButtonElement | null>(null);
  const previewCloseButtonRef = useRef<HTMLButtonElement | null>(null);
  const modalTriggerRef = useRef<HTMLElement | null>(null);

  function isPdfUrl(url?: string | null) {
    if (!url) return false;
    const lower = url.toLowerCase();
    return lower.endsWith(".pdf") || lower.startsWith("data:application/pdf");
  }

  function getFlyerExtension(url?: string | null) {
    if (!url) return "file";

    if (url.startsWith("data:application/pdf")) return "pdf";
    if (url.startsWith("data:image/jpeg")) return "jpg";
    if (url.startsWith("data:image/png")) return "png";
    if (url.startsWith("data:image/webp")) return "webp";
    if (url.startsWith("data:image/gif")) return "gif";

    try {
      const cleanUrl = url.split("?")[0].split("#")[0].toLowerCase();
      const match = cleanUrl.match(/\.([a-z0-9]+)$/i);
      return match?.[1] || "file";
    } catch {
      return "file";
    }
  }

  function buildDownloadFileName(event: Event) {
    const safeTitle = (event.title || "event-flyer")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const ext = getFlyerExtension(event.flyer);
    return `${safeTitle || "event-flyer"}.${ext}`;
  }

  async function handleDownloadFlyer(event: Event) {
    if (!event.flyer) return;

    try {
      const fileName = buildDownloadFileName(event);

      if (event.flyer.startsWith("data:")) {
        const link = document.createElement("a");
        link.href = event.flyer;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        return;
      }

      const response = await fetch(event.flyer);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(event.flyer, "_blank", "noopener,noreferrer");
    }
  }

  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedDetailEvent, setSelectedDetailEvent] = useState<Event | null>(
    null
  );
  const [selectedPreviewEvent, setSelectedPreviewEvent] =
    useState<Event | null>(null);
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
    return {
      nextDate: lastDate.toISOString().slice(0, 10),
      isUpcoming: false,
    };
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

  useEffect(() => {
    setFilteredEvents(
      filterEventsByQuery(searchQuery, events).sort(sortByClosestToToday)
    );
  }, [searchQuery, events]);

  useEffect(() => {
    if (!selectedDetailEvent && !selectedPreviewEvent) return;

    if (selectedPreviewEvent) {
      previewCloseButtonRef.current?.focus();
    } else {
      detailCloseButtonRef.current?.focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (selectedPreviewEvent) {
          setSelectedPreviewEvent(null);
          return;
        }

        setSelectedDetailEvent(null);
        setTimeout(() => {
          modalTriggerRef.current?.focus();
        }, 0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedDetailEvent, selectedPreviewEvent]);

  const formatDateRange = (startDate?: string, endDate?: string) => {
    if (!startDate) return "";
    const start = new Date(startDate).toLocaleDateString();
    if (!endDate || startDate === endDate) return start;
    const end = new Date(endDate).toLocaleDateString();
    return `${start} - ${end}`;
  };

  const formatTimeRange = (startTime?: string, endTime?: string) => {
    if (!startTime) return "Time not provided";
    if (!endTime) return startTime;
    return `${startTime} - ${endTime}`;
  };

  const buildFlyerAltText = (event: Event) => {
    const pieces = [
      event.title,
      formatDateRange(event.startDate, event.endDate),
      formatTimeRange(event.startTime, event.endTime),
      event.description,
    ].filter(Boolean);

    return `Flyer for ${pieces.join(". ")}`;
  };

  async function deleteEventById(eventId: string) {
    try {
      const res = await fetch(`/api/Event/${eventId}`, { method: "DELETE" });
      if (!res.ok) return;
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      setFilteredEvents((prev) => prev.filter((e) => e.id !== eventId));
      if (selectedDetailEvent?.id === eventId) setSelectedDetailEvent(null);
      if (selectedPreviewEvent?.id === eventId) setSelectedPreviewEvent(null);
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
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {filteredEvents.map((event) => (
                <Card
                  key={event.id}
                  className="
                    relative
                    rounded-2xl
                    shadow-[0_12px_28px_rgba(0,0,0,0.42)]
                    hover:shadow-[0_16px_36px_rgba(0,0,0,0.48)]
                    flex flex-col overflow-hidden
                    transition-transform hover:scale-[1.025]
                    hover:ring-4 hover:ring-orange-300
                    duration-300 w-full max-w-[344px] h-[474px]
                    after:absolute after:inset-0
                    after:bg-[linear-gradient(180deg,rgba(255,255,255,0.20),rgba(255,255,255,0.06),transparent)]
                    after:pointer-events-none
                  "
                  style={{
                    backgroundColor: theme.eventCardBackground,
                    border: `3px solid ${theme.eventCardBorder}`,
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.22), 0 12px 28px rgba(0,0,0,0.42)",
                  }}
                >
                 <div className="text-center font-semibold pt-4 pb-2 px-3 leading-tight overflow-hidden"
                  style={{
                    color: theme.eventTitleColor,
                    fontSize: "clamp(0.9rem, 1.2vw, 1.25rem)",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    }}
                >
                    {event.title}
                  </div>

                  <button
                    type="button"
                    className="flex justify-center items-center cursor-pointer px-3 bg-transparent border-0"
                    onClick={(e) => {
                      modalTriggerRef.current = e.currentTarget;
                      setSelectedPreviewEvent(event);
                    }}
                    aria-label={`Open flyer preview for ${event.title}`}
                  >
                    {event.flyer ? (
                      isPdfUrl(event.flyer) ? (
                        <div className="w-full rounded-xl bg-white/96 p-2 shadow-sm">
                          <PdfViewer
                            fileUrl={event.flyer}
                            containerHeight={328}
                            altText={buildFlyerAltText(event)}
                          />
                        </div>
                      ) : (
                        <img
                          src={event.flyer}
                          alt={buildFlyerAltText(event)}
                          className="w-full h-[332px] object-cover rounded-xl shadow-sm bg-white/96"
                        />
                      )
                    ) : (
                      <div className="w-full h-[332px] bg-white/96 flex items-center justify-center text-gray-700 italic rounded-xl shadow-sm">
                        No Flyer Available
                      </div>
                    )}
                  </button>

                  <CardBody className="flex justify-between items-center px-4 pt-3 pb-4 text-center overflow-hidden">
                    <div
                      className="text-[15px] font-semibold"
                      style={{ color: theme.eventDateColor }}
                    >
                      {formatDateRange(event.startDate, event.endDate)}
                    </div>

                    <Button
                      onClick={(e) =>
                        isAdmin
                          ? deleteEventById(event.id)
                          : (() => {
                              modalTriggerRef.current =
                                e.currentTarget as HTMLElement;
                              setSelectedDetailEvent(event);
                            })()
                      }
                      aria-label={
                        isAdmin
                          ? `Delete ${event.title}`
                          : `View details for ${event.title}`
                      }
                      className={`
                        group inline-flex items-center justify-center gap-2
                        px-14 py-2.5 rounded-xl
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

      {selectedDetailEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-details-title"
            className="
              relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl border
              after:absolute after:inset-0
              after:bg-[linear-gradient(180deg,rgba(255,255,255,0.20),rgba(255,255,255,0.06),transparent)]
              after:pointer-events-none
            "
            style={{
              backgroundColor: theme.eventCardBackground,
              borderColor: theme.eventCardBorder,
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.22), 0 20px 48px rgba(0,0,0,0.42)",
            }}
          >
            <div
              className="relative z-10 w-full flex items-center justify-between px-5 py-4 border-b"
              style={{ borderColor: "rgba(255,255,255,0.22)" }}
            >
              <h2
                id="event-details-title"
                className="text-2xl md:text-3xl font-semibold"
                style={{ color: theme.eventTitleColor }}
              >
                {selectedDetailEvent.title}
              </h2>

              <button
                ref={detailCloseButtonRef}
                type="button"
                onClick={() => {
                  setSelectedDetailEvent(null);
                  setTimeout(() => {
                    modalTriggerRef.current?.focus();
                  }, 0);
                }}
                aria-label="Close event details"
                className="inline-flex items-center rounded-md px-5 py-2.5 text-base font-bold shadow-md transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  backgroundColor: "#f59e0b",
                  color: "#1b1b1b",
                  border: "2px solid #6b3f00",
                }}
              >
                Close
              </button>
            </div>

            <div className="relative z-10 grid max-h-[calc(90vh-74px)] grid-cols-1 gap-0 overflow-y-auto lg:grid-cols-[1.02fr_1fr]">
              <div
                className="p-5 lg:p-6 flex items-center justify-center border-b lg:border-b-0 lg:border-r"
                style={{
                  borderColor: "rgba(255,255,255,0.24)",
                  boxShadow: "inset -1px 0 0 rgba(255,255,255,0.08)",
                }}
              >
                {selectedDetailEvent.flyer ? (
                  <button
                    type="button"
                    className="w-full bg-transparent border-0 p-0 text-left"
                    onClick={() => setSelectedPreviewEvent(selectedDetailEvent)}
                    aria-label={`Open full flyer preview for ${selectedDetailEvent.title}`}
                  >
                    {isPdfUrl(selectedDetailEvent.flyer) ? (
                      <div className="w-full h-[500px] rounded-xl bg-white/96 p-3 shadow-sm flex items-center justify-center">
                        <PdfViewer
                          fileUrl={selectedDetailEvent.flyer}
                          containerHeight={470}
                          altText={buildFlyerAltText(selectedDetailEvent)}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-[500px] rounded-xl bg-white/96 p-3 shadow-sm flex items-center justify-center">
                        <img
                          src={selectedDetailEvent.flyer}
                          alt={buildFlyerAltText(selectedDetailEvent)}
                          className="max-w-full max-h-full h-auto w-auto object-contain rounded-lg"
                        />
                      </div>
                    )}
                  </button>
                ) : (
                  <div className="w-full h-[500px] rounded-xl bg-white/96 flex items-center justify-center text-gray-700 italic">
                    No Flyer Available
                  </div>
                )}
              </div>

              <div className="relative p-5 lg:p-6">
                <div className="space-y-4">
                  <div className="rounded-2xl bg-white/12 p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <FileText
                        className="mt-0.5 h-5 w-5 shrink-0"
                        style={{ color: theme.eventDateColor }}
                      />
                      <div>
                        <p
                          className="text-lg font-semibold"
                          style={{ color: theme.eventTitleColor }}
                        >
                          Description
                        </p>
                        <p
                          className="mt-1 text-base leading-7"
                          style={{ color: theme.eventDateColor }}
                        >
                          {selectedDetailEvent.description?.trim() ||
                            "No event description was provided."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/12 p-4 shadow-sm">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CalendarDays
                          className="mt-0.5 h-5 w-5 shrink-0"
                          style={{ color: theme.eventDateColor }}
                        />
                        <div>
                          <p
                            className="text-base font-semibold"
                            style={{ color: theme.eventTitleColor }}
                          >
                            Date
                          </p>
                          <p
                            className="text-base leading-7"
                            style={{ color: theme.eventDateColor }}
                          >
                            {formatDateRange(
                              selectedDetailEvent.startDate,
                              selectedDetailEvent.endDate
                            ) || "Date not provided"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock
                          className="mt-0.5 h-5 w-5 shrink-0"
                          style={{ color: theme.eventDateColor }}
                        />
                        <div>
                          <p
                            className="text-base font-semibold"
                            style={{ color: theme.eventTitleColor }}
                          >
                            Time
                          </p>
                          <p
                            className="text-base leading-7"
                            style={{ color: theme.eventDateColor }}
                          >
                            {selectedDetailEvent.time
                              ? selectedDetailEvent.time
                              : formatTimeRange(
                                  selectedDetailEvent.startTime,
                                  selectedDetailEvent.endTime
                                ) || "N/A"}
                          </p>
                        </div>
                      </div>

                      {selectedDetailEvent.address && (
                        <div className="flex items-start gap-3">
                          <MapPin
                            className="mt-0.5 h-5 w-5 shrink-0"
                            style={{ color: theme.eventDateColor }}
                          />
                          <div>
                            <p
                              className="text-base font-semibold"
                              style={{ color: theme.eventTitleColor }}
                            >
                              Location
                            </p>
                            <p
                              className="text-base leading-7"
                              style={{ color: theme.eventDateColor }}
                            >
                              {selectedDetailEvent.address}
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedDetailEvent.website && (
                        <div className="flex items-start gap-3">
                          <ExternalLink
                            className="mt-0.5 h-5 w-5 shrink-0"
                            style={{ color: theme.eventDateColor }}
                          />
                          <div>
                            <p
                              className="text-base font-semibold"
                              style={{ color: theme.eventTitleColor }}
                            >
                              Website
                            </p>
                            <a
                              href={selectedDetailEvent.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-base underline underline-offset-4"
                              style={{ color: theme.eventDateColor }}
                            >
                              Visit event website
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedDetailEvent.flyer && (
                    <div className="rounded-2xl bg-white/12 p-4 shadow-sm">
                      <button
                        type="button"
                        onClick={() => handleDownloadFlyer(selectedDetailEvent)}
                        className="inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-base font-bold shadow-md transition-all duration-200 hover:-translate-y-0.5"
                        style={{
                          backgroundColor: "#f59e0b",
                          color: "#1b1b1b",
                          border: "2px solid #6b3f00",
                        }}
                        aria-label={`Download flyer for ${selectedDetailEvent.title}`}
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Flyer</span>
                      </button>
                    </div>
                  )}

                  <div className="rounded-2xl bg-white/12 p-4 shadow-sm">
                    <p
                      className="text-base font-semibold"
                      style={{ color: theme.eventTitleColor }}
                    >
                      Organizer
                    </p>
                    <p
                      className="mt-1 text-base leading-7"
                      style={{ color: theme.eventDateColor }}
                    >
                      {selectedDetailEvent.organizer || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedPreviewEvent && (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="min-h-screen flex items-start justify-center px-4 py-6">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="event-preview-title"
              className="
                relative w-full max-w-6xl rounded-2xl border
                transition-all duration-200 ease-out opacity-0 scale-95 animate-[fadeInScale_0.2s_ease-out_forwards]
                after:absolute after:inset-0
                after:bg-[linear-gradient(180deg,rgba(255,255,255,0.20),rgba(255,255,255,0.06),transparent)]
                after:pointer-events-none
              "
              style={{
                backgroundColor: theme.eventCardBackground,
                borderColor: theme.eventCardBorder,
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.22), 0 20px 48px rgba(0,0,0,0.42)",
              }}
            >
              <div
                className="relative z-10 w-full flex items-center justify-between px-5 py-4 border-b"
                style={{ borderColor: "rgba(255,255,255,0.22)" }}
              >
                <h2
                  id="event-preview-title"
                  className="text-2xl md:text-3xl font-semibold"
                  style={{ color: theme.eventTitleColor }}
                >
                  {selectedPreviewEvent.title}
                </h2>

                <button
                  ref={previewCloseButtonRef}
                  type="button"
                  onClick={() => setSelectedPreviewEvent(null)}
                  aria-label="Close event preview"
                  className="inline-flex items-center rounded-md px-5 py-2.5 text-base font-bold shadow-md transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    backgroundColor: "#f59e0b",
                    color: "#1b1b1b",
                    border: "2px solid #6b3f00",
                  }}
                >
                  Close
                </button>
              </div>

              <div className="relative z-10 w-full p-5 flex items-start justify-center">
                {selectedPreviewEvent.flyer ? (
                  isPdfUrl(selectedPreviewEvent.flyer) ? (
                    <div className="w-full bg-white/96 p-3 rounded-xl shadow-sm">
                      <PdfViewer
                        fileUrl={selectedPreviewEvent.flyer}
                        containerHeight={1100}
                        altText={buildFlyerAltText(selectedPreviewEvent)}
                      />
                    </div>
                  ) : (
                    <div className="w-full bg-white/96 p-3 rounded-xl shadow-sm flex items-start justify-center">
                      <img
                        src={selectedPreviewEvent.flyer}
                        alt={buildFlyerAltText(selectedPreviewEvent)}
                        className="max-w-full h-auto w-auto object-contain rounded-lg"
                        style={{ maxHeight: "none" }}
                      />
                    </div>
                  )
                ) : (
                  <p className="text-white text-lg italic">No flyer available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomBar />
    </div>
  );
}
