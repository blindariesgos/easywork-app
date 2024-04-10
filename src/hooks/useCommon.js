import {
    ChevronRightIcon
} from "@heroicons/react/20/solid";
import {
    useTranslation
} from "react-i18next";

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
                    href: "/tools/webmail",
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
                            href: "/sales/crm/leads",
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
            name: t('contacts:filters:date:yesterday')
        },
        {
            id: 2,
            name: t('contacts:filters:date:today')
        },
        {
            id: 3,
            name: t('contacts:filters:date:tomorrow')
        },
        {
            id: 4,
            name: t('contacts:filters:date:thisWeek')
        },
        {
            id: 5,
            name: t('contacts:filters:date:thisMonth')
        },
        {
            id: 6,
            name: t('contacts:filters:date:currentQuarter')
        },
        {
            id: 7,
            name: t('contacts:filters:date:last7Days')
        },
        {
            id: 8,
            name: t('contacts:filters:date:last30Days')
        },
        {
            id: 9,
            name: t('contacts:filters:date:last60Days')
        },
        {
            id: 10,
            name: t('contacts:filters:date:last90Days')
        },
        {
            id: 11,
            name: t('contacts:filters:date:lastNDays'),
            date: "input"
        },
        {
            id: 12,
            name: t('contacts:filters:date:nextNDays'),
            date: "input"
        },
        {
            id: 13,
            name: t('contacts:filters:date:month'),
            date: "month"
        },
        {
            id: 14,
            name: t('contacts:filters:date:quarter'),
            date: "quarter"
        }, 
        {
            id: 15,
            name: t('contacts:filters:date:year'),
            date: "year"
        },
        {
            id: 16,
            name: t('contacts:filters:date:exactDate'),            
            date: "exactDate"
        },
        {
            id: 17,
            name: t('contacts:filters:date:lastWeek')
        },
        {
            id: 18,
            name: t('contacts:filters:date:lastMonth')
        },
        {
            id: 19,
            name: t('contacts:filters:date:dateRange'),      
            date: "range"
        },
        {
            id: 20,
            name: t('contacts:filters:date:nextWeek')
        },
        {
            id: 21,
            name: t('contacts:filters:date:nextMonth')
        }
    ];
    
    const ramo = [
        { id: 1, name: t("contacts:policies:ramo") },
        { id: 2, name: t("contacts:policies:life") },
        { id: 3, name: t("contacts:policies:health") },
        { id: 4, name: t("contacts:policies:medical-expenses") },
        { id: 5, name: t("contacts:policies:damages") },
        { id: 6, name: t("contacts:policies:various") }
    ]
    return {
        calendarViews,
        createdDate,
        ramo
    }
}