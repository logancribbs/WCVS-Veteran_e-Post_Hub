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
];

export default function ManageLandingThemeModal({
  isOpen,
  onClose,
  currentOverride,
  onSaved,
}: ManageLandingThemeModalProps) {
  const [selectedOverride, setSelectedOverride] = useState<ThemeOverride>("auto");
  const [customDurationDays, setCustomDurationDays] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadThemeSettings() {
      try {
        const response = await fetch("/api/theme", { cache: "no-store" });
        if (!response.ok) {
          setSelectedOverride(currentOverride);
          setCustomDurationDays("");
          setMessage("");
          return;
        }

        const data = await response.json();
        setSelectedOverride(currentOverride);

        if (
          typeof data.expiresAt === "string" &&
          data.expiresAt.trim() &&
          (currentOverride === "christmas" || currentOverride === "fourthOfJuly")
        ) {
          const expiresAt = new Date(data.expiresAt);
          const now = new Date();

          if (!Number.isNaN(expiresAt.getTime()) && expiresAt.getTime() > now.getTime()) {
            const msRemaining = expiresAt.getTime() - now.getTime();
            const daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24));
            setCustomDurationDays(String(daysRemaining));
          } else {
            setCustomDurationDays("");
          }
        } else {
          setCustomDurationDays("");
        }

        setMessage("");
      } catch {
        setSelectedOverride(currentOverride);
        setCustomDurationDays("");
        setMessage("");
      }
    }

    if (isOpen) {
      loadThemeSettings();
    }
  }, [isOpen, currentOverride]);

  if (!isOpen) return null;

  const showDurationInput =
    selectedOverride === "christmas" || selectedOverride === "fourthOfJuly";

  const handleSave = async () => {
    setIsSaving(true);
    setMessage("Saving theme...");

    try {
      const trimmedDuration = customDurationDays.trim();
      const parsedDuration =
        trimmedDuration === "" ? null : Number.parseInt(trimmedDuration, 10);

      if (
        trimmedDuration !== "" &&
        (!Number.isFinite(parsedDuration) || parsedDuration === null || parsedDuration < 1)
      ) {
        throw new Error("Enter a valid duration in days.");
      }

      const response = await fetch("/api/theme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          override: selectedOverride,
          customDurationDays:
            showDurationInput && parsedDuration !== null ? parsedDuration : null,
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
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedOverride(option.value)}
                  disabled={isSaving}
                  className={`w-full rounded-xl border p-4 text-left shadow-sm transition-all ${
                    isSelected
                      ? "border-black bg-[#FFF7E6]"
                      : "border-black/20 bg-white hover:bg-black/[0.03]"
                  }`}
                >
                  <div className="text-base font-semibold text-black">{option.title}</div>
                  <div className="mt-1 text-sm text-black/70">{option.description}</div>
                </button>
              );
            })}
          </div>

          {showDurationInput && (
            <div className="mt-6 rounded-xl border border-black/20 bg-white p-4">
              <label
                htmlFor="custom-theme-duration"
                className="block text-sm font-semibold text-black"
              >
                Custom Theme Duration (Days)
              </label>
              <p className="mt-1 text-sm text-black/70">
                Optional. If set, this theme stays active for the number of days you choose.
                If left blank, the current default behavior is used.
              </p>
              <input
                id="custom-theme-duration"
                type="number"
                min={1}
                step={1}
                inputMode="numeric"
                value={customDurationDays}
                onChange={(e) => setCustomDurationDays(e.target.value)}
                disabled={isSaving}
                placeholder="Example: 30"
                className="mt-3 w-full rounded-lg border border-black/20 bg-[#fdfbf7] px-3 py-2 text-black outline-none focus:border-black"
              />
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
