"use client";
import Image from "next/image";
const Whatsapp = () => {
  return (
    <div className="p-5">
      <h1 className="leading-tight mb-2">
        textotextotextotextotextotextote xtotextotextotextotextotextotext
        otextotextotextotextotexto
      </h1>
      {/* <a
            href="https://www.whatsapp.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="rounded-full p-4 max-md:p-2 bg-white hover:bg-[#25D366] transition-colors duration-300">
              <Image
                className="w-6 lg:w-9 h-6 lg:h-9"
                width={400}
                height={400}
                src="/img/landing/social/whatsapp.svg"
                alt="WhatsApp"
              />
            </div>
          </a> */}
      <a
        href="https://www.whatsapp.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <button className="px-3 py-2 rounded-md text-white bg-green-600 flex items-center">
          Abrir Whatsapp
          <Image
            src="/img/landing/whatsappWhite.png"
            alt="whatsapp"
            width={20}
            height={20}
            className="ml-2"
          />
        </button>
      </a>
    </div>
  );
};

export default Whatsapp;
