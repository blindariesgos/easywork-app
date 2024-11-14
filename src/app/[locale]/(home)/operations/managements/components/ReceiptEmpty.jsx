import { PlusIcon } from "@heroicons/react/20/solid";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export default function PolizasEmpty({ add }) {
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
      {!add && (
        <div className="mt-6">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-easy-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-easy-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-easy-600"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            {t("contacts:edit:policies:table:empty:new")}
          </button>
        </div>
      )}
    </div>
  );
}
