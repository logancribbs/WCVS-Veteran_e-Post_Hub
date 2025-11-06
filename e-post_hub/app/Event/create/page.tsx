"use client";

import Link from "next/link";

export default function CreateEventPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#C7D9FF] p-6">
      {/* Back Button */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="
            bg-[#D8B67A] 
            hover:bg-[#c7a267] 
            text-black 
            font-semibold 
            px-6 py-3 
            rounded-md 
            border border-black 
            shadow-md 
            text-lg
            transition-all 
            hover:-translate-y-0.5 
            active:translate-y-0
          "
        >
          ← Back
        </Link>
      </div>

      {/* Create Event Card */}
      <div
        className="
          bg-[#FFF9F2]
          w-full max-w-2xl
          rounded-lg
          shadow-2xl
          p-10
          mt-12
          border border-gray-400
        "
      >
        <h1 className="text-3xl font-bold text-center mb-8 text-black">
          Create New Event
        </h1>

        {/* Title Input */}
        <input
          type="text"
          placeholder="Event Title"
          className="
            w-full 
            border border-gray-400 
            rounded-md 
            px-3 py-3 
            mb-5 
            shadow-sm 
            focus:outline-none 
            focus:border-black
          "
        />

        {/* Add Dates Button */}
        <button
          type="button"
          className="
            w-full 
            bg-gray-200 
            border border-gray-500 
            rounded-md 
            py-2.5 
            font-semibold 
            text-black 
            shadow-sm 
            hover:bg-gray-300 
            transition-all 
            mb-5
          "
        >
          + Add Dates
        </button>

        {/* Description Input */}
        <textarea
          placeholder="Event Description"
          rows={6}
          className="
            w-full 
            border border-gray-400 
            rounded-md 
            px-3 py-3 
            mb-5 
            shadow-sm 
            focus:outline-none 
            focus:border-black
          "
        />

        {/* File Upload */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-black mb-1">
            Flyer / Attachment (Required*)
          </label>
          <input
            type="file"
            className="
              w-full 
              border border-gray-400 
              rounded-md 
              py-2 px-2 
              shadow-sm 
              text-black
              focus:outline-none 
              focus:border-black
            "
          />
        </div>

        {/* Address Input */}
        <input
          type="text"
          placeholder="Address"
          className="
            w-full 
            border border-gray-400 
            rounded-md 
            px-3 py-3 
            mb-5 
            shadow-sm 
            focus:outline-none 
            focus:border-black
          "
        />

        {/* Website Input */}
        <input
          type="text"
          placeholder="Website or Additional Info"
          className="
            w-full 
            border border-gray-400 
            rounded-md 
            px-3 py-3 
            mb-6 
            shadow-sm 
            focus:outline-none 
            focus:border-black
          "
        />

        {/* Submit Button */}
        <button
          type="button"
          className="
            w-full 
            bg-[#ff7b00]
            hover:bg-[#ff6a00]
            text-black 
            font-semibold 
            py-3 
            rounded-md 
            border border-black 
            shadow-md 
            transition-all 
            hover:-translate-y-1 
            hover:shadow-lg 
            active:translate-y-0
          "
        >
          Submit Event
        </button>
      </div>
    </main>
  );
}
