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

<<<<<<< HEAD
  // ✅ Source list and filtered list
=======
  // CHANGED: we will actually use `events` as the authoritative list
>>>>>>> 20aed4ee0db8ca3dc89d39744ebe4ad7d4d16fc4
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

<<<<<<< HEAD
  // ✅ NEW: Live search query
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ NEW: Multi-field search filter
=======
  // NEW: search query lives here (we'll pass it down to HeroBanner)
  const [searchQuery, setSearchQuery] = useState("");

  // NEW: small helper to filter by multiple fields
>>>>>>> 20aed4ee0db8ca3dc89d39744ebe4ad7d4d16fc4
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

        // ✅ Apply date sorting & start/end range extraction
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

<<<<<<< HEAD
        // ✅ Store original list
        setEvents(allEvents);

        // ✅ Initial filtered list based on current query (empty initially)
        setFilteredEvents(filterEventsByQuery(searchQuery, allEvents));
=======
        // CHANGED: keep the raw list and apply current query once
        setEvents(allEvents); // source of truth
        setFilteredEvents(filterEventsByQuery(searchQuery, allEvents)); // respects current query
>>>>>>> 20aed4ee0db8ca3dc89d39744ebe4ad7d4d16fc4
      } catch (error) {
        console.error("Error fetching approved events:", error);
      }
    }

    fetchApprovedEvents();
  }, []); // initial load

  // NEW: re-filter whenever query or source list changes
  useEffect(() => {
    setFilteredEvents(filterEventsByQuery(searchQuery, events));
  }, [searchQuery, events]);

  // ✅ Live filtering (Option A you selected)
  useEffect(() => {
    setFilteredEvents(filterEventsByQuery(searchQuery, events));
  }, [searchQuery, events]);

  // Redirect based on role
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt.decode(token) as { role: string };
        if (decoded) {
          if (decoded.role === "ADMIN") router.push("/Admin");
          if (decoded.role === "MEMBER") router.push("/Member");
        }
      } catch (error) {
        console.error("Token decode error:", error);
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
<<<<<<< HEAD
      {/* ✅ updated HeroBanner with search props */}
      <HeroBanner query={searchQuery} onQueryChange={setSearchQuery} />
=======
      {/* CHANGED: make HeroBanner a controlled search input */}
      {/*    You will update HeroBanner to accept these props:
            - query: string
            - onQueryChange: (q: string) => void
            (If your HeroBanner has a Search button, you can also pass onSubmit)
      */}
      <HeroBanner
        query={searchQuery}                 // NEW
        onQueryChange={setSearchQuery}      // NEW
        // onSubmit={() => setFilteredEvents(filterEventsByQuery(searchQuery, events))} // optional
      />
>>>>>>> 20aed4ee0db8ca3dc89d39744ebe4ad7d4d16fc4

      <div className="flex flex-col md:flex-row w-full pt-6">
        {/* Sidebar (KEEP OUR FIXED WIDTH) */}
        <div className="w-full md:w-80 p-4">
          <Sidebar />
        </div>

<<<<<<< HEAD
        {/* EVENT GRID */}
        <div className="content flex-1 p-6 pl-8 md:pl-12 lg:pl-16">
=======
        {/* Event Cards */}
        {/* ONLY CHANGE (existing): lg:pl-10 to prevent overlap on Windows */}
        <div className="content flex-1 p-6 lg:pl-10">
>>>>>>> 20aed4ee0db8ca3dc89d39744ebe4ad7d4d16fc4
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
                    w-full max-w-[380px]
                    h-[520px]
                  "
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

      {/* MODAL */}
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
