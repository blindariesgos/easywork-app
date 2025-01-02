"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import LoaderSpinner from "../LoaderSpinner";
import { useEffect } from "react";
import { logout } from "@/src/lib/apis";

export default function LoggedInProvider({ children }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshTokenError") {
      logout();
    }
  }, []);

  if (status === "loading") {
    return <LoaderSpinner />; // Mostrar un componente de carga mientras se verifica la sesión
  }

  if (!session?.user) {
    redirect("/auth"); // Redirigir a la página de autenticación si no hay sesión activa
  }

  return <div>{children}</div>; // Renderizar el contenido si la sesión es válida
}
