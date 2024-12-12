"use client";
import React, { useRef, useCallback, useState } from "react";
import Image from "next/image";
import { useDataContext } from "../context";
import { validateOTP } from "@/src/lib/api/hooks/auths";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Esquema de validación para el OTP
const schema = yup.object().shape({
  otpCode: yup
    .string()
    .matches(/^\d{6}$/, "El código debe tener 6 dígitos numéricos")
    .required("El código es obligatorio"),
});

export default function CheckUser() {
  const inputRefs = useRef([]);
  const { setOtpToken } = useDataContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema), // Usar Yup para la validación
  });

  const handleValidateOTP = useCallback(
    async (data) => {
      setIsLoading(true);
      setError(null);
      const otpCode = data.otpCode;
      try {
        const response = await validateOTP(otpCode);

        setOtpToken(response);
        router.push(`${window.location.pathname}?loginState=${2}`);
      } catch (err) {
        console.log(err);
        setError("Código inválido");
        inputRefs.current[0].focus();
      } finally {
        setValue("otpCode", ""); // Reiniciar el código OTP
        setIsLoading(false);
      }
    },
    [setOtpToken, setValue, router]
  );

  // Maneja el input y enfoca automáticamente el siguiente input
  const handleInput = (e, index) => {
    const { value } = e.target;
    const inputValue = value.slice(0, 1); // Limita el valor a un solo dígito

    // Actualiza el valor del campo correspondiente
    setValue(`otpCode[${index}]`, inputValue);

    // Enfoca el siguiente input automáticamente
    if (inputValue && index < 5) {
      inputRefs.current[index + 1].focus();
    } else if (!inputValue && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-2">
        <Image
          width={156.75}
          height={118.84}
          src={"/img/logo.svg"}
          alt="easywork"
          priority // Prioriza la carga de la imagen
        />
      </div>
      <div className="mb-4 text-xl">
        <h1>¡Valida tu usuario!</h1>
      </div>
      <div style={{ width: 320 }} className="text-md text-center my-4 w-1/4">
        <h4>Introducir los 6 dígitos recibidos por mensaje de texto o correo</h4>
      </div>
      <form
        onSubmit={handleSubmit(handleValidateOTP)}
        className="p-4 bg-slate-50 rounded-xl"
      >
        <div className="flex flex-row gap-4">
          {Array(6)
            .fill("")
            .map((_, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*" // Validar solo números
                className="w-10 h-10 text-center bg-slate-200/80 !important border-transparent border-b-2 border-gray-400 focus:border-primary transition-colors"
                {...register(`otpCode[${index}]`)}
                onChange={(e) => handleInput(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
              />
            ))}
        </div>

        {errors.otpCode && (
          <p className="text-red-500 text-xs mt-1">{errors.otpCode.message}</p>
        )}

        <div className="mt-4 w-full flex justify-evenly">
          <button
            type="submit"
            disabled={isLoading}
            className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
            style={{ backgroundColor: "#262261" }}
          >
            {isLoading ? "Cargando..." : "Aceptar"}
          </button>
          <button
            type="button"
            onClick={() => {
              setOtpToken(null);
              setError(null);
              router.push(`${window.location.pathname}?loginState=${0}`);
            }}
            className="hover:bg-gray-800 bg-gray-700 text-white font-bold py-2 px-4 rounded-md"
          >
            Cancelar
          </button>
        </div>
      </form>
      {error && <div className="mt-2 text-red-600">{error}</div>}
    </div>
  );
}
