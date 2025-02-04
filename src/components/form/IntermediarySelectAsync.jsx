"use client";
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LoadingSpinnerSmall } from "../LoaderSpinner";
import {
  createAgentIntermediary,
  getAgentIntermediaryById,
} from "@/src/lib/apis";
import { useDebouncedCallback } from "use-debounce";
import { useIntermediaries } from "@/src/lib/api/hooks/intermediaries";
import TextInput from "./TextInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Button from "./Button";
import {
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

function IntermediarySelectAsync({
  label,
  selectedOption,
  disabled,
  name,
  error,
  setValue,
  border,
  watch,
  setSelectedOption,
  placeholder,
  helperText,
  object,
}) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const {
    data: options,
    isLoading,
    mutate,
  } = useIntermediaries({
    page: 1,
    limit: 10,
    filters,
  });
  const [loading, setLoading] = useState(false);

  // const handleSearch = useDebouncedCallback(() => {
  //   if (query.length > 0) {
  //     setFilters({
  //       name: query,
  //     });
  //   } else {
  //     setFilters({});
  //   }
  // }, 500);

  // useEffect(() => {
  //   handleSearch();
  // }, [query]);

  const filteredElements =
    query === ""
      ? (options ?? [])
      : options?.filter((element) => {
          return element.name.toLowerCase().includes(query.toLowerCase());
        });

  useEffect(() => {
    if (selectedOption) {
      setSelected(selectedOption);
    }
  }, [selectedOption]);

  useEffect(() => {
    if (selected) {
      setValue && setValue(name, object ? selected : selected.id);
      setSelectedOption && setSelectedOption(selected.id);
    }
  }, [selected, setValue, name, setSelectedOption]);

  useEffect(() => {
    if (!watch || !watch(name) || selected) return;
    const getAgent = async (agentId) => {
      const response = await getAgentIntermediaryById(agentId);
      if (response.hasError) return;
      setSelected(response);
    };
    getAgent(watch(name));
  }, [watch && watch(name)]);

  const schema = Yup.object().shape({
    name: Yup.string()
      .required(t("common:validations:required"))
      .min(2, t("common:validations:min", { min: 2 })),
    cua: Yup.string(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const handleAdd = async (data) => {
    setLoading(true);
    const response = await createAgentIntermediary(data);
    if (response.hasError) {
      toast.error(
        response.message ?? "Ocurrio un error, intente de nuevo mas tarde"
      );
      setLoading(false);
      return;
    }
    setSelected(response);
    setIsOpenAdd(false);
    mutate();
    setLoading(false);
  };

  return (
    <div className="w-full">
      <Combobox
        as="div"
        value={selected}
        onChange={setSelected}
        disabled={disabled}
      >
        {label && (
          <label
            className={`block text-sm font-medium leading-6 text-gray-900 px-3`}
          >
            {label}
          </label>
        )}

        <div className={`relative ${label ? "mt-1" : "mt-0"}`}>
          <ComboboxInput
            placeholder={placeholder}
            className={clsx(
              "z-50 w-full outline-none focus:outline-none focus:ring-0 rounded-md  placeholder:text-xs text-sm ",
              {
                "border border-gray-200 focus:ring-gray-200 focus:outline-0":
                  border,
                "border-none focus:ring-0 ": !border,
                // "bg-gray-100": disabled,
                "drop-shadow-md": !disabled,
              }
            )}
            displayValue={(person) => person?.name}
            onChange={(event) => {
              setQuery && setQuery(event.target.value);
            }}
            onKeyUp={(e) => {
              e.preventDefault();
              if (e.key === "Enter") {
                setIsOpenAdd(true);
              }
            }}
          />
          {!disabled && (
            <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDownIcon
                className="h-5 w-5 text-primary"
                aria-hidden="true"
              />
            </ComboboxButton>
          )}

          <ComboboxOptions
            transition
            anchor={{
              to: "bottom end",
              gap: "5px",
            }}
            className="z-50 w-[var(--input-width)] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            {isLoading && (
              <div className="w-full h-[50px] flex justify-center items-center">
                <LoadingSpinnerSmall />
              </div>
            )}
            {filteredElements?.length === 0 && query !== "" && !isLoading ? (
              <div className="relative cursor-default select-none px-4 py-2 text-gray-700 text-xs">
                {t("common:not-found")}
              </div>
            ) : (
              filteredElements &&
              filteredElements?.map((option) => (
                <ComboboxOption
                  key={option.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 px-2 data-[disabled]:opacity-50 ${
                      active ? "bg-primary text-white" : "text-gray-900"
                    }`
                  }
                  value={option}
                  disabled={option.disabled}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate pl-6 ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {option.name}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-2 ${
                            active ? "text-white" : "text-primary"
                          }`}
                        >
                          <CheckIcon className="h-4 w-4" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </ComboboxOption>
              ))
            )}
          </ComboboxOptions>
        </div>
        {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
        {helperText && (
          <p className="mt-1 text-xs text-gray-50 italic">{helperText}</p>
        )}
      </Combobox>
      <Dialog
        open={isOpenAdd}
        onClose={() => setIsOpenAdd(false)}
        className="relative z-[100000000000000]"
      >
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <DialogBackdrop className="fixed inset-0 bg-black/30" />

        {/* Full-screen container to center the panel */}
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          {/* The actual dialog panel  */}
          <DialogPanel className="max-w-lg w-full space-y-4 bg-white p-4 rounded-xl">
            <DialogTitle className="font-bold">
              Agregar agente intermediario
            </DialogTitle>
            <form onSubmit={handleSubmit(handleAdd)}>
              <Description>
                <TextInput
                  type="text"
                  label={"Nombre completo"}
                  error={errors.name}
                  register={register}
                  value={query}
                  name="name"
                  disabled={loading}
                />
                <TextInput
                  type="text"
                  label={"Cua"}
                  error={errors.cua}
                  register={register}
                  name="cua"
                  disabled={loading}
                />
              </Description>
              <div className="flex gap-4 justify-center pt-4">
                <Button
                  buttonStyle="secondary"
                  label={t("common:buttons:cancel")}
                  type="button"
                  className="px-2 py-1"
                  onclick={() => setIsOpenAdd(false)}
                  disabled={loading}
                />
                <Button
                  buttonStyle="primary"
                  label={
                    loading
                      ? t("common:buttons:adding")
                      : t("common:buttons:add")
                  }
                  type="button"
                  onclick={handleSubmit(handleAdd)}
                  className="px-2 py-1"
                  disabled={loading}
                />
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}

export default IntermediarySelectAsync;
