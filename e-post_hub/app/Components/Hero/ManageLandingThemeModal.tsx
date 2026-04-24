"use client";

import { useEffect, useState } from "react";
import { ThemeOverride } from "@/app/themes/types";

type ManageLandingThemeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentOverride: ThemeOverride;
  onSaved: (override: ThemeOverride) => void;
};

const themeOptions: {
  value: ThemeOverride;
  title: string;
  description: string;
}[] = [
  {
    value: "auto",
    title: "Auto",
    description: "Themes will automatically apply based on the date.",
  },
  {
    value: "default",
    title: "Default",
    description:
      "Turns all holiday styling off and uses the standard landing page colors.",
  },
  {
    value: "fourthOfJuly",
    title: "4th of July",
    description: "Turn on 4th of July Theme.",
  },
  {
    value: "christmas",
    title: "Christmas",
    description: "Turn on Christmas Theme.",
  },
  {
    value: "thanksgiving",
    title: "Thanksgiving",
    description: "Turn on Thanksgiving Theme.",
  },
  {
    value: "newYears",
    title: "New Years",
    description: "Turn on New Years Theme.",
  },
  {
    value: "veteransDay",
    title: "Veterans Day",
    description: "Turn on Veterans Day Theme.",
  },
];

export default function ManageLandingThemeModal({
  isOpen,
  onClose,
  currentOverride,
  onSaved,
}: ManageLandingThemeModalProps) {
  const [selectedOverride, setSelectedOverride] =
    useState<ThemeOverride>("auto");
  const [durationMap, setDurationMap] = useState<Record<string, number>>({});
  const [editingTheme, setEditingTheme] = useState<ThemeOverride | null>(null);
  const [input, setInput] = useState("");
  const [remainingDays, setRemainingDays] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSelectedOverride(currentOverride);
  }, [isOpen, currentOverride]);

  useEffect(() => {
    async function fetchExpires() {
      try {
        const res = await fetch("/api/theme", { cache: "no-store" });
        if (!res.ok) return;

        const data = await res.json();

        if (!data.expiresAt) {
          setRemainingDays(null);
          return;
        }

        const end = new Date(data.expiresAt);
        const now = new Date();

        const diff = end.getTime() - now.getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

        setRemainingDays(days > 0 ? days : null);
      } catch {}
    }

    if (isOpen) fetchExpires();
  }, [isOpen, selectedOverride]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const days = durationMap[selectedOverride];

      const response = await fetch("/api/theme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          override: selectedOverride,
          customDurationDays: days ?? null,
        }),
      });

      if (!response.ok) throw new Error();

      onSaved(selectedOverride);
      onClose();
    } catch {
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-4xl rounded-2xl border-2 border-black/70 bg-[#f7f1e8] shadow-[0_6px_16px_rgba(0,0,0,0.35)]">

        {/* Header */}
        <div className="border-b border-black/20 px-6 py-4">
          <h2 className="text-2xl font-semibold text-black">
            Manage Landing Theme
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="max-h-[65vh] overflow-y-auto p-6 space-y-4">
          {themeOptions.map((option) => {
            const isSelected = selectedOverride === option.value;
            const hasDuration = durationMap[option.value];

            return (
              <div
                key={option.value}
                className={`relative rounded-xl border p-4 ${
                  isSelected
                    ? "border-black bg-[#FFF7E6]"
                    : "border-black/20 bg-white hover:bg-black/[0.03]"
                }`}
              >
                <button
                  onClick={() => setSelectedOverride(option.value)}
                  disabled={isSaving}
                  className="w-full text-left"
                >
                  <div className="text-base font-semibold text-black">
                    {option.title}
                  </div>
                  <div className="mt-1 text-sm text-black/70">
                    {option.description}
                  </div>
                </button>

                {option.value !== "auto" && option.value !== "default" && (
                  <div className="absolute bottom-2 right-2 text-xs">
                    {!hasDuration && editingTheme !== option.value && (
                      <button
                        onClick={() => {
                          setEditingTheme(option.value);
                          setInput("");
                        }}
                        className="underline"
                      >
                        Set Duration
                      </button>
                    )}

                    {editingTheme === option.value && (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={1}
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          className="w-14 rounded border border-black/20 px-1 py-[2px]"
                        />
                        <button
                          onClick={() => {
                            const val = parseInt(input);
                            if (!isNaN(val) && val > 0) {
                              setDurationMap({
                                ...durationMap,
                                [option.value]: val,
                              });
                              setEditingTheme(null);
                              setInput("");
                            }
                          }}
                        >
                          ✓
                        </button>
                      </div>
                    )}

                    {hasDuration && editingTheme !== option.value && (
                      <div className="flex items-center gap-2">
                        <span>
                          {selectedOverride === option.value && remainingDays
                            ? `${remainingDays}d left`
                            : `${hasDuration}d`}
                        </span>

                        <button onClick={() => setEditingTheme(option.value)}>
                          ✏️
                        </button>

                        <button
                          onClick={() => {
                            const copy = { ...durationMap };
                            delete copy[option.value];
                            setDurationMap(copy);
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-black/20 px-6 py-4">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="rounded-lg border border-black/20 bg-white px-4 py-2 font-semibold text-black hover:bg-black/5"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-lg border border-black/30 bg-[#A32626] px-4 py-2 font-semibold text-white hover:bg-[#8C1F1F]"
          >
            {isSaving ? "Saving..." : "Save Theme"}
          </button>
        </div>
      </div>
    </div>
  );
}