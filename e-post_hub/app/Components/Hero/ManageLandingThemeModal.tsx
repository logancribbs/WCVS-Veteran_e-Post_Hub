"use client";

import { useEffect, useState } from "react";
import { ThemeOverride } from "@/app/themes/types";
import { useLandingTheme } from "@/app/themes";

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
    description: "Turns all holiday styling off and uses the standard landing page colors.",
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
  const [selectedOverride, setSelectedOverride] = useState<ThemeOverride>("auto");
  const [durationMap, setDurationMap] = useState<Record<string, number>>({});
  const [activeTheme, setActiveTheme] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const { remainingDays } = useLandingTheme();

  useEffect(() => {
    setSelectedOverride(currentOverride);
  }, [isOpen, currentOverride]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    setMessage("Saving theme...");

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to save theme.");
      }

      onSaved(selectedOverride);
      setMessage("");
      onClose();
    } catch (error) {
      if (error instanceof Error && error.message) {
        setMessage(error.message);
      } else {
        setMessage("Failed to save theme.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-4xl rounded-2xl border-2 border-black/70 bg-[#f7f1e8] shadow-[0_6px_16px_rgba(0,0,0,0.35)]">
        <div className="border-b border-black/20 px-6 py-4">
          <h2 className="text-2xl font-semibold text-black">Manage Landing Theme</h2>
          <p className="mt-1 text-sm text-black/70">
            Choose automatic seasonal themes or manually force a specific holiday look.
          </p>
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-6">
          {message && (
            <div className="mb-4 rounded-lg border border-black/20 bg-white px-4 py-3 text-sm text-black">
              {message}
            </div>
          )}

          <div className="space-y-4">
            {themeOptions.map((option) => {
              const isSelected = selectedOverride === option.value;

              return (
                <div
                  key={option.value}
                  className={`relative rounded-xl border p-4 shadow-sm transition-all ${
                    isSelected
                      ? "border-black bg-[#FFF7E6]"
                      : "border-black/20 bg-white hover:bg-black/[0.03]"
                  }`}
                >
                  <button
                    type="button"
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
                      {!durationMap[option.value] ? (
                        <button
                          onClick={() => setActiveTheme(option.value)}
                          className="underline"
                        >
                          set duration
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span>
                            {selectedOverride === option.value && remainingDays
                              ? `${remainingDays}d left`
                              : `${durationMap[option.value]}d`}
                          </span>

                          <button onClick={() => setActiveTheme(option.value)}>
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

          {activeTheme && (
            <div className="mt-6 rounded-xl border border-black/20 bg-white p-4">
              <input
                type="number"
                min={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="days"
                className="w-full rounded-lg border border-black/20 px-3 py-2"
              />
              <button
                onClick={() => {
                  const val = parseInt(input);
                  if (!isNaN(val) && val > 0) {
                    setDurationMap({ ...durationMap, [activeTheme]: val });
                    setActiveTheme(null);
                    setInput("");
                  }
                }}
                className="mt-3"
              >
                save
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-black/20 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-lg border border-black/20 bg-white px-4 py-2 font-semibold text-black hover:bg-black/5"
          >
            Cancel
          </button>

          <button
            type="button"
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