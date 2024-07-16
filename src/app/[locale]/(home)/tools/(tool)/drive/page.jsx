"use client";
import useAppContext from "../../../../../../context/app";
import DriveHeader from "./components/DriveHeader";
import ThumbsInfo from "./components/info/thumbs";
import TableInfo from "./components/info/table";
import IconsInfo from "./components/info/icons";
import { useLayoutEffect, useRef, useState } from "react";
import useDriveContext from "@/src/context/drive";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/20/solid";
import { Dialog, DialogTitle, DialogPanel, DialogBackdrop } from "@headlessui/react";
import TextInput from "@/src/components/form/TextInput";
import Button from "@/src/components/form/Button";

export default function DrivePage({ children }) {
  const { driveView } = useAppContext();
  const checkbox = useRef();
  const { folders, config, loading, addPage, renameFolder } = useDriveContext();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isOpenAdd, setIsOpenAdd] = useState(false)
  const [folderName, setFolderName] = useState("")
  const [idFolderEdit, setIdFolderEdit] = useState("")

  useLayoutEffect(() => {
    const isIndeterminate =
      selectedFiles.length > 0 && selectedFiles.length < folders?.length;
    setChecked(selectedFiles.length === folders?.length);
    setIndeterminate(isIndeterminate);
    checkbox.current.indeterminate = isIndeterminate;
  }, [selectedFiles]);

  const toggleAll = () => {
    setSelectedFiles(checked || indeterminate ? [] : folders ?? []);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  const itemOptions = [
    {
      name: "Abrir",
      onClick: (page) => addPage(page)
    },
    {
      name: "Compartir",
      disabled: true
    },
    {
      name: "Renombrar",
      onClick: (page) => {
        setFolderName(page.name)
        setIsOpenAdd(true)
        setIdFolderEdit(page.id)
      }
    },
    {
      name: "Copiar",
      disabled: true
    },
  ];

  const shareOptions = [
    { name: "Compartir enlace interno" },
    { name: "Compartir con otros usuarios" },
  ];

  const handleRenameFolder = async () => {
    await renameFolder(idFolderEdit, folderName)
    setIsOpenAdd(false)
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
      {children}
      {
        driveView === "table" && (
          <TableInfo
            files={folders}
            toggleAll={toggleAll}
            itemOptions={itemOptions}
            shareOptions={shareOptions}
            selectedFiles={selectedFiles}
            checkbox={checkbox}
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
            checkbox={checkbox}
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
            checkbox={checkbox}
            setSelectedFiles={setSelectedFiles}
            checked={checked}
          />)
      }
      <Dialog open={isOpenAdd} as="div" className="relative z-10 focus:outline-none" onClose={() => setIsOpenAdd(false)}>
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
                  onclick={() => setIsOpenAdd(false)}
                  label="Cerrar"
                />
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <div className="flex justify-between items-center">
        <div className="ml-6">Seleccionado: {selectedFiles.length}/{config.totalItems}</div>
        <p>{`Página ${config.currentPage}/${config.totalPages}`}</p>
        <div className="flex items-center ">
          <div className="flex">
            <ChevronLeftIcon className="h-6 w-6 mr-2 text-easywork-main" />
            anterior
          </div>
          <div className="ml-4 flex">
            siguiente
            <ChevronRightIcon className="h-6 w-6 ml-2 text-easywork-main" />
          </div>
        </div>
      </div>
    </div>
  );
}
