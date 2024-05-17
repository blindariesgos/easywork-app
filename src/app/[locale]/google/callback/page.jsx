"use client";
import { useEffect } from "react";
import { googleCallback } from "../../../../lib/apis";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import qs from "qs"

export default function Page() {
  const searchParams = useSearchParams();
  const fetchData = async (refresh_token, access_token, expires_in) => {
    await googleCallback(
      {
        refresh_token,
        access_token,
        expires_in,
      },
      searchParams.get("state")
    );
  };

  useEffect(() => {
    axios.post("https://oauth2.googleapis.com/token", qs.stringify({
      code: searchParams.get("code"),
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_CALLBACK_URL,
      client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
      grant_type: "authorization_code",
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then((res) => {
        console.log(res)
        fetchData( res.data.refresh_token, res.data.access_token, res.data.expires_in ).then(() => {
          close();
        });
      });
  }, []);
}
