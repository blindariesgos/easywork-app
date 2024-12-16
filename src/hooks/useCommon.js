"use client";
import {
  ArrowDownTrayIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  XMarkIcon,
  ArrowDownCircleIcon,
  SquaresPlusIcon,
  ArchiveBoxIcon,
  BookOpenIcon,
  InboxArrowDownIcon,
  CalendarDaysIcon,
  TagIcon,
  NewspaperIcon,
  PresentationChartBarIcon,
  WalletIcon,
  PuzzlePieceIcon,
  GlobeAltIcon,
  FunnelIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  IdentificationIcon,
  UserPlusIcon,
  ArrowPathIcon,
  BuildingOfficeIcon,
  SparklesIcon,
  HomeIcon,
} from "@heroicons/react/20/solid";
import { useSession } from "next-auth/react";

import { useTranslation } from "react-i18next";
import { TrashIcon } from "@heroicons/react/24/outline";
import { RiFileExcel2Fill } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useAlertContext } from "../context/common/AlertContext";
import { toast } from "react-toastify";
import { deleteLeadById, deleteTask } from "../lib/apis";
import { handleApiError } from "../utils/api/errors";
import { useSWRConfig } from "swr";

export const useSidebar = () => {
  const { t } = useTranslation();
  const { data: session } = useSession();

  // Obtener los permisos de menú del usuario
  const userMenuPermissions =
    session?.user?.menuPermissions ??
    session?.user?.roles?.flatMap((role) => role.menuPermissions) ??
    [];

  const sidebarNavigation = [
    {
      id: "home",
      name: t("common:menu:home:name"),
      href: "/home",
      icon: ChevronRightIcon,
      iconShortBar: HomeIcon,
      current: true,
      roles: ["admin", "user"],
    },
    {
      id: "tools",
      name: t("common:menu:tools:name"),
      href: "/tools",
      icon: ChevronRightIcon,
      iconShortBar: SquaresPlusIcon,
      current: false,
      children: [
        {
          id: "tools:tasks",
          name: t("common:menu:tools:tasks"),
          href: "/tools/tasks?page=1",
          image: "/img/herramientas/tareas.png",
          iconShortBar: BookOpenIcon,
        },
        {
          id: "tools:calendar",
          name: t("common:menu:tools:calendar"),
          href: "/tools/calendar",
          image: "/img/herramientas/calendario.png",
          iconShortBar: CalendarDaysIcon,
        },
        {
          id: "tools:drive",
          name: t("common:menu:tools:drive"),
          href: "/tools/drive",
          image: "/img/herramientas/drive.png",
          iconShortBar: ArchiveBoxIcon,
        },
        {
          id: "tools:email",
          name: t("common:menu:tools:email"),
          href: "/tools/webmail?page=1",
          image: "/img/herramientas/correo.png",
          iconShortBar: InboxArrowDownIcon,
        },
      ],
    },
    {
      id: "sales",
      name: t("common:menu:sales:name"),
      icon: ChevronRightIcon,
      current: false,
      href: "/sales",
      iconShortBar: TagIcon,
      children: [
        {
          id: "sales:crm",
          name: t("common:menu:sales:crm:name"),
          href: "/sales/crm",
          image: "/img/ventas/crm.png",
          iconShortBar: NewspaperIcon,
          children: [
            {
              id: "sales:crm:contacts",
              name: t("common:menu:sales:crm:contacts"),
              href: "/sales/crm/contacts?page=1",
              image: "/img/crm/contacto.svg",
              iconShortBar: ArrowDownCircleIcon,
            },
            {
              id: "sales:crm:leads",
              name: t("common:menu:sales:crm:prospects"),
              href: "/sales/crm/leads?page=1",
              image: "/img/crm/prospecto.png",
              iconShortBar: ArrowDownCircleIcon,
            },
          ],
        },
        {
          id: "sales:reports",
          name: t("common:menu:sales:reports:name"),
          href: "",
          image: "/img/ventas/reportes.png",
          iconShortBar: PresentationChartBarIcon,
          children: [
            {
              id: "sales:reports:activities",
              name: t("common:menu:sales:reports:activities"),
              href: "",
              iconShortBar: ArrowDownCircleIcon,
            },
            {
              id: "sales:reports:history",
              name: t("common:menu:sales:reports:history"),
              href: "",
              iconShortBar: ArrowDownCircleIcon,
            },
            {
              id: "sales:reports:reports",
              name: t("common:menu:sales:reports:reports"),
              href: "",
              iconShortBar: ArrowDownCircleIcon,
            },
            {
              id: "sales:reports:agent",
              name: t("common:menu:sales:reports:agent"),
              href: "",
              iconShortBar: ArrowDownCircleIcon,
              children: [
                {
                  id: "sales:reports:agent:performance",
                  name: "Embudo de ventas sin conversión",
                  href: "",
                  iconShortBar: ArrowDownCircleIcon,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "control",
      name: t("common:menu:control:name"),
      icon: ChevronRightIcon,
      current: false,
      href: "/control",
      iconShortBar: WalletIcon,
      children: [
        {
          id: "control:commissions",
          name: t("common:menu:control:portfolio:commissions"),
          href: "",
          iconShortBar: GlobeAltIcon,
          children: [
            {
              id: "control:commissions:commission-simulator",
              name: t("common:menu:control:portfolio:commission-simulator"),
              href: "",
              iconShortBar: GlobeAltIcon,
            },
            {
              id: "control:commissions:commissions-generated",
              name: t("common:menu:control:portfolio:commissions-generated"),
              href: "",
              iconShortBar: GlobeAltIcon,
            },
          ],
        },
        {
          id: "control:portfolio",
          name: t("common:menu:control:portfolio:name"),
          href: "/control/portafolio",
          image: "/img/cobranza/portafolio.png",
          iconShortBar: GlobeAltIcon,
          children: [
            {
              id: "control:portfolio:receipts",
              name: t("common:menu:control:portfolio:receipts"),
              href: "/control/portafolio/receipts",
              image: "/img/cobranza/recibos.png",
              iconShortBar: GlobeAltIcon,
            },
            {
              id: "control:portfolio:control",
              name: t("common:menu:control:portfolio:control"),
              href: "/control/portafolio/control",
              image: "/img/cobranza/cobranzasub.png",
              iconShortBar: GlobeAltIcon,
            },
          ],
        },
      ],
    },
    {
      id: "operations",
      name: "OPERACIONES",
      icon: ChevronRightIcon,
      current: false,
      href: "/operations",
      iconShortBar: WalletIcon,
      children: [
        {
          id: "operations:management",
          name: "Gestión",
          href: "/operations/managements",
          image: "/img/operations/policies.svg",
          iconShortBar: GlobeAltIcon,
        },
        {
          id: "operations:policies",
          name: "Pólizas",
          href: "/operations/policies",
          image: "/img/operations/policies.svg",
          iconShortBar: GlobeAltIcon,
        },
        {
          id: "operations:endorsements",
          name: "Renovaciones",
          href: "/operations/renovations",
          image: "/img/operations/renovations.svg",
          iconShortBar: GlobeAltIcon,
        },
        {
          id: "operations:sinisters",
          name: "Siniestros",
          href: "/operations/claims",
          image: "/img/operations/accidents.svg",
          iconShortBar: GlobeAltIcon,
        },
        {
          id: "operations:refunds",
          name: "Reembolsos",
          href: "/operations/refunds",
          image: "/img/operations/refunds.svg",
          iconShortBar: GlobeAltIcon,
        },
        {
          id: "operations:refunds",
          name: "Programaciones",
          href: "/operations/programations",
          image: "/img/operations/programations.svg",
          iconShortBar: GlobeAltIcon,
        },
        {
          id: "operations:fund-recovery",
          name: "Rescate de Fondos",
          href: "/operations/fundrecoveries",
          image: "/img/operations/fund_recovery.svg",
          iconShortBar: GlobeAltIcon,
        },
      ],
    },
    {
      id: "marketing",
      name: t("common:menu:sales:marketing:name"),
      icon: ChevronRightIcon,
      current: false,
      href: "/marketing",
      iconShortBar: PuzzlePieceIcon,
      children: [
        {
          id: "marketing:campaigns",
          name: "Canales (REDES SOCIALES)",
          href: "",
          image: "/img/cobranza/portafolio.png",
          iconShortBar: GlobeAltIcon,
        },
        {
          id: "marketing:phone",
          name: "Telefonía (PRÓXIMAMENTE)",
          href: "",
          image: "/img/cobranza/portafolio.png",
          iconShortBar: GlobeAltIcon,
        },
        {
          id: "marketing:sms",
          name: "SMS (PRÓXIMAMENTE)",
          href: "",
          image: "/img/cobranza/portafolio.png",
          iconShortBar: GlobeAltIcon,
        },
        {
          id: "marketing:widgets",
          name: "WIDGETS (PRÓXIMAMENTE)",
          href: "",
          image: "/img/cobranza/portafolio.png",
          iconShortBar: GlobeAltIcon,
        },
        {
          id: "marketing:forms",
          name: "Formularios (PRÓXIMAMENTE)",
          href: "",
          image: "/img/cobranza/portafolio.png",
          iconShortBar: GlobeAltIcon,
        },
        {
          id: "marketing:websites",
          name: "Sitios Web (PRÓXIMAMENTE)",
          href: "",
          image: "/img/cobranza/portafolio.png",
          iconShortBar: GlobeAltIcon,
        },
        {
          id: "marketing:landing",
          name: "Landing (PRÓXIMAMENTE)",
          href: "",
          image: "/img/cobranza/portafolio.png",
          iconShortBar: GlobeAltIcon,
        },
      ],
    },
    {
      id: "services",
      name: t("common:menu:services:name"),
      icon: ChevronRightIcon,
      current: false,
      href: "/services",
      iconShortBar: PuzzlePieceIcon,
      children: [
        {
          id: "services:automations",
          name: t("common:menu:services:automations"),
          href: "",
          image: "/img/services/automatizaciones.png",
          iconShortBar: GlobeAltIcon,
        },
        {
          id: "services:funnels",
          name: t("common:menu:services:funnels"),
          href: "",
          image: "/img/services/embudos.png",
          iconShortBar: FunnelIcon,
        },
        {
          id: "services:chat",
          name: t("common:menu:services:soport"),
          href: "",
          image: "/img/services/soporte.png",
          iconShortBar: ChatBubbleOvalLeftEllipsisIcon,
        },
        {
          id: "services:trash",
          name: t("common:menu:services:trash"),
          href: "",
          image: "/img/services/papelera.png",
          iconShortBar: TrashIcon,
        },
        {
          id: "services:logs",
          name: t("common:menu:services:logs"),
          href: "",
          image: "/img/services/logs.png",
          iconShortBar: ShieldCheckIcon,
        },
        {
          id: "services:academy",
          name: t("common:menu:services:academy"),
          href: "",
          image: "/img/services/academia.png",
          iconShortBar: AcademicCapIcon,
        },
      ],
    },
    {
      id: "agent-management",
      name: t("common:menu:agent-management:name"),
      href: "/agents-management",
      icon: ChevronRightIcon,
      current: false,
      iconShortBar: IdentificationIcon,
      children: [
        {
          id: "agent-management",
          name: t("common:menu:agent-management:accompaniment"),
          href: "/agents-management/accompaniment",
          iconShortBar: ArrowDownCircleIcon,
          image: "/img/agentsManagement/accompaniment.svg",
        },
        {
          id: "agent-management",
          name: t("common:menu:agent-management:recruitement"),
          href: "/agents-management/recruitment",
          iconShortBar: UserPlusIcon,
          image: "/img/agentsManagement/recruitement.svg",
        },
        {
          id: "agent-management:capacitations",
          name: t("common:menu:agent-management:capacitations:name"),
          href: "/agents-management/capacitations",
          iconShortBar: NewspaperIcon,
          image: "/img/agentsManagement/capacitations.svg",
          children: [
            {
              id: "agent-management:capacitations",
              name: t("common:menu:agent-management:capacitations:e-learning"),
              href: "/agents-management/capacitations/e-learning/courses",
              image: "/img/crm/contacto.png",
              iconShortBar: ArrowDownCircleIcon,
            },
            {
              id: "agent-management:capacitations",
              name: t("common:menu:agent-management:capacitations:academy"),
              href: "/agents-management/capacitations/academy",
              image: "/img/crm/contacto.png",
              iconShortBar: ArrowDownCircleIcon,
            },
          ],
        },
        {
          id: "agent-management",
          name: t("common:menu:agent-management:conections"),
          href: "",
          iconShortBar: ArrowPathIcon,
          image: "/img/agentsManagement/conections.svg",
        },
        {
          id: "agent-management",
          name: "Reuniones y sesiones",
          href: "/agents-management/meetings-and-sessions",
          icon: ChevronRightIcon,
          image: "/img/agentsManagement/metting-and-sessions.svg",
          current: false,
          iconShortBar: IdentificationIcon,
          children: [
            {
              id: "agent-management",
              name: t("common:menu:agent-management:team-meetings"),
              href: "/agents-management/meetings-and-sessions/teams",
              image: "/img/agentsManagement/group-meet.svg",
              iconShortBar: SparklesIcon,
            },
            {
              id: "agent-management",
              name: t("common:menu:agent-management:individual-meetings"),
              href: "/agents-management/meetings-and-sessions/individuals",
              image: "/img/agentsManagement/individual-meet.svg",
              iconShortBar: SparklesIcon,
            },
          ],
        },
      ],
    },
    {
      id: "companies",
      name: t("common:menu:companies:name"),
      href: "/",
      icon: ChevronRightIcon,
      current: false,
      iconShortBar: BuildingOfficeIcon,
      children: [
        {
          id: "companies:insurance",
          name: t("common:menu:companies:insurance"),
          href: "",
          iconShortBar: GlobeAltIcon,
          children: [
            {
              id: "companies:insurance:gnp",
              name: t("common:menu:companies:gnp"),
              href: "",
              iconShortBar: ArrowDownCircleIcon,
            },
            {
              id: "companies:insurance:axa",
              name: t("common:menu:companies:axa"),
              href: "",
              iconShortBar: ArrowDownCircleIcon,
            },
            {
              id: "companies:insurance:banorte",
              name: t("common:menu:companies:banorte"),
              href: "",
              iconShortBar: ArrowDownCircleIcon,
            },
            {
              id: "companies:insurance:atlas",
              name: t("common:menu:companies:atlas"),
              href: "",
              iconShortBar: ArrowDownCircleIcon,
            },
            {
              id: "companies:insurance:zurich",
              name: t("common:menu:companies:zurich"),
              href: "",
              iconShortBar: ArrowDownCircleIcon,
            },
            {
              id: "companies:insurance:qualitas",
              name: t("common:menu:companies:qualitas"),
              href: "",
              iconShortBar: ArrowDownCircleIcon,
            },
            {
              id: "companies:insurance:afirme",
              name: t("common:menu:companies:afirme"),
              href: "",
              iconShortBar: ArrowDownCircleIcon,
            },
            {
              id: "companies:insurance:others",
              name: t("common:menu:companies:others"),
              href: "",
              iconShortBar: ArrowDownCircleIcon,
            },
          ],
        },
        {
          id: "companies:agency-addresses",
          name: t("common:menu:companies:agency-addresses"),
          href: "",
          iconShortBar: GlobeAltIcon,
          children: [
            {
              id: "companies:agency-addresses:gya",
              name: "GYA TUS SUEÑOS",
              href: "",
              iconShortBar: ArrowDownCircleIcon,
            },
            {
              id: "companies:agency-addresses:blinda",
              name: "BLINDARIESGOS",
              href: "",
              iconShortBar: ArrowDownCircleIcon,
            },
          ],
        },
      ],
    },
    {
      id: "settings",
      name: t("common:menu:settings:name"),
      href: "/settings",
      icon: ChevronRightIcon,
      current: false,
      iconShortBar: ArrowDownCircleIcon,
      children: [
        {
          id: "settings:permissions",
          name: t("common:menu:settings:permissions"),
          href: "/settings/permissions",
          iconShortBar: ArrowDownCircleIcon,
          image: "/img/settings/permissions.png",
          children: [
            {
              id: "settings:permissions:invite",
              name: t("common:menu:settings:invite"),
              href: `${window.location.pathname}?inviteuser=true`,
              image: "/img/settings/invitar.png",
              iconShortBar: ArchiveBoxIcon,
            },
            {
              id: "settings:permissions:user-list",
              name: t("common:menu:settings:user-list"),
              href: "/settings/permissions/users",
              image: "/img/settings/listausuarios.png",
              iconShortBar: BookOpenIcon,
            },
          ],
        },
        {
          id: "settings:others",
          name: t("common:menu:settings:others"),
          href: "/settings/others",
          iconShortBar: ArrowDownCircleIcon,
          image: "/img/settings/others.png",
          children: [
            {
              id: "settings:others:other-settings",
              name: t("common:menu:settings:other-settings"),
              href: `${window.location.pathname}?othersettings=true`,
              image: "/img/settings/othersettings.png",
              iconShortBar: BookOpenIcon,
            },
            {
              id: "settings:others:change-password",
              name: t("common:menu:settings:change-password"),
              href: `${window.location.pathname}?changepassword=true`,
              image: "/img/settings/changepassword.png",
              iconShortBar: InboxArrowDownIcon,
            },
            {
              id: "settings:others:other-notifications",
              name: t("common:menu:settings:other-notifications"),
              href: `${window.location.pathname}?othernotifications=true`,
              image: "/img/settings/otrasnotificaciones.png",
              iconShortBar: InboxArrowDownIcon,
            },
            {
              id: "settings:others:subscriptions",
              name: "Suscripciones",
              href: "",
              image: "/img/settings/subscriptions.png",
              iconShortBar: ArchiveBoxIcon,
            },
          ],
        },
      ],
    },
  ];

  // Función para filtrar el menú según los permisos del usuario
  const filterMenuByPermissions = (menuItems) => {
    return menuItems
      .filter((item) => {
        // Verificar si el id del menú está en los permisos del usuario
        return userMenuPermissions.includes(item.id);
      })
      .map((item) => {
        // Si tiene hijos, aplicar el filtro recursivamente
        if (item.children) {
          return {
            ...item,
            children: filterMenuByPermissions(item.children),
          };
        }
        return item;
      })
      .filter((item) => {
        // Eliminar elementos sin hijos después del filtrado
        if (item.children) {
          return item.children.length > 0;
        }
        return true;
      });
  };

  const filteredSidebarNavigation = filterMenuByPermissions(sidebarNavigation);

  return {
    sidebarNavigation: filteredSidebarNavigation,
  };
};

export const useCommon = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const calendarViews = [
    t("tools:calendar:day"),
    t("tools:calendar:week"),
    t("tools:calendar:month"),
    t("tools:calendar:program"),
  ];
  const createdDate = [
    {
      id: "yesterday",
      name: t("common:date:yesterday"),
    },
    {
      id: "today",
      name: t("common:date:today"),
    },
    {
      id: "tomorrow",
      name: t("common:date:tomorrow"),
    },
    {
      id: "thisWeek",
      name: t("common:date:thisWeek"),
    },
    {
      id: "thisMonth",
      name: t("common:date:thisMonth"),
    },
    {
      id: "currentQuarter",
      name: t("common:date:currentQuarter"),
    },
    {
      id: "last7Days",
      name: t("common:date:last7Days"),
    },
    {
      id: "last30Days",
      name: t("common:date:last30Days"),
    },
    {
      id: "last60Days",
      name: t("common:date:last60Days"),
    },
    {
      id: "last90Days",
      name: t("common:date:last90Days"),
    },
    {
      id: "lastNDays",
      name: t("common:date:lastNDays"),
      date: "input",
    },
    {
      id: "nextNDays",
      name: t("common:date:nextNDays"),
      date: "input",
    },
    {
      id: "month",
      name: t("common:date:month"),
      date: "month",
    },
    {
      id: "quarter",
      name: t("common:date:quarter"),
      date: "quarter",
    },
    {
      id: "year",
      name: t("common:date:year"),
      date: "year",
    },
    {
      id: "exactDate",
      name: t("common:date:exactDate"),
      date: "exactDate",
    },
    {
      id: "lastWeek",
      name: t("common:date:lastWeek"),
    },
    {
      id: "lastMonth",
      name: t("common:date:lastMonth"),
    },
    {
      id: "dateRange",
      name: t("common:date:dateRange"),
      date: "range",
    },
    {
      id: "nextWeek",
      name: t("common:date:nextWeek"),
    },
    {
      id: "nextMonth",
      name: t("common:date:nextMonth"),
    },
  ];

  const trashContact = [
    {
      value: 0,
      name: t("contacts:header:delete:remove"),
      icon: XMarkIcon,
      onclick: () => {},
    },
    {
      value: 1,
      icon: TrashIcon,
      name: t("contacts:header:delete:trash"),
      onclick: () => {},
    },
  ];

  const trashLead = [
    {
      value: 0,
      name: t("leads:header:delete:remove"),
      icon: XMarkIcon,
      onclick: () => {},
    },
    {
      value: 1,
      icon: TrashIcon,
      name: t("leads:header:delete:trash"),
      onclick: () => {},
    },
  ];

  const settingsContact = [
    {
      value: 0,
      name: t("contacts:header:settings:vcard"),
      onclick: () => {},
      disabled: true,
    },
    {
      value: 1,
      name: t("contacts:header:settings:gmail"),
      onclick: () => {},
      disabled: true,
    },
    {
      value: 2,
      name: t("contacts:header:settings:outlook"),
      onclick: () => {},
      disabled: true,
    },
    {
      value: 3,
      name: t("contacts:header:settings:yahoo"),
      onclick: () => {},
      disabled: true,
    },
    {
      value: 4,
      name: t("contacts:header:settings:import"),
      onClick: () => router.push("/custom-import/contacts"),
      disabled: false,
    },
    {
      value: 5,
      name: t("contacts:header:settings:crm"),
      onclick: () => {},
      disabled: true,
    },
    {
      value: 6,
      name: t("contacts:header:settings:csv"),
      onclick: () => {},
      disabled: true,
    },
    {
      value: 7,
      name: t("contacts:header:settings:excel"),
      onclick: () => {},
      disabled: true,
    },
    {
      value: 8,
      name: t("contacts:header:settings:export"),
      onclick: () => {},
      disabled: true,
    },
    {
      value: 9,
      name: t("contacts:header:settings:control"),
      onclick: () => {},
      disabled: true,
    },
    {
      value: 10,
      name: t("contacts:header:settings:search"),
      onclick: () => {},
      disabled: true,
    },
    {
      value: 11,
      name: t("contacts:header:settings:entity"),
      onclick: () => {},
      disabled: true,
    },
  ];

  const settingsUser = [
    {
      value: 6,
      name: t("contacts:header:settings:csv"),
      onclick: () => {},
      disabled: false,
    },
    {
      value: 7,
      name: t("contacts:header:settings:excel"),
      onclick: () => {},
      disabled: false,
    },
  ];

  const settingsReceipts = [
    {
      value: 6,
      name: t("contacts:header:settings:csv"),
      onclick: () => {},
      disabled: false,
    },
    {
      value: 7,
      name: t("contacts:header:settings:excel"),
      onclick: () => {},
      disabled: false,
    },
    {
      value: 0,
      name: "Imprimir pdf",
      onclick: () => {},
      icon: DocumentTextIcon,
    },
  ];

  const settingsPolicies = [
    {
      value: 0,
      name: t("contacts:header:excel:export"),
      icon: RiFileExcel2Fill,
      onclick: () => {},
    },
    {
      value: 1,
      icon: RiFileExcel2Fill,
      name: t("contacts:header:excel:print"),
      onclick: () => {},
    },
  ];

  const settingsPolicy = [
    {
      value: 0,
      name: t("contacts:edit:policies:consult:settings:download"),
      icon: ArrowDownTrayIcon,
      onclick: () => {},
    },
    {
      value: 1,
      icon: DocumentTextIcon,
      name: t("contacts:edit:policies:consult:settings:print"),
      onclick: () => {},
    },
  ];

  const settingsLead = [
    {
      value: 0,
      name: "Importación vCard",
      disabled: true,
      onclick: () => {},
    },
    {
      value: 1,
      name: "Gmail Importar",
      disabled: true,
      onclick: () => {},
    },
    {
      value: 1,
      name: "Yahoo! Importar",
      disabled: true,
      onclick: () => {},
    },
    {
      value: 1,
      name: "Outlook Importar",
      disabled: true,
      onclick: () => {},
    },
    {
      value: 1,
      name: "Importación personalizada",
      onClick: () => router.push("/custom-import/leads"),
    },
    {
      value: 1,
      name: "Exportar a Excel",
      disabled: true,
      onclick: () => {},
    },
    {
      value: 1,
      name: "Exportar a CSV",
      disabled: true,
      onclick: () => {},
    },
  ];

  const months = [
    t("common:months:january"),
    t("common:months:february"),
    t("common:months:march"),
    t("common:months:april"),
    t("common:months:may"),
    t("common:months:june"),
    t("common:months:july"),
    t("common:months:august"),
    t("common:months:september"),
    t("common:months:october"),
    t("common:months:november"),
    t("common:months:december"),
  ];

  const stagesLead = [
    {
      id: 1,
      name: t("leads:filters:stages:initial-contact"),
    },
    {
      id: 2,
      name: t("leads:filters:stages:submit-proposal"),
    },
    {
      id: 3,
      name: t("leads:filters:stages:revision-proposal"),
    },
    {
      id: 4,
      name: t("leads:filters:stages:process-issuance"),
    },
    {
      id: 5,
      name: t("leads:filters:stages:policy-issuance"),
    },
  ];

  const statusLead = [
    {
      id: 1,
      name: t("leads:filters:completed"),
    },
    {
      id: 2,
      name: t("leads:filters:not-completed"),
    },
  ];

  return {
    calendarViews,
    createdDate,
    trash: trashContact,
    trashLead,
    settingsContact,
    settingsUser,
    settingsPolicies,
    months,
    settingsPolicy,
    settingsLead,
    statusLead,
    stagesLead,
    settingsReceipts,
  };
};

export const usePolicies = (contactID) => {
  const { push } = useRouter();
  const { t } = useTranslation();
  const branches = [
    {
      value: 0,
      name: t("contacts:policies:branches:all"),
      onclick: () =>
        push(`/sales/crm/contacts/contact/policies/${contactID}?show=true`),
      route: `/sales/crm/contacts/contact/policies/${contactID}`,
    },
    {
      value: 1,
      name: t("contacts:policies:branches:life"),
      onclick: () =>
        push(
          `/sales/crm/contacts/contact/policies/branch/life/${contactID}?show=true`
        ),
      route: `/sales/crm/contacts/contact/policies/branch/life/${contactID}`,
    },
    {
      value: 2,
      name: t("contacts:policies:branches:cars"),
      route: `/sales/crm/contacts/contact/policies/branch/cars/${contactID}`,
      onclick: () =>
        push(
          `/sales/crm/contacts/contact/policies/branch/cars/${contactID}?show=true`
        ),
    },
    {
      value: 3,
      name: t("contacts:policies:branches:medicinal"),
      route: `/sales/crm/contacts/contact/policies/branch/medicine/${contactID}`,
      onclick: () =>
        push(
          `/sales/crm/contacts/contact/policies/branch/medicine/${contactID}?show=true`
        ),
    },
    {
      value: 4,
      name: t("contacts:policies:branches:damages"),
      route: `/sales/crm/contacts/contact/policies/branch/damages/${contactID}`,
      onclick: () =>
        push(
          `/sales/crm/contacts/contact/policies/branch/damages/${contactID}?show=true`
        ),
    },
    {
      value: 5,
      name: t("contacts:policies:branches:various"),
      route: `/sales/crm/contacts/contact/policies/branch/various/${contactID}`,
      onclick: () =>
        push(
          `/sales/crm/contacts/contact/policies/branch/various/${contactID}?show=true`
        ),
    },
    {
      value: 6,
      name: t("contacts:policies:branches:fleets"),
      inactive: true,
    },
    {
      value: 7,
      name: t("contacts:policies:branches:others"),
      inactive: true,
    },
  ];

  const policyConsult = [
    {
      value: 0,
      name: t("contacts:edit:policies:consult:name"),
      onclick: () =>
        push(
          `/sales/crm/contacts/contact/policy/consult/${contactID}?show=true`
        ),
      route: `/sales/crm/contacts/contact/policy/consult/${contactID}`,
    },
    {
      value: 1,
      name: t("contacts:edit:policies:consult:payments"),
      onclick: () =>
        push(
          `/sales/crm/contacts/contact/policy/payments/${contactID}?show=true`
        ),
      route: `/sales/crm/contacts/contact/policy/payments/${contactID}`,
    },
    {
      value: 2,
      name: t("contacts:edit:policies:consult:claims"),
      onclick: () =>
        push(
          `/sales/crm/contacts/contact/policy/claims/${contactID}?show=true`
        ),
      route: `/sales/crm/contacts/contact/policy/claims/${contactID}`,
    },
    {
      value: 3,
      name: t("contacts:edit:policies:consult:refund"),
      onclick: () =>
        push(
          `/sales/crm/contacts/contact/policy/refunds/${contactID}?show=true`
        ),
      route: `/sales/crm/contacts/contact/policy/refunds/${contactID}`,
    },
    {
      value: 4,
      name: t("contacts:edit:policies:consult:invoices"),
      onclick: () =>
        push(
          `/sales/crm/contacts/contact/policy/invoices/${contactID}?show=true`
        ),
      route: `/sales/crm/contacts/contact/policy/invoices/${contactID}`,
    },
    {
      value: 5,
      name: t("contacts:edit:policies:consult:versions"),
      onclick: () =>
        push(
          `/sales/crm/contacts/contact/policy/versions/${contactID}?show=true`
        ),
      route: `/sales/crm/contacts/contact/policy/versions/${contactID}`,
    },
    {
      value: 6,
      name: t("contacts:edit:policies:consult:commissions"),
      onclick: () =>
        push(
          `/sales/crm/contacts/contact/policy/commissions/${contactID}?show=true`
        ),
      route: `/sales/crm/contacts/contact/policy/commissions/${contactID}`,
    },
    {
      value: 7,
      name: t("contacts:edit:policies:consult:quotes"),
      onclick: () =>
        push(
          `/sales/crm/contacts/contact/policy/quotes/${contactID}?show=true`
        ),
      route: `/sales/crm/contacts/contact/policy/quotes/${contactID}`,
    },
    {
      value: 8,
      name: t("contacts:edit:policies:consult:schedules"),
      onclick: () =>
        push(
          `/sales/crm/contacts/contact/policy/schedules/${contactID}?show=true`
        ),
      route: `/sales/crm/contacts/contact/policy/schedules/${contactID}`,
    },
  ];

  return {
    branches,
    policyConsult,
  };
};

export const useLeads = () => {
  let [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const optionsHeader = [
    {
      id: 1,
      name: t("leads:header:sales"),
    },
    {
      id: 2,
      name: t("leads:header:activities"),
    },
    {
      id: 3,
      name: t("leads:header:reports"),
    },
    {
      id: 4,
      name: t("leads:header:documents"),
    },
  ];

  const stages = [
    {
      id: 1,
      name: t("leads:lead:stages:initial-contact"),
    },
    {
      id: 2,
      name: t("leads:lead:stages:submit-proposal"),
    },
    {
      id: 3,
      name: t("leads:lead:stages:revision-proposal"),
    },
    {
      id: 4,
      name: t("leads:lead:stages:process-issuance"),
    },
    {
      id: 5,
      name: t("leads:lead:stages:policy-issuance"),
    },
    {
      id: 6,
      name: t("leads:lead:stages:positive-stage"),
      onclick: () => {
        setIsOpen(true);
      },
    },
    {
      id: 7,
      name: t("leads:lead:stages:negative-stage"),
    },
  ];

  const columnTable = [
    {
      id: 1,
      name: t("leads:table:lead"),
      row: "fullName",
      order: "fullName",
      check: true,
      link: true,
      permanent: true,
      photo: true,
    },
    {
      id: 2,
      name: t("leads:table:stages"),
      row: "stage",
      check: true,
    },
    {
      id: 3,
      name: t("leads:table:created"),
      row: "createdAt",
      order: "createdAt",
      check: true,
    },
    {
      id: 4,
      name: t("leads:table:origin"),
      row: "source",
      check: true,
    },

    {
      id: 5,
      name: t("leads:lead:fields:amount"),
      row: "quoteAmount",
      check: true,
    },
    {
      id: 6,
      name: t("leads:table:polizaType"),
      row: "polizaType",
      check: true,
    },
    {
      id: 5,
      name: t("leads:table:activities"),
      row: "activities",
      check: true,
      activities: true,
    },
  ];
  return {
    optionsHeader,
    stages,
    isOpen,
    setIsOpen,
    columnTable,
  };
};

export const useTasksConfigs = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState([
    {
      id: "completed",
      name: t("tools:tasks:filters:closed"),
      value: "completed",
      selected: false,
    },
    {
      id: "overdue",
      name: t("tools:tasks:filters:expirated"),
      value: "overdue",
      selected: false,
    },
    {
      id: "pending",
      name: t("tools:tasks:filters:pending"),
      value: "pending",
      selected: false,
    },
  ]);

  const optionsSettings = [
    {
      value: 0,
      name: t("tools:tasks:header:excel:alone"),
      icon: RiFileExcel2Fill,
      onclick: () => {},
    },
    {
      value: 0,
      name: t("tools:tasks:header:excel:all"),
      icon: RiFileExcel2Fill,
      onclick: () => {},
    },
  ];
  const optionsTrash = [
    {
      value: 0,
      name: t("tools:tasks:header:delete:remove"),
      icon: XMarkIcon,
      onclick: () => {},
    },
    {
      value: 1,
      icon: TrashIcon,
      name: t("tools:tasks:header:delete:trash"),
      onclick: () => {},
    },
  ];

  const columnTable = [
    {
      id: 1,
      name: t("tools:tasks:table:name"),
      row: "name",
      check: true,
      link: true,
      permanent: true,
    },
    {
      id: 2,
      name: t("tools:tasks:table:activity"),
      row: "activity",
      check: true,
    },
    {
      id: 15,
      name: "Conexiones CRM",
      row: "crm",
      check: true,
    },
    // {
    //   id: 3,
    //   name: t("tools:tasks:table:contact"),
    //   row: "contact",
    //   check: true,
    // },
    // {
    //   id: 4,
    //   name: t("tools:tasks:table:policy"),
    //   row: "policy",
    //   check: true,
    // },
    // {
    //   id: 4,
    //   name: t("tools:tasks:table:lead"),
    //   row: "lead",
    //   check: true,
    // },
    {
      id: 5,
      name: t("tools:tasks:table.limit-date"),
      row: "deadline",
      check: true,
    },
    {
      id: 6,
      name: t("tools:tasks:table.created-by"),
      row: "createdBy",
      photo: true,
      check: true,
    },
    {
      id: 7,
      name: t("tools:tasks:table.responsible"),
      row: "responsible",
      check: true,
      photo: true,
    },
    {
      id: 8,
      name: t("tools:tasks:table.important"),
      row: "important",
      check: true,
    },
  ];

  const settings = [
    {
      value: 0,
      name: t("tools:tasks:new:download"),
      onclick: () => {},
      icon: ArrowDownTrayIcon,
    },
    {
      value: 0,
      name: t("tools:tasks:new:print"),
      onclick: () => {},
      icon: DocumentTextIcon,
    },
  ];
  return {
    optionsTrash,
    optionsSettings,
    status,
    setStatus,
    columnTable,
    settings,
  };
};

export const useTasksActions = (selectedTask, setSelectedTasks, setLoading) => {
  const { t } = useTranslation();
  const { onCloseAlertDialog } = useAlertContext();
  const { mutate } = useSWRConfig();

  const optionsCheckBox = [
    {
      id: 1,
      name: t("common:table:checkbox:complete"),
    },
    {
      id: 2,
      name: t("common:table:checkbox:add-observer"),
      selectUser: true,
    },
    {
      id: 3,
      name: t("common:table:checkbox:add-participant"),
      selectUser: true,
    },
    {
      id: 4,
      name: t("common:table:checkbox:change-observer"),
      selectUser: true,
    },
    {
      id: 5,
      name: t("common:table:checkbox:change-participant"),
      selectUser: true,
    },
    {
      id: 6,
      name: t("common:table:checkbox:delete"),
      onclick: () => deleteTasks(),
    },
  ];

  const deleteTasks = async () => {
    try {
      setLoading(true);
      if (selectedTask.length === 1) apiDelete(selectedTask[0].id);
      else if (selectedTask.length > 1) {
        await Promise.all(selectedTask.map((task) => apiDelete(task.id)));
      }
      toast.success(t("tools:tasks:delete-msg"));
      setSelectedTasks([]);

      onCloseAlertDialog();
    } catch (error) {
      handleApiError(err.message);
    } finally {
      setLoading(false);
      mutate("/tools/tasks/user?limit=15&page=1");
    }
  };

  const apiDelete = async (id) => {
    await deleteTask(id);
  };

  return {
    optionsCheckBox,
  };
};

export const useTooltip = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);

  const getTooltipStyle = (position) => {
    switch (position) {
      case "top":
        return {
          top: 5,
          left: 0,
          transform: "translate(-50%, -100%)",
        };
      case "bottom":
        return {
          top: 25,
          left: 15,
          transform: "translate(-50%, 0)",
        };
      case "left":
        return {
          top: 5,
          left: 5,
          transform: "translate(-100%, -50%)",
        };
      case "right":
        return {
          top: 5,
          left: 25,
          transform: "translate(0, -50%)",
        };
      default:
        return {
          top: 0,
          left: 0,
          transform: "translate(0, 0)",
        };
    }
  };

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return {
    showTooltip,
    handleMouseEnter,
    handleMouseLeave,
    getTooltipStyle,
    tooltipRef,
  };
};

export const useContactTable = () => {
  const { t } = useTranslation();
  const columnTable = [
    {
      id: 1,
      name: t("contacts:table:contact"),
      row: "contactName",
      order: "name",
      check: true,
      link: true,
      permanent: true,
      photo: true,
    },
    {
      id: 2,
      name: t("contacts:table:birthday"),
      row: "birthdate",
      order: "birthdate",
      check: true,
    },
    {
      id: 3,
      name: t("contacts:table:responsible"),
      row: "responsible",
      order: "responsible",
      check: true,
      photo: true,
    },
    {
      id: 4,
      name: t("contacts:table:email"),
      row: "email",
      order: "emails[0].email.email",
      check: true,
    },
    {
      id: 5,
      name: t("contacts:table:phone"),
      row: "phone",
      order: "phones[0].phone.number",
      check: true,
    },
    {
      id: 6,
      name: t("contacts:table:created"),
      row: "createdAt",
      order: "createdAt",
      check: true,
    },
    {
      id: 7,
      name: t("contacts:table:origin"),
      row: "source",
      order: "source",
      check: true,
    },
    {
      id: 8,
      name: t("contacts:table:activities"),
      row: "activities",
      check: true,
      activities: true,
    },
  ];
  return { columnTable };
};

export const useUserTable = () => {
  const { t } = useTranslation();
  const columnTable = [
    {
      id: 1,
      name: t("users:table:name"),
      row: "contactName",
      order: "profile.firstName",
      check: true,
      link: true,
      permanent: true,
      photo: true,
    },
    {
      id: 2,
      name: t("users:table:email"),
      row: "email",
      order: "email",
      check: true,
    },
    {
      id: 3,
      name: t("users:table:phone"),
      row: "phone",
      order: "phone",
      check: true,
      photo: true,
    },
    {
      id: 5,
      name: t("users:table:mobile-app"),
      row: "mobile-app",
      check: true,
    },
    {
      id: 6,
      name: t("users:table:desk-app"),
      row: "desk-app",
      check: true,
    },
    {
      id: 4,
      name: t("users:table:lastActivity"),
      row: "lastLogin",
      order: "lastLogin",
      check: true,
    },
  ];
  return { columnTable };
};

export const useReceiptTable = () => {
  const { t } = useTranslation();
  const columnTable = [
    {
      id: 1,
      name: t("control:portafolio:receipt:table:receipt"),
      row: "title",
      order: "receipt",
      check: true,
      permanent: true,
    },
    {
      id: 5,
      name: t("control:portafolio:receipt:table:stages"),
      row: "stages",
      check: true,
    },
    {
      id: 4,
      name: t("control:portafolio:receipt:table:client"),
      row: "client",
      order: "client",
      check: true,
    },
    // {
    //   id: 2,
    //   name: t("control:portafolio:receipt:table:policy"),
    //   row: "policy",
    //   order: "policy",
    //   check: true,
    // },
    {
      id: 2,
      name: t("control:portafolio:receipt:table:status"),
      row: "status",
      order: "status",
      check: true,
    },
    {
      id: 6,
      name: t("control:portafolio:receipt:table:amount"),
      row: "paymentAmount",
      check: true,
    },
    {
      id: 9,
      name: t("control:portafolio:receipt:table:expiration-date"),
      row: "dueDate",
      order: "dueDate",
      check: true,
    },
    {
      id: 3,
      name: t("control:portafolio:receipt:table:responsible"),
      row: "responsible",
      order: "responsible",
      check: true,
      photo: true,
    },
    {
      id: 7,
      name: t("control:portafolio:receipt:table:created-in"),
      row: "createdAt",
      check: true,
    },
    {
      id: 8,
      name: t("control:portafolio:receipt:table:activities"),
      row: "activities",
      check: true,
    },
  ];
  return { columnTable };
};

export const usePoliciesTable = () => {
  const { t } = useTranslation();
  const columnTable = [
    {
      id: 4,
      name: t("operations:policies:table:client"),
      row: "name",
      order: "name",
      check: true,
    },
    {
      id: 2,
      name: t("operations:policies:table:policy"),
      row: "poliza",
      order: "poliza",
      check: true,
    },
    {
      id: 3,
      name: t("operations:policies:table:state"),
      row: "status",
      order: "status",
      check: true,
      photo: true,
    },
    {
      id: 7,
      name: t("operations:policies:table:created-in"),
      row: "vigenciaDesde",
      order: "vigenciaDesde",
      check: true,
    },
    {
      id: 1,
      name: t("operations:policies:table:origin"),
      row: "source",
      order: "source",
      check: true,
      permanent: true,
    },
    {
      id: 6,
      name: t("operations:policies:table:amount"),
      row: "importePagar",
      check: true,
    },
    {
      id: 8,
      name: t("operations:policies:table:activities"),
      row: "activities",
      check: true,
    },
  ];
  return { columnTable };
};

export const useRenovationTable = () => {
  const { t } = useTranslation();
  const columnTable = [
    {
      id: 4,
      name: t("operations:renovations:table:client"),
      row: "name",
      order: "name",
      check: true,
    },
    {
      id: 2,
      name: t("operations:renovations:table:policy"),
      row: "poliza",
      order: "poliza",
      check: true,
    },
    {
      id: 3,
      name: t("operations:renovations:table:state"),
      row: "status",
      order: "status",
      check: true,
      photo: true,
    },
    {
      id: 7,
      name: t("operations:renovations:table:created-in"),
      row: "vigenciaDesde",
      order: "vigenciaDesde",
      check: true,
    },
    {
      id: 1,
      name: t("operations:renovations:table:origin"),
      row: "source",
      order: "source",
      check: true,
      permanent: true,
    },
    {
      id: 6,
      name: t("operations:renovations:table:amount"),
      row: "importePagar",
      check: true,
    },
    {
      id: 8,
      name: t("operations:renovations:table:activities"),
      row: "activities",
      check: true,
    },
  ];
  return { columnTable };
};

export const useClaimTable = () => {
  const { t } = useTranslation();
  const columnTable = [
    {
      id: 4,
      name: t("operations:claims:table:client"),
      row: "name",
      order: "name",
      check: true,
    },
    {
      id: 2,
      name: t("operations:claims:table:policy"),
      row: "poliza",
      order: "poliza",
      check: true,
    },
    {
      id: 3,
      name: t("operations:claims:table:state"),
      row: "status",
      order: "status",
      check: true,
      photo: true,
    },
    {
      id: 7,
      name: t("operations:claims:table:contact"),
      row: "vigenciaDesde",
      order: "vigenciaDesde",
      check: true,
    },
    {
      id: 7,
      name: t("operations:claims:table:created-in"),
      row: "vigenciaDesde",
      order: "vigenciaDesde",
      check: true,
    },
    {
      id: 8,
      name: t("operations:claims:table:activities"),
      row: "activities",
      check: true,
    },
  ];
  return { columnTable };
};

export const useIndividualMeetTable = () => {
  const { t } = useTranslation();
  const columnTable = [
    {
      id: 4,
      name: t("agentsmanagement:meetings-and-sessions:table:name"),
      row: "name",
      order: "name",
      check: true,
    },
    {
      id: 2,
      name: t("agentsmanagement:meetings-and-sessions:table:gdd"),
      row: "poliza",
      order: "poliza",
      check: true,
    },
    {
      id: 3,
      name: t("agentsmanagement:meetings-and-sessions:table:conexions"),
      row: "status",
      order: "status",
      check: true,
      photo: true,
    },
    {
      id: 7,
      name: t("agentsmanagement:meetings-and-sessions:table:time"),
      row: "vigenciaDesde",
      order: "vigenciaDesde",
      check: true,
    },
    {
      id: 8,
      name: t("agentsmanagement:meetings-and-sessions:table:date"),
      row: "vigenciaDesde",
      order: "vigenciaDesde",
      check: true,
    },
    {
      id: 8,
      name: t("agentsmanagement:meetings-and-sessions:table:revision"),
      row: "vigenciaDesde",
      order: "vigenciaDesde",
      check: true,
    },
  ];
  return { columnTable };
};
export const useTeamMeetTable = () => {
  const { t } = useTranslation();
  const columnTable = [
    {
      id: 4,
      name: t("agentsmanagement:meetings-and-sessions:table:name"),
      row: "name",
      order: "name",
      check: true,
    },
    {
      id: 2,
      name: t("agentsmanagement:meetings-and-sessions:table:gdd"),
      row: "poliza",
      order: "poliza",
      check: true,
    },
    {
      id: 3,
      name: t("agentsmanagement:meetings-and-sessions:table:conexions"),
      row: "status",
      order: "status",
      check: true,
      photo: true,
    },
    {
      id: 7,
      name: t("agentsmanagement:meetings-and-sessions:table:time"),
      row: "vigenciaDesde",
      order: "vigenciaDesde",
      check: true,
    },
    {
      id: 8,
      name: t("agentsmanagement:meetings-and-sessions:table:date"),
      row: "vigenciaDesde",
      order: "vigenciaDesde",
      check: true,
    },
  ];
  return { columnTable };
};

export const useAccompanimentsTable = () => {
  const { t } = useTranslation();
  const columnTable = [
    {
      id: 4,
      name: t("agentsmanagement:accompaniments:table:agent"),
      row: "name",
      order: "name",
      check: true,
    },
    {
      id: 2,
      name: t("agentsmanagement:accompaniments:table:email"),
      row: "email",
      order: "email",
      check: true,
    },
    {
      id: 3,
      name: t("agentsmanagement:accompaniments:table:mobile"),
      row: "phone",
      order: "phone",
      check: true,
      photo: true,
    },
    {
      id: 7,
      name: t("agentsmanagement:accompaniments:table:lastUpdate"),
      row: "updatedAt",
      order: "updatedAt",
      check: true,
    },
    {
      id: 7,
      name: t("agentsmanagement:accompaniments:table:manager"),
      row: "manager",
      order: "manager",
      check: true,
    },
    {
      id: 8,
      name: t("agentsmanagement:accompaniments:table:state"),
      row: "isActive",
      check: true,
    },
    {
      id: 8,
      name: t("agentsmanagement:accompaniments:table:created-in"),
      row: "createdAt",
      order: "createdAt",
      check: true,
    },
  ];
  return { columnTable };
};

export const useRecruitmentTable = () => {
  const { t } = useTranslation();
  const columnTable = [
    {
      id: 4,
      name: t("agentsmanagement:recruitment:table:agent"),
      row: "name",
      order: "name",
      check: true,
    },
    {
      id: 2,
      name: t("agentsmanagement:recruitment:table:state"),
      row: "stage",
      order: "stage",
      check: true,
    },
    {
      id: 3,
      name: t("agentsmanagement:recruitment:table:initdate"),
      row: "date",
      order: "date",
      check: true,
      photo: true,
    },
    {
      id: 7,
      name: t("agentsmanagement:recruitment:table:indate"),
      row: "date",
      order: "date",
      check: true,
    },
    {
      id: 7,
      name: t("agentsmanagement:recruitment:table:responsible"),
      row: "manager",
      order: "manager",
      check: true,
    },
    {
      id: 8,
      name: t("agentsmanagement:recruitment:table:origin"),
      row: "origin",
      check: true,
    },
    {
      id: 8,
      name: t("agentsmanagement:recruitment:table:activity"),
      row: "activities",
      order: "activities",
      check: true,
    },
  ];
  return { columnTable };
};

export const useCapacitationsTable = () => {
  const { t } = useTranslation();
  const columnTable = [
    {
      id: 4,
      name: t("agentsmanagement:capacitations:table:agent"),
      row: "name",
      order: "name",
      check: true,
    },
    {
      id: 2,
      name: t("agentsmanagement:capacitations:table:stage"),
      row: "stage",
      order: "stage",
      check: true,
    },
    {
      id: 3,
      name: t("agentsmanagement:capacitations:table:startDate"),
      row: "startDate",
      order: "startDate",
      check: true,
      photo: true,
    },
    {
      id: 7,
      name: t("agentsmanagement:capacitations:table:endDate"),
      row: "endDate",
      order: "endDate",
      check: true,
    },
    {
      id: 7,
      name: t("agentsmanagement:capacitations:table:processClosed"),
      row: "processClosed",
      order: "processClosed",
      check: true,
    },
    {
      id: 8,
      name: t("agentsmanagement:capacitations:table:responsible"),
      row: "responsible",
      check: true,
    },
    {
      id: 8,
      name: t("agentsmanagement:capacitations:table:activity"),
      row: "activities",
      check: true,
    },
  ];
  return { columnTable };
};

export const useRefundTable = () => {
  const { t } = useTranslation();
  const columnTable = [
    {
      id: 4,
      name: t("operations:refunds:table:client"),
      row: "name",
      order: "name",
      check: true,
    },
    {
      id: 2,
      name: t("operations:refunds:table:policy"),
      row: "poliza",
      order: "poliza",
      check: true,
    },
    {
      id: 3,
      name: t("operations:refunds:table:state"),
      row: "status",
      order: "status",
      check: true,
      photo: true,
    },
    {
      id: 7,
      name: t("operations:refunds:table:contact"),
      row: "vigenciaDesde",
      order: "vigenciaDesde",
      check: true,
    },
    {
      id: 7,
      name: t("operations:refunds:table:created-in"),
      row: "vigenciaDesde",
      order: "vigenciaDesde",
      check: true,
    },
    {
      id: 8,
      name: t("operations:refunds:table:activities"),
      row: "activities",
      check: true,
    },
  ];
  return { columnTable };
};

export const useProgramationTable = () => {
  const { t } = useTranslation();
  const columnTable = [
    {
      id: 4,
      name: t("operations:programations:table:client"),
      row: "name",
      order: "name",
      check: true,
    },
    {
      id: 2,
      name: t("operations:programations:table:policy"),
      row: "poliza",
      order: "poliza",
      check: true,
    },
    {
      id: 3,
      name: t("operations:programations:table:state"),
      row: "status",
      order: "status",
      check: true,
      photo: true,
    },
    {
      id: 7,
      name: t("operations:programations:table:contact"),
      row: "vigenciaDesde",
      order: "vigenciaDesde",
      check: true,
    },
    {
      id: 7,
      name: t("operations:programations:table:created-in"),
      row: "vigenciaDesde",
      order: "vigenciaDesde",
      check: true,
    },
    {
      id: 8,
      name: t("operations:programations:table:activities"),
      row: "activities",
      check: true,
    },
  ];
  return { columnTable };
};

export const useFundRecoveriesTable = () => {
  const { t } = useTranslation();
  const columnTable = [
    {
      id: 4,
      name: t("operations:fundrecovery:table:client"),
      row: "name",
      order: "name",
      check: true,
    },
    {
      id: 2,
      name: t("operations:fundrecovery:table:policy"),
      row: "poliza",
      order: "poliza",
      check: true,
    },
    {
      id: 3,
      name: t("operations:fundrecovery:table:state"),
      row: "status",
      order: "status",
      check: true,
      photo: true,
    },
    {
      id: 7,
      name: t("operations:fundrecovery:table:contact"),
      row: "vigenciaDesde",
      order: "vigenciaDesde",
      check: true,
    },
    {
      id: 7,
      name: t("operations:fundrecovery:table:created-in"),
      row: "vigenciaDesde",
      order: "vigenciaDesde",
      check: true,
    },
    {
      id: 8,
      name: t("operations:fundrecovery:table:activities"),
      row: "activities",
      check: true,
    },
  ];
  return { columnTable };
};

export const useLeadDetete = (selectedLead, setSelectedLead, setLoading) => {
  const { t } = useTranslation();
  const { onCloseAlertDialog } = useAlertContext();

  const optionsCheckBox = [
    {
      id: 1,
      name: t("common:table:checkbox:delete"),
      onclick: () => deleteTasks(),
    },
  ];

  const deleteTasks = () => {
    if (selectedLead.length === 1) apiDelete(selectedLead[0].id);
    if (selectedLead.length > 1) {
      selectedLead.map((task) => apiDelete(task.id));
    }
    // router.push('/sales/crm/leads?page=1');
    toast.success(t("leads:delete:msg"));
    setSelectedLead([]);
    onCloseAlertDialog();
  };

  const apiDelete = async (id) => {
    try {
      setLoading(true);
      const response = await deleteLeadById(id);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      handleApiError(err.message);
    }
  };

  return {
    optionsCheckBox,
  };
};
