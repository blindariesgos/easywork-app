"use client";
import useSWR from "swr";
import fetcher from "../fetcher";

export const useNotify = () => {
  const { data, error, isLoading, mutate, size, setSize } = useSWR(
    `/notify/`,
    fetcher,
    {
      initialSize: 1,
      revalidateOnFocus: false,
    },
  );

  const notifications = data ? data.flat() : [];

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
    isError: error,
    markAsRead,
    loadMore,
    hasMore: data && data[data.length - 1]?.length > 0, // Si la última página tiene datos
  };
};
