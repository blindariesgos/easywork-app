import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import LoaderSpinner from "@/src/components/LoaderSpinner";
import { endpoints } from "@/src/utils/endpoints";
import fetcher from "@/src/lib/api/fetcher";
import { useBoolean } from "@/src/hooks";

import { EventNewEditForm } from "../event-new-edit-form";

export function CalendarEventDetails({ eventId }) {
  const [currentEvent, setCurrentEvent] = useState(null);

  const isLoading = useBoolean();

  const fetchDataEvent = useCallback(async () => {
    try {
      isLoading.onTrue();
      const response = await fetcher(endpoints.calendar.details(eventId));
      setCurrentEvent(response);
    } catch (error) {
      toast.error("Se ha producido un error, inténtelo de nuevo más tarde.");
    } finally {
      isLoading.onFalse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  useEffect(() => {
    fetchDataEvent();
  }, [fetchDataEvent]);

  if (isLoading.value || !currentEvent) {
    return null;
  }

  // TODO: Falta buscar detalle de evento
  return <EventNewEditForm currentEvent={currentEvent} />;
}
