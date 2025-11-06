"use client";

import Image from "next/image";

export default function Sidebar() {
  return (
    <aside className="w-full md:w-96 bg-[#8C1F1F] border border-black rounded-lg p-5 flex flex-col items-center text-white shadow-md">

      {/* Client photo */}
      <Image
        src="/buri_photo.jpeg"
        alt="Becky Buri - Whitman County Veterans Services"
        width={360}
        height={360}
        className="rounded-lg border border-gray-300 object-cover mb-6"
        unoptimized
      />

      {/* Contact Info */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Contact Info</h3>
        <p className="text-sm leading-relaxed">
          <strong>Email:</strong>{" "}
          <a
            href="mailto:BeckyBuri@whitmancounty.gov"
            className="text-blue-300 hover:underline"
          >
            BeckyBuri@whitmancounty.gov
          </a>
          <br />
          <strong>Phone:</strong>{" "}
          <a
            href="tel:+15093975246"
            className="text-blue-300 hover:underline"
          >
            +1 (509)-397-5246
          </a>
        </p>
      </div>

      {/* Resource Links */}
      <nav className="w-full flex flex-col gap-3 text-left font-semibold text-white">
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
          className="hover:underline text-[1.05rem]"
        >
          - Whitman County Veteran Services
        </a>

        {/* ✅ Updated Link */}
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

