import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useTranslation } from "react-i18next";



function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function CreateEventButton() {
  const { t } = useTranslation();
  const items = [
    { name: t('tools:calendar:event'), href: "#evento" },
    { name: t('tools:calendar:task'), href: "#tarea" },
  ];
  return (
    <div className="md:inline-flex rounded-md shadow-sm hidden">
      <Link
        href="/tools/calendar/event"
        className="relative inline-flex items-center rounded-l-md bg-primary px-3 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-indigo-600 hover:bg-indigo-500 focus:z-10"
      >
        {t('tools:calendar:create')}
      </Link>

      <Menu as="div" className="relative -ml-px block">
        <Menu.Button className="relative inline-flex items-center rounded-r-md bg-primary px-2 py-2 text-white ring-1 ring-inset ring-indigo-600 hover:bg-indigo-500 focus:z-10">
          <span className="sr-only">{t('tools:calendar:open')}</span>
          <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 -mr-1 mt-2 w-28 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {items.map((item) => (
                <Menu.Item key={item.name}>
                  {({ active }) => (
                    <Link
                      href={item.href}
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      {item.name}
                    </Link>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
