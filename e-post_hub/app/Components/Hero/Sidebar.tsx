"use client";

import Image from "next/image";
// state + effect for slideshow
import { useEffect, useState } from "react";

export default function Sidebar() {

  // list of images to use in the slideshow
  // replace these paths with whatever images you want to show.
  const slideshowImages = [
    "/Helmet_w_Flag.jpg",
    "/Landscape_1.jpg",
    "/Landscape_2.jpg",
    "/US_Flags_Veterans.jpg",
    "/Landscape_3.jpg"
  ];

  const [currentIndex, setCurrentIndex] = useState(0); 

  // auto-advance the slideshow every 5 seconds
  useEffect(() => {
    if (slideshowImages.length <= 1) return; // no need to rotate a single image

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideshowImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slideshowImages.length]);

  // manual controls
  const showPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? slideshowImages.length - 1 : prev - 1
    );
  };

  const showNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slideshowImages.length);
  };

  return (
    <aside
      className="
        w-full
        md:min-w-[340px]
        lg:min-w-[360px]
        bg-gradient-to-b from-[#8C1F1F] via-[#A32626] to-[#ff8c00]
        border-2 border-black/70
        rounded-2xl
        p-5 md:p-6
        flex flex-col
        items-center
        text-white
        shadow-[0_6px_16px_rgba(0,0,0,0.35)]   
        md:sticky md:top-6
        gap-4
      "
    >
      <div
        className="
          w-full max-w-[320px]
          rounded-lg
          border border-gray-300
          overflow-hidden
          relative
          shadow-md
        "
      >
        <Image
          src={slideshowImages[currentIndex]} // use current slide
          alt="Veteran Services photos"
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-auto object-contain"
          unoptimized
        />

        {/* show controls only if there is more than one image */}
        {slideshowImages.length > 1 && (
          <>
            {/* Prev/Next buttons */}
            <button
              type="button"
              onClick={showPrev}
              className="
                absolute left-2 top-1/2 -translate-y-1/2
                bg-black/40 hover:bg-black/60
                text-white
                rounded-full
                w-7 h-7
                flex items-center justify-center
                text-xs
                transition-colors
              "
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={showNext}
              className="
                absolute right-2 top-1/2 -translate-y-1/2
                bg-black/40 hover:bg-black/60
                text-white
                rounded-full
                w-7 h-7
                flex items-center justify-center
                text-xs
                transition-colors
              "
              aria-label="Next image"
            >
              ›
            </button>

            {/* Dots indicator */}
            <div
              className="
                absolute bottom-2 left-1/2 -translate-x-1/2
                flex gap-1.5
              "
            >
              {slideshowImages.map((_, idx) => (
                <span
                  key={idx}
                  className={`
                    h-2 w-2 rounded-full
                    ${idx === currentIndex ? "bg-white" : "bg-white/50"}
                  `}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Contact Info</h3>
        <p className="text-sm leading-relaxed">
          <strong>Email:</strong>{" "}
          <a href="mailto:BeckyBuri@whitmancounty.gov" className="text-blue-300 hover:underline">
            BeckyBuri@whitmancounty.gov
          </a>
          <br />
          <strong>Phone:</strong>{" "}
          <a href="tel:+15093975246" className="text-blue-300 hover:underline">
            +1 (509)-397-5246
          </a>
        </p>
      </div>

   <nav className="w-full flex flex-col gap-3 text-left font-semibold text-white text-base">
  <a
    href="https://www.va.gov/spokane-health-care/locations/mann-grandstaff-department-of-veterans-affairs-medical-center/"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:underline"
  >
    - Veteran Health Care
  </a>

  <a
    href="https://www.whitmancounty.gov/628/Veteran-Services-Officer"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:underline"
  >
    - Whitman County Veteran Services
  </a>

  <a
    href="https://palouseresources.org/"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:underline"
  >
    - Palouse Resource Guide
  </a>
</nav>
    </aside>
  );
}
