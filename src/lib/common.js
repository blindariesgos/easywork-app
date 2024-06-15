import {
  ArrowLeftIcon,
  CalendarIcon,
  ChartPieIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
} from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";

export const contactSubmenuOptions = [
  "míos",
  "mis elementos",
  "planeados",
  "mas",
  "otros",
  "vencida",
  "comentarios",
  "marcar todo como leido",
];

export const contactDetailTabs = [
  "general",
  "polizas",
  "actividades",
  "reportes",
  "documentos",
]

export const driveViews = ["table", "icon", "thumb"];
export const driveMimeTypes = [
  "image",
  "audio",
  "video",
  "application",
  "pdf",
  "document",
  "text",
  "message",
  "model",
  "multipart",
  "font",
  "unknown",
  "folder",
];

export const responsible = [
  { id: 1, name: "Nathaly Polin", phone: "+528354120", email: "Naty@gmail.com", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
  { id: 2, name: "Nathaly Polin", phone: "+528354120", email: "Naty@gmail.com", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
  { id: 3, name: "Nathaly Polin", phone: "+528354120", email: "Naty@gmail.com", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
  { id: 4, name: "Nathaly Polin", phone: "+528354120", email: "Naty@gmail.com", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
]

export const creator = [
  { id: 1, name: "Nathaly Polin", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
  { id: 2, name: "Nathaly Polin", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
  { id: 3, name: "Nathaly Polin", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
  { id: 4, name: "Nathaly Polin", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
]

export const contactTypes = [
  { id: 1, name: "Agente" },
  { id: 2, name: "Amigo" },
  { id: 3, name: "Cliente Asegurado" },
  { id: 4, name: "Cliente Contratado" },
  { id: 5, name: "Conocido - Referido" },
  { id: 6, name: "Familiar de asegurado" },
  { id: 7, name: "Familiar de un amigo" },
  { id: 8, name: "Familiar de un conocido" },
  { id: 9, name: "Familiar directo" },
  { id: 10, name: "Otro" },
];

export function onDismissModal(setOpenModal) {
  setOpenModal(false);
}


export function getURLContactPhoto(objeto) {
  // Verificar si el objeto tiene la propiedad 'ContactsFiles'
  if (objeto && objeto.ContactsFiles && Array.isArray(objeto.ContactsFiles)) {
    // Iterar sobre los elementos en 'ContactsFiles'
    for (const file of objeto.ContactsFiles) {
      // Verificar si el campo es 'photoContact'
      if (file.FieldsFilesContact && file.FieldsFilesContact.name === 'photoContact') {
        // Devolver la URL de la foto
        return file.url;
      }
    }
  }


  // Devolver null si no se encuentra la URL de la foto
  return null;
}

export const filterOptions = (query, options) => {
  return query === ""
    ? options
    : options.filter((option) =>
        option.name.toLowerCase().includes(query.toLowerCase())
      );
};