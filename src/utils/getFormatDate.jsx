import {
  format,
  formatDistanceStrict,
  formatISO,
  isBefore,
  parseISO,
  differenceInDays,
  isTomorrow,
  isSameDay,
  startOfDay,
  addDays,
  endOfTomorrow,
  startOfTomorrow,
  startOfToday,
  endOfToday,
} from "date-fns";
import { es } from "date-fns/locale";

export const getFormatDate = (date) => {
  const parsedDate = new Date(date);
  // Verificar si la fecha es válida
  if (isNaN(parsedDate)) {
    return null;
  }

  return formatISO(parsedDate, { representation: "complete" });
};

export const formatDate = (date, formato = "MMMM d, h:mm a") => {
  if (!date) return "";
  try {
    return format(date, formato, { locale: es });
  } catch (error) {
    return "";
  }
};

export const isTaskOverdue = (task) => {
  if (!task?.deadline) return false; // No hay fecha limite
  if (!task.status === "overdue") return false; // La tarea está completada
  const deadlineDate = parseISO(task.deadline);
  const now = new Date();

  return isBefore(deadlineDate, now);
};

export const isDateOverdue = (date) => {
  if (!date) return false; // No hay fecha limite
  const deadlineDate = parseISO(date);
  const now = new Date();

  return isBefore(deadlineDate, now);
};

export const isDateTomorrowOverdue = (date) => {
  if (!date) return false; // No hay fecha limite
  const deadlineDate = parseISO(date);
  return startOfTomorrow() < deadlineDate && deadlineDate < endOfTomorrow();
};

export const isDateTodayOverdue = (date) => {
  if (!date) return false; // No hay fecha limite
  const deadlineDate = parseISO(date);

  return startOfToday() < deadlineDate && deadlineDate < endOfToday();
};

export const isDateMoreFiveDayOverdue = (date) => {
  if (!date) return false; // No hay fecha limite
  const deadlineDate = parseISO(date);
  const now = new Date();

  return (
    differenceInDays(deadlineDate, now) >= 2 &&
    differenceInDays(deadlineDate, now) <= 10
  );
};

export const isDateMoreTenDayOverdue = (date) => {
  if (!date) return false; // No hay fecha limite
  const deadlineDate = parseISO(date);
  const now = new Date();

  return differenceInDays(deadlineDate, now) > 10;
};

export const getTaskOverdueTimeDelta = (task) => {
  if (!task?.deadline) {
    return null; // No hay fecha límite, no hay retraso
  }

  if (task.completedTime) return formatDate(task.deadline);

  const deadlineDate = parseISO(task.deadline);
  const now = new Date();

  if (deadlineDate > now) {
    return formatDate(task.deadline);
  }

  return `- ${formatDistanceStrict(deadlineDate, now, { addSuffix: false, locale: es })}`;
};
