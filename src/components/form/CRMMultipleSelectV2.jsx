import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDownIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import TextInput from "./TextInput";
import clsx from "clsx";
import { useContacts } from "../../lib/api/hooks/contacts";
import { useAgents } from "../../lib/api/hooks/agents";
import { usePolicies } from "../../lib/api/hooks/policies";
import { useLeads } from "../../lib/api/hooks/leads";
import { LoadingSpinnerSmall } from "../LoaderSpinner";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import Button from "./Button";
import { useReceipts } from "@/src/lib/api/hooks/receipts";

const CRMMultipleSelectV2 = ({ getValues, setValue, name, label, error }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [filterSelect, setFilterSelect] = useState(1);
  const [query, setQuery] = useState("");
  const { contacts, isLoading: isLoadingContacts } = useContacts({
    filters: { searchVector: query },
    page: 1,
    limit: 5,
  });
  const { data: policies, isLoading: isLoadingPolicies } = usePolicies({
    filters: { poliza: query },
    config: {
      page: 1,
      limit: 5,
    },
  });
  const { data: renovations, isLoading: isLoadingRenovations } = usePolicies({
    filters: { renewal: "true", poliza: query },
    config: {
      page: 1,
      limit: 5,
    },
  });
  const { leads, isLoading: isLoadingLeads } = useLeads({
    filters: { fullName: query },
    config: {
      page: 1,
      limit: 5,
    },
  });

  const { data: receipts, isLoading: isLoadingReceipts } = useReceipts({
    filters: { name: query },
    config: {
      page: 1,
      limit: 5,
    },
  });

  const { data: agents, isLoading: isLoadingAgents } = useAgents({
    filters: { name: query },
    config: {
      page: 1,
      limit: 5,
    },
  });

  const handleToggle = () => {
    setQuery("");
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    const currentValues = getValues(name) || [];

    const types = ["contact", "poliza", "lead", "receipt", "renewal", "agent"];
    // Determine the type based on filterSelect
    const type = types[filterSelect - 1];

    const newOption = {
      id: option.id,
      name: ["poliza", "renewal"].includes(type)
        ? `${option?.company?.name} ${option?.poliza} ${option?.type?.name}`
        : option.fullName || option.name,
      username: option.username,
      title: option.title,
      type,
    };

    const index = currentValues.findIndex((res) => res.id === option.id);

    if (index === -1) {
      setValue(name, [...currentValues, newOption], { shouldValidate: true });
    } else {
      const updatedValue = currentValues.filter((res) => res.id !== option.id);
      setValue(name, updatedValue, { shouldValidate: true });
    }
  };

  const handleRemove = (id) => {
    const updatedValue = getValues(name).filter((res) => res.id !== id);
    setValue(name, updatedValue, { shouldValidate: true });
  };

  const filterData = useMemo(() => {
    const items = [
      contacts?.items ?? [],
      policies?.items ?? [],
      leads?.items ?? [],
      receipts?.items ?? [],
      renovations?.items ?? [],
      agents?.items ?? [],
    ];
    return items[filterSelect - 1];
  }, [
    policies,
    contacts,
    leads,
    filterSelect,
    query,
    receipts,
    renovations,
    agents,
  ]);

  return (
    <div className="">
      <label className="text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <div className="relative mt-1">
        <button
          type="button"
          className="text-left w-full outline-none focus:outline-none focus-visible:outline-none focus-within:outline-none border-none rounded-md drop-shadow-md placeholder:text-xs focus:ring-0 text-sm bg-white py-2"
        >
          <span className="ml-2 text-gray-60 flex gap-1 flex-wrap items-center">
            {getValues(name)?.length > 0 &&
              getValues(name).map((option) => (
                <div
                  key={option?.id}
                  className="bg-primary p-1 rounded-md text-white flex gap-1 items-center text-xs"
                >
                  {option.fullName ||
                    option.name ||
                    option.username ||
                    option.title ||
                    option.id}
                  <div
                    type="button"
                    onClick={() => handleRemove(option.id)}
                    className="text-white"
                  >
                    <XMarkIcon className="h-3 w-3 text-white" />
                  </div>
                </div>
              ))}
            <div
              className="flex gap-1 border-b border-dashed ml-2 text-primary font-semibold"
              onClick={handleToggle}
            >
              <PlusIcon className="h-3 w-3" />
              <p className="text-xs">{t("common:buttons:add")}</p>
            </div>
          </span>
          <div
            className="absolute top-0 right-1 mt-2.5 flex items-center pr-2 pointer-events-none"
            onClick={handleToggle}
          >
            <ChevronDownIcon className="h-4 w-4" />
          </div>
        </button>
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="relative w-full  z-[10000] py-2"
        >
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <DialogPanel className="max-w-lg w-full space-y-4 border bg-white p-4 h-[380px] rounded-md shadow-lg">
              <DialogTitle className="font-bold">{label}</DialogTitle>
              <Description>
                <ul className="gap-x-2 flex">
                  <li
                    className={clsx(
                      filterSelect === 1 && "bg-gray-300",
                      "cursor-pointer hover:bg-gray-200 px-2 text-xs py-1.5 rounded-3xl"
                    )}
                    onClick={() => setFilterSelect(1)}
                  >
                    Clientes
                  </li>
                  <li
                    className={clsx(
                      filterSelect === 2 && "bg-gray-300",
                      "cursor-pointer hover:bg-gray-200 px-2 text-xs py-1.5 rounded-3xl"
                    )}
                    onClick={() => setFilterSelect(2)}
                  >
                    Pólizas
                  </li>
                  <li
                    className={clsx(
                      filterSelect === 3 && "bg-gray-300",
                      "cursor-pointer hover:bg-gray-200 px-2 text-xs py-1.5 rounded-3xl"
                    )}
                    onClick={() => setFilterSelect(3)}
                  >
                    Prospectos
                  </li>
                  <li
                    className={clsx(
                      filterSelect === 4 && "bg-gray-300",
                      "cursor-pointer hover:bg-gray-200 px-2 text-xs py-1.5 rounded-3xl"
                    )}
                    onClick={() => setFilterSelect(4)}
                  >
                    Recibos
                  </li>
                  <li
                    className={clsx(
                      filterSelect === 5 && "bg-gray-300",
                      "cursor-pointer hover:bg-gray-200 px-2 text-xs py-1.5 rounded-3xl"
                    )}
                    onClick={() => setFilterSelect(5)}
                  >
                    Renovaciones
                  </li>
                  <li
                    className={clsx(
                      filterSelect === 5 && "bg-gray-300",
                      "cursor-pointer hover:bg-gray-200 px-2 text-xs py-1.5 rounded-3xl"
                    )}
                    onClick={() => setFilterSelect(5)}
                  >
                    Agentes
                  </li>
                </ul>
                <div className="">
                  <div
                    className="py-1 flex flex-col gap-2 px-2 flex-1"
                    aria-labelledby="options-menu"
                  >
                    <div className="w-full mt-2">
                      <TextInput
                        onChangeCustom={(e) => setQuery(e.target.value)}
                        border
                      />
                    </div>
                    {filterData?.length === 0 &&
                    query !== "" &&
                    !isLoadingContacts &&
                    !isLoadingPolicies &&
                    !isLoadingRenovations &&
                    !isLoadingAgents &&
                    !isLoadingLeads ? (
                      <div className="relative cursor-default select-none px-4 py-2 text-gray-700 text-xs">
                        {t("common:not-found")}
                      </div>
                    ) : (
                      filterData &&
                      filterData.map((option) => (
                        <div
                          key={option.id}
                          className={`flex items-center px-4 py-2 text-sm cursor-pointer rounded-md ${
                            getValues(name) &&
                            getValues(name).some((res) => res.id === option.id)
                              ? "bg-primary"
                              : "hover:bg-primary/5"
                          }`}
                          onClick={() => handleSelect(option)}
                        >
                          {option.avatar && (
                            <Image
                              src={option.avatar}
                              width={100}
                              height={100}
                              alt={`${option.name} avatar`}
                              className="w-6 h-6 rounded-full mr-2"
                            />
                          )}
                          <span
                            className={`text-xs ${
                              getValues(name) &&
                              getValues(name).some(
                                (res) => res.id === option.id
                              )
                                ? "text-white"
                                : "text-black"
                            }`}
                          >
                            {[2, 5].includes(filterSelect)
                              ? `${option?.company?.name} ${option?.poliza} ${option?.type?.name}`
                              : option.fullName ||
                                option.name ||
                                option.username ||
                                option.title ||
                                option.id}
                          </span>
                        </div>
                      ))
                    )}
                    {(isLoadingContacts ||
                      isLoadingPolicies ||
                      isLoadingReceipts ||
                      isLoadingAgents ||
                      isLoadingRenovations ||
                      isLoadingLeads) && <LoadingSpinnerSmall />}
                  </div>
                </div>
              </Description>

              <div className="flex justify-end">
                <Button
                  label={"Cerrar"}
                  buttonStyle="primary"
                  onclick={() => setIsOpen(false)}
                  className="px-2 py-1"
                />
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
    </div>
  );
};
export default CRMMultipleSelectV2;
