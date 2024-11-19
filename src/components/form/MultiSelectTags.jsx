import React, { useEffect, useState, Fragment } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  ChevronDownIcon,
  PlusCircleIcon,
  PlusIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import TextInput from "./TextInput";
import { deleteTags, getTags, postTags } from "../../lib/apis";
import { handleApiError } from "../../utils/api/errors";

const MultiSelectTags = ({ getValues, setValue, name, label, error }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [query, setQuery] = useState("");
  const [filterData, setFilterData] = useState([]);
  const handleToggle = () => {
    setQuery("");
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const getAllTags = async () => {
      try {
        const tags = await getTags();
        setOptions(tags);
        setFilterData(tags);
      } catch (error) {
        handleApiError(error.message);
      }
    };

    getAllTags();
  }, []);

  const handleSelect = (option) => {
    const array = getValues(name);
    if (array) {
      const index = array.findIndex((res) => res.id === option.id);
      if (index === -1) {
        setValue(name, [...array, option], { shouldValidate: true });
      } else {
        const updatedResponsible = array.filter((res) => res.id !== option.id);
        setValue(name, updatedResponsible, { shouldValidate: true });
      }
    } else {
      setValue(name, [option], { shouldValidate: true });
    }
  };

  const handleRemove = (id) => {
    const updatedResponsible = getValues(name).filter((res) => res.id !== id);
    setValue(name, updatedResponsible, { shouldValidate: true });
  };

  const onChangeTags = (e) => {
    const { value } = e.target;
    setQuery(value);
    const filterData =
      value === ""
        ? options
        : options.filter((opt) => {
            return `${opt.username} ${opt.name}`
              .toLowerCase()
              .includes(value.toLowerCase());
          });
    setFilterData(filterData);
  };

  const createTags = async (close) => {
    try {
      const addTag = await postTags({ name: query });
      setOptions([...options, addTag]);
      setFilterData([...options, addTag]);
      handleSelect(addTag);
      setQuery("");
      close && close();
    } catch (error) {
      handleApiError(error.message);
    }
  };

  const deleteTag = async (e, id) => {
    e.preventDefault();
    try {
      const data = await deleteTags(id);
      setOptions(options.filter((tag) => tag.id !== id));
      setFilterData(filterData.filter((tag) => tag.id !== id));
    } catch (error) {
      handleApiError(error.message);
    }
  };
  return (
    <div className="">
      {label && (
        <label className="text-sm font-medium leading-6 text-gray-900 px-3">
          {label}
        </label>
      )}
      <Menu>
        {({ close }) => (
          <Fragment>
            <MenuButton className="text-left min-h-[36px] w-full outline-none focus:outline-none focus-visible:outline-none focus-within:outline-none border-none rounded-md drop-shadow-sm placeholder:text-xs focus:ring-0 text-sm bg-white py-2">
              <span className="ml-2 text-gray-60 flex gap-1 flex-wrap items-center">
                {getValues(name)?.length > 0 &&
                  getValues(name).map((res) => (
                    <div
                      key={res.id}
                      className="bg-primary p-1 rounded-md text-white flex gap-1 items-center text-xs"
                    >
                      {res.name}
                      <button
                        type="button"
                        onClick={() => handleRemove(res.id)}
                        className="text-white"
                      >
                        <XMarkIcon className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  ))}
                {/* <div className="flex gap-1 border-b border-dashed ml-2 text-primary font-semibold">
              <PlusIcon className="h-3 w-3" />
              <p className="text-xs">{t("common:buttons:add")}</p>
            </div> */}
              </span>
              <span className="absolute top-0 right-1 mt-2.5 flex items-center pr-2 pointer-events-none">
                <ChevronDownIcon className="h-4 w-4" />
              </span>
            </MenuButton>
            <MenuItems
              transition
              anchor={{ gap: 10, to: "bottom end" }}
              className="w-[var(--button-width)] origin-top-right rounded-md bg-white shadow-[0px_0px_6px_3px_#0000001a] z-50 pt-2 transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
            >
              <div
                className="py-1 flex flex-col gap-2 px-2 relative"
                aria-labelledby="options-menu"
              >
                <div className="w-full mt-2">
                  <TextInput
                    onChangeCustom={(e) => onChangeTags(e)}
                    border
                    value={query}
                  />
                </div>
                {filterData?.length === 0 && query !== "" ? (
                  <div className="relative cursor-default select-none px-4 py-2 text-gray-700 text-xs">
                    {t("common:not-found")}
                  </div>
                ) : (
                  filterData &&
                  filterData.map((option) => (
                    <MenuItem
                      key={option.id}
                      className={`flex justify-between px-4 py-2 text-sm cursor-pointer rounded-md hover:bg-primary hover:text-white ${
                        getValues(name) &&
                        getValues(name).some((res) => res.id === option.id)
                          ? "bg-primary text-white"
                          : " text-black bg-white"
                      }`}
                      onClick={() => {
                        handleSelect(option);
                      }}
                      as="div"
                    >
                      {option.name}
                      <div
                        className="cursor-pointer"
                        onClick={(e) => deleteTag(e, option.id)}
                      >
                        <XCircleIcon className="h-4 w-4" />
                      </div>
                    </MenuItem>
                  ))
                )}
              </div>

              {query !== "" && (
                <div className="bg-blue-100 p-2 rounded-b-md">
                  <div
                    className="flex gap-1 items-center cursor-pointer"
                    onClick={() => createTags(close)}
                  >
                    <PlusCircleIcon className="h-4 w-4 text-primary" />
                    <p className="text-xs ">{t("tools:tasks:add-tags")}</p>
                  </div>
                </div>
              )}
            </MenuItems>
          </Fragment>
        )}
      </Menu>
      {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
    </div>
  );
};
export default MultiSelectTags;
