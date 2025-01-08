"use client";
import { Menu, MenuItems, MenuButton } from "@headlessui/react";
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import FormFilters from "./FormFilters";
import { FaMagnifyingGlass } from "react-icons/fa6";
// import { postFilter, getFilters } from "../../../../../../../lib/apis";
// import useAppContext from "../../../../../../../context/app";
import { useDebouncedCallback } from "use-debounce";
import { IoIosArrowDown } from "react-icons/io";
import useFilterTableContext from "../../context/filters-table";
import { PlusIcon } from "@heroicons/react/24/outline";

const Filters = () => {
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState("");
  const {
    filters,
    setFilters,
    searchParam,
    allowSaveCustomFilters,
    customFilters,
    filterFields,
    setDisplayFilters,
    setCustomFilterSelected,
    customFilterSelected,
  } = useFilterTableContext();

  const handleSearch = useDebouncedCallback(() => {
    if (searchInput.length > 0) {
      setFilters({
        ...filters,
        [searchParam ?? "name"]: searchInput,
      });
    } else {
      const otherFilters = Object.keys(filters)
        .filter((key) => key != (searchParam ?? "name"))
        .reduce((acc, key) => ({ ...acc, [key]: filters[key] }), {});
      setFilters(otherFilters);
    }
  }, 500);

  useEffect(() => {
    handleSearch();
  }, [searchInput]);

  // const saveFilter = async () => {
  //   if (!filter) {
  //     toast.error("Debe colocar filtros");
  //     return;
  //   }
  //   await postFilter({
  //     view: "/sales/crm/contacts",
  //     name: "filter ",
  //     userId: session.data.user.id,
  //     jsonData: filter,
  //   });
  //   toast.success("Filtro guardado");
  //   getFilterSaved();
  // };

  // const getFilterSaved = () => {
  //   getFilters(session.data.user.id).then((res) => {
  //     const updatedRes = res.map((obj) => ({ ...obj, selected: false }));
  //     setContacts(updatedRes);
  //   });
  // };

  const handleSelectCustomFilter = (custom) => {
    const keys = Object.keys(custom.filter);
    const fields = filterFields.filter((field) => keys.includes(field.code));
    const displayAux = fields.map((field) => {
      return {
        ...field,
        value: custom.filter[field.code],
      };
    });
    console.log({ keys, fields, displayAux });
    setDisplayFilters(displayAux);

    // const newFilters = fields.reduce((acc, field) => {
    //   let value = custom.filter[field.code];

    //   if (field.type == "date") {
    //     value = moment(custom.filter[field.code])
    //       .utc()
    //       .format("YYYY-MM-DDTHH:mm:ss");
    //   }

    //   if (field.type == "multipleSelect") {
    //     value = field.options.filter((option) =>
    //       custom.filter[field.code].includes(option.value)
    //     );
    //   }

    //   // if (field.type == "daterange") {
    //   //   value = getRangeValue(field);
    //   // }

    //   return {
    //     ...acc,
    //     [field.code]: value,
    //   };
    // }, {});
    setFilters(custom.filter);
    setCustomFilterSelected(custom.id);
  };

  return (
    <Menu as="div" className="relative inline-block w-full">
      <div className="w-full flex justify-between items-center gap-2 h-[34px]">
        <div className="flex items-center w-full">
          <FaMagnifyingGlass className="h-4 w-4 text-primary" />
          <input
            type="search"
            name="search"
            id="search-cal"
            className="block w-full py-1.5 text-primary placeholder:text-primary sm:text-sm border-0 focus:ring-0 bg-gray-300"
            placeholder={t("contacts:header:search")}
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
          />
        </div>
        <MenuButton className="pr-2" onClick={() => setSearchInput("")}>
          <IoIosArrowDown className="h-4 w-4 text-primary" />
        </MenuButton>
      </div>
      <MenuItems
        transition
        className={`absolute right-0 mt-2 rounded-md bg-blue-50 shadow-lg ring-1 ring-black/5 focus:outline-none z-50 w-fit`}
      >
        <div className="p-4">
          <div className="flex gap-4 flex-col sm:flex-row">
            {customFilters && customFilters.length > 0 && (
              <div className="bg-gray-150 flex flex-col w-full sm:w-40 px-4 py-2 rounded-md relative">
                <p className="text-xs text-gray-60 text-center">
                  {t("contacts:filters:name")}
                </p>
                <div className="mt-4 flex flex-col gap-2 mb-14">
                  {customFilters.map((filter, index) => (
                    <div
                      key={index}
                      className="cursor-pointer group"
                      onClick={() => handleSelectCustomFilter(filter)}
                    >
                      <p
                        className={`text-sm uppercase group-hover:font-semibold  ${
                          customFilterSelected == filter.id
                            ? "text-primary font-medium"
                            : "text-gray-60"
                        }`}
                      >
                        {filter.name}
                      </p>
                    </div>
                  ))}
                </div>
                {allowSaveCustomFilters && (
                  <div className="absolute bottom-2">
                    <div
                      className="flex gap-2 cursor-pointer items-center"
                      onClick={() => saveFilter()}
                    >
                      <PlusIcon className="h-3 w-3 text-gray-60" />
                      <p className="text-xs uppercase text-gray-60">
                        {t("contacts:filters:save")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
            <FormFilters />
          </div>
        </div>
      </MenuItems>
    </Menu>
  );
};

export default Filters;
