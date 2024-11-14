"use client";
import { Fragment, useEffect, useState } from "react";
import {
  Menu,
  Transition,
  MenuButton,
  MenuItems,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogPanel,
  DialogBackdrop,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { DocumentIcon, FolderIcon } from "@heroicons/react/24/outline";
import {
  TbBrandGoogleDrive,
  TbBrandOffice,
  TbAppWindow,
  TbCloudUpload,
} from "react-icons/tb";
// import { SiMicrosoftoffice } from "react-icons/si";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import Button from "@/src/components/form/Button";
import TextInput from "@/src/components/form/TextInput";
import useDriveContext from "@/src/context/drive";

const CreateDocumentButton = () => {
  const { t } = useTranslation();
  const { addFolder, pages, addFiles } = useDriveContext();
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenAddFile, setIsOpenAddFile] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [files, setFiles] = useState([]);

  const handleChangeFolderName = (e) => {
    setFolderName(e.target.value);
  };

  const handleChangeAddFolder = async () => {
    await addFolder(folderName);
    setIsOpenAdd(false);
    setFolderName("");
  };

  const handleChangeFiles = (e) => {
    const files = e.target.files;

    if (!files) {
      return;
    }

    // if (file.size > MAX_FILE_SIZE) {
    //   toast.error('The document must be less than 7MB in size.')
    //   return
    // }

    // setFilePrev1({
    //   url: URL.createObjectURL(file),
    //   number: 1,
    // })

    setFiles(Array.from(files));
  };

  const handleSaveFiles = async () => {
    console.log({ files });
    const response = await addFiles(files);
    setIsOpenAddFile(false);
    setFiles([]);
  };

  return (
    <Fragment>
      <Menu>
        <MenuButton className="relative inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-indigo-600 hover:bg-indigo-500 focus:z-10">
          {t("tools:drive:add:name")}
          <ChevronDownIcon
            className="-mr-1 h-5 w-5 text-white"
            aria-hidden="true"
          />
        </MenuButton>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems
            anchor="bottom start"
            className="divide-y z-10 divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <div className="py-1">
              <MenuItem
                disabled={pages.length === 0}
                onClick={() => setIsOpenAddFile(true)}
              >
                {({ active }) => (
                  <p
                    className={clsx(
                      active ? "bg-easy-600 text-white" : "text-gray-700",
                      "group flex items-center cursor-pointer px-4 py-2 text-sm data-[disabled]:cursor-no-drop data-[disabled]:opacity-50"
                    )}
                  >
                    <DocumentIcon
                      className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                    {t("tools:drive:add:document")}
                  </p>
                )}
              </MenuItem>
              <MenuItem onClick={() => setIsOpenAdd(true)}>
                {({ active }) => (
                  <div
                    className={clsx(
                      active ? "bg-easy-600 text-white" : "text-gray-700",
                      "group flex cursor-pointer items-center px-4 py-2 text-sm data-[disabled]:cursor-no-drop data-[disabled]:opacity-50"
                    )}
                  >
                    <FolderIcon
                      className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                    {t("tools:drive:add:folder")}
                  </div>
                )}
              </MenuItem>
            </div>
            <div className="py-1">
              <MenuItem disabled>
                {({ active }) => (
                  <a
                    href="#"
                    className={clsx(
                      active ? "bg-easy-600 text-white" : "text-gray-700",
                      "group flex items-center px-4 py-2 text-sm data-[disabled]:cursor-no-drop data-[disabled]:opacity-50"
                    )}
                  >
                    <TbCloudUpload
                      className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                    {t("tools:drive:add:bitrixDocs")}
                  </a>
                )}
              </MenuItem>
              <MenuItem disabled>
                {({ active }) => (
                  <a
                    href="#"
                    className={clsx(
                      active ? "bg-easy-600 text-white" : "text-gray-700",
                      "group flex items-center px-4 py-2 text-sm data-[disabled]:cursor-no-drop data-[disabled]:opacity-50"
                    )}
                  >
                    <TbBrandGoogleDrive
                      className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                    {t("tools:drive:add:googleDocs")}
                  </a>
                )}
              </MenuItem>
            </div>
            <div className="py-1">
              <MenuItem disabled>
                {({ active }) => (
                  <a
                    href="#"
                    className={clsx(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "group flex items-center px-4 py-2 text-sm data-[disabled]:cursor-no-drop data-[disabled]:opacity-50"
                    )}
                  >
                    <TbBrandOffice
                      className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                    {t("tools:drive:add:msOfficeOnline")}
                  </a>
                )}
              </MenuItem>
              <MenuItem disabled>
                {({ active }) => (
                  <a
                    href="#"
                    className={clsx(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "group flex items-center px-4 py-2 text-sm data-[disabled]:cursor-no-drop data-[disabled]:opacity-50"
                    )}
                  >
                    {/* <SiMicrosoftoffice
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  /> */}
                    {t("tools:drive:add:office365")}
                  </a>
                )}
              </MenuItem>
            </div>
            <div className="py-1">
              <MenuItem disabled>
                {({ active }) => (
                  <a
                    href="#"
                    className={clsx(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "group flex items-center px-4 py-2 text-sm data-[disabled]:cursor-no-drop data-[disabled]:opacity-50"
                    )}
                  >
                    {/* <TbAppWindow
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  /> */}
                    {t("tools:drive:add:desktopApp")}
                  </a>
                )}
              </MenuItem>
            </div>
          </MenuItems>
        </Transition>
      </Menu>

      <Dialog
        open={isOpenAdd}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={() => setIsOpenAdd(false)}
      >
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <DialogTitle as="h3" className="text-base font-medium">
                Crear Carpeta
              </DialogTitle>
              <form
                className="py-10 px-2 bg-[#F2F6F7] mt-4"
                onSubmit={(e) => e.preventDefault()}
              >
                <TextInput
                  type="text"
                  label={"Nombre de carpeta"}
                  name="responsible"
                  value={folderName}
                  onChangeCustom={handleChangeFolderName}
                />
              </form>
              <div className="mt-4 flex justify-center gap-4">
                <Button
                  buttonStyle="primary"
                  className="inline-flex items-center gap-2 rounded-md py-1.5 px-3 text-sm/6 font-semibold "
                  onclick={handleChangeAddFolder}
                  label="Crear"
                />
                <Button
                  buttonStyle="secondary"
                  className="inline-flex items-center gap-2 rounded-md py-1.5 px-3 text-sm/6 font-semibold "
                  onclick={() => setIsOpenAdd(false)}
                  label="Cerrar"
                />
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <Dialog
        open={isOpenAddFile}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={() => setIsOpenAddFile(false)}
      >
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <DialogTitle as="h3" className="text-base font-medium">
                Agregar Archivos
              </DialogTitle>
              <form
                className="py-10 px-2 bg-[#F2F6F7] mt-4"
                onSubmit={(e) => e.preventDefault()}
              >
                <input type="file" multiple onChange={handleChangeFiles} />
              </form>
              <div className="mt-4 flex justify-center gap-4">
                <Button
                  buttonStyle="primary"
                  className="inline-flex items-center gap-2 rounded-md py-1.5 px-3 text-sm/6 font-semibold "
                  onclick={handleSaveFiles}
                  label="Agregar"
                />
                <Button
                  buttonStyle="secondary"
                  className="inline-flex items-center gap-2 rounded-md py-1.5 px-3 text-sm/6 font-semibold "
                  onclick={() => setIsOpenAddFile(false)}
                  label="Cerrar"
                />
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </Fragment>
  );
};

export default CreateDocumentButton;
