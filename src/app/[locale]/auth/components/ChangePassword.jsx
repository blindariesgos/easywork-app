"use client";
import React, { useCallback, useState } from "react";
import Image from "next/image";
import { DialogSuccess } from "./DialogSuccess";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import { useDataContext } from "../context";
import { toast } from "react-toastify";
import { changePassword } from "@/src/lib/api/hooks/auths";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Esquema de validación para las contraseñas
const schema = yup.object().shape({
  newPassword: yup
    .string()
    .min(7, "La contraseña debe tener al menos 7 caracteres")
    .matches(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
    .matches(/[!@#$%^&*]/, "La contraseña debe contener al menos un carácter especial (!@#$%^&*)")
    .required("La nueva contraseña es obligatoria"),
  repeatPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Las contraseñas no coinciden")
    .required("Debes repetir la contraseña"),
});

export default function ChangePassword() {
  const { otpToken, setOtpToken } = useDataContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Configuración del hook del formulario
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema), // Usa Yup para la validación
  });

  const onSubmit = useCallback(
    async (data) => {
      setIsLoading(true);
      setError(null);
      setIsOpen(false);

      try {
        console.log("Token: ", otpToken);
        await changePassword({
          token: otpToken,
          password: data.newPassword,
          confirmPassword: data.repeatPassword,
        });

        toast.success("Contraseña cambiada exitosamente");

        setOtpToken(null);
        setIsOpen(true);
      } catch (err) {
        console.log(err);
        setError("Error al cambiar la contraseña");
      } finally {
        setIsLoading(false);
      }
    },
    [otpToken, setOtpToken]
  );

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Logo */}
      <div className="mb-2">
        <Image width={156.75} height={118.84} src={"/img/logo.svg"} alt="img" />
      </div>
      <div className="mb-4">
        <h1>Cambiar contraseña</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm flex flex-col items-center">
        {/* Nueva contraseña */}
        <div className="relative text-gray-600 focus-within:text-gray-400">
          <span className="absolute inset-y-0 left-0 flex items-center pl-2">
            <LockClosedIcon className="h-5 w-5 text-easywork-main" />
          </span>
          <input
            type="password"
            {...register("newPassword")}
            className="py-2 text-sm rounded-md pl-10 focus:text-gray-900 placeholder-slate-600"
            placeholder="Contraseña nueva"
            autoComplete="off"
          />
          {errors.newPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Repetir contraseña */}
        <div className="relative text-gray-600 focus-within:text-gray-400 mt-2">
          <span className="absolute inset-y-0 left-0 flex items-center pl-2">
            <LockClosedIcon className="h-5 w-5 text-easywork-main" />
          </span>
          <input
            type="password"
            {...register("repeatPassword")}
            className="py-2 text-sm rounded-md pl-10 focus:text-gray-900 placeholder-slate-600"
            placeholder="Repetir contraseña"
            autoComplete="off"
          />
          {errors.repeatPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.repeatPassword.message}</p>
          )}
        </div>

        {/* Botón para enviar */}
        <div className="my-4">
          <button
            type="submit"
            disabled={isLoading}
            className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
            style={{ backgroundColor: "#262261" }}
          >
            {isLoading ? "Cargando..." : "Restablecer mi contraseña"}
          </button>
        </div>
      </form>

      <DialogSuccess isOpen={isOpen} callback={setIsOpen}>
        <div>
          <p>Contraseña restablecida con éxito.</p>
        </div>
      </DialogSuccess>

      {error && <div className="mt-2 text-red-600">{error}</div>}
    </div>
  );
}
