"use client";
import { useEffect } from "react";
import { googleCallback, deleteTokenGoogle } from "../../../../lib/apis";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import qs from "qs";

export default function Page() {
  const searchParams = useSearchParams();
  const session = useSession();
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
        const config = {
          headers: { Authorization: `Bearer ${res.data.access_token}` },
        };
        axios
          .get("https://www.googleapis.com/oauth2/v1/userinfo", config)
          .then((userInfo) => {
            console.log("userInfo", userInfo);
            fetchData(
              res.data.refresh_token,
              res.data.access_token,
              res.data.expires_in,
              userInfo.data.id,
              userInfo.data.family_name,
              userInfo.data.given_name,
              userInfo.data.email,
              userInfo.data.picture,
              res.data.id_token
            )
              .then(() => {
                close();
              })
              .catch(() => {
                deleteTokenGoogle(
                  session.data.user.id,
                  "none",
                  res.data.refresh_token
                )
                  .then(() => {
                    close();
                  })
                  .catch(() => {
                    close();
                  });
              });
          });
      })
      .catch(() => {
        close();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.data]);
  return <div className="absolute w-screen h-screen bg-easywork-main" style={{zIndex: 900}}></div>;
}
