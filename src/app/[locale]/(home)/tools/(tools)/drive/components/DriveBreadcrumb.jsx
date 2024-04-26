import { HomeIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import { FiHardDrive } from "react-icons/fi";



export default function DriveBreadcrumb() {
  const { t } = useTranslation();
  const pages = [
    { name: t('tools:drive:my-unit'), href: "#", current: false },
    { name: "Rosmer Campos", href: "#", current: true },
  ];
  return (
    <nav className="flex ml-3" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <div>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <FiHardDrive
                className="h-5 w-5 flex-shrink-0"
                aria-hidden="true"
              />
              <span className="sr-only">{t('tools:drive:home')}</span>
            </a>
          </div>
        </li>
        {pages.map((page) => (
          <li key={page.name}>
            <div className="flex items-center">
              <svg
                className="h-5 w-5 flex-shrink-0 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
              <a
                href={page.href}
                className="ml-4 text-sm font-medium text-gray-400 hover:text-gray-700"
                aria-current={page.current ? "page" : undefined}
              >
                {page.name}
              </a>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
