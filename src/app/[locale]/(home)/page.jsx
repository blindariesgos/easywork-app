"use client"; // Indicamos que es un Client Component
import { redirect } from "next/navigation";
import { useEffect } from "react"; // Importa useEffect
export default function Page() {

  useEffect(() => {
    redirect("/home"); // Realiza la redirección cuando el componente se monta
  }, []); // El array de dependencias vacío garantiza que se ejecute una vez



  // No es necesario retornar nada, ya que la redirección se produce antes del renderizado
  return null
}
