"use client";

import { useState, useRef, useEffect } from "react"; // useRef - modal focus handling
import Image from "next/image";

export default function EventPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const modalTriggerRef = useRef<HTMLButtonElement | null>(null);

  // ✅ force admin ON for testing
  useEffect(() => {
    setIsAdmin(true);
  }, []);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/Event");
        const data = await response.json();
        setEvents(data || []);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  // Escape-to-close support - Modal accessibility effect
  useEffect(() => {
  if (!selectedEvent) return;

  closeButtonRef.current?.focus();

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      handleCloseModal();
    }
  }

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
  }, [selectedEvent]);


  const handleOpenModal = (
    eventData: any,
    trigger: HTMLButtonElement
  ) => {
    modalTriggerRef.current = trigger;
    setSelectedEvent(eventData);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setTimeout(() =>
    {
      modalTriggerRef.current?.focus();
    }, 0);
  }; // when the modal closes, focus should return to the button the user came from.

  // ✅ delete event
  const handleDelete = async (eventId: string) => {
    if (!confirm("Delete this event? This cannot be undone.")) return;

    try {
      let res = await fetch(`/api/Event/${eventId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        // fallback if backend only supports POST delete
        res = await fetch("/api/Event/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: eventId }),
        });
      }

      if (!res.ok) throw new Error("Delete failed");

      // remove from local list
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      if (selectedEvent?.id === eventId) setSelectedEvent(null);
    } catch (err) {
      console.error(err);
      alert("Delete failed. Check logs.");
    }
  };

  return (
    <main className="relative min-h-screen bg-[#C7D9FF] flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-8 text-center text-black">
        Upcoming Events
      </h1>

      {/* Event Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {events.length > 0 ? (
          events.map((event) => (
            <div
              key={event.id}
              className="bg-[#f8f8f8] rounded-2xl border border-gray-300 shadow-md p-5 w-[320px] flex flex-col justify-between hover:shadow-lg transition-all"
            >
              {/* Clickable Image */}
              <button
                type="button"
                onClick={(e) => handleOpenModal(event, e.currentTarget)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleOpenModal(event, e.currentTarget);
                  }
                }}
                className="cursor-pointer bg-transparent border-0 p-0 text-left rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700 focus-visible:outline-offset-4"
                aria-label={`Open flyer preview for ${event.title || "this event"}`}
              >
                <Image
                  src={event.flyer || "/default-flyer-placeholder.jpg"}
                  alt={event.title ? `${event.title} flyer` : "Event flyer"}
                  width={300}
                  height={300}
                  className="w-full h-64 object-cover rounded-xl mb-3"
                />
              </button>

              {/* Title */}
              <h2 className="text-lg font-semibold text-center mb-2">
                {event.title || "Untitled Event"}
              </h2>

              {/* ✅ Admin sees DELETE; user sees VIEW DETAILS */}
              {isAdmin ? (
                <button
                  onClick={() => handleDelete(event.id)}
                  className="w-full bg-red-600 text-white font-semibold py-2 rounded-md border border-black shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-red-700"
                >
                  Delete
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => handleOpenModal(event, e.currentTarget)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleOpenModal(event, e.currentTarget);
                    }
                  }}
                  className="w-full bg-[#E78E3F] text-black font-semibold py-2 rounded-md border border-black shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700 focus-visible:outline-offset-2"
                >
                  View Details
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-lg">No events found.</p>
        )}
      </div>

      {/* MODAL */}
      {selectedEvent && (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn px-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="event-preview-title"
          className="relative bg-white rounded-xl shadow-2xl border border-gray-400 p-4 max-w-3xl max-h-[85vh] flex flex-col items-center w-full"
        >
          <div className="w-full flex justify-between items-center mb-4">
            <h2
              id="event-preview-title"
              className="text-2xl font-bold text-black"
            >
              {selectedEvent.title || "Event Title"}
            </h2>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={handleCloseModal}
              aria-label="Close event preview"
              className="bg-orange-700 hover:bg-orange-800 text-white font-semibold px-5 py-2.5 rounded-md border border-black shadow-md transition-all hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700 focus-visible:outline-offset-2"
              >
              Back
            </button>
          </div>

          <Image
            src={selectedEvent.flyer || "/default-flyer-placeholder.jpg"}
            alt={selectedEvent.title ? `${selectedEvent.title} flyer` : "Event flyer"}
            width={900}
            height={1200}
            className="object-contain rounded-lg max-h-[75vh]"
          />
        </div>
      </div>
    )}
    </main>
  );
}