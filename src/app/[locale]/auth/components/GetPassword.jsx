"use client";
import React, { useCallback, useState } from "react";
import Image from "next/image";
import { EnvelopeIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { sendOtpEmail } from "@/src/lib/api/hooks/auths";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Esquema de validación para el formulario
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Debe ser un email válido")
    .required("El email es obligatorio"),
});

export default function GetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Configuración de react-hook-form con Yup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleSendOtp = useCallback(
    async (data) => {
      setIsLoading(true);
      setError(null);
      try {
        await sendOtpEmail(data.email);
        router.push(`${window.location.pathname}?loginState=${4}`);
      } catch (err) {
        console.log(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Logo */}
      <div className="mb-2">
        <Image
          width={156.75}
          height={118.84}
          src={"/img/logo.svg"}
          alt="easywork"
        />
      </div>
      <div className="mb-4">
        <h1>Obtener contraseña</h1>
      </div>
      {/* Formulario de E-mail */}
      <form
        onSubmit={handleSubmit(handleSendOtp)}
        className="relative text-gray-600 focus-within:text-gray-400 mt-2 w-full"
      >
        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
          <EnvelopeIcon className="h-5 w-5 text-easywork-main" />
        </span>
        <input
          style={{ border: "none" }}
          type="email"
          {...register("email")} // Registro de react-hook-form
          className="py-2 text-sm rounded-md pl-10 focus:text-gray-900 placeholder-slate-600 w-full"
          placeholder="E-mail"
          autoComplete="off"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </form>
      {/* Info */}
      <div style={{ width: 320 }} className="text-xs my-4 w-1/4">
        <p className="text-center">
          Si ha olvidado su contraseña, introduzca su dirección de correo
          electrónico. La información de la cuenta será enviada a usted por
          correo electrónico junto con un código para restablecer su contraseña.
        </p>
      </div>
      {/* Botones */}
      <div className="flex flex-col items-center">
        <button
          onClick={handleSubmit(handleSendOtp)} // Usamos handleSubmit para el botón
          disabled={isLoading}
          style={{ backgroundColor: "#262261" }}
          className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
        >
          {isLoading ? "Cargando..." : "Restablecer mi contraseña"}
        </button>
        <button
          onClick={() => router.push(`${window.location.pathname}?loginState=${0}`)}
          className="hover:bg-gray-800 bg-gray-700 w-32 mt-2 text-white font-bold py-2 px-4 rounded-md"
        >
          Cancelar
        </button>
      </div>
      {error && <div className="mt-2 text-red-600">{error}</div>}
    </div>
  );
}
