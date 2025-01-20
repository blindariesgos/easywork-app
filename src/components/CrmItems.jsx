"use client";
import Link from "next/link";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { getCrmTypeConfig } from "@/src/utils/crmTypes";
const CrmItems = ({ conections }) => {
  const { t } = useTranslation();

  const getCMRTag = (data, key) => {
    if (!data || !data.type || !data.crmEntity) return null;

    const typeConfig = getCrmTypeConfig(data);
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
