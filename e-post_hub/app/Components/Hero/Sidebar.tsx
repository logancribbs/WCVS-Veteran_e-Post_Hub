"use client";

import Image from "next/image";

export default function Sidebar() {
  return (
    <aside className="w-full md:w-96 bg-[#B5565E] border border-black rounded-lg p-5 flex flex-col items-center text-white shadow-md">
      {/* Client photo */}
      <div className="w-full mb-4">
        <Image
          src="/e-post_hub/public/buri_photo.jpeg"
          alt="Becky Buri - Whitman County Veterans Services"
          width={400}
          height={400}
          className="rounded-md border border-black object-cover"
          unoptimized
        />
      </div>

      {/* Contact Info */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Contact Info</h3>
        <p className="text-sm leading-relaxed">
          <strong>Email:</strong>{" "}
          <a
            href="mailto:BeckyBuri@whitmancounty.gov"
            className="text-blue-200 hover:underline"
          >
            BeckyBuri@whitmancounty.gov
          </a>
          <br />
          <strong>Phone:</strong>{" "}
          <a
            href="tel:+15093975246"
            className="text-blue-200 hover:underline"
          >
            +1 (509)-397-5246
          </a>
        </p>
      </div>

      {/* Resource Links */}
      <nav className="w-full flex flex-col gap-2 text-left font-semibold text-white">
        <a
          href="https://www.va.gov/mann-grandstaff-veterans-health-care/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          - Mann-Grandstaff
        </a>
        <a href="#" className="hover:underline">
          - Community Questions
        </a>
        <a href="#" className="hover:underline">
          - Palouse Resource Guide
        </a>
        <a href="#" className="hover:underline">
          - Office Hours
        </a>
      </nav>
    </aside>
  );
}


