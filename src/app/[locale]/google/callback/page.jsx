"use client";
import { useEffect } from "react";
import { googleCallback } from "../../../../lib/apis";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import qs from "qs";

export default function Page() {
  const searchParams = useSearchParams();
  const fetchData = async (
    refresh_token,
    access_token,
    expires_in,
    usergoogle_id,
    family_name,
    given_name,
    email,
    picture,
    id_token
  ) => {
    await googleCallback(
      {
        refresh_token,
        access_token,
        expires_in,
        usergoogle_id,
        family_name,
        given_name,
        email,
        picture,
        id_token,
      },
      searchParams.get("state")
    );
  };

  useEffect(() => {
    axios
      .post(
        "https://oauth2.googleapis.com/token",
        qs.stringify({
          code: searchParams.get("code"),
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_CALLBACK_URL,
          client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
          grant_type: "authorization_code",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((res) => {
        console.log(res);
        const config = {
          headers: { Authorization: `Bearer ${res.data.access_token}` },
        };
        axios
          .get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", config)
          .then((userInfo) => {
            console.log(userInfo)
            fetchData(
              res.data.refresh_token,
              res.data.access_token,
              res.data.expires_in,
              userInfo.data.id,
              userInfo.data.family_name,
              userInfo.data.given_name,
              userInfo.data.email,
              userInfo.data.picture,
              res.data.id_token,
            ).then(() => {
              close();
            });
          });
      });
  }, []);
}
