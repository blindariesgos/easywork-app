"use client";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { EnvelopeIcon } from "@heroicons/react/24/solid";
import { useDataContext } from "../context";
import { sendOtpEmail, sendOtpPhone } from "@/src/lib/api/hooks/auths";
import InputPhone from "../../../../components/form/InputPhone";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter, useSearchParams } from "next/navigation";

const schemaInputs = yup.object().shape({
  phone: yup.string(),
});

export default function DontRememberDetails() {
  const { t } = useTranslation();
  const [mode, setMode] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [phoneValue, setPhoneValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { isValid, errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schemaInputs),
  });

  const handleModeChange = useCallback((newMode) => {
    setMode(newMode);
    setInputValue("");
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendOtp = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (mode === "email") {
        await sendOtpEmail(inputValue);
      } else if (mode === "cellphone") {
        let phone = "+" + watch("phone").toString();
        await sendOtpPhone(phone);
      }
      router.push(`${window.location.pathname}?loginState=${4}`);
    } catch (err) {
      console.log(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, mode, phoneValue]);

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Logo */}
      <div className="mb-2">
        <Image width={156.75} height={118.84} src={"/img/logo.svg"} alt="img" />
      </div>
      {/* Titulo */}
      <div className="mb-4">
        <h1>No recuerdo mis datos</h1>
      </div>
      {/* Dato de usuario */}
      <div className="relative text-gray-600 focus-within:text-gray-400 w-full">
        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
          <button
            type="submit"
            className="p-1 focus:outline-none focus:shadow-outline"
          >
            {/* <UserIcon className="h-5 w-5 text-easywork-main" /> */}
          </button>
        </span>
        {!mode && (
          <div className="flex justify-center">
            <button
              onClick={() => handleModeChange("email")}
              className="hover:bg-easywork-mainhover bg-easywork-main text-white font-bold py-2 px-2 w-32 rounded-md"
            >
              Usar correo
            </button>
            <button
              onClick={() => handleModeChange("cellphone")}
              className="hover:bg-easywork-mainhover bg-easywork-main text-white font-bold py-2 px-2 w-32 rounded-md ml-3"
            >
              Usar teléfono
            </button>
          </div>
        )}
        {mode === "email" && (
          <div className="relative text-gray-600 focus-within:text-gray-400 mt-2">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2 top-2">
              <EnvelopeIcon className="h-6 w-6 text-easywork-main" />
            </span>
            <input
              style={{ border: "none" }}
              type="email"
              name="email"
              value={inputValue}
              onChange={handleInputChange}
              className="py-2 text-sm rounded-md pl-10 mt-2 focus:text-gray-900 placeholder-slate-600 w-72"
              placeholder="E-mail"
              autoComplete="off"
            />
          </div>
        )}
        {mode === "cellphone" && (
          <div className="mt-2">
            <Controller
              render={({ field: { ref, ...field } }) => {
                return (
                  <InputPhone
                    name="phone"
                    field={field}
                    label={t("leads:lead:fields:phone-number")}
                    defaultValue={field.value}
                  />
                );
              }}
              name="phone"
              control={control}
              defaultValue=""
            />
          </div>
        )}
      </div>
      {/* Video guia */}
      <div className="mt-4 w-full flex justify-center">
        <button
          onClick={() => {
            router.push(`${window.location.pathname}?loginState=${0}`);
            setMode(null);
          }}
          className="hover:bg-gray-800 bg-gray-700 w-28 text-white font-bold py-2 px-4 rounded-md"
        >
          Cancelar
        </button>
        {mode && (
          <button
            onClick={handleSendOtp}
            disabled={isLoading}
            className="hover:bg-easywork-mainhover w-28 bg-easywork-main text-white font-bold py-2 px-4 rounded-md ml-3"
          >
            {isLoading ? "Enviando..." : "Aceptar"}
          </button>
        )}
      </div>
      {error && <div className="mt-2 text-red-600">{error}</div>}
    </div>
  );
}
