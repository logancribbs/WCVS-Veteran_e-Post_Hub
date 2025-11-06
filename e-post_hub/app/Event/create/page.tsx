"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function CreateEventPage() {
  const [isRecurring, setIsRecurring] = useState(false);

  return (
    <div className="min-h-screen w-full bg-blue-100 flex justify-center items-center py-20">
      {/* Back Button */}
      <Link
        href="/"
        className="fixed top-6 left-6 px-4 py-2 bg-[#d6b26a] text-black rounded-md shadow hover:scale-105 transition-transform"
      >
        ← Back
      </Link>

      {/* Create Event Card */}
      <div
        className="
          w-full max-w-3xl 
          bg-[#f4ede3]
          rounded-xl 
          shadow-xl 
          border border-gray-300
          p-10
        "
      >
        <h1 className="text-3xl font-bold text-center mb-8">Create New Event</h1>

        {/* Event Title */}
        <input
          type="text"
          placeholder="Event Title"
          className="w-full p-3 rounded-md bg-white shadow-inner border border-gray-300 mb-6"
        />

        {/* Add Dates + Recurring Event */}
        <div className="flex gap-4 mb-6">
          {/* Add Dates */}
          <button className="w-1/2 bg-gray-200 font-medium py-3 rounded-md border border-gray-300">
            + Add Dates
          </button>

          {/* Recurring Event */}
          <button
            onClick={() => setIsRecurring(!isRecurring)}
            className={`
              w-1/2 font-medium py-3 rounded-md border border-gray-300 transition-colors
              ${isRecurring ? "bg-[#e48a24] text-white" : "bg-gray-200 text-black"}
            `}
          >
            {isRecurring ? "☑ Recurring Event" : "Recurring Event"}
          </button>
        </div>

        {/* Description Box */}
        <textarea
          placeholder="Event Description"
          className="w-full h-40 p-3 rounded-md bg-white shadow-inner border border-gray-300 mb-8"
        />

        {/* File Upload */}
        <div className="mb-4 font-medium">Flyer / Attachment (Required*)</div>
        <input
          type="file"
          className="w-full p-3 rounded-md bg-gray-100 shadow-inner border border-gray-300 mb-8"
        />

        {/* Website or Additional Info */}
        <input
          type="text"
          placeholder="Website or Additional Info"
          className="w-full p-3 rounded-md bg-white shadow-inner border border-gray-300 mb-10"
        />

        {/* Submit Button */}
        <button className="w-full bg-[#e48a24] text-black py-3 rounded-md border border-gray-400 shadow hover:scale-[1.02] transition-transform font-semibold">
          Submit Event
        </button>
      </div>
    </div>
  );
}
