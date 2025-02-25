"use client";

import { Fragment, useState } from "react";
import Control from "./components/panels/control";
import { useTranslation } from "react-i18next";
import FiltersControl from "./components/filters/FiltersControl";
import ActiveFiltersDrawer from "@/src/components/ActiveFiltersDrawer";
import useControlContext from "@/src/context/control";

const Page = () => {
  const { t } = useTranslation();
  const { displayFilters, removeFilter } = useControlContext();

  return (
    <Fragment>
      <div className="bg-white rounded-md shadow-sm py-4 px-4 grid grid-cols-1 gap-2">
        <div className="flex gap-3 items-center">
          <h2 className="text-primary text-2xl">
            {t("control:portafolio:control:title")}
          </h2>
          <div className="flex-grow">
            <div className="flex border px-1 py-1 bg-gray-300 items-center rounded-md gap-x-2">
              <FiltersControl />
            </div>
          </div>
        </div>
        <ActiveFiltersDrawer
          displayFilters={displayFilters}
          removeFilter={removeFilter}
        />
      </div>
      <Control />
    </Fragment>
  );
};

export default Page;
