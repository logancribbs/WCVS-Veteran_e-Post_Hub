"use client";

import Image from "next/image";

export default function Sidebar() {
  return (
    <aside
      className="
        w-full
        // md:w-[260px]
        md:min-w-[300px]
        lg:min-w-[320px]
        bg-[#8C1F1F]
        border border-black
        rounded-lg
        p-5 md:p-6
        flex flex-col
        items-center
        text-white
        shadow-md
        md:sticky md:top-6
        gap-4
      "
    >
      <Image
        src="/buri_photo.jpeg"
        alt="Becky Buri"
        width={0}
        height={0}
        sizes="100vw"
        className="w-full max-w-[260px] h-auto rounded-lg border border-gray-300 object-contain mb-6"
        unoptimized
      />

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
