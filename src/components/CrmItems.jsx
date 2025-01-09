"use client";
import Link from "next/link";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";

const CrmItems = ({ conections }) => {
  const { t } = useTranslation();

  const getCMRTag = (data, key) => {
    if (!data || !data.type || !data.crmEntity) return null;

    const typeConfig = {
      contact: {
        href: `/sales/crm/contacts/contact/${data.crmEntity.id}?show=true`,
        bgClass: "bg-[#241F61] text-white",
        labelKey: "tools:tasks:edit:contact",
        name: data?.crmEntity?.fullName ?? data?.crmEntity?.name ?? "",
      },
      poliza: {
        href: `/operations/policies/policy/${data.crmEntity.id}?show=true`,
        bgClass: "bg-[#86BEDF] text-[#241F61]",
        labelKey: "tools:tasks:edit:policy",
        name:
          `${data?.crmEntity?.company?.name} ${data?.crmEntity?.poliza} ${data?.crmEntity?.type?.name}` ??
          "",
      },
      lead: {
        href: `/sales/crm/leads/lead/${data.crmEntity.id}?show=true`,
        bgClass: "bg-[#A9EA44] text-[#241F61]",
        labelKey: "tools:tasks:edit:lead",
        name: data?.crmEntity?.fullName ?? data?.crmEntity?.name ?? "",
      },
      receipt: {
        href: `/sales/crm/leads/lead/${data.crmEntity.id}?show=true`,
        bgClass: "bg-[#DFE3E6] text-[#241F61]",
        labelKey: "Recibo",
        name: data?.crmEntity?.title ?? data?.crmEntity?.name ?? "",
      },
      renewal: {
        href: `/operations/renovations/renovation/${data.crmEntity.id}?show=true`,
        bgClass: "bg-[#fff79d] text-[#241F61]",
        labelKey: "Renovación",
        name: data?.crmEntity?.name,
      },
      agent: {
        href: `/agents-management/accompaniment/agent/${data.crmEntity.id}?show=true`,
        bgClass: "bg-easy-400 text-white",
        labelKey: "Agente",
        name: data?.crmEntity?.name,
      },
    };

    const config = typeConfig[data.type];

    if (!config) return null;

    return (
      <Link
        href={config.href}
        className={`${config.bgClass} p-2 rounded-lg flex gap-2 justify-between w-full hover:shadow-[-2px_2px_5px_1px_#00000082]`}
        key={key}
      >
        <p className="text-sm ">{t(`${config.labelKey}`)}:</p>
        <p className="text-sm text-right">{config.name}</p>
      </Link>
    );
  };
  return (
    <Fragment>
      {conections.map((connection, index) =>
        getCMRTag(connection, `crm-tag-${index}`)
      )}
    </Fragment>
  );
};

export default CrmItems;
