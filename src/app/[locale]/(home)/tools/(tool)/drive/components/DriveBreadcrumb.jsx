import useDriveContext from "@/src/context/drive";
import { HomeIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { FiHardDrive } from "react-icons/fi";

export default function DriveBreadcrumb() {
  const { t } = useTranslation();
  const { pages, returnFolder, externalFolderInfo } = useDriveContext();
  const route = useRouter();

  return (
    <nav className="flex ml-3" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center gap-x-2">
        <li>
          <div
            className={clsx("text-gray-400  flex gap-2", {
              "hover:text-gray-500 cursor-pointer":
                pages.length > 0 || externalFolderInfo,
            })}
            onClick={() => {
              if (pages.length > 0) returnFolder(-1);
              if (externalFolderInfo) route.back();
            }}
          >
            <FiHardDrive className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
          </div>
        </li>
        {externalFolderInfo && (
          <li>
            <div
              className={clsx("text-gray-400  flex gap-2", {
                "hover:text-gray-500 cursor-pointer": pages.length > 0,
              })}
              onClick={() => {
                if (pages.length > 0) returnFolder(-1);
              }}
            >
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 flex-shrink-0 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <p className="text-sm font-medium text-gray-400 whitespace-nowrap text-ellipsis overflow-hidden max-w-[160px]">
                  {externalFolderInfo.name}
                </p>
              </div>
            </div>
          </li>
        )}
        {pages.length > 0 &&
          pages.map((page, index) => (
            <li key={page.id}>
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 flex-shrink-0 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <p
                  className={clsx(
                    "text-sm font-medium text-gray-400 whitespace-nowrap text-ellipsis overflow-hidden max-w-[160px]",
                    {
                      "hover:text-gray-700 cursor-pointer":
                        index < pages.length - 1,
                    }
                  )}
                  onClick={() =>
                    index < pages.length - 1 && returnFolder(index)
                  }
                  title={page.name}
                >
                  {page.name}
                </p>
              </div>
            </li>
          ))}
      </ol>
    </nav>
  );
}
