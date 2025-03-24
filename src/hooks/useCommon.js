"use client";
import {
  ArrowDownTrayIcon,
  DocumentTextIcon,
  XMarkIcon,
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
import { useMemo, useEffect } from "react";
import { getFullMenuStructure } from "../config/menuStructure";
import { encodeToModal } from "../utils/formatters";
import {
  codesToPaths,
  inferParentPermissions,
} from "../utils/permissionMapping";

export const useSidebar = () => {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const [sidebarItems, setSidebarItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Memorizar la estructura completa del menú (solo se recalcula cuando cambia el idioma)
  const fullMenuStructure = useMemo(() => getFullMenuStructure(t), [t]);

  // Memorizar los permisos expandidos (solo se recalcula cuando cambia la sesión)
  const permissionPaths = useMemo(() => {
    if (!session?.user?.roles?.[0]?.menuPermissions) return [];

    const permissionCodes = session.user.roles[0].menuPermissions;
    const expandedCodes = inferParentPermissions(permissionCodes);
    return codesToPaths(expandedCodes);
  }, [session?.user?.roles?.[0]?.menuPermissions]);

  // Filtrar el menú según los permisos (solo se recalcula cuando cambian los permisos o la estructura)
  useEffect(() => {
    setLoading(true);
    try {
      const filtered = filterMenuByPermissions(
        fullMenuStructure,
        permissionPaths
      );
      setSidebarItems(filtered);
    } catch (error) {
      console.error("Error filtering menu:", error);
      setSidebarItems([]);
    } finally {
      setLoading(false);
    }
  }, [fullMenuStructure, permissionPaths]);

  // Filtrar menú según permisos
  const filterMenuByPermissions = (menuItems, permissionPaths) => {
    return menuItems
      .filter((item) => permissionPaths.includes(item.id))
      .map((item) => {
        // Si tiene hijos, aplicar el filtro recursivamente
        if (item.children) {
          return {
            ...item,
            children: filterMenuByPermissions(item.children, permissionPaths),
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

  return {
    sidebarNavigation: sidebarItems,
    isLoadingSidebar: loading,
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
      onClick: () => {
        const a = encodeToModal({
          type: "contact-duplicate",
          id: "131212414144141414",
        });
        console.log({ a });
      },
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

export const useUserActivitiesTable = () => {
  const { t } = useTranslation();
  const columnTable = [
    {
      id: 2,
      name: t("users:activities:name"),
      row: "type",
      check: true,
    },
    {
      id: 1,
      name: t("users:activities:title"),
      row: "name",
      check: true,
    },
    {
      id: 1,
      name: t("users:activities:description"),
      row: "description",
      check: true,
    },
    {
      id: 3,
      name: t("users:activities:lastUpdate"),
      row: "updatedAt",
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
      order: "title",
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
      row: "contact",
      check: true,
    },
    {
      id: 7,
      name: t("operations:claims:table:created-in"),
      row: "createdAt",
      order: "createdAt",
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
      row: "developmentManager",
      order: "developmentManager",
      check: true,
    },
    {
      id: 3,
      name: t("agentsmanagement:meetings-and-sessions:table:conexions"),
      row: "crm",
      order: "crm",
      check: true,
      photo: true,
    },
    {
      id: 7,
      name: t("agentsmanagement:meetings-and-sessions:table:time"),
      row: "duration",
      order: "duration",
      check: true,
    },
    {
      id: 8,
      name: t("agentsmanagement:meetings-and-sessions:table:date"),
      row: "startTime",
      order: "startTime",
      check: true,
    },
    {
      id: 8,
      name: t("agentsmanagement:meetings-and-sessions:table:revision"),
      row: "assignments",
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
      row: "developmentManager",
      order: "developmentManager",
      check: true,
    },
    {
      id: 3,
      name: t("agentsmanagement:meetings-and-sessions:table:conexions"),
      row: "crm",
      order: "crm",
      check: true,
    },
    {
      id: 7,
      name: t("agentsmanagement:meetings-and-sessions:table:time"),
      row: "duration",
      order: "duration",
      check: true,
    },
    {
      id: 8,
      name: t("agentsmanagement:meetings-and-sessions:table:date"),
      row: "startTime",
      order: "startTime",
      check: true,
    },
    {
      id: 8,
      name: t("agentsmanagement:meetings-and-sessions:table:revision"),
      row: "assignments",
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
      id: 8,
      name: t("agentsmanagement:accompaniments:table:created-in"),
      row: "createdAt",
      order: "createdAt",
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
      id: 7,
      name: t("agentsmanagement:recruitment:table:indate"),
      row: "entryDate",
      order: "entryDate",
      check: true,
    },
    {
      id: 3,
      name: t("agentsmanagement:recruitment:table:initdate"),
      row: "startDate",
      order: "startDate",
      check: true,
      photo: true,
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

export const useConectionsTable = () => {
  const { t } = useTranslation();
  const columnTable = [
    {
      id: 4,
      name: t("agentsmanagement:conections:table:agent"),
      row: "name",
      order: "name",
      check: true,
    },
    {
      id: 2,
      name: t("agentsmanagement:conections:table:state"),
      row: "stage",
      order: "stage",
      check: true,
    },

    {
      id: 8,
      name: t("agentsmanagement:conections:table:proccess"),
      row: "proccess",
      check: true,
    },
    {
      id: 7,
      name: t("agentsmanagement:accompaniments:agent:manager"),
      row: "manager",
      order: "manager",
      check: true,
    },
    {
      id: 3,
      name: t("agentsmanagement:conections:table:initdate"),
      row: "initdate",
      order: "date",
      check: true,
      photo: true,
    },
    {
      id: 7,
      name: t("agentsmanagement:conections:table:indate"),
      row: "cnsfDate",
      order: "cnsfDate",
      check: true,
    },
    {
      id: 8,
      name: t("agentsmanagement:conections:table:activity"),
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
      row: "contact",
      order: "contact",
      check: true,
    },
    {
      id: 7,
      name: t("operations:refunds:table:created-in"),
      row: "createdAt",
      order: "createdAt",
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
      row: "client",
      order: "client",
      check: true,
    },
    {
      id: 7,
      name: t("operations:programations:table:created-in"),
      row: "createdAt",
      order: "createdAt",
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
      check: true,
    },
    {
      id: 7,
      name: t("operations:fundrecovery:table:contact"),
      row: "contact",
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
