"use client";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import React, { useState, Fragment } from "react";
import { Controller, useForm } from "react-hook-form";
import { Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import TextInput from "@/src/components/form/TextInput";
import InputPhone from "@/src/components/form/InputPhone";
import Image from "next/image";
import { createSimpleLeadLanding } from "@/src/lib/apis";

export default function ModalForm({ buttonOpen }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  // Función para el submit
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
        toast.error(message);
        setLoading(false);
        setIsOpen(false);
        return;
      }
      toast.success("Enviado con exito");
      setLoading(false);
      setIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const ButtonOpen = React.cloneElement(buttonOpen, {
    onClick: () => setIsOpen(true),
  });

  return (
    <div className="flex items-center justify-center">
      {loading && <LoaderSpinner />}
      {ButtonOpen}

      <Transition show={isOpen} as={Fragment}>
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-black opacity-50 -z-1"
            onClick={() => setIsOpen(false)}
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
            <div className="relative w-2/4 max-md:w-3/4 flex flex-col items-center bg-white p-6 rounded-lg shadow-lg">
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

              {/* <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute -left-1 -top-3 p-1 mt-4 text-white bg-red-600 rounded"
              >
                <XMarkIcon className="h-5 w-5 text-slate-50" />
              </button> */}
            </div>
          </Transition.Child>
        </div>
      </Transition>
    </div>
  );
}
