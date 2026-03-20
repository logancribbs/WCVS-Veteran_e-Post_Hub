"use client";

import { useEffect, useState } from "react";
import { ThemeOverride } from "@/app/themes/types";
import { Settings } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  currentOverride: ThemeOverride;
  onSaved: (override: ThemeOverride) => void;
};

export default function ManageLandingThemeModal({
  isOpen,
  onClose,
  currentOverride,
  onSaved,
}: Props) {
  const [selectedOverride, setSelectedOverride] = useState<ThemeOverride>("auto");

  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [hasCustomRange, setHasCustomRange] = useState(false);

  const [showSettings, setShowSettings] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/theme", { cache: "no-store" });
        const data = await res.json();

        setSelectedOverride(currentOverride);

        if (data.expiresAt && data.startsAt) {
          setRangeStart(data.startsAt.slice(0, 10));
          setRangeEnd(data.expiresAt.slice(0, 10));
          setHasCustomRange(true);
        } else {
          setHasCustomRange(false);
          setRangeStart("");
          setRangeEnd("");
        }
      } catch {}
    }

    if (isOpen) load();
  }, [isOpen, currentOverride]);

  if (!isOpen) return null;

  const showRange =
    selectedOverride === "christmas" ||
    selectedOverride === "fourthOfJuly";

  const handleSave = async () => {
    try {
      await fetch("/api/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          override: selectedOverride,
          startDate: rangeStart || null,
          endDate: rangeEnd || null,
        }),
      });

      onSaved(selectedOverride);
      onClose();
    } catch {}
  };

  const clearRange = async () => {
    setRangeStart("");
    setRangeEnd("");
    setHasCustomRange(false);

    await fetch("/api/theme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        override: selectedOverride,
        startDate: null,
        endDate: null,
      }),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-3xl rounded-2xl bg-[#f7f1e8] border border-black/30 shadow-lg">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Theme Settings</h2>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-black/10 rounded-md"
          >
            <Settings size={20} />
          </button>
        </div>

        {/* SETTINGS PANEL */}
        {showSettings && (
          <div className="px-6 py-4 border-b bg-white/60">
            {hasCustomRange ? (
              <>
                <p className="text-sm mb-2">
                  Active Duration:
                  <span className="font-semibold ml-2">
                    {rangeStart} → {rangeEnd}
                  </span>
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setHasCustomRange(false);
                      setRangeStart("");
                      setRangeEnd("");
                    }}
                    className="px-3 py-1 border rounded"
                  >
                    Adjust
                  </button>

                  <button
                    onClick={clearRange}
                    className="px-3 py-1 border rounded text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-600">
                No custom duration set (default behavior active)
              </p>
            )}
          </div>
        )}

        {/* BODY */}
        <div className="p-6 space-y-4">

          {/* THEME OPTIONS */}
          {["auto", "default", "fourthOfJuly", "christmas"].map((opt) => (
            <button
              key={opt}
              onClick={() => setSelectedOverride(opt as ThemeOverride)}
              className={`w-full text-left p-3 rounded border ${
                selectedOverride === opt
                  ? "bg-[#FFF7E6] border-black"
                  : "bg-white"
              }`}
            >
              {opt}
            </button>
          ))}

          {/* DATE RANGE PICKER */}
          {showRange && (
            <div className="mt-4 p-4 bg-white rounded border">
              <p className="text-sm mb-2 font-semibold">
                Custom Duration (optional)
              </p>

              <div className="flex gap-3">
                <input
                  type="date"
                  value={rangeStart}
                  onChange={(e) => setRangeStart(e.target.value)}
                  className="border rounded px-2 py-1"
                />
                <input
                  type="date"
                  value={rangeEnd}
                  onChange={(e) => setRangeEnd(e.target.value)}
                  className="border rounded px-2 py-1"
                />
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Select one or two dates. Range will be applied automatically.
              </p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#A32626] text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
