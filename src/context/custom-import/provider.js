"use client";

import React, { useEffect, useMemo, useState } from "react";
import { CustomImportContext } from "..";
import useAppContext from "../app";
import { useTranslation } from "react-i18next";

export default function CustomImportContextProvider({ children }) {
  const { t } = useTranslation();
  const [header, setHeader] = useState();
  const [columns, setColumns] = useState();
  const [columnsConfiguration, setColumnsConfiguration] = useState();

  const values = useMemo(
    () => ({
      header,
      columns,
      columnsConfiguration,
      setHeader,
      setColumns,
      setColumnsConfiguration,
    }),
    [header, columns, columnsConfiguration]
  );

  return (
    <CustomImportContext.Provider value={values}>
      {children}
    </CustomImportContext.Provider>
  );
}
