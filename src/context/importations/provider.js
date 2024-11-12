"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ImportationsContext } from "..";
import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/react";

export default function ImportationsContextProvider({ children }) {
  const session = useSession()
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { isValid, errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const values = useMemo(
    () => ({

    }),
    [

    ]
  );

  return <ImportationsContext.Provider value={values}>
    {children}
  </ImportationsContext.Provider>;
}
