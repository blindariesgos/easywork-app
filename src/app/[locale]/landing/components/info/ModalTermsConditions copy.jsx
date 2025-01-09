"use client";
import React, { useState, Fragment } from "react";
import { Transition } from "@headlessui/react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";

export default function ModalTermsConditions() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = new URLSearchParams(searchParams);

  return (
    <div className="flex items-center">
      <Transition show={params.get("termsConditions") === "true"} as={Fragment}>
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-black opacity-50 -z-1"
            onClick={() =>
              router.push(`${window.location.pathname}?termsConditions=false`)
            }
          ></div>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="relative w-2/4 max-md:w-4/5 flex flex-col items-center bg-white p-6 rounded-lg shadow-lg">
              <Image
                className="w-28"
                width={1000}
                height={1000}
                src="/img/logo.png"
                alt="Easywork"
              />
              <p className="p-6 text-black">
                Programa una videollamada con uno de nuestros agentes vía Zoom
              </p>
            </div>
          </Transition.Child>
        </div>
      </Transition>
    </div>
  );
}
