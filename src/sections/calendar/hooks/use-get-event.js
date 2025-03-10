import { useState, useCallback, useEffect } from "react";
import moment from "moment";

import { endpoints } from "@/src/utils/endpoints";
import fetcher from "@/src/lib/api/fetcher";
import { useBoolean } from "@/src/hooks";

export function useGetEvent(filters) {
  const [events, setEvents] = useState([]);

  const isLoading = useBoolean();

  const { userId, startDate, endDate } = filters;

  const parameters = useCallback(() => {
    const params = new URLSearchParams();
    if (userId) params.append("userId", userId);
    if (startDate)
      params.append("startDate", moment(startDate).format("YYYY-MM-DD"));
    if (endDate) params.append("endDate", moment(endDate).format("YYYY-MM-DD"));

    return params.toString();
  }, [userId, endDate, startDate]);

  const fetchCalendarData = useCallback(async () => {
    try {
      isLoading.onTrue();
      const params = parameters();
      const currentUrl = `${endpoints.calendar.list}?${params}`;
      const { items } = await fetcher(currentUrl, { method: "GET" });
      setEvents(items);
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    } finally {
      isLoading.onFalse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parameters]);

  useEffect(() => {
    fetchCalendarData();
  }, [fetchCalendarData]);

  const handleUpdate = useCallback(() => {
    fetchCalendarData();
  }, [fetchCalendarData]);

  return {
    events,
    onUpdate: handleUpdate,
    isLoading: isLoading.value,
  };
}
