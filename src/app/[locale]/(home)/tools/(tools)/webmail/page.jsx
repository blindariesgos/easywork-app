"use client";
import { useSidebar } from "@/hooks/useCommon";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SliderOverShort from "@/components/SliderOverShort";

export default function Email() {
  const emails = [
    {
      name: "Gmail",
      src: "/icons/emails/gmail.svg",
    },
    {
      name: "ICloud",
      src: "/icons/emails/icloud.svg",
    },
    {
      name: "Outlook",
      src: "/icons/emails/outlook.svg",
    },
    {
      name: "Exchange",
      src: "/icons/emails/exchange.svg",
    },
    {
      name: "Yahoo!",
      src: "/icons/emails/yahoo.svg",
    },
    {
      name: "Office 365",
      src: "/icons/emails/office365.svg",
    },
    {
      name: "IMAP",
      src: "/icons/emails/imap.svg",
    },
  ];

  return (
    <div
      className="rounded-2xl px-2 flex justify-center items-center flex flex-col"
    >
      <SliderOverShort openModal={true} >
        <div className="bg-gray-300 h-full w-full">
          <h1>quiowdhuiqowhduiow</h1>
        </div>
      </SliderOverShort>
      <div className="w-full rounded-xl text-easywork-main mb-4">
        <h1 className="ml-3 py-3 font-medium">Integración del buzón</h1>
      </div>
      <div className="w-full bg-white rounded-xl drop-shadow-md text-easywork-main mb-4">
        <h1 className="ml-3 w-full py-5 text-center font-medium">Use y gestione su buzón</h1>
      </div>
      <div className="w-full bg-white rounded-xl drop-shadow-md sm:p-3 px-20 py-10 flex items-center flex-col gap-4">
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-4 my-3">
          {emails.map((item, index) => (
            <div
              className="flex flex-col justify-center bg-gray-100 px-10 py-7 rounded-lg"
              key={index}
            >
              <div className="flex justify-center items-center bg-white overflow-hidden rounded-full mb-4 p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6">
                <Image
                  width={30}
                  height={30}
                  src={item.src}
                  alt={item.name}
                  className="object-cover object-center"
                />
              </div>
              <div className="text-center">
                <h1>{item.name}</h1>
              </div>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}
