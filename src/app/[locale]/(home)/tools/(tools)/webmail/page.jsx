"use client";
import { useSidebar } from "@/hooks/useCommon";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Email() {
  // const { sidebarNavigation } = useSidebar();
  // const pathname = usePathname();
  // const [options, setOptions] = useState(null);
  // useEffect(() => {
  //   sidebarNavigation && sidebarNavigation.map((side) => {
  //     if ( side.children ) {
  //       const foundInChildren = side.children.find( child => child.href === pathname );
  //       if ( foundInChildren ) return setOptions(foundInChildren);
  //     }
  //     if (side.href === pathname) return setOptions(side);
  //   })
  // }, [])

  const emails = [
    {
      name: "Gmail",
      src: "/icons/emails/gmail.svg"
    },
    {
      name: "ICloud",
      src: "/icons/emails/icloud.svg"
    },
    {
      name: "Outlook",
      src: "/icons/emails/outlook.svg"
    },
    {
      name: "Exchange",
      src: "/icons/emails/exchange.svg"
    },
    {
      name: "Yahoo!",
      src: "/icons/emails/yahoo.svg"
    },
    {
      name: "Office 365",
      src: "/icons/emails/office365.svg"
    },
    {
      name: "IMAP",
      src: "/icons/emails/imap.svg"
    },
  ];

  return (
    <div
      className="bg-center bg-cover h-full rounded-2xl px-2"
      style={{ backgroundImage: "url('/img/fondo-home.png')" }}
    >
      <div className="flex justify-center items-center h-full">
        <div className="w-full bg-white rounded-xl drop-shadow-md px-20 py-10 flex items-center flex-col gap-4">
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-4">
            {emails.map((item, index) => (
              <div
                className="flex flex-col bg-gray-100 px-10 py-5 rounded-lg"
                key={index}
              >
                <div className="bg-white overflow-hidden rounded-full mb-4 p-4">
                  <Image
                    width={30}
                    height={30}
                    src={item.src}
                    alt={item.name}
                    className="h-full w-full object-cover object-center"
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
    </div>
  );
}
