import { PlusIcon } from "@heroicons/react/20/solid";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export default function PolizasEmpty() {
  const { t } = useTranslation();
  return (
    <div className="text-center">
      <DocumentPlusIcon
        className="mx-auto h-12 w-12 text-gray-400"
        aria-hidden="true"
      />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">
        {t("contacts:edit:policies:table:empty:not-policies")}
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        {t("contacts:edit:policies:table:empty:register")}
      </p>
    </div>
  );
}
