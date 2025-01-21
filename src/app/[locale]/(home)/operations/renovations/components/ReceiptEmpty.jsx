import { PlusIcon } from "@heroicons/react/20/solid";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export default function PolizasEmpty({ type }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col justify-center items-center h-[400px]">
      <DocumentPlusIcon
        className="mx-auto h-12 w-12 text-gray-400"
        aria-hidden="true"
      />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">
        No hay {type}
      </h3>
    </div>
  );
}
