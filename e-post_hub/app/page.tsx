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
    return lower.endsWith(".pdf") || lower.startsWith("data:application/pdf");
  }

  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role) {
      setIsAdmin(role === "ADMIN");
      return;
    }
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwt.decode(token) as { role?: string } | null;
      setIsAdmin(decoded?.role === "ADMIN");
    }
  }, []);

  function filterEventsByQuery(query: string, items: Event[]) {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((e) =>
      [
        e.title,
        e.description,
        e.address,
        e.type,
        e.createdBy?.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }

  function computeNextAnchor(ev: Event) {
    const occ = ev.occurrences ?? [];
    if (!occ.length) return { nextDate: undefined, isUpcoming: false };

    const sorted = [...occ].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const o of sorted) {
      const d = new Date(o.date);
      d.setHours(0, 0, 0, 0);
      if (d >= today) {
        return { nextDate: d.toISOString().slice(0, 10), isUpcoming: true };
      }
    }

    const last = sorted[sorted.length - 1];
    const d = new Date(last.date);
    d.setHours(0, 0, 0, 0);
    return { nextDate: d.toISOString().slice(0, 10), isUpcoming: false };
  }

  function sortByClosestToToday(a: Event, b: Event) {
    const aDate = a._nextDate ? new Date(a._nextDate).getTime() : Infinity;
    const bDate = b._nextDate ? new Date(b._nextDate).getTime() : Infinity;
    if (a._isUpcoming && !b._isUpcoming) return -1;
    if (!a._isUpcoming && b._isUpcoming) return 1;
    return a._isUpcoming ? aDate - bDate : bDate - aDate;
  }

  useEffect(() => {
    async function fetchApprovedEvents() {
      const res = await fetch("/api/Event/approved");
      const data = await res.json();
      const allEvents = data.events || [];

      allEvents.forEach((ev: Event) => {
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
    }

    fetchApprovedEvents();
  }, []);

  useEffect(() => {
    setFilteredEvents(
      filterEventsByQuery(searchQuery, events).sort(sortByClosestToToday)
    );
  }, [searchQuery, events]);

  return (
    <div className="min-h-screen w-full flex flex-col">
      <HeroBanner
        query={searchQuery}
        onQueryChange={setSearchQuery}
        isAdmin={isAdmin}
      />

      <div className="flex flex-col md:flex-row w-full pt-6">
        <div className="w-full md:w-[30%] p-6">
          <Sidebar />
        </div>

        <div className="flex-1 p-6">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <Card
                key={event.id}
                className="
                  relative overflow-hidden
                  bg-[#4F5D3A]
                  border-[3px] border-[#22301A]
                  rounded-2xl
                  shadow-[0_12px_28px_rgba(0,0,0,0.42)]
                  hover:shadow-[0_16px_36px_rgba(0,0,0,0.48)]
                  transition-transform hover:scale-[1.03]
                  duration-300
                  before:absolute before:inset-0
                  before:bg-[linear-gradient(135deg,rgba(255,255,255,0.18),rgba(255,255,255,0.04),transparent)]
                  before:opacity-60
                  before:pointer-events-none
                "
              >
                <div className="text-center text-xl font-semibold text-white pt-4">
                  {event.title}
                </div>

                <div
                  className="px-3 cursor-pointer"
                  onClick={() => setSelectedEvent(event)}
                >
                  {event.flyer && !isPdfUrl(event.flyer) && (
                    <img
                      src={event.flyer}
                      className="w-full h-[350px] object-cover rounded-xl border-2 border-white/30 bg-white"
                    />
                  )}
                </div>

                <CardBody className="flex justify-between items-center p-4">
                  <div className="text-white text-lg">
                    {event.startDate}
                  </div>
                  <Button className="bg-white text-[#0F2A22]">
                    View Details
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <BottomBar />
    </div>
  );
}
