"use client";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import React, { useState, Fragment } from "react";
import { Controller, useForm } from "react-hook-form";
import { Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import TextInput from "@/src/components/form/TextInput";
import InputPhone from "@/src/components/form/InputPhone";
import Image from "next/image";
import { createSimpleLeadLanding } from "@/src/lib/apis";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { useSearchParams, useRouter } from "next/navigation";

export default function ModalForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = new URLSearchParams(searchParams);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (body) => {
    body.phones_dto = [{ number: body.phone, relation: "Personal" }];
    body.emails_dto = [{ email: body.email, relation: "Personal" }];
    console.log(body);

    try {
      setLoading(true);
      const response = await createSimpleLeadLanding(body);
      if (response.hasError) {
        let message = response.message;
        if (response.errors) {
          message = response.errors.join(", ");
        }
        setLoading(false);
        router.push(`${window.location.pathname}?show=false`);
        return;
      }
      setLoading(false);
      router.push(`${window.location.pathname}?show=false`);
      setSubmitted(true);
      setConfirmModalOpen(true);

      reset();

      setTimeout(() => {
        setConfirmModalOpen(false);
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center">
      {loading && <LoaderSpinner />}

      <Transition show={params.get("show") === "true"} as={Fragment}>
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-black opacity-50 -z-1"
            onClick={() =>
              router.push(`${window.location.pathname}?show=false`)
            }
          ></div>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="relative w-2/4 max-md:w-4/5 flex flex-col items-center bg-white p-6 rounded-lg shadow-lg">
              <Image
                className="w-28"
                width={1000}
                height={1000}
                src="/img/logo.png"
                alt="Easywork"
              />
              <p className="p-6 text-black">
                Programa una videollamada con uno de nuestros agentes vía Zoom
              </p>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 gap-6 md:grid-cols-2 text-easywork-main"
              >
                {/* Nombre */}
                <TextInput
                  type="text"
                  label={"Nombre"}
                  placeholder={"Nombre"}
                  error={errors.firstName && errors.firstName.message}
                  register={register}
                  name="name"
                />

                {/* Apellido */}
                <TextInput
                  type="text"
                  label={"Apellido"}
                  placeholder={"Apellido"}
                  error={errors.lastName && errors.lastName.message}
                  register={register}
                  name="lastName"
                />

                {/* Email */}
                <TextInput
                  type="email"
                  label={"Email"}
                  placeholder={"Email"}
                  error={errors.email}
                  register={register}
                  name="email"
                />

                {/* Teléfono */}
                <Controller
                  render={({ field: { ref, ...field } }) => {
                    return (
                      <InputPhone
                        name="Teléfono"
                        field={field}
                        error={errors.phone}
                        label={"Teléfono"}
                        defaultValue={field.value}
                      />
                    );
                  }}
                  name="phone"
                  control={control}
                  defaultValue=""
                />

                {/* Empresa */}
                <TextInput
                  type="text"
                  label={"Empresa"}
                  placeholder={"Empresa"}
                  error={errors.company}
                  register={register}
                  name="company"
                />

                {/* Puesto */}
                <TextInput
                  type="text"
                  label={"Puesto"}
                  placeholder={"Puesto"}
                  error={errors.workstation}
                  register={register}
                  name="cargo"
                />

                <div className="md:col-span-2 flex justify-center">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-easywork-main hover:bg-easywork-mainhover text-white rounded-md"
                  >
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Transition>

      {/* Modal de confirmación */}
      <Transition show={confirmModalOpen} as={Fragment}>
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* <div className="fixed inset-0 bg-black opacity-50 z-40"></div> */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 1 }}
            className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center"
          >
            <AiOutlineCheckCircle className="text-6xl text-green-500" />
            <p className="text-xl mt-4 text-black">
              Formulario enviado con éxito
            </p>
          </motion.div>
        </div>
      </Transition>
    </div>
  );
}
