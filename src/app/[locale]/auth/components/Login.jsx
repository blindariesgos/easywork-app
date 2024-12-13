"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { LockClosedIcon, UserIcon } from "@heroicons/react/24/solid";
import ModalVideo from "./ModalVideo";
import { login } from "../../../../lib/apis";
import { toast } from "react-toastify";
import LoaderSpinner from "../../../../components/LoaderSpinner";
import { setCookie, getCookie } from "cookies-next";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter, useSearchParams } from "next/navigation";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("El formato del correo electrónico no es válido")
    .required("El correo electrónico es obligatorio"),
  password: yup
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es obligatoria"),
});

export default function Login() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setCookie("rememberSession", false);
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      redirect("/home");
    }
  }, [status]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await login({
        email: data.email.trim(),
        password: data.password,
        redirectTo: `/home?rememberSession=${getCookie("rememberSession")}`,
      });
    } catch (error) {
      toast.error("Las credenciales no coinciden");
      setIsLoading(false);
    }
  };

  const rememberSessionCookie = (state) => {
    setCookie("rememberSession", state);
  };

  if (status === "loading") {
    return <div>Cargando...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center justify-center">
        {isLoading && <LoaderSpinner />}
        {/* Logo */}
        <div className="mb-2">
          <Image
            width={156.75}
            height={118.84}
            src={"/img/logo.svg"}
            alt="easywork"
          />
        </div>
        {/* Formulario */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-sm flex flex-col items-center"
        >
          {/* Email */}
          <div className="relative text-gray-600 focus-within:text-gray-400">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <button
                type="submit"
                className="p-1 focus:outline-none focus:shadow-outline"
              >
                <UserIcon className="h-5 w-5 text-easywork-main" />
              </button>
            </span>
            <input
              {...register("email")}
              style={{ border: "none" }}
              type="text"
              className="py-2 text-sm rounded-md pl-10 focus:text-gray-900 placeholder-slate-600"
              placeholder="Email"
              autoComplete="off"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>
          {/* Contraseña */}
          <div className="relative text-gray-600 focus-within:text-gray-400 mt-2">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <button
                type="submit"
                className="p-1 focus:outline-none focus:shadow-outline"
              >
                <LockClosedIcon className="h-5 w-5 text-easywork-main" />
              </button>
            </span>
            <input
              {...register("password")}
              style={{ border: "none" }}
              type="password"
              className="py-2 text-sm rounded-md pl-10 focus:text-gray-900 placeholder-slate-600"
              placeholder="Contraseña"
              autoComplete="off"
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>
          {/* Recordar contraseña */}
          <div className="flex justify-between my-4 text-sm">
            <input
              type="checkbox"
              onChange={(e) => rememberSessionCookie(e.target.checked)}
            />
            <p className="ml-1">Recordar en esta computadora</p>
          </div>
          {/* Ingresar */}
          <div className="my-2">
            <button
              type="submit"
              className="hover:bg-primaryhover bg-primary text-white font-bold py-2 px-4 rounded-md"
              disabled={isLoading}
            >
              Inicio de sesión
            </button>
          </div>
        </form>
        {/* Recuperar */}
        <div className="text-primary hover:text-primaryhover text-xs w-full my-4 underline">
          <a
            className="cursor-pointer"
            onClick={() =>
              router.push(`${window.location.pathname}?loginState=${1}`)
            }
          >
            ¿Olvidó su contraseña?
          </a>
          <a
            className="cursor-pointer ml-7"
            onClick={() =>
              router.push(`${window.location.pathname}?loginState=${3}`)
            }
          >
            Recordar todos mis datos
          </a>
        </div>
        {/* Video guía */}
        <div>
          <ModalVideo
            buttonOpen={
              <button
                type="button"
                className="hover:bg-primaryhover bg-primary text-white font-bold py-2 px-4 rounded-md"
              >
                ¿Cómo ingresar?
              </button>
            }
          />
        </div>
      </div>
    );
  }

  return null;
}
