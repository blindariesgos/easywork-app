"use client";
import useSWRInfinite from "swr/infinite";
import fetcher from "../fetcher";
import { useEffect } from "react";

export const useNotify = () => {
  const { data, error, isLoading, mutate, size, setSize } = useSWRInfinite(
    (index) => `/notify?limit=10&page=${index + 1}`,
    fetcher,
    {
      initialSize: 1,
      revalidateOnFocus: false,
    }
  );

  const notifications =
    data && Array.isArray(data)
      ? data.reduce(
          (acc, x) => (Array.isArray(x?.items) ? [...acc, ...x?.items] : acc),
          []
        )
      : [];

  const markAsRead = async (id) => {
    try {
      await fetcher(`/notify/${id}/read`, {
        method: "PUT",
      });
      // Actualiza las notificaciones después de marcar como leída
      mutate();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const loadMore = () => {
    setSize(size + 1);
  };

  return {
    notifications,
    isLoading,
    unread: data?.[0]?.meta?.unreadCount ?? 0,
    isError: error,
    markAsRead,
    loadMore,
    mutate,
    hasMore: data && data[data.length - 1]?.items?.length > 0, // Si la última página tiene datos
  };
};
