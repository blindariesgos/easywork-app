"use client";

import React, { useEffect, useMemo, useState } from "react";
import { CustomImportContext } from "..";
import { useTranslation } from "react-i18next";

export default function CustomImportContextProvider({ children }) {
  const { t } = useTranslation();
  const [header, setHeader] = useState();
  const [columns, setColumns] = useState();
  const [columnsConfiguration, setColumnsConfiguration] = useState();
  const [info, setInfo] = useState({});

  const values = useMemo(
    () => ({
      header,
      columns,
      columnsConfiguration,
      setHeader,
      setColumns,
      setColumnsConfiguration,
      info,
      setInfo,
    }),
    [header, columns, columnsConfiguration, info]
  );

  return (
    <CustomImportContext.Provider value={values}>
      {children}
    </CustomImportContext.Provider>
  );
}
