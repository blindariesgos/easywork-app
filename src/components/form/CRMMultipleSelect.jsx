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
import { usePolicies } from "../../lib/api/hooks/policies";
import { useLeads } from "../../lib/api/hooks/leads";
import { LoadingSpinnerSmall } from "../LoaderSpinner";

const CMRMultipleSelectWithFilters = ({
  getValues,
  setValue,
  name,
  label,
  error,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [filterSelect, setFilterSelect] = useState(1);
  const [query, setQuery] = useState("");
  const { contacts, isLoading: isLoadingContacts } = useContacts({
    filters: { [fullName]: query },
    page: 1,
    limit: 5,
  });
  const { data: dataPolicies, isLoading: isLoadingPolicies } = usePolicies({
    filters: { name: query },
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

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (!dropdownRef) return;

    document?.addEventListener("mousedown", handleClickOutside);
    return () => {
      document?.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleToggle = () => {
    setQuery("");
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    const currentValues = getValues(name) || [];

    const types = ["contact", "poliza", "lead"];
    // Determine the type based on filterSelect
    const type = types[filterSelect - 1];

    const newOption = {
      id: option.id,
      name:
        type === "poliza"
          ? `${option?.company?.name} ${option?.poliza} ${option?.company?.type}`
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
      dataPolicies?.items ?? [],
      leads?.items ?? [],
    ];
    return items[filterSelect - 1];
  }, [dataPolicies, contacts, leads, filterSelect, query]);

  return (
    <div className="">
      <label className="text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <div className="relative mt-1">
        <button
          type="button"
          onClick={handleToggle}
          className="text-left w-full outline-none focus:outline-none focus-visible:outline-none focus-within:outline-none border-none rounded-md drop-shadow-sm placeholder:text-xs focus:ring-0 text-sm bg-white py-2"
        >
          <div className="ml-2 text-gray-60 flex gap-1 flex-wrap items-center">
            {getValues(name)?.length > 0 &&
              getValues(name).map((res) => (
                <div
                  key={res.id}
                  className="bg-primary p-1 rounded-md text-white flex gap-1 items-center text-xs"
                >
                  {res.fullName ||
                    res.name ||
                    res.username ||
                    res.title ||
                    res.id}
                  <div
                    type="button"
                    onClick={() => handleRemove(res.id)}
                    className="text-white"
                  >
                    <XMarkIcon className="h-3 w-3 text-white" />
                  </div>
                </div>
              ))}
            <div className="flex gap-1 border-b border-dashed ml-2 text-primary font-semibold">
              <PlusIcon className="h-3 w-3" />
              <p className="text-xs">{t("common:buttons:add")}</p>
            </div>
          </div>
          <div className="absolute top-0 right-1 mt-2.5 flex items-center pr-2 pointer-events-none">
            <ChevronDownIcon className="h-4 w-4" />
          </div>
        </button>
        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-50 py-2"
          >
            <div className="flex divide-x-2 divide-gray-200/70">
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
                      <div
                        className={`text-xs ${
                          getValues(name) &&
                          getValues(name).some((res) => res.id === option.id)
                            ? "text-white"
                            : "text-black"
                        }`}
                      >
                        {filterSelect == 2
                          ? `${option?.company?.name} ${option?.poliza} ${option?.company?.type}`
                          : option.fullName ||
                            option.name ||
                            option.username ||
                            option.title ||
                            option.id}
                      </div>
                    </div>
                  ))
                )}
                {(isLoadingContacts || isLoadingPolicies || isLoadingLeads) && (
                  <LoadingSpinnerSmall />
                )}
              </div>
              <div className="pr-2 pt-3">
                <ul className="gap-x-2">
                  <li
                    className={clsx(
                      filterSelect === 1 && "bg-gray-300",
                      "cursor-pointer hover:bg-gray-200 pr-10 pl-2 text-xs py-1.5 rounded-l-sm rounded-r-3xl mb-2"
                    )}
                    onClick={() => setFilterSelect(1)}
                  >
                    Clientes
                  </li>
                  <li
                    className={clsx(
                      filterSelect === 2 && "bg-gray-300",
                      "cursor-pointer hover:bg-gray-200 pr-10 pl-2 text-xs py-1.5 rounded-l-sm rounded-r-3xl mb-2"
                    )}
                    onClick={() => setFilterSelect(2)}
                  >
                    Pólizas
                  </li>
                  <li
                    className={clsx(
                      filterSelect === 3 && "bg-gray-300",
                      "cursor-pointer hover:bg-gray-200 pr-10 pl-2 text-xs py-1.5 rounded-l-sm rounded-r-3xl mb-2"
                    )}
                    onClick={() => setFilterSelect(3)}
                  >
                    Prospectos
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
    </div>
  );
};
export default CMRMultipleSelectWithFilters;
