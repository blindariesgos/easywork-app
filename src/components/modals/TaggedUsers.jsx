import TextInput from "../form/TextInput";
import { XMarkIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import React, { Fragment } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

const TaggedUsers = ({
  dataUsers,
  onChangeCustom,
  setUserSelected,
  userSelected,
  setDropdownVisible,
  isOpen,
}) => {
  const handleSelected = (user) => {
    setUserSelected(user);
    setDropdownVisible(false);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setDropdownVisible(false)}
      className="relative z-[100000]"
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        {/* The actual dialog panel  */}
        <DialogPanel className="max-w-lg max-h-[60vh] rounded-md bg-blue-50 shadow-lg ring-1 ring-black/5 focus:outline-none  w-full h-min-96">
          <div className="p-4 relative">
            <div className="sticky">
              <div className="flex justify-end gap-2">
                <div
                  className="cursor-pointer"
                  onClick={() => setDropdownVisible(false)}
                >
                  <XMarkIcon className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <p className="text-gray-50">Seleccione usuario</p>
              <div className="w-full mt-2">
                <TextInput onChangeCustom={onChangeCustom} border />
              </div>
            </div>
            <div className=" overflow-y-auto pt-6 max-h-64">
              <div className="flex flex-col gap-2">
                {dataUsers &&
                  dataUsers.map((user, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 w-full cursor-pointer hover:bg-gray-100 p-2 rounded-md ${
                        userSelected?.id === user.id ? "bg-easy-600" : "bg-none"
                      }`}
                      onClick={() => handleSelected(user)}
                    >
                      <Image
                        src={user.avatar || "/img/avatar.svg"}
                        alt=""
                        height={300}
                        width={300}
                        layout="fixed"
                        objectFit="cover"
                        className="h-6 w-6 rounded-full"
                      />
                      <div className={`flex flex-col`}>
                        <p
                          className={`text-xs font-medium ${
                            userSelected?.id === user.id
                              ? "text-white"
                              : "text-black"
                          }`}
                        >
                          {user.name}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default TaggedUsers;
