// app/Event/create/page.tsx
"use client";

import React, { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Occurrence = { date: string; startTime?: string; endTime?: string };
type DateMode = "single" | "multiple" | "range";

export default function CreateEventPage() {
  const router = useRouter();

  const [isRecurring, setIsRecurring] = useState(false);

  // Uncontrolled refs (keep your layout untouched)
  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const websiteRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Dates + modal state
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [showDateModal, setShowDateModal] = useState(false);
  const [dateMode, setDateMode] = useState<DateMode>("single");
  const [singleDate, setSingleDate] = useState("");
  const [multiDates, setMultiDates] = useState("");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [addingDatesError, setAddingDatesError] = useState<string | null>(null);

  const existingDatesSet = useMemo(
    () => new Set(occurrences.map((o) => o.date)),
    [occurrences]
  );

  function openDateModal() {
    setAddingDatesError(null);
    setShowDateModal(true);
  }
  function closeDateModal() {
    setShowDateModal(false);
  }

  function isValidISODate(d: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return false;
    const dt = new Date(d + "T00:00:00");
    return !Number.isNaN(dt.getTime()) && dt.toISOString().slice(0, 10) === d;
  }

  function addDatesToOccurrences(newDates: string[]) {
    const unique = newDates.filter(isValidISODate).filter((d) => !existingDatesSet.has(d));
    if (unique.length === 0) return;
    setOccurrences((prev) =>
      [...prev, ...unique.map((d) => ({ date: d }))].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    );
  }

  function confirmAddDates() {
    try {
      setAddingDatesError(null);
      let parsed: string[] = [];

      if (dateMode === "single") {
        if (!singleDate || !isValidISODate(singleDate)) {
          setAddingDatesError("Please pick a valid date (YYYY-MM-DD).");
          return;
        }
        parsed = [singleDate];
      } else if (dateMode === "multiple") {
        const tokens = multiDates
          .split(/[\s,]+/)
          .map((s) => s.trim())
          .filter(Boolean);
        const valids = tokens.filter(isValidISODate);
        if (valids.length === 0) {
          setAddingDatesError("Enter one or more valid dates separated by commas or new lines.");
          return;
        }
        parsed = valids;
      } else {
        if (!rangeStart || !rangeEnd || !isValidISODate(rangeStart) || !isValidISODate(rangeEnd)) {
          setAddingDatesError("Provide a valid start and end date (YYYY-MM-DD).");
          return;
        }
        const start = new Date(rangeStart + "T00:00:00");
        const end = new Date(rangeEnd + "T00:00:00");
        if (start > end) {
          setAddingDatesError("Start date must be on or before end date.");
          return;
        }
        const buf: string[] = [];
        for (let d = new Date(start); d.getTime() <= end.getTime(); d.setDate(d.getDate() + 1)) {
          buf.push(d.toISOString().slice(0, 10));
        }
        parsed = buf;
      }

      addDatesToOccurrences(parsed);
      setShowDateModal(false);
    } catch {
      setAddingDatesError("Could not add dates. Please try again.");
    }
  }

  function removeDate(d: string) {
    setOccurrences((prev) => prev.filter((o) => o.date !== d));
  }

  // Recurring “priority”: add +14d and +28d copies so it bubbles up periodically
  function extendForRecurring(baseDates: string[]): string[] {
    if (!isRecurring || baseDates.length === 0) return baseDates;
    const last = new Date(baseDates[baseDates.length - 1] + "T00:00:00");
    const d1 = new Date(last);
    d1.setDate(d1.getDate() + 14);
    const d2 = new Date(last);
    d2.setDate(d2.getDate() + 28);
    const extras = [d1, d2]
      .map((d) => d.toISOString().slice(0, 10))
      .filter((d) => !baseDates.includes(d));
    return [...baseDates, ...extras];
  }

  // Read the file as a data URL (image/* or application/pdf). No server creds needed.
  async function readFileAsDataUrl(): Promise<string | undefined> {
    const file = fileRef.current?.files?.[0];
    if (!file) return undefined;

    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";
    if (!isImage && !isPdf) return undefined;

    const asDataURL = await new Promise<string>((resolve, reject) => {
      const fr = new FileReader();
      fr.onerror = () => reject(new Error("File read failed"));
      fr.onload = () => resolve(String(fr.result));
      fr.readAsDataURL(file);
    });

    // sanity check
    if (asDataURL.startsWith("data:")) return asDataURL;
    return undefined;
  }

  async function handleSubmit() {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const rawTitle = (titleRef.current?.value || "").trim();
      const description = (descRef.current?.value || "").trim();
      const website = (websiteRef.current?.value || "").trim();
      const pickedFile = fileRef.current?.files?.[0];

      // Get data URL (image/pdf) or undefined
      const flyerDataUrl = await readFileAsDataUrl();

      // If title is empty but a file was picked, fall back to file name (no extension)
      let title = rawTitle;
      if (!title && pickedFile?.name) {
        title = pickedFile.name.replace(/\.[^.]+$/, "");
      }

      // Backend requires title OR flyer
      if (!title && !flyerDataUrl) return;

      const baseDates = occurrences.map((o) => o.date);
      const finalDates = extendForRecurring(baseDates);
      const eventOccurrences: Occurrence[] = finalDates.map((d) => ({ date: d }));

      const body = {
        title: title || undefined,
        description: description || undefined,
        website: website || undefined,
        flyer: flyerDataUrl || undefined, // <- store data URL directly
        eventOccurrences,
      };

      const res = await fetch("/api/Event/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) return;

      router.push("/");
      router.refresh?.();
    } catch {
      // keep UX unchanged
    }
  }

  return (
    <div className="min-h-screen w-full bg-blue-100 flex justify-center items-center py-20">
      {/* Back Button */}
      <Link
        href="/"
        className="fixed top-6 left-6 px-4 py-2 bg-[#d6b26a] text-black rounded-md shadow hover:scale-105 transition-transform"
      >
        ← Back
      </Link>

      {/* Create Event Card (structure/classes kept intact) */}
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
          ref={titleRef}
          type="text"
          placeholder="Event Title"
          className="w-full p-3 rounded-md bg-white shadow-inner border border-gray-300 mb-6"
        />

        {/* Add Dates + Recurring Event */}
        <div className="flex gap-4 mb-4">
          <button
            type="button"
            onClick={openDateModal}
            className="w-1/2 bg-gray-200 font-medium py-3 rounded-md border border-gray-300 hover:bg-gray-100"
          >
            + Add Dates
          </button>

          <button
            type="button"
            onClick={() => setIsRecurring(!isRecurring)}
            className={`
              w-1/2 font-medium py-3 rounded-md border border-gray-300 transition-colors
              ${isRecurring ? "bg-[#e48a24] text-white" : "bg-gray-200 text-black hover:bg-gray-100"}
            `}
            aria-pressed={isRecurring}
          >
            {isRecurring ? "☑ Recurring Event" : "Recurring Event"}
          </button>
        </div>

        {/* Selected dates as chips */}
        {occurrences.length > 0 && (
          <div className="mb-6">
            <div className="mb-2 text-sm font-medium text-gray-700">Dates added:</div>
            <div className="flex flex-wrap gap-2">
              {occurrences.map((o) => (
                <span
                  key={o.date}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1 text-sm"
                >
                  {o.date}
                  <button
                    type="button"
                    onClick={() => removeDate(o.date)}
                    className="rounded-full border border-gray-300 px-2 py-0.5 text-xs hover:bg-gray-100"
                    aria-label={`Remove ${o.date}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description Box */}
        <textarea
          ref={descRef}
          placeholder="Event Description"
          className="w-full h-40 p-3 rounded-md bg-white shadow-inner border border-gray-300 mb-8"
        />

        {/* File Upload (accept images + PDF; now stored as data URL) */}
        <div className="mb-4 font-medium">Flyer / Attachment (Required*)</div>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
          className="w-full p-3 rounded-md bg-gray-100 shadow-inner border border-gray-300 mb-8"
        />

        {/* Website or Additional Info (optional) */}
        <input
          ref={websiteRef}
          type="text"
          placeholder="Website or Additional Info"
          className="w-full p-3 rounded-md bg-white shadow-inner border border-gray-300 mb-10"
        />

        {/* Submit Button */}
        <button
          className="w-full bg-[#e48a24] text-black py-3 rounded-md border border-gray-400 shadow hover:scale-[1.02] transition-transform font-semibold"
          onClick={handleSubmit}
        >
          Submit Event
        </button>
      </div>

      {/* Date Modal */}
      {showDateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl border border-gray-200">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="text-lg font-semibold">Add Dates</h2>
              <button
                onClick={closeDateModal}
                className="rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
              >
                Close
              </button>
            </div>

            <div className="px-5 pt-4">
              {/* Mode Switcher */}
              <div className="mb-4 flex gap-2">
                <button
                  onClick={() => setDateMode("single")}
                  className={`rounded-md border px-3 py-1 text-sm ${
                    dateMode === "single" ? "bg-gray-200" : "hover:bg-gray-50"
                  }`}
                >
                  Single
                </button>
                <button
                  onClick={() => setDateMode("multiple")}
                  className={`rounded-md border px-3 py-1 text-sm ${
                    dateMode === "multiple" ? "bg-gray-200" : "hover:bg-gray-50"
                  }`}
                >
                  Multiple
                </button>
                <button
                  onClick={() => setDateMode("range")}
                  className={`rounded-md border px-3 py-1 text-sm ${
                    dateMode === "range" ? "bg-gray-200" : "hover:bg-gray-50"
                  }`}
                >
                  Range
                </button>
              </div>

              {/* Mode Content */}
              {dateMode === "single" && (
                <div className="mb-5">
                  <label className="block text-sm font-medium mb-1">Pick a date</label>
                  <input
                    type="date"
                    className="w-full rounded-md border px-3 py-2"
                    value={singleDate}
                    onChange={(e) => setSingleDate(e.target.value)}
                  />
                </div>
              )}

              {dateMode === "multiple" && (
                <div className="mb-5">
                  <label className="block text-sm font-medium mb-1">
                    Enter dates (comma or newline separated)
                  </label>
                  <textarea
                    className="w-full rounded-md border px-3 py-2"
                    rows={4}
                    placeholder={"2025-12-12, 2025-12-19\n2025-12-26"}
                    value={multiDates}
                    onChange={(e) => setMultiDates(e.target.value)}
                  />
                </div>
              )}

              {dateMode === "range" && (
                <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start date</label>
                    <input
                      type="date"
                      className="w-full rounded-md border px-3 py-2"
                      value={rangeStart}
                      onChange={(e) => setRangeStart(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End date</label>
                    <input
                      type="date"
                      className="w-full rounded-md border px-3 py-2"
                      value={rangeEnd}
                      onChange={(e) => setRangeEnd(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {addingDatesError && (
                <div className="mb-3 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {addingDatesError}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t">
              <button
                onClick={closeDateModal}
                className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmAddDates}
                className="rounded-md bg-[#e48a24] px-4 py-2 text-sm font-semibold text-white hover:brightness-105"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
