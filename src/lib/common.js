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

export const sidebarNavigation = [
  {
    name: "Herramientas",
    href: "#",
    icon: ChevronRightIcon,
    current: true,
    children: [
      { name: "Drive-Documentos", href: "/tools/drive" },
      { name: "Tareas", href: "/tools/task" },
      { name: "Correo", href: "/tools/webmail" },
      { name: "Calendario", href: "/tools/calendar" },
    ],
  },
  {
    name: "Ventas",
    icon: ChevronRightIcon,
    current: false,
    children: [
      {
        name: "CRM",
        href: "#",
        children: [
          { name: "Contactos", href: "/sales/crm/contacts" },
          { name: "Prospectos", href: "/sales/crm/leads" },
        ],
      },
      { 
        name: "Reportes",
        href: "#",
        children: [
          { name: "Actividades", href: "/sales/report/activities" },
          { name: "Historial", href: "/sales/report/history" },
          { name: "Informes", href: "/sales/report/reports" },
          { 
            name: "Rendimiento del agente", 
            href: "#",
            children: [
              {
                name: "Embudo de ventas sin conversión",
                href: "/sales/report/agentperformance/noconv"
              }
            ]
          },
        ],
      },
      { name: "Marketing", href: "#" },
      { name: "Control de cartera", href: "#" },
    ],
  },
  {
    name: "Servicios",
    icon: ChevronRightIcon,
    current: false,
    children: [
      { name: "Automatizaciones", href: "#" },
      { name: "Embudos", href: "#" },
      { name: "Soporte a clientes - chats", href: "#" },
      { name: "Papelera", href: "#" },
      { name: "Logs", href: "#" },
      { name: "Academia", href: "#" },
    ],
  },
  {
    name: "Gestión de agentes",
    href: "#",
    icon: ChevronRightIcon,
    current: false,
    children: [
      { name: "Reclutamiento y selección", href: "#" },
      { name: "Capacitaciones", href: "#" },
      { name: "Conexiones", href: "#" },
      { name: "Desarrollo de agentes", href: "#" },
      { name: "E-Learning", href: "#" },
    ],
  },
  {
    name: "Compañías",
    href: "#",
    icon: ChevronRightIcon,
    current: false,
    children: [
      { name: "AFIRME", href: "#" },
      { name: "ATLAS", href: "#" },
      { name: "AXXA", href: "#" },
      { name: "BANORTE", href: "#" },
      { name: "GNP", href: "#" },
      { name: "QUALITAS", href: "#" },
      { name: "ZURICH", href: "#" },
      { name: "OTRAS", href: "#" },
    ],
  },
  {
    name: "Ajustes y configuración",
    href: "#",
    icon: ChevronRightIcon,
    current: false,
    children: [
      { name: "Permisos y accesos usuarios", href: "#" },
      { name: "Cambio de contraseña", href: "#" },
      { name: "Otros", href: "#" },
    ],
  },
];

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

  console.log('No se encontró la URL de la foto');
  console.log('objeto', objeto);

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