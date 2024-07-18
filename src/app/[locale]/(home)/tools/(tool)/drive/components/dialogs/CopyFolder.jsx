"use client";
import { useState } from "react";
import useDriveContext from "@/src/context/drive";
import { Dialog, DialogTitle, DialogPanel, DialogBackdrop } from "@headlessui/react";
import TextInput from "@/src/components/form/TextInput";
import Button from "@/src/components/form/Button";
import SelectInput from "@/src/components/form/SelectInput";

const CopyFolder = () => {
    const {
        duplicateFolder,
        folderCopy,
        setFolderCopy,
        currentFolder,
        isOpenCopy,
        setIsOpenCopy
    } = useDriveContext();
    const [folderName, setFolderName] = useState("")

    const handleClose = () => {
        setIsOpenCopy(false)
    }

    const handleCopyFolder = async () => {
        await duplicateFolder(folderCopy?.id, folderName, currentFolder?.id)
        setFolderCopy()
        handleClose()
    }

    const handleChangeFolderName = (e) => {
        setFolderName(e.target.value)
    }

    return (
        <Dialog open={isOpenCopy} as="div" className="relative z-10 focus:outline-none" onClose={handleClose}>
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
                                placeholder="Opcional"
                            />
                            <TextInput
                                type="text"
                                label={"Pegar en carpeta"}
                                name="copy"
                                value={currentFolder?.name}
                                disabled

                            />
                        </form>
                        <div className="mt-4 flex justify-center gap-4">
                            <Button
                                buttonStyle="primary"
                                className="inline-flex items-center gap-2 rounded-md py-1.5 px-3 text-sm/6 font-semibold "
                                onclick={handleCopyFolder}
                                label="Pegar"
                            />
                            <Button
                                buttonStyle="secondary"
                                className="inline-flex items-center gap-2 rounded-md py-1.5 px-3 text-sm/6 font-semibold "
                                onclick={handleClose}
                                label="Cerrar"
                            />
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}

export default CopyFolder