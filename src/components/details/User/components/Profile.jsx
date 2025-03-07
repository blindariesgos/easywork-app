"use client";
import { PencilIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  Fragment,
} from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Button from "@/src/components/form/Button";
import TextInput from "@/src/components/form/TextInput";
import { Controller, useForm } from "react-hook-form";
import InputPhone from "@/src/components/form/InputPhone";
import { handleFrontError } from "@/src/utils/api/errors";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { updateUser, getUsersGroup, updateStatus } from "@/src/lib/apis";
import ProfileImageInput from "@/src/components/ProfileImageInput";
import Image from "next/image";
import { userStatus } from "@/src/utils/constants";
import clsx from "clsx";
import { useSession } from "next-auth/react";

export function Profile({ data, isLoguedUser, mutate }) {
  const { t } = useTranslation();
  const [isEdit, setIsEdit] = useState(false);
  const [groups, setGroups] = useState([]);
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(data?.status ?? "do_not_disturb");
  const { data: session, update: updateSession } = useSession();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isValid, errors },
  } = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    if (data) {
      reset({
        name: data.name,
        position: data.cargo,
        phone: data.phone,
        email: data.email,
        cua: data.cua,
        bio: data.bio,
        firstName: data.profile?.firstName,
        lastName: data.profile?.lastName,
      });
      setSelectedProfileImage({
        base64: data?.avatar || null,
        file: null,
      });
    }
  }, [data, reset]);

  useEffect(() => {
    if (data?.id) {
      getUsersGroup(data.id).then((res) => {
        console.log({ res });
        setGroups(res.groups);
      });
    }
  }, [data]);

  const handleProfileImageChange = useCallback((event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setSelectedProfileImage({ base64: e.target.result, file: file });
      };

      reader.readAsDataURL(file);
    }
  }, []);

  const handleFormSubmit = async (dataUser) => {
    const previousData = {
      email: data.email,
      phone: data.phone,
    };

    const body = {
      firstName: dataUser.firstName,
      lastName: dataUser.lastName,
      image: selectedProfileImage?.file || "",
      cua: dataUser.cua,
      email: dataUser.email !== previousData.email ? dataUser.email : undefined,
      phone: dataUser.phone !== previousData.phone ? dataUser.phone : undefined,
    };

    Object.keys(body).forEach(
      (key) => body[key] === undefined && delete body[key]
    );

    const formData = new FormData();

    for (const key in body) {
      if (body[key]) {
        formData.append(key, body[key]);
      }
    }

    try {
      setLoading(true);
      const response = await updateUser(data?.id, formData);

      if (response.hasError) {
        handleFrontError(response);
        setLoading(false);
        return;
      }

      if (isLoguedUser) {
      }

      mutate(); // Refresca la información del usuario
      setLoading(false);
      setIsEdit(false);
    } catch (error) {
      handleFrontError(error);
      setLoading(false);
    }
  };

  const changeStatus = async (item) => {
    try {
      await updateStatus(item);
      setStatus(item);
      mutate();
    } catch (error) {
      toast.error("Error al cambiar status");
    }
  };

  const statusLabel = useMemo(() => {
    const statusSelected = userStatus(t).find((x) => x.value == status);

    return statusSelected ? (
      <Fragment>
        {statusSelected?.icon}{" "}
        <p className="text-sm">{statusSelected?.label}</p>
      </Fragment>
    ) : (
      <div></div>
    );
  }, [status]);

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg w-full h-[calc(100vh_-_160px)]"
    >
      {/* Menu Izquierda */}
      <div className="gap-4">
        <div className="rounded-lg bg-gray-100">
          <div className="flex w-full justify-between pt-4">
            <div>
              {data?.roles?.length && (
                <div className="px-2 flex items-center bg-easywork-main hover:bg-easywork-mainhover text-white">
                  {data?.roles[0]?.name}
                </div>
              )}
            </div>
            <Menu
              as="div"
              className="relative hover:bg-slate-50/30 w-10 md:w-auto py-2 pr-4 rounded-lg"
            >
              {({ open }) => {
                return (
                  <>
                    <MenuButton
                      className="flex items-center gap-2 group"
                      disabled={!isLoguedUser}
                    >
                      {statusLabel}
                      {isLoguedUser && (
                        <ChevronDownIcon
                          className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`}
                        />
                      )}
                    </MenuButton>
                    <MenuItems
                      transition
                      anchor="bottom end"
                      className="z-50 mt-2.5 w-52 rounded-md bg-white py-2 shadow-lg focus:outline-none"
                    >
                      {userStatus(t).map((item) => (
                        <MenuItem key={item.value}>
                          <div
                            onClick={() => changeStatus(item.value)}
                            className={clsx(
                              "px-3 py-1 data-[seleted]:bg-gray-50 text-sm leading-6 text-black cursor-pointer flex items-center"
                            )}
                          >
                            {item.icon} {item.label}
                          </div>
                        </MenuItem>
                      ))}
                    </MenuItems>
                  </>
                );
              }}
            </Menu>
          </div>
          <div className="flex flex-col text-sm justify-center items-center w-full h-full py-24">
            {isEdit ? (
              <ProfileImageInput
                selectedProfileImage={selectedProfileImage}
                onChange={handleProfileImageChange}
                disabled={!isEdit}
              />
            ) : (
              <Image
                width={1080}
                height={1080}
                src={data?.avatar || "/img/avatar.svg"}
                alt="Profile picture"
                className="h-60 w-60 flex-none rounded-full text-white fill-white bg-zinc-200 object-cover items-center justify-center"
                objectFit="fill"
              />
            )}
          </div>
        </div>
      </div>
      {/* Menu Derecha */}
      <div className="h-auto rounded-lg">
        <div className="grid grid-cols-1 gap-x-6 bg-gray-100 rounded-lg w-full gap-y-3 px-5 pb-9">
          <div className="flex justify-between py-4 px-2 rounded-md">
            <h1 className="text-primary font-bold text-xl">
              Información del usuario
            </h1>
            {data && (
              <button
                type="button"
                onClick={() => setIsEdit(!isEdit)}
                title="Editar"
              >
                <PencilIcon className="h-6 w-6 text-primary" />
              </button>
            )}
          </div>
          <TextInput
            type="text"
            label={t("users:form:firstname")}
            placeholder={t("contacts:create:placeholder-name")}
            error={errors.firstName}
            register={register}
            name="firstName"
            disabled={!isEdit}
          />
          <TextInput
            type="text"
            label={t("users:form:lastname")}
            placeholder={t("contacts:create:placeholder-name")}
            error={errors.lastName}
            register={register}
            name="lastName"
            disabled={!isEdit}
          />
          <TextInput
            label={t("contacts:create:email")}
            placeholder={t("contacts:create:placeholder-lastname")}
            error={errors.email}
            register={register}
            name="email"
            disabled={!isEdit}
          />
          <Controller
            render={({ field: { ref, ...field } }) => {
              return (
                <InputPhone
                  name="phone"
                  field={field}
                  error={errors.phone}
                  label={t("contacts:create:phone")}
                  defaultValue={field.value}
                  disabled={!isEdit}
                />
              );
            }}
            name="phone"
            control={control}
            defaultValue=""
          />
          <TextInput
            label={t("contacts:create:cua")}
            error={errors.cua}
            register={register}
            name="cua"
            disabled={!isEdit}
          />
        </div>
        {groups?.map((group, index) => (
          <div
            className="w-full py-4 px-2 mt-4 rounded-lg h-60 bg-gray-100 overflow-y-hidden hover:overflow-y-auto"
            key={index}
          >
            <h1 className="text-primary font-bold text-xl p-2 w-full">
              Compañía: {group.name}
            </h1>
            {group?.users?.map((user, index) => (
              <div className="px-3 py-2 text-sm" key={index}>
                <div className="mb-3">
                  <p className="text-gray-50">Miembro del equipo</p>
                  <div className="flex">
                    <Image
                      className="h-12 w-12 rounded-full object-cover"
                      width={100}
                      height={100}
                      src={user?.avatar ?? "/img/avatar.svg"}
                      alt="user"
                    />
                    <div className="ml-2">
                      <p>Nombre</p>
                      <h1 className="font-semibold">
                        {`${user?.profile?.firstName} ${user?.profile?.lastName}`}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* Botones de acción */}
      {isEdit && (
        <div className="flex w-full justify-center px-4 py-4 gap-4 fixed -bottom-4 md:bottom-0 bg-white shadow-[0px_-2px_6px_4px_#00000017]">
          <Button
            type="submit"
            label={
              loading ? t("common:buttons:saving") : t("common:buttons:save")
            }
            disabled={loading}
            buttonStyle="primary"
            className="px-3 py-2"
          />
          <Button
            type="button"
            label={t("common:buttons:cancel")}
            disabled={loading}
            buttonStyle="secondary"
            onclick={() => setIsEdit(false)}
            className="px-3 py-2"
          />
        </div>
      )}
    </form>
  );
}
