"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Fragment } from "react";
import { Transition } from "@headlessui/react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

export default function ModalInfo() {
  const [info, setInfo] = useState(null);
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);

    if (params.get("termsConditions") === "true")
      axios
        .get(`${window.location.origin}/info/terms.html`)
        .then((text) => {
          setInfo(text.data);
        })
        .catch((err) => console.error("Error fetching terms:", err));
    else if (params.get("returns") === "true")
      axios
        .get(`${window.location.origin}/info/returns.html`)
        .then((text) => {
          setInfo(text.data);
        })
        .catch((err) => console.error("Error fetching terms:", err));
    else if (params.get("faq") === "true")
      axios
        .get(`${window.location.origin}/info/faq.html`)
        .then((text) => {
          setInfo(text.data);
        })
        .catch((err) => console.error("Error fetching terms:", err));
    else if (params.get("cookiesPolicy") === "true")
      axios
        .get(`${window.location.origin}/info/cookiesPolicy.html`)
        .then((text) => {
          setInfo(text.data);
        })
        .catch((err) => console.error("Error fetching terms:", err));
    else if (params.get("privacyPolicy") === "true")
      axios
        .get(`${window.location.origin}/info/privacyPolicy.html`)
        .then((text) => {
          setInfo(text.data);
        })
        .catch((err) => console.error("Error fetching terms:", err));
  }, [
    params.get("termsConditions"),
    params.get("returns"),
    params.get("faq"),
    params.get("cookiesPolicy"),
    params.get("privacyPolicy"),
  ]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center">
      <Transition
        show={
          params.get("termsConditions") === "true" ||
          params.get("returns") === "true" ||
          params.get("faq") === "true" ||
          params.get("cookiesPolicy") === "true" ||
          params.get("privacyPolicy") === "true"
        }
        as={Fragment}
      >
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-black opacity-50 -z-1"
            onClick={() => {
              params.get("termsConditions") === "true"
                ? router.push(
                    `${window.location.pathname}?termsConditions=false`
                  )
                : params.get("returns") === "true"
                  ? router.push(`${window.location.pathname}?returns=false`)
                  : params.get("faq") === "true"
                    ? router.push(`${window.location.pathname}?faq=false`)
                    : params.get("cookiesPolicy") === "true"
                      ? router.push(
                          `${window.location.pathname}?cookiesPolicy=false`
                        )
                      : params.get("privacyPolicy") === "true"
                        ? router.push(
                            `${window.location.pathname}?privacyPolicy=false`
                          )
                        : "",
                setInfo(null);
            }}
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
              <div dangerouslySetInnerHTML={{ __html: info }} />
            </div>
          </Transition.Child>
        </div>
      </Transition>
    </div>
  );
}
