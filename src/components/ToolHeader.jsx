import React from "react";
import { useTranslation } from "react-i18next";
import Button from "./form/Button";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useRouter, useSearchParams } from "next/navigation";
import { CgSpinner } from "react-icons/cg";
import ActiveFiltersDrawer from "./ActiveFiltersDrawer";
import useTasksContext from "../context/tasks";

export default function ToolHeader({
  title,
  children,
  route,
  Filters,
  toolButtons,
  FiltersView,
}) {
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const { push } = useRouter();
  const { displayFilters, removeFilter } = useTasksContext();
  const handlePathname = () => {
    setLoading(true);
    params.delete("page");
    params.set("show", true);
    push(`${route}?${params.toString()}`);
    setLoading(false);
  };
  return (
    <header className="flex flex-col w-full">
      <div className="lg:px-6 px-2 grid grid-cols-1 gap-2 bg-white py-4 rounded-md ">
        <div className="flex gap-3 items-center flex-wrap w-full">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900 hidden md:block">
            {title}
          </h1>
          <Button
            label={t("contacts:header:create")}
            type="button"
            onclick={() => handlePathname()}
            buttonStyle={"primary"}
            icon={
              loading ? (
                <CgSpinner className="ml-2 h-5 w-5 text-white animate-spin" />
              ) : (
                <ChevronDownIcon className="ml-2 h-5 w-5 text-white" />
              )
            }
            className="px-3 py-2"
          />
          <div className="flex-grow">
            <div className="flex border px-1 py-1 bg-gray-300 items-center rounded-md gap-x-2">
              <Filters />
              {/* <div className="flex items-center w-full">
							<FaMagnifyingGlass className="h-4 w-4 text-primary" />
							<input
								type="search"
								name="search"
								id="search-cal"
								className="block w-full py-1.5 text-primary placeholder:text-primary sm:text-sm border-0 focus:ring-0 bg-gray-300"
								placeholder={t('contacts:header:search')}
							/>
						</div> */}
            </div>
          </div>
          {toolButtons}
        </div>
        <ActiveFiltersDrawer
          displayFilters={displayFilters}
          removeFilter={removeFilter}
        />
      </div>
      {children}
    </header>
  );
}
