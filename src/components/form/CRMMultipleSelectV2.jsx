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
import { useSchedules } from "@/src/lib/api/hooks/schedules";
import { useRefunds } from "@/src/lib/api/hooks/refunds";
import { useClaims } from "@/src/lib/api/hooks/claims";
import { useFundRecoveries } from "@/src/lib/api/hooks/fundRecoveries";

const CRMMultipleSelectV2 = ({
  watch,
  setValue,
  name,
  label,
  error,
  border,
  disabled,
  hidden = [],
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [filterSelect, setFilterSelect] = useState(0);
  const [query, setQuery] = useState("");
  const [values, setValues] = useState([]);
  const [crmTypes, setCrmTypes] = useState([
    "contact",
    "poliza",
    "lead",
    "receipt",
    "renewal",
    "agent",
    "poliza_scheduling",
    "poliza_reimbursement",
    "poliza_claim",
    "poliza_fund_recovery",
  ]);
  const { contacts, isLoading: isLoadingContacts } = useContacts({
    filters: { search: query },
    page: 1,
    limit: 10,
  });
  const { data: policies, isLoading: isLoadingPolicies } = usePolicies({
    filters: { search: query },
    config: {
      page: 1,
      limit: 10,
    },
  });
  const { data: renovations, isLoading: isLoadingRenovations } = usePolicies({
    filters: { renewal: "true", search: query },
    config: {
      page: 1,
      limit: 10,
    },
  });
  const { leads, isLoading: isLoadingLeads } = useLeads({
    filters: { search: query },
    config: {
      page: 1,
      limit: 10,
    },
  });
  const { data: receipts, isLoading: isLoadingReceipts } = useReceipts({
    filters: { search: query },
    config: {
      page: 1,
      limit: 10,
    },
  });
  const { data: agents, isLoading: isLoadingAgents } = useAgents({
    filters: { search: query },
    config: {
      page: 1,
      limit: 10,
    },
  });
  const { data: schedulings, isLoading: isLoadingSchedulings } = useSchedules({
    filters: { ot: query },
    config: {
      page: 1,
      limit: 10,
    },
  });

  const { data: refunds, isLoading: isLoadingRefunds } = useRefunds({
    filters: { ot: query },
    config: {
      page: 1,
      limit: 10,
    },
  });

  const { data: claims, isLoading: isLoadingClaims } = useClaims({
    filters: { ot: query },
    config: {
      page: 1,
      limit: 10,
    },
  });

  const { data: funds, isLoading: isLoadingFunds } = useFundRecoveries({
    filters: { ot: query },
    config: {
      page: 1,
      limit: 10,
    },
  });

  const isLoading = useMemo(() => {
    return (
      isLoadingContacts ||
      isLoadingPolicies ||
      isLoadingReceipts ||
      isLoadingAgents ||
      isLoadingRenovations ||
      isLoadingLeads ||
      isLoadingSchedulings ||
      isLoadingRefunds ||
      isLoadingClaims ||
      isLoadingFunds
    );
  }, [
    isLoadingContacts,
    isLoadingPolicies,
    isLoadingReceipts,
    isLoadingAgents,
    isLoadingRenovations,
    isLoadingLeads,
    isLoadingSchedulings,
    isLoadingRefunds,
    isLoadingClaims,
    isLoadingFunds,
  ]);

  useEffect(() => {
    if (hidden && hidden.length > 0) {
      setCrmTypes(crmTypes.filter((type) => !hidden.includes(type)));
    }
  }, [hidden]);

  const handleToggle = () => {
    setQuery("");
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setValues(watch(name) ?? []);
  }, [watch && watch(name)]);

  const handleSelect = (option) => {
    const currentValues = values || [];

    // Determine the type based on filterSelect
    const type = crmTypes[filterSelect];

    const newOption = {
      id: option.id,
      name: ["poliza", "renewal"].includes(type)
        ? `${option?.company?.name} ${option?.poliza} ${option?.type?.name}`
        : option?.fullName ||
          option?.name ||
          option?.ot ||
          option?.sigre ||
          option?.claimNumber,
      username: option.username,
      title: option.title,
      type,
    };

    const index = currentValues.findIndex((res) => res.id === option.id);

    if (index === -1) {
      setValue(name, [...currentValues, newOption]);
    } else {
      const updatedValue = currentValues.filter((res) => res.id !== option.id);
      setValue(name, updatedValue);
    }
  };

  const handleRemove = (id) => {
    const updatedValue = values.filter((res) => res.id !== id);
    setValue(name, updatedValue);
  };

  const filterData = useMemo(() => {
    const items = {
      contact: contacts?.items ?? [],
      poliza: policies?.items ?? [],
      lead: leads?.items ?? [],
      receipt: receipts?.items ?? [],
      renewal: renovations?.items ?? [],
      agent: agents?.items ?? [],
      poliza_scheduling: schedulings?.items ?? [],
      poliza_reimbursement: refunds?.items ?? [],
      poliza_claim: claims?.items ?? [],
      poliza_fund_recovery: funds?.items ?? [],
    };

    const key = Object.keys(items).filter((key) => !hidden.includes(key))[
      filterSelect
    ];

    return items[key];
  }, [
    policies,
    contacts,
    leads,
    filterSelect,
    query,
    receipts,
    renovations,
    agents,
    schedulings,
    refunds,
    claims,
    funds,
  ]);

  return (
    <div className="">
      <label className="text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <div className="relative mt-1">
        <button
          type="button"
          className={clsx(
            "w-full resize-none py-2 outline-none min-h-[36px] bg-white focus:outline-none focus-visible:outline-none focus-within:outline-none rounded-md placeholder:text-xs focus:ring-0 text-sm",
            {
              "border border-gray-200 focus:ring-gray-200 focus:outline-0":
                border,
              "border-none focus:ring-0 ": !border,
              "drop-shadow-md": !disabled,
            }
          )}
        >
          <span className="ml-2 text-gray-60 flex gap-1 flex-wrap items-center">
            {values.length > 0 &&
              values.map((option) => (
                <div
                  key={option?.id}
                  className="bg-primary p-1 group rounded-md text-white flex gap-1 items-center text-xs"
                >
                  <p className="text-xs">
                    {t(`common:crmType:${option?.type}`)}:
                  </p>
                  {option.fullName ||
                    option.name ||
                    option.username ||
                    option.title ||
                    option.id ||
                    option.ot ||
                    option.sigre}
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
            <DialogPanel className="max-w-lg w-full space-y-4 border bg-white p-4 h-[380px] rounded-md shadow-lg flex flex-col justify-between">
              <div>
                <DialogTitle className="font-bold">{label}</DialogTitle>
                <Description>
                  <ul className="gap-2 flex flex-wrap">
                    {crmTypes.map((type, index) => (
                      <li
                        key={type}
                        className={clsx(
                          filterSelect === index && "bg-gray-300",
                          "cursor-pointer hover:bg-gray-200 px-2 text-xs py-1.5 rounded-3xl"
                        )}
                        onClick={() => setFilterSelect(index)}
                      >
                        {t(`common:crmTypes:${type}`)}
                      </li>
                    ))}
                  </ul>
                  <div
                    className="py-1 flex flex-col gap-2 px-2 flex-1"
                    aria-labelledby="options-menu"
                  >
                    <div className="w-full mt-2">
                      <TextInput
                        onChangeCustom={(e) => setQuery(e.target.value)}
                        border
                        placeholder={"Buscar"}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-1 overflow-y-auto max-h-[170px] h-full">
                      {filterData?.length === 0 &&
                      query !== "" &&
                      !isLoading ? (
                        <div className="relative cursor-default select-none px-4 py-2 text-gray-700 text-xs">
                          {t("common:not-found")}
                        </div>
                      ) : (
                        filterData &&
                        filterData.map((option) => (
                          <div
                            key={option.id}
                            className={`flex items-center px-4 py-2 text-sm cursor-pointer rounded-md ${
                              values &&
                              values.some((res) => res.id === option.id)
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
                                values &&
                                values.some((res) => res.id === option.id)
                                  ? "text-white"
                                  : "text-black"
                              }`}
                            >
                              {["poliza"].includes(crmTypes[filterSelect])
                                ? `${option?.company?.name} ${option?.poliza} ${option?.type?.name}`
                                : option.fullName ||
                                  option.name ||
                                  option.username ||
                                  option.title ||
                                  option.ot ||
                                  option.sigre ||
                                  option.id}
                            </span>
                          </div>
                        ))
                      )}
                      {isLoading && <LoadingSpinnerSmall />}
                    </div>
                  </div>
                </Description>
              </div>

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
