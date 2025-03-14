import { useNotifyContext } from "@/src/context/notify";
import { BellIcon } from "@heroicons/react/20/solid";
import React from "react";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { markAllNotificationsRead } from "@/src/lib/apis";
import { handleFrontError } from "@/src/utils/api/errors";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function Notification() {
  const { setIsOpen, unread, update } = useNotifyContext();
  const { t } = useTranslation();

  const markAllRead = async () => {
    const response = await markAllNotificationsRead();
    if (response.hasError) {
      handleFrontError(response);
      return;
    }
    toast.success(t("common:header:mark-all-read-success"));
    update();
  };

  const actions = [
    {
      name: t("common:header:notification"),
      onClick: () => setIsOpen(true),
    },
    { name: t("common:header:mark-all-read"), onClick: markAllRead },
  ];
  return (
    <div className="md:flex flex-col gap-1 items-start hidden">
      <Menu as="div" className="flex gap-x-1">
        <MenuButton className="flex items-center gap-x-1">
          <BellIcon className="h-6 w-6 text-green-500" aria-hidden="true" />
          <p className="text-black text-xs">{unread}</p>
        </MenuButton>
        <MenuItems
          transition
          anchor="bottom"
          className=" z-50 mt-2.5 rounded-md bg-white py-2 shadow-lg focus:outline-none"
        >
          {actions.map((item) => (
            <MenuItem key={item.name}>
              <div
                onClick={item.onClick}
                className={
                  "block px-3 py-1 text-sm leading-6 text-black cursor-pointer data-[focus]:bg-gray-600"
                }
              >
                {item.name}
              </div>
            </MenuItem>
          ))}
        </MenuItems>
      </Menu>
    </div>
  );
}
