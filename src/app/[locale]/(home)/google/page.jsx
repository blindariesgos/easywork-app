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

  const handleReauthentication = () => {
    // Construir la URL de autenticación de Google
    const googleAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_CALLBACK_URL}&response_type=code&scope=email profile&access_type=offline&prompt=consent`;

    // Redirigir al usuario a la URL de autenticación de Google
    window.location.href = googleAuthURL;
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
        // Si el refresh_token no está presente, manejar la reautenticación
        if (!res.data.refresh_token) {
          console.warn(
            "No refresh token found. Redirecting to reauthentication."
          );
          handleReauthentication();
          return;
        }

        // Continuar con la lógica si se obtuvo el refresh_token
        const config = {
          headers: { Authorization: `Bearer ${res.data.access_token}` },
        };

        axios
          .get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", config)
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
                // close()
              })
              .catch((err) => {
                console.log(err);
                deleteTokenGoogle(
                  session.data.user.id,
                  "none",
                  res.data.refresh_token
                )
                  .then((res) => {
                    console.log(res);
                    // Lógica adicional si es necesario
                  })
                  .catch((err) => {
                    console.log(err);
                    // Manejo de errores
                  });
              });
          });
      })
      .catch((err) => {
        console.error("Error getting token:", err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.data]);
  return (
    <div
      className="absolute w-screen h-screen bg-easywork-main"
      style={{ zIndex: 900 }}
    ></div>
  );
}
