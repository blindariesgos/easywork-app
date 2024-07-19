"use client";
import useAppContext from "../../../../../../context/app";
import DriveHeader from "./components/DriveHeader";
import ThumbsInfo from "./components/info/thumbs";
import TableInfo from "./components/info/table";
import IconsInfo from "./components/info/icons";
import { Fragment, useLayoutEffect, useRef, useState } from "react";
import useDriveContext from "@/src/context/drive";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/20/solid";
import { Dialog, DialogTitle, DialogPanel, DialogBackdrop } from "@headlessui/react";
import TextInput from "@/src/components/form/TextInput";
import Button from "@/src/components/form/Button";
import SelectInput from "@/src/components/form/SelectInput";
import DialogCopyFolder from "./components/dialogs/CopyItem";
import DriveFooter from "./components/DriveFooter";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

export default function DrivePage({ children }) {
  const { driveView } = useAppContext();
  const { t } = useTranslation()
  const checkboxTable = useRef();
  const checkbox = useRef();
  const {
    folders,
    loading,
    addPage,
    renameFolder,
    folderCopy,
    setFolderCopy,
    isOpenCopy,
    setIsOpenCopy
  } = useDriveContext();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isOpenRename, setIsOpenRename] = useState(false)
  const [folderName, setFolderName] = useState("")
  const [idFolderEdit, setIdFolderEdit] = useState("")

  useLayoutEffect(() => {
    const isIndeterminate =
      selectedFiles.length > 0 && selectedFiles.length < folders?.length;
    setChecked(selectedFiles.length === folders?.length);
    setIndeterminate(isIndeterminate);
    if (checkboxTable?.current) checkboxTable.current.indeterminate = isIndeterminate;
    if (checkbox?.current) checkbox.current.indeterminate = isIndeterminate;
  }, [selectedFiles]);

  const toggleAll = () => {
    setSelectedFiles(checked || indeterminate ? [] : folders.map(x => x.id) ?? []);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  const itemOptions = [
    {
      name: "Abrir",
      onClick: (item) => {
        if (item.type == "folder") {
          addPage(item)
          return
        }
        window.open(item.url, "self", "status=yes,scrollbars=yes,toolbar=yes,resizable=yes,width=850,height=500")
      }
    },
    {
      name: "Compartir",
      disabled: true
    },
    {
      name: "Renombrar",
      onClick: (page) => {
        setFolderName(page.name)
        setIsOpenRename(true)
        setIdFolderEdit(page.id)
      }
    },
    {
      name: "Copiar",
      onClick: (page) => {
        setFolderCopy(page)
      }
    },
  ];

  const shareOptions = [
    { name: "Compartir enlace interno" },
    { name: "Compartir con otros usuarios" },
  ];

  const handleRenameFolder = async () => {
    await renameFolder(idFolderEdit, folderName)
    setIsOpenRename(false)
    setFolderName("")
    setIdFolderEdit("")
  }

  const handleChangeFolderName = (e) => {
    setFolderName(e.target.value)
  }

  return (
    <div className="flex flex-col flex-grow">
      {loading && <LoaderSpinner />}
      <DriveHeader />

      <div className={clsx("flex items-center gap-2", { "p-2": selectedFiles.length > 0 || folderCopy })}>
        {
          selectedFiles.length > 0 && (
            <Fragment>
              {
                driveView !== "table" && (
                  < input
                    type="checkbox"
                    className=" h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    ref={checkbox}
                    checked={checked}
                    onChange={toggleAll}
                    indeterminate={true}
                  />
                )
              }
              <button
                type="button"
                className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
              >
                {t("tools:drive:table:delete")}
              </button>
            </Fragment>
          )
        }
        {
          folderCopy && (
            <button
              type="button"
              className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
              title={folderCopy?.name}
              onClick={() => setIsOpenCopy(true)}
            >
              {t("tools:drive:table:paste")}
            </button>
          )
        }
      </div>
      {
        driveView === "table" && (
          <TableInfo
            files={folders}
            toggleAll={toggleAll}
            itemOptions={itemOptions}
            shareOptions={shareOptions}
            selectedFiles={selectedFiles}
            checkbox={checkboxTable}
            setSelectedFiles={setSelectedFiles}
            checked={checked}
          />)}
      {
        driveView === "icon" && (
          <IconsInfo
            files={folders}
            toggleAll={toggleAll}
            itemOptions={itemOptions}
            shareOptions={shareOptions}
            selectedFiles={selectedFiles}
            checkbox={checkboxTable}
            setSelectedFiles={setSelectedFiles}
            checked={checked}
          />)
      }
      {
        driveView === "thumb" && (
          <ThumbsInfo
            files={folders}
            toggleAll={toggleAll}
            itemOptions={itemOptions}
            shareOptions={shareOptions}
            selectedFiles={selectedFiles}
            checkbox={checkboxTable}
            setSelectedFiles={setSelectedFiles}
            checked={checked}
          />)
      }
      <DriveFooter selectedFiles={selectedFiles.length} />
      <Dialog open={isOpenRename} as="div" className="relative z-10 focus:outline-none" onClose={() => setIsOpenRename(false)}>
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <DialogTitle as="h3" className="text-base font-medium">
                Renombrar Carpeta
              </DialogTitle>
              <form className="py-10 px-2 bg-[#F2F6F7] mt-4" onSubmit={e => e.preventDefault()}>
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
                  onclick={handleRenameFolder}
                  label="Renombrar"
                />
                <Button
                  buttonStyle="secondary"
                  className="inline-flex items-center gap-2 rounded-md py-1.5 px-3 text-sm/6 font-semibold "
                  onclick={() => setIsOpenRename(false)}
                  label="Cerrar"
                />
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <Dialog open={isOpenCopy} as="div" className="relative z-10 focus:outline-none" onClose={() => setIsOpenCopy(false)}>
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <DialogTitle as="h3" className="text-base font-medium">
                {`Copiar Carpeta (${folderCopy?.name})`}
              </DialogTitle>
              <form className="py-10 px-2 bg-[#F2F6F7] mt-4 flex flex-col gap-2" onSubmit={e => e.preventDefault()}>
                <TextInput
                  type="text"
                  label={"Nombre de carpeta"}
                  name="responsible"
                  value={folderName}
                  onChangeCustom={handleChangeFolderName}
                />
                <SelectInput
                  options={folders}
                  label="Copiar en"
                  setSelectedOption={(option) => console.log(option)}
                />
              </form>
              <div className="mt-4 flex justify-center gap-4">
                <Button
                  buttonStyle="primary"
                  className="inline-flex items-center gap-2 rounded-md py-1.5 px-3 text-sm/6 font-semibold "
                  onclick={handleRenameFolder}
                  label="Renombrar"
                />
                <Button
                  buttonStyle="secondary"
                  className="inline-flex items-center gap-2 rounded-md py-1.5 px-3 text-sm/6 font-semibold "
                  onclick={() => setIsOpenCopy(false)}
                  label="Cerrar"
                />
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <DialogCopyFolder />
    </div>
  );
}
