import { format, formatDistanceStrict, formatISO, isBefore, parseISO } from "date-fns";
import { es } from 'date-fns/locale';

export const getFormatDate = (date) => {
	 const parsedDate = new Date(date);
	 // Verificar si la fecha es válida
  if (isNaN(parsedDate)) {
    throw new Error('Fecha no válida');
  }

  return formatISO(parsedDate, { representation: 'complete' });
};


export const formatDate = (date, formato = "MMMM d, h:mm a") => {
  return format(date, formato, { locale: es });
};

export const isTaskOverdue = (task) => {
	if (!task?.deadline) return false; // No hay fecha limite
	const deadlineDate = parseISO(task.deadline);
	const now = new Date();

	return isBefore(deadlineDate, now);
}

export const isDateOverdue = (date) => {
	if (!date) return false; // No hay fecha limite
	const deadlineDate = parseISO(date);
	const now = new Date();

	return isBefore(deadlineDate, now);
}

export const getTaskOverdueTimeDelta = (task) => {
console.log("Deadlinetask ", task)
  if (!task?.deadline) {
    return null; // No hay fecha límite, no hay retraso
  }


  const deadlineDate = parseISO(task.deadline);
  const now = new Date();

  if (deadlineDate > now) {
    return formatDate(task.deadline);
  }

  return `- ${formatDistanceStrict(deadlineDate, now, { addSuffix: false, locale: es })}`;
};