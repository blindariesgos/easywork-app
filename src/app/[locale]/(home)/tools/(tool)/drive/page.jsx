"use client";
import useAppContext from "../../../../../../context/app";
import DriveHeader from "./components/DriveHeader";
import ThumbsInfo from "./components/info/thumbs";
import TableInfo from "./components/info/table";
import IconsInfo from "./components/info/icons";
import { Fragment, useLayoutEffect, useRef, useState } from "react";
import useDriveContext from "@/src/context/drive";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import DialogCopyItem from "./components/dialogs/CopyItem";
import DialogRenameItem from "./components/dialogs/RenameItem";
import DialogDeleteItem from "./components/dialogs/DeleteItem";
import DialogMoveItem from "./components/dialogs/MoveItem";
import DriveFooter from "./components/DriveFooter";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import Button from "@/src/components/form/Button";
import { toast } from "react-toastify";

export default function DrivePage() {
  const { driveView } = useAppContext();
  const { t } = useTranslation()
  const checkboxTable = useRef();
  const checkbox = useRef();
  const {
    folders,
    loading,
    addPage,
    folderCopy,
    setFolderCopy,
    setIsOpenCopy,
    setIsOpenRename,
    setItemEdit,
    setDeleteItem,
    setItemMove,
    setIsOpenMove,
    itemMove
  } = useDriveContext();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);


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

  const handleOpenItem = (item) => {
    if (item.type == "folder") {
      addPage(item)
      return
    }
    window.open(item.url, "self", "status=yes,scrollbars=yes,toolbar=yes,resizable=yes,width=850,height=500")
  }

  const itemOptions = [
    {
      name: "Abrir",
      onClick: handleOpenItem
    },
    {
      name: "Compartir",
      disabled: true
    },
    {
      name: "Renombrar",
      onClick: (item) => {
        setItemEdit(item)
        setIsOpenRename(true)
      }
    },
    {
      name: "Copiar",
      onClick: (page) => {
        setFolderCopy(page)
        toast.success("El elemento se ha copiado correctamente, navegue por las carpetas y pulse el botón PEGAR en el destino final.", { autoClose: 10000, })
      }
    },
    {
      name: "Eliminar",
      onClick: (page) => {
        setDeleteItem(page)
      },
    },
    {
      name: "Mover",
      onClick: (page) => {
        setItemMove(page)
        toast.success("El elemento se ha seleccionado correctamente, navegue por las carpetas y pulse el botón MOVER en el destino final.", { autoClose: 10000, })
      }
    },
  ];

  const shareOptions = [
    { name: "Compartir enlace interno" },
    { name: "Compartir con otros usuarios" },
  ];


  return (
    <div className="flex flex-col flex-grow md:pb-10 pb-16">
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
            <Button
              label={"PEGAR"}
              title={folderCopy?.name}
              buttonStyle="primary"
              className="px-4 py-2"
              onclick={() => setIsOpenCopy(true)}
            />
          )
        }
        {
          itemMove && (
            <Button
              label={"MOVER"}
              title={itemMove?.name}
              buttonStyle="primary"
              className="px-4 py-2"
              onclick={() => setIsOpenMove(true)}
            />
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
            handleOpenItem={handleOpenItem}
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
            handleOpenItem={handleOpenItem}
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
            handleOpenItem={handleOpenItem}
          />)
      }
      <DriveFooter selectedFiles={selectedFiles.length} />

      <DialogRenameItem />
      <DialogCopyItem />
      <DialogDeleteItem />
      <DialogMoveItem />
    </div>
  );
}
