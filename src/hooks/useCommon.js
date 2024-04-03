import {
    ChevronRightIcon
} from "@heroicons/react/20/solid";
import {
    useTranslation
} from "react-i18next";

export const useSidebar = () => {
    const { t } = useTranslation();

    const sidebarNavigation = [{
            name: t("common:menu:tools:name"),
            href: "#",
            icon: ChevronRightIcon,
            current: true,
            children: [{
                    name: t("common:menu:tools:drive"),
                    href: "/tools/drive"
                },
                {
                    name: t("common:menu:tools:tasks"),
                    href: "/tools/task"
                },
                {
                    name: t("common:menu:tools:email"),
                    href: "/tools/webmail"
                },
                {
                    name: t("common:menu:tools:calendar"),
                    href: "/tools/calendar"
                },
            ],
        },
        {
            name: t("common:menu:sales:name"),
            icon: ChevronRightIcon,
            current: false,
            children: [{
                    name: t("common:menu:sales:crm:name"),
                    href: "#",
                    children: [{
                            name: t("common:menu:sales:crm:contacts"),
                            href: "/sales/crm/contacts"
                        },
                        {
                            name: t("common:menu:sales:crm:prospects"),
                            href: "/sales/crm/leads"
                        },
                    ],
                },
                {
                    name: t("common:menu:sales:reports:name"),
                    href: "#",
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
                    href: "#"
                },
                {
                    name: t("common:menu:sales:control:name"),
                    href: "#"
                },
            ],
        },
        {
            name: t("common:menu:services:name"),
            icon: ChevronRightIcon,
            current: false,
            children: [{
                    name: t("common:menu:services:automations"),
                    href: "#"
                },
                {
                    name: t("common:menu:services:funnels"),
                    href: "#"
                },
                {
                    name: t("common:menu:services:soport"),
                    href: "#"
                },
                {
                    name: t("common:menu:services:trash"),
                    href: "#"
                },
                {
                    name: t("common:menu:services:logs"),
                    href: "#"
                },
                {
                    name: t("common:menu:services:academy"),
                    href: "#"
                },
            ],
        },
        {
            name: t("common:menu:agent-management:name"),
            href: "#",
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
            href: "#",
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
            href: "#",
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
    const { t } = useTranslation();
    const calendarViews = [t('tools:calendar:day'), t('tools:calendar:week'), t('tools:calendar:month'), t('tools:calendar:program')];
    return { calendarViews}
}