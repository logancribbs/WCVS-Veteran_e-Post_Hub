"use client";

import React, { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Occurrence = { date: string; startTime?: string; endTime?: string };
type DateMode = "single" | "multiple" | "range";

export default function CreateEventPage() {
  const router = useRouter();

  const [isRecurring, setIsRecurring] = useState(false);

  const [, forceRender] = useState(0);

  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const websiteRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const timeRef = useRef<HTMLInputElement>(null);
  const organizerRef = useRef<HTMLInputElement>(null);

  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [showDateModal, setShowDateModal] = useState(false);
  const [dateMode, setDateMode] = useState<DateMode>("single");
  const [singleDate, setSingleDate] = useState("");
  const [multiDates, setMultiDates] = useState("");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [addingDatesError, setAddingDatesError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
    const unique = newDates
      .filter(isValidISODate)
      .filter((d) => !existingDatesSet.has(d));

    if (unique.length === 0) return;

    setOccurrences((prev) =>
      [...prev, ...unique.map((d) => ({ date: d }))].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    );

    forceRender((x) => x + 1);
  }

  function confirmAddDates() {
    let parsed: string[] = [];

    if (dateMode === "single") parsed = [singleDate];
    else if (dateMode === "multiple")
      parsed = multiDates.split(/[\s,]+/).filter(Boolean);
    else {
      const start = new Date(rangeStart);
      const end = new Date(rangeEnd);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        parsed.push(d.toISOString().slice(0, 10));
      }
    }

    addDatesToOccurrences(parsed);
    setShowDateModal(false);
  }

  function removeDate(d: string) {
    setOccurrences((prev) => prev.filter((o) => o.date !== d));
    forceRender((x) => x + 1);
  }

  async function readFileAsDataUrl(): Promise<string | undefined> {
    const file = fileRef.current?.files?.[0];
    if (!file) return undefined;

    return await new Promise((resolve) => {
      const fr = new FileReader();
      fr.onload = () => resolve(String(fr.result));
      fr.readAsDataURL(file);
    });
  }

  const hasTitle = Boolean(titleRef.current?.value?.trim());
  const hasDescription = Boolean(descRef.current?.value?.trim());
  const hasDate = occurrences.length > 0;
  const canSubmit = hasTitle && hasDescription && hasDate;

  async function handleSubmit() {
    const title = titleRef.current?.value || "";
    const description = descRef.current?.value || "";
    const website = websiteRef.current?.value || "";
    const time = timeRef.current?.value || "";
    const organizer = organizerRef.current?.value || "";

    const flyer = await readFileAsDataUrl();

    await fetch("/api/Event/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        website,
        time,
        organizer,
        flyer,
        eventOccurrences: occurrences,
      }),
    });

    router.push("/");
  }

  return (
    <div className="min-h-screen flex justify-center items-center py-20">
      <div className="w-full max-w-3xl p-10 bg-[#f4ede3] rounded-xl">

        <h1 className="text-3xl font-bold mb-8 text-center">Create New Event</h1>

        <input
          ref={titleRef}
          placeholder="Event Title"
          className="w-full p-3 border mb-2"
          onChange={() => forceRender((x) => x + 1)}
        />

        <div className="flex gap-4 mb-4">
          <button onClick={openDateModal} className="w-1/2 bg-gray-200 py-3">
            + Add Dates
          </button>

          <button
            onClick={() => setIsRecurring(!isRecurring)}
            className="w-1/2 bg-gray-200 py-3"
          >
            Recurring Event
          </button>
        </div>

        <textarea
          ref={descRef}
          placeholder="Event Description"
          className="w-full h-40 p-3 border mb-6"
          onChange={() => forceRender((x) => x + 1)}
        />

        <input ref={fileRef} type="file" className="mb-6" />

        <input
          ref={websiteRef}
          placeholder="Website or Additional Info"
          className="w-full p-3 border mb-4"
        />

        <input
          ref={timeRef}
          placeholder="Event Time (Optional)"
          className="w-full p-3 border mb-4"
        />

        <input
          ref={organizerRef}
          placeholder="Organizer (Optional)"
          className="w-full p-3 border mb-6"
        />

        <button
          disabled={!canSubmit}
          onClick={handleSubmit}
          className="w-full bg-orange-500 py-3"
        >
          Submit Event
        </button>
      </div>
    </div>
  );
}
