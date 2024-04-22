import {
    ArrowDownTrayIcon,
    ChevronRightIcon,
    DocumentTextIcon,
    XMarkIcon
} from "@heroicons/react/20/solid";
import {
    useTranslation
} from "react-i18next";
import {
    TrashIcon
} from '@heroicons/react/24/outline';
import {
    RiFileExcel2Fill
} from "react-icons/ri";
import {
    useRouter
} from "next/navigation";
import {
    useState
} from "react";

export const useSidebar = () => {
    const {
        t
    } = useTranslation();

    const sidebarNavigation = [{
            name: t("common:menu:tools:name"),
            href: "/tools",
            icon: ChevronRightIcon,
            current: true,
            children: [{
                    name: t("common:menu:tools:drive"),
                    href: "/tools/drive",
                    image: '/img/herramientas/drive.png'
                },
                {
                    name: t("common:menu:tools:tasks"),
                    href: "/tools/task",
                    image: '/img/herramientas/tareas.png'
                },
                {
                    name: t("common:menu:tools:email"),
                    href: "/tools/mails",
                    image: '/img/herramientas/correo.png'
                },
                {
                    name: t("common:menu:tools:calendar"),
                    href: "/tools/calendar",
                    image: '/img/herramientas/calendario.png'
                },
            ],
        },
        {
            name: t("common:menu:sales:name"),
            icon: ChevronRightIcon,
            current: false,
            href: "/sales",
            children: [{
                    name: t("common:menu:sales:crm:name"),
                    href: "/sales/crm",
                    image: '/img/ventas/crm.png',
                    children: [{
                            name: t("common:menu:sales:crm:contacts"),
                            href: "/sales/crm/contacts?page=1",
                            image: '/img/crm/contacto.png'
                        },
                        {
                            name: t("common:menu:sales:crm:prospects"),
                            href: "/sales/crm/leads?page=1",
                            image: '/img/crm/prospecto.png'
                        },
                    ],
                },
                {
                    name: t("common:menu:sales:reports:name"),
                    href: "/sales/report",
                    image: '/img/ventas/reportes.png',
                    children: [{
                            name: t("common:menu:sales:reports:activities"),
                            href: "/sales/report/activities"
                        },
                        {
                            name: t("common:menu:sales:reports:history"),
                            href: "/sales/report/history"
                        },
                        {
                            name: t("common:menu:sales:reports:reports"),
                            href: "/sales/report/reports"
                        },
                        {
                            name: t("common:menu:sales:reports:agent"),
                            href: "#",
                            children: [{
                                name: "Embudo de ventas sin conversión",
                                href: "/sales/report/agentperformance/noconv"
                            }]
                        },
                    ],
                },
                {
                    name: t("common:menu:sales:marketing:name"),
                    href: "#",
                    image: '/img/ventas/marketing.png',
                },
                {
                    name: t("common:menu:sales:control:name"),
                    href: "#",
                    image: '/img/ventas/cobranza.png',
                },
            ],
        },
        {
            name: t("common:menu:services:name"),
            icon: ChevronRightIcon,
            current: false,
            href: "/services",
            children: [{
                    name: t("common:menu:services:automations"),
                    href: "#",
                    image: '/img/services/automatizaciones.png'
                },
                {
                    name: t("common:menu:services:funnels"),
                    href: "#",
                    image: '/img/services/embudos.png'
                },
                {
                    name: t("common:menu:services:soport"),
                    href: "#",
                    image: '/img/services/soporte.png'
                },
                {
                    name: t("common:menu:services:trash"),
                    href: "#",
                    image: '/img/services/papelera.png'
                },
                {
                    name: t("common:menu:services:logs"),
                    href: "#",
                    image: '/img/services/logs.png'
                },
                {
                    name: t("common:menu:services:academy"),
                    href: "#",
                    image: '/img/services/academia.png'
                },
            ],
        },
        {
            name: t("common:menu:agent-management:name"),
            href: "/",
            icon: ChevronRightIcon,
            current: false,
            children: [{
                    name: t("common:menu:agent-management:recruitement"),
                    href: "#"
                },
                {
                    name: t("common:menu:agent-management:capacitations"),
                    href: "#"
                },
                {
                    name: t("common:menu:agent-management:conections"),
                    href: "#"
                },
                {
                    name: t("common:menu:agent-management:development-agents"),
                    href: "#"
                },
                {
                    name: t("common:menu:agent-management:learning"),
                    href: "#"
                },
            ],
        },
        {
            name: t("common:menu:companies:name"),
            href: "/",
            icon: ChevronRightIcon,
            current: false,
            children: [{
                    name: t("common:menu:companies:gnp"),
                    href: "#"
                },
                {
                    name: t("common:menu:companies:axxa"),
                    href: "#"
                },
                {
                    name: t("common:menu:companies:banorte"),
                    href: "#"
                },
                {
                    name: t("common:menu:companies:atlas"),
                    href: "#"
                },
                {
                    name: t("common:menu:companies:zurich"),
                    href: "#"
                },
                {
                    name: t("common:menu:companies:qualitas"),
                    href: "#"
                },
                {
                    name: t("common:menu:companies:afirme"),
                    href: "#"
                },
                {
                    name: t("common:menu:companies:others"),
                    href: "#"
                },
            ],
        },
        {
            name: t("common:menu:settings:name"),
            href: "/",
            icon: ChevronRightIcon,
            current: false,
            children: [{
                    name: t("common:menu:settings:permissions"),
                    href: "#"
                },
                {
                    name: t("common:menu:settings:password"),
                    href: "#"
                },
                {
                    name: t("common:menu:settings:others"),
                    href: "#"
                },
            ],
        },
    ];

    return {
        sidebarNavigation
    }
}

export const useCommon = () => {
    const {
        t
    } = useTranslation();
    const calendarViews = [t('tools:calendar:day'), t('tools:calendar:week'), t('tools:calendar:month'), t('tools:calendar:program')];
    const createdDate = [

        {
            id: 1,
            name: t('common:date:yesterday')
        },
        {
            id: 2,
            name: t('common:date:today')
        },
        {
            id: 3,
            name: t('common:date:tomorrow')
        },
        {
            id: 4,
            name: t('common:date:thisWeek')
        },
        {
            id: 5,
            name: t('common:date:thisMonth')
        },
        {
            id: 6,
            name: t('common:date:currentQuarter')
        },
        {
            id: 7,
            name: t('common:date:last7Days')
        },
        {
            id: 8,
            name: t('common:date:last30Days')
        },
        {
            id: 9,
            name: t('common:date:last60Days')
        },
        {
            id: 10,
            name: t('common:date:last90Days')
        },
        {
            id: 11,
            name: t('common:date:lastNDays'),
            date: "input"
        },
        {
            id: 12,
            name: t('common:date:nextNDays'),
            date: "input"
        },
        {
            id: 13,
            name: t('common:date:month'),
            date: "month"
        },
        {
            id: 14,
            name: t('common:date:quarter'),
            date: "quarter"
        },
        {
            id: 15,
            name: t('common:date:year'),
            date: "year"
        },
        {
            id: 16,
            name: t('common:date:exactDate'),
            date: "exactDate"
        },
        {
            id: 17,
            name: t('common:date:lastWeek')
        },
        {
            id: 18,
            name: t('common:date:lastMonth')
        },
        {
            id: 19,
            name: t('common:date:dateRange'),
            date: "range"
        },
        {
            id: 20,
            name: t('common:date:nextWeek')
        },
        {
            id: 21,
            name: t('common:date:nextMonth')
        }
    ];

    const trashContact = [{
            value: 0,
            name: t('contacts:header:delete:remove'),
            icon: XMarkIcon,
            onclick: () => {}
        },
        {
            value: 1,
            icon: TrashIcon,
            name: t('contacts:header:delete:trash'),
            onclick: () => {}
        }
    ];

    const trashLead = [{
            value: 0,
            name: t('leads:header:delete:remove'),
            icon: XMarkIcon,
            onclick: () => {}
        },
        {
            value: 1,
            icon: TrashIcon,
            name: t('leads:header:delete:trash'),
            onclick: () => {}
        }
    ];

    const settingsContact = [{
            value: 0,
            name: t('contacts:header:settings:vcard'),
            onclick: () => {}
        },
        {
            value: 1,
            name: t('contacts:header:settings:gmail'),
            onclick: () => {}
        },
        {
            value: 2,
            name: t('contacts:header:settings:outlook'),
            onclick: () => {}
        },
        {
            value: 3,
            name: t('contacts:header:settings:yahoo'),
            onclick: () => {}
        },
        {
            value: 4,
            name: t('contacts:header:settings:import'),
            onclick: () => {}
        },
        {
            value: 5,
            name: t('contacts:header:settings:crm'),
            onclick: () => {}
        },
        {
            value: 6,
            name: t('contacts:header:settings:csv'),
            onclick: () => {}
        },
        {
            value: 7,
            name: t('contacts:header:settings:excel'),
            onclick: () => {}
        },
        {
            value: 8,
            name: t('contacts:header:settings:export'),
            onclick: () => {}
        },
        {
            value: 9,
            name: t('contacts:header:settings:control'),
            onclick: () => {}
        },
        {
            value: 10,
            name: t('contacts:header:settings:search'),
            onclick: () => {}
        },
        {
            value: 11,
            name: t('contacts:header:settings:entity'),
            onclick: () => {}
        }
    ];

    const settingsPolicies = [{
            value: 0,
            name: t('contacts:header:excel:export'),
            icon: RiFileExcel2Fill,
            onclick: () => {}
        },
        {
            value: 1,
            icon: RiFileExcel2Fill,
            name: t('contacts:header:excel:print'),
            onclick: () => {}
        }
    ];

    const settingsPolicy = [{
            value: 0,
            name: t('contacts:edit:policies:consult:settings:download'),
            icon: ArrowDownTrayIcon,
            onclick: () => {}
        },
        {
            value: 1,
            icon: DocumentTextIcon,
            name: t('contacts:edit:policies:consult:settings:print'),
            onclick: () => {}
        }
    ];

    const settingsLead = [{
            value: 0,
            name: t('leads:header:excel:alone'),
            icon: RiFileExcel2Fill,
            onclick: () => {}
        },
        {
            value: 0,
            name: t('leads:header:excel:all'),
            icon: RiFileExcel2Fill,
            onclick: () => {}
        },
    ];

    const months = [
        t('common:months:january'),
        t('common:months:february'),
        t('common:months:march'),
        t('common:months:april'),
        t('common:months:may'),
        t('common:months:june'),
        t('common:months:july'),
        t('common:months:august'),
        t('common:months:september'),
        t('common:months:october'),
        t('common:months:november'),
        t('common:months:december')
    ];

    const stagesLead = [{
            id: 1,
            name: t('leads:filters:stages:initial-contact')
        },
        {
            id: 2,
            name: t('leads:filters:stages:submit-proposal')
        },
        {
            id: 3,
            name: t('leads:filters:stages:revision-proposal')
        },
        {
            id: 4,
            name: t('leads:filters:stages:process-issuance')
        },
        {
            id: 5,
            name: t('leads:filters:stages:policy-issuance')
        }
    ];

    const statusLead = [{
            id: 1,
            name: t('leads:filters:completed')
        },
        {
            id: 2,
            name: t('leads:filters:not-completed')
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
        stagesLead
    }
}

export const usePolicies = (contactID, ) => {
    const {
        push
    } = useRouter();
    const {
        t
    } = useTranslation();
    const branches = [{
            value: 0,
            name: t('contacts:policies:branches:all'),
            onclick: () => push(`/sales/crm/contacts/contact/policies/${contactID}?show=true`),
            route: `/sales/crm/contacts/contact/policies/${contactID}`,
        },
        {
            value: 1,
            name: t('contacts:policies:branches:life'),
            onclick: () => push(`/sales/crm/contacts/contact/policies/branch/life/${contactID}?show=true`),
            route: `/sales/crm/contacts/contact/policies/branch/life/${contactID}`,
        },
        {
            value: 2,
            name: t('contacts:policies:branches:cars'),
            route: `/sales/crm/contacts/contact/policies/branch/cars/${contactID}`,
            onclick: () => push(`/sales/crm/contacts/contact/policies/branch/cars/${contactID}?show=true`),
        },
        {
            value: 3,
            name: t('contacts:policies:branches:medicinal'),
            route: `/sales/crm/contacts/contact/policies/branch/medicine/${contactID}`,
            onclick: () => push(`/sales/crm/contacts/contact/policies/branch/medicine/${contactID}?show=true`),
        },
        {
            value: 4,
            name: t('contacts:policies:branches:damages'),
            route: `/sales/crm/contacts/contact/policies/branch/damages/${contactID}`,
            onclick: () => push(`/sales/crm/contacts/contact/policies/branch/damages/${contactID}?show=true`),
        },
        {
            value: 5,
            name: t('contacts:policies:branches:various'),
            route: `/sales/crm/contacts/contact/policies/branch/various/${contactID}`,
            onclick: () => push(`/sales/crm/contacts/contact/policies/branch/various/${contactID}?show=true`),
        },
        {
            value: 6,
            name: t('contacts:policies:branches:fleets'),
            inactive: true,
        },
        {
            value: 7,
            name: t('contacts:policies:branches:others'),
            inactive: true,
        }
    ];

    const policyConsult = [{
            value: 0,
            name: t('contacts:edit:policies:consult:name'),
            onclick: () => push(`/sales/crm/contacts/contact/policy/consult/${contactID}?show=true`),
            route: `/sales/crm/contacts/contact/policy/consult/${contactID}`,
        },
        {
            value: 1,
            name: t('contacts:edit:policies:consult:payments'),
            onclick: () => push(`/sales/crm/contacts/contact/policy/payments/${contactID}?show=true`),
            route: `/sales/crm/contacts/contact/policy/payments/${contactID}`,
        },
        {
            value: 2,
            name: t('contacts:edit:policies:consult:claims'),
            onclick: () => push(`/sales/crm/contacts/contact/policy/claims/${contactID}?show=true`),
            route: `/sales/crm/contacts/contact/policy/claims/${contactID}`,
        },
        {
            value: 3,
            name: t('contacts:edit:policies:consult:refund'),
            onclick: () => push(`/sales/crm/contacts/contact/policy/refunds/${contactID}?show=true`),
            route: `/sales/crm/contacts/contact/policy/refunds/${contactID}`,
        },
        {
            value: 4,
            name: t('contacts:edit:policies:consult:invoices'),
            onclick: () => push(`/sales/crm/contacts/contact/policy/invoices/${contactID}?show=true`),
            route: `/sales/crm/contacts/contact/policy/invoices/${contactID}`,
        },
        {
            value: 5,
            name: t('contacts:edit:policies:consult:versions'),
            onclick: () => push(`/sales/crm/contacts/contact/policy/versions/${contactID}?show=true`),
            route: `/sales/crm/contacts/contact/policy/versions/${contactID}`,
        },
        {
            value: 6,
            name: t('contacts:edit:policies:consult:commissions'),
            onclick: () => push(`/sales/crm/contacts/contact/policy/commissions/${contactID}?show=true`),
            route: `/sales/crm/contacts/contact/policy/commissions/${contactID}`,
        },
        {
            value: 7,
            name: t('contacts:edit:policies:consult:quotes'),
            onclick: () => push(`/sales/crm/contacts/contact/policy/quotes/${contactID}?show=true`),
            route: `/sales/crm/contacts/contact/policy/quotes/${contactID}`,
        },
        {
            value: 8,
            name: t('contacts:edit:policies:consult:schedules'),
            onclick: () => push(`/sales/crm/contacts/contact/policy/schedules/${contactID}?show=true`),
            route: `/sales/crm/contacts/contact/policy/schedules/${contactID}`,
        },
    ];

    return {
        branches,
        policyConsult
    }
}

export const useLeads = () => {
    let [isOpen, setIsOpen] = useState(false);
    const {
        t
    } = useTranslation();

    const optionsHeader = [{
            id: 1,
            name: t('leads:header:sales')
        },
        {
            id: 2,
            name: t('leads:header:activities')
        },
        {
            id: 3,
            name: t('leads:header:reports')
        },
        {
            id: 4,
            name: t('leads:header:documents')
        }
    ];

    const stages = [{
            id: 1,
            name: t('leads:lead:stages:initial-contact')
        },
        {
            id: 2,
            name: t('leads:lead:stages:submit-proposal')
        },
        {
            id: 3,
            name: t('leads:lead:stages:revision-proposal')
        },
        {
            id: 4,
            name: t('leads:lead:stages:process-issuance')
        },
        {
            id: 5,
            name: t('leads:lead:stages:policy-issuance')
        },
        {
            id: 6,
            name: t('leads:lead:stages:positive-stage'),
            onclick: () => {
                setIsOpen(true)
            }
        },
        {
            id: 7,
            name: t('leads:lead:stages:negative-stage')
        }
    ];

    return {
        optionsHeader,
        stages,
        isOpen,
        setIsOpen
    }
}

export const useTasks = () => {
    const {
        t
    } = useTranslation();
    const [status, setStatus] = useState([{
            id: 1,
            name: t('tools:tasks:filters:closed'),
            selected: false
        },
        {
            id: 2,
            name: t('tools:tasks:filters:in-progress'),
            selected: false
        },
        {
            id: 3,
            name: t('tools:tasks:filters:expirated'),
            selected: false
        },
        {
            id: 4,
            name: t('tools:tasks:filters:pending'),
            selected: false
        }
    ]);
    const optionsSettings = [{
            value: 0,
            name: t('leads:header:excel:alone'),
            icon: RiFileExcel2Fill,
            onclick: () => {}
        },
        {
            value: 0,
            name: t('leads:header:excel:all'),
            icon: RiFileExcel2Fill,
            onclick: () => {}
        },
    ]
    const optionsTrash = [{
            value: 0,
            name: t('leads:header:delete:remove'),
            icon: XMarkIcon,
            onclick: () => {}
        },
        {
            value: 1,
            icon: TrashIcon,
            name: t('leads:header:delete:trash'),
            onclick: () => {}
        }
    ];

    return {
        optionsTrash,
        optionsSettings,
        status,
        setStatus
    }
}