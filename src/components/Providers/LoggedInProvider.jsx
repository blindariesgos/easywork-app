import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LoggedInProvider({ children }) {
  const session = await auth();
  if (session?.error === "RefreshTokenError") {
    //redirect("/auth");
  }

  return <div>{children}</div>; // Renderizar el contenido si la sesión es válida
}
