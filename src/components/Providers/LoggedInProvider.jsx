import { auth, ERROR_TYPES } from "@/auth";
import { redirect } from "next/navigation";

export default async function LoggedInProvider({ children }) {
  const session = await auth();

  if (!session || session?.error === ERROR_TYPES.REFRESH_TOKEN_ERROR) {
    redirect("/auth");
  }

  return <div>{children}</div>; // Renderizar el contenido si la sesión es válida
}
