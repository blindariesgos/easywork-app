"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

export default function InfoPage() {
  const [info, setInfo] = useState(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const { param } = useParams();

  useEffect(() => {
    if (!param) return;

    setMounted(true);

    const fetchInfo = async () => {
      try {
        let filePath = "";
        switch (param) {
          case "termsConditions":
            filePath = "/info/terms.html";
            break;
          case "returns":
            filePath = "/info/returns.html";
            break;
          case "faq":
            filePath = "/info/faq.html";
            break;
          case "cookiesPolicy":
            filePath = "/info/cookiesPolicy.html";
            break;
          case "privacyPolicy":
            filePath = "/info/privacyPolicy.html";
            break;
          default:
            return;
        }

        const response = await axios.get(
          `${window.location.origin}${filePath}`
        );
        setInfo(response.data);
      } catch (error) {
        console.error("Error fetching info:", error);
      }
    };

    fetchInfo();
  }, [param]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center">
      {param && (
        <div className=" flex flex-col items-center p-6 rounded-lg shadow-lg">
          <Image
            className="w-28"
            width={1000}
            height={1000}
            src="/img/logo.png"
            alt="Easywork"
          />
          <div dangerouslySetInnerHTML={{ __html: info }} />
        </div>
      )}
    </div>
  );
}
