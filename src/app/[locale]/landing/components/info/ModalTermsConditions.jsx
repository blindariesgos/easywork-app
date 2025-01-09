"use client";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Fragment } from "react";
import { Transition } from "@headlessui/react";

export default function ModalTermsConditions() {
  const [terms, setTerms] = useState(null);
  const [mounted, setMounted] = useState(false); // Track if the component is mounted
  const [query, setQuery] = useState(null); // Store the query parameter

  useEffect(() => {
    setMounted(true); // Set to true once the component has mounted

    // Fetch the query parameters after mounting
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("termsConditions"));

    // Fetch the terms content after mounting
    const fetchTerms = async () => {
      try {
        const response = await fetch("/info/terms.html");
        const text = await response.text();
        setTerms(text);
      } catch (error) {
        console.error("Error fetching terms:", error);
      }
    };

    fetchTerms();
  }, []);

  // Avoid rendering on the server side by checking `mounted`
  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center">
      <Transition show={query === "true"} as={Fragment}>
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-black opacity-50 -z-1"
            onClick={() =>
              window.history.pushState(null, "", window.location.pathname)
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
            <div className="relative w-2/4 max-md:w-4/5 flex flex-col items-center bg-white p-6 rounded-lg shadow-lg h-screen overflow-y-scroll">
              <Image
                className="w-28"
                width={1000}
                height={1000}
                src="/img/logo.png"
                alt="Easywork"
              />
              <div dangerouslySetInnerHTML={{ __html: terms }} />
            </div>
          </Transition.Child>
        </div>
      </Transition>
    </div>
  );
}
