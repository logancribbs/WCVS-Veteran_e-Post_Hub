"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import jwt from "jsonwebtoken";

const defaultSlideshowImages = [
  "/Helmet_w_Flag.jpg",
  "/Landscape_1.jpg",
  "/Landscape_2.jpg",
  "/US_Flags_Veterans.jpg",
  "/Landscape_3.jpg",
];

export default function Sidebar() {
  const resources = [
    {
      label: "Veteran Health Care",
      href: "https://www.va.gov/spokane-health-care/locations/mann-grandstaff-department-of-veterans-affairs-medical-center/",
    },
    {
      label: "Whitman County Veteran Services",
      href: "https://www.whitmancounty.gov/628/Veteran-Services-Officer",
    },
    {
      label: "Palouse Resource Guide",
      href: "https://palouseresources.org/",
    },
    {
      label: "More Resources",
      href: "/Resources",
    },
  ];

  const adminControls = [
    { label: "Create Event", href: "/Event/create" },
    { label: "Manage Homepage Images", action: "manageImages" },
    { label: "Manage Resource Links", href: "/Admin/resources" },
  ];

  const [slideshowImages, setSlideshowImages] = useState<string[]>(defaultSlideshowImages);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showManager, setShowManager] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/slideshow", { cache: "no-store" });
        const data = await res.json();

        if (data.images.length > 0) {
          setSlideshowImages(data.images);
        }
      } catch {}
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const readRole = () => {
      const role = localStorage.getItem("role");

      if (role) {
        setIsAdmin(role === "ADMIN");
        return;
      }

      const token = localStorage.getItem("token");

      if (token) {
        try {
          const decoded = jwt.decode(token) as { role?: string } | null;
          setIsAdmin(decoded?.role === "ADMIN");
        } catch {
          setIsAdmin(false);
        }
      }
    };

    readRole();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideshowImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slideshowImages]);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files) return;

    const newImages: string[] = [];

    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      newImages.push(url);
    });

    setSlideshowImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setSlideshowImages((prev) => prev.filter((_, i) => i !== index));
  };

  const saveImages = async () => {
    await fetch("/api/slideshow", {
      method: "POST",
      body: JSON.stringify({ images: slideshowImages }),
      headers: { "Content-Type": "application/json" },
    });

    setShowManager(false);
  };

  return (
    <>
      <aside
        className="w-full md:min-w-[340px] lg:min-w-[360px] border-2 border-black/70 rounded-2xl p-6 flex flex-col items-center text-white gap-4"
        style={{
          backgroundColor: "#8C1F1F",
          backgroundImage:
            "linear-gradient(to bottom, #8C1F1F 0%, #A32626 55%, #ff8c00 100%)",
        }}
      >
        <div className="w-full max-w-[320px] rounded-lg border border-gray-300 overflow-hidden relative">
          <div className="aspect-[4/3] flex items-center justify-center bg-black/10">
            <img
              src={slideshowImages[currentIndex]}
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        <nav className="w-full flex flex-col gap-3 text-left font-semibold text-white text-base">
          {(isAdmin ? adminControls : resources).map((item) =>
            item.action === "manageImages" ? (
              <button
                key={item.label}
                onClick={() => setShowManager(true)}
                className="group flex items-center gap-3 rounded-lg px-3 py-2 border border-white/20 bg-white/5 hover:bg-white/20"
              >
                {item.label}
              </button>
            ) : (
              <Link
                key={item.label}
                href={item.href!}
                className="group flex items-center gap-3 rounded-lg px-3 py-2 border border-white/20 bg-white/5 hover:bg-white/20"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>
      </aside>

      {showManager && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-xl shadow-lg p-6 w-[600px]">
            <h2 className="text-xl font-semibold mb-4">
              Manage Homepage Images
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {slideshowImages.map((img, i) => (
                <div key={i} className="border rounded p-2">
                  <div className="aspect-[4/3] flex items-center justify-center">
                    <img src={img} className="object-contain w-full h-full" />
                  </div>

                  <button
                    onClick={() => removeImage(i)}
                    className="mt-2 text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleUpload}
            />

            <div className="flex justify-end mt-4 gap-3">
              <button
                onClick={() => setShowManager(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={saveImages}
                className="px-4 py-2 bg-orange-500 text-white rounded"
              >
                Save Images
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
