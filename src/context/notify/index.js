"use client";
import { createContext, useContext, useMemo, useState } from "react";
import { useNotify } from "@/src/lib/api/hooks/notify";

const NotifyContext = createContext(undefined);

export function NotifyContextProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const { notifications, isLoading, isError, markAsRead, loadMore, hasMore } =
    useNotify();

  const value = useMemo(
    () => ({
      isOpen,
      notifications,
      isLoading,
      isError,
      setIsOpen,
      disabled,
      markAsRead,
      loadMore,
      hasMore,
    }),
    [
      isOpen,
      notifications,
      isLoading,
      isError,
      disabled,
      markAsRead,
      loadMore,
      hasMore,
    ],
  );

  return (
    <NotifyContext.Provider value={value}>{children}</NotifyContext.Provider>
  );
}

export function useNotifyContext() {
  return useContext(NotifyContext);
}
