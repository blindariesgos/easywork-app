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
  MegaphoneIcon,
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

  const sidebarNavigation = [
    {
      name: t("common:menu:home:name"),
      href: "/home",
      icon: ChevronRightIcon,
      iconShortBar: HomeIcon,
      current: true,
      children: [],
    },
    {
      name: t("common:menu:tools:name"),
      href: "/tools",
      icon: ChevronRightIcon,
      iconShortBar: SquaresPlusIcon,
      current: true,
      children: [
        {
          name: t("common:menu:tools:drive"),
          href: "/tools/drive",
          image: "/img/herramientas/drive.png",
          iconShortBar: ArchiveBoxIcon,
        },
        {
          name: t("common:menu:tools:tasks"),
          href: "/tools/tasks?page=1",
          image: "/img/herramientas/tareas.png",
          iconShortBar: BookOpenIcon,
        },
        {
          name: t("common:menu:tools:email"),
          href: "/tools/mails/middleware",
          image: "/img/herramientas/correo.png",
          iconShortBar: InboxArrowDownIcon,
        },
        {
          name: t("common:menu:tools:calendar"),
          href: "/tools/calendar",
          image: "/img/herramientas/calendario.png",
          iconShortBar: CalendarDaysIcon,
        },
      ],
    },
    {
      name: t("common:menu:sales:name"),
      icon: ChevronRightIcon,
      current: false,
      href: "/sales",
      iconShortBar: TagIcon,
      children: [
        {
          name: t("common:menu:sales:crm:name"),
          href: "/sales/crm",
          image: "/img/ventas/crm.png",
          iconShortBar: NewspaperIcon,
          children: [
            {
              name: t("common:menu:sales:crm:contacts"),
              href: "/sales/crm/contacts?page=1",
              image: "/img/crm/contacto.png",
              iconShortBar: ArrowDownCircleIcon,
            },
            {
              name: t("common:menu:sales:crm:prospects"),
              href: "/sales/crm/leads?page=1",
              image: "/img/crm/prospecto.png",
              iconShortBar: ArrowDownCircleIcon,
            },
          ],
        },
        {
          name: t("common:menu:sales:reports:name"),
          href: "/sales/report",
          image: "/img/ventas/reportes.png",
          iconShortBar: PresentationChartBarIcon,
          children: [
            {
              name: t("common:menu:sales:reports:activities"),
              href: "/sales/report/activities",
              iconShortBar: ArrowDownCircleIcon,
            },
            {
              name: t("common:menu:sales:reports:history"),
              href: "/sales/report/history",
              iconShortBar: ArrowDownCircleIcon,
            },
            {
              name: t("common:menu:sales:reports:reports"),
              href: "/sales/report/reports",
              iconShortBar: ArrowDownCircleIcon,
            },
            {
              name: t("common:menu:sales:reports:agent"),
              href: "/sd",
              iconShortBar: ArrowDownCircleIcon,
              children: [
                {
                  name: "Embudo de ventas sin conversión",
                  href: "/sales/report/agentperformance/noconv",
                  iconShortBar: ArrowDownCircleIcon,
                },
              ],
            },
          ],
        },
        {
          name: t("common:menu:sales:marketing:name"),
          href: "/sd",
          image: "/img/ventas/marketing.png",
          iconShortBar: MegaphoneIcon,
        },
      ],
    },
    {
      name: t("common:menu:control:name"),
      icon: ChevronRightIcon,
      current: false,
      href: "/control",
      iconShortBar: WalletIcon,
      children: [
        {
          name: t("common:menu:control:portfolio:name"),
          href: "/control/portafolio",
          image: "/img/cobranza/portafolio.png",
          iconShortBar: GlobeAltIcon,
          children: [
            {
              name: t("common:menu:control:portfolio:control"),
              href: "/control/portafolio/control",
              image: "/img/cobranza/cobranzasub.png",
              iconShortBar: GlobeAltIcon,
            },
            {
              name: t("common:menu:control:portfolio:receipts"),
              href: "/control/portafolio/receipts",
              image: "/img/cobranza/recibos.png",
              iconShortBar: GlobeAltIcon,
            }
          ]
        }
      ],
    },
    {
      name: t("common:menu:services:name"),
      icon: ChevronRightIcon,
      current: false,
      href: "/services",
      iconShortBar: PuzzlePieceIcon,
      children: [
        {
          name: t("common:menu:services:automations"),
          href: "/sd",
          image: "/img/services/automatizaciones.png",
          iconShortBar: GlobeAltIcon,
        },
        {
          name: t("common:menu:services:funnels"),
          href: "/sd",
          image: "/img/services/embudos.png",
          iconShortBar: FunnelIcon,
        },
        {
          name: t("common:menu:services:soport"),
          href: "/sd",
          image: "/img/services/soporte.png",
          iconShortBar: ChatBubbleOvalLeftEllipsisIcon,
        },
        {
          name: t("common:menu:services:trash"),
          href: "/sd",
          image: "/img/services/papelera.png",
          iconShortBar: TrashIcon,
        },
        {
          name: t("common:menu:services:logs"),
          href: "/sd",
          image: "/img/services/logs.png",
          iconShortBar: ShieldCheckIcon,
        },
        {
          name: t("common:menu:services:academy"),
          href: "/sd",
          image: "/img/services/academia.png",
          iconShortBar: AcademicCapIcon,
        },
      ],
    },
    {
      name: t("common:menu:agent-management:name"),
      href: "/",
      icon: ChevronRightIcon,
      current: false,
      iconShortBar: IdentificationIcon,
      children: [
        {
          name: t("common:menu:agent-management:recruitement"),
          href: "/sd",
          iconShortBar: UserPlusIcon,
        },
        {
          name: t("common:menu:agent-management:capacitations"),
          href: "/sd",
          iconShortBar: NewspaperIcon,
        },
        {
          name: t("common:menu:agent-management:conections"),
          href: "/sd",
          iconShortBar: ArrowPathIcon,
        },
        {
          name: t("common:menu:agent-management:development-agents"),
          href: "/sd",
          iconShortBar: SparklesIcon,
        },
        {
          name: t("common:menu:agent-management:learning"),
          href: "/sd",
          iconShortBar: ArrowDownCircleIcon,
        },
      ],
    },
    {
      name: t("common:menu:companies:name"),
      href: "/",
      icon: ChevronRightIcon,
      current: false,
      iconShortBar: BuildingOfficeIcon,
      children: [
        {
          name: t("common:menu:companies:gnp"),
          href: "/sd",
          iconShortBar: ArrowDownCircleIcon,
        },
        {
          name: t("common:menu:companies:axxa"),
          href: "/sd",
          iconShortBar: ArrowDownCircleIcon,
        },
        {
          name: t("common:menu:companies:banorte"),
          href: "/sd",
          iconShortBar: ArrowDownCircleIcon,
        },
        {
          name: t("common:menu:companies:atlas"),
          href: "/sd",
          iconShortBar: ArrowDownCircleIcon,
        },
        {
          name: t("common:menu:companies:zurich"),
          href: "/sd",
          iconShortBar: ArrowDownCircleIcon,
        },
        {
          name: t("common:menu:companies:qualitas"),
          href: "/sd",
          iconShortBar: ArrowDownCircleIcon,
        },
        {
          name: t("common:menu:companies:afirme"),
          href: "/sd",
          iconShortBar: ArrowDownCircleIcon,
        },
        {
          name: t("common:menu:companies:others"),
          href: "/sd",
          iconShortBar: ArrowDownCircleIcon,
        },
      ],
    },
    {
      name: t("common:menu:settings:name"),
      href: "/settings",
      icon: ChevronRightIcon,
      current: false,
      iconShortBar: ArrowDownCircleIcon,
      children: [
        {
          name: t("common:menu:settings:permissions"),
          href: "/settings/permissions",
          iconShortBar: ArrowDownCircleIcon,
          image: "/img/settings/permissions.png",
          children: [
            {
              name: t("common:menu:settings:invite"),
              href: "/settings/invite",
              image: "/img/settings/invitar.png",
              iconShortBar: ArchiveBoxIcon,
            },
            {
              name: t("common:menu:settings:user-list"),
              href: "/settings/permissions/users",
              image: "/img/settings/listausuarios.png",
              iconShortBar: BookOpenIcon,
            },
            {
              name: t("common:menu:settings:other-notifications"),
              href: "/settings/othernotifications",
              image: "/img/settings/otrasnotificaciones.png",
              iconShortBar: InboxArrowDownIcon,
            },
          ]
        },
        // {
        //   name: t("common:menu:settings:password"),
        //   href: "/sd",
        //   iconShortBar: ArrowDownCircleIcon,
        // },
        {
          name: t("common:menu:settings:others"),
          href: "/settings/others",
          iconShortBar: ArrowDownCircleIcon,
          image: "/img/settings/others.png",
          children: [
            {
              name: t("common:menu:settings:subscriptions"),
              href: "/settings/subscriptions",
              image: "/img/settings/subscriptions.png",
              iconShortBar: ArchiveBoxIcon,
            },
            {
              name: t("common:menu:settings:other-settings"),
              href: "/settings/othersettings",
              image: "/img/settings/othersettings.png",
              iconShortBar: BookOpenIcon,
            },
            {
              name: t("common:menu:settings:change-password"),
              href: "/settings/mails/changepassword",
              image: "/img/settings/changepassword.png",
              iconShortBar: InboxArrowDownIcon,
            },
          ]
        },
      ],
    },
  ];

  return {
    sidebarNavigation,
  };
};

export const useCommon = () => {
  const { t } = useTranslation();
  const calendarViews = [
    t("tools:calendar:day"),
    t("tools:calendar:week"),
    t("tools:calendar:month"),
    t("tools:calendar:program"),
  ];
  const createdDate = [
    {
      id: 1,
      name: t("common:date:yesterday"),
    },
    {
      id: 2,
      name: t("common:date:today"),
    },
    {
      id: 3,
      name: t("common:date:tomorrow"),
    },
    {
      id: 4,
      name: t("common:date:thisWeek"),
    },
    {
      id: 5,
      name: t("common:date:thisMonth"),
    },
    {
      id: 6,
      name: t("common:date:currentQuarter"),
    },
    {
      id: 7,
      name: t("common:date:last7Days"),
    },
    {
      id: 8,
      name: t("common:date:last30Days"),
    },
    {
      id: 9,
      name: t("common:date:last60Days"),
    },
    {
      id: 10,
      name: t("common:date:last90Days"),
    },
    {
      id: 11,
      name: t("common:date:lastNDays"),
      date: "input",
    },
    {
      id: 12,
      name: t("common:date:nextNDays"),
      date: "input",
    },
    {
      id: 13,
      name: t("common:date:month"),
      date: "month",
    },
    {
      id: 14,
      name: t("common:date:quarter"),
      date: "quarter",
    },
    {
      id: 15,
      name: t("common:date:year"),
      date: "year",
    },
    {
      id: 16,
      name: t("common:date:exactDate"),
      date: "exactDate",
    },
    {
      id: 17,
      name: t("common:date:lastWeek"),
    },
    {
      id: 18,
      name: t("common:date:lastMonth"),
    },
    {
      id: 19,
      name: t("common:date:dateRange"),
      date: "range",
    },
    {
      id: 20,
      name: t("common:date:nextWeek"),
    },
    {
      id: 21,
      name: t("common:date:nextMonth"),
    },
  ];

  const trashContact = [
    {
      value: 0,
      name: t("contacts:header:delete:remove"),
      icon: XMarkIcon,
      onclick: () => { },
    },
    {
      value: 1,
      icon: TrashIcon,
      name: t("contacts:header:delete:trash"),
      onclick: () => { },
    },
  ];

  const trashLead = [
    {
      value: 0,
      name: t("leads:header:delete:remove"),
      icon: XMarkIcon,
      onclick: () => { },
    },
    {
      value: 1,
      icon: TrashIcon,
      name: t("leads:header:delete:trash"),
      onclick: () => { },
    },
  ];

  const settingsContact = [
    {
      value: 0,
      name: t("contacts:header:settings:vcard"),
      onclick: () => { },
      disabled: true,
    },
    {
      value: 1,
      name: t("contacts:header:settings:gmail"),
      onclick: () => { },
      disabled: true,
    },
    {
      value: 2,
      name: t("contacts:header:settings:outlook"),
      onclick: () => { },
      disabled: true,
    },
    {
      value: 3,
      name: t("contacts:header:settings:yahoo"),
      onclick: () => { },
      disabled: true,
    },
    {
      value: 4,
      name: t("contacts:header:settings:import"),
      onclick: () => { },
      disabled: false,
    },
    {
      value: 5,
      name: t("contacts:header:settings:crm"),
      onclick: () => { },
      disabled: true,
    },
    {
      value: 6,
      name: t("contacts:header:settings:csv"),
      onclick: () => { },
      disabled: false,
    },
    {
      value: 7,
      name: t("contacts:header:settings:excel"),
      onclick: () => { },
      disabled: false,
    },
    {
      value: 8,
      name: t("contacts:header:settings:export"),
      onclick: () => { },
      disabled: true,
    },
    {
      value: 9,
      name: t("contacts:header:settings:control"),
      onclick: () => { },
      disabled: false,
    },
    {
      value: 10,
      name: t("contacts:header:settings:search"),
      onclick: () => { },
      disabled: false,
    },
    {
      value: 11,
      name: t("contacts:header:settings:entity"),
      onclick: () => { },
      disabled: false,
    },
  ];

  const settingsPolicies = [
    {
      value: 0,
      name: t("contacts:header:excel:export"),
      icon: RiFileExcel2Fill,
      onclick: () => { },
    },
    {
      value: 1,
      icon: RiFileExcel2Fill,
      name: t("contacts:header:excel:print"),
      onclick: () => { },
    },
  ];

  const settingsPolicy = [
    {
      value: 0,
      name: t("contacts:edit:policies:consult:settings:download"),
      icon: ArrowDownTrayIcon,
      onclick: () => { },
    },
    {
      value: 1,
      icon: DocumentTextIcon,
      name: t("contacts:edit:policies:consult:settings:print"),
      onclick: () => { },
    },
  ];

  const settingsLead = [
    {
      value: 0,
      name: t("leads:header:excel:alone"),
      icon: RiFileExcel2Fill,
      onclick: () => { },
    },
    {
      value: 0,
      name: t("leads:header:excel:all"),
      icon: RiFileExcel2Fill,
      onclick: () => { },
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
    settingsPolicies,
    months,
    settingsPolicy,
    settingsLead,
    statusLead,
    stagesLead,
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
      row: "name",
      order: "name",
      check: true,
      link: true,
      permanent: true,
      photo: true,
    },
    {
      id: 2,
      name: t("leads:table:stages"),
      row: "stages",
      order: "stages.name",
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
      row: "origin",
      order: "origin",
      check: false,
    },
    {
      id: 5,
      name: t("leads:table:activities"),
      row: "activities",
      check: false,
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
      onclick: () => { },
    },
    {
      value: 0,
      name: t("tools:tasks:header:excel:all"),
      icon: RiFileExcel2Fill,
      onclick: () => { },
    },
  ];
  const optionsTrash = [
    {
      value: 0,
      name: t("tools:tasks:header:delete:remove"),
      icon: XMarkIcon,
      onclick: () => { },
    },
    {
      value: 1,
      icon: TrashIcon,
      name: t("tools:tasks:header:delete:trash"),
      onclick: () => { },
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
      id: 3,
      name: t("tools:tasks:table:contact"),
      row: "contact",
      check: true,
    },
    {
      id: 4,
      name: t("tools:tasks:table:policy"),
      row: "policy",
      check: true,
    },
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
  ];

  const settings = [
    {
      value: 0,
      name: t("tools:tasks:new:download"),
      onclick: () => { },
      icon: ArrowDownTrayIcon,
    },
    {
      value: 0,
      name: t("tools:tasks:new:print"),
      onclick: () => { },
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