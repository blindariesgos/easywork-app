"use client";

import { useEffect, useState } from "react";
import useDriveContext from "@/src/context/drive";
import { Dialog, DialogTitle, DialogPanel, DialogBackdrop } from "@headlessui/react";
import TextInput from "@/src/components/form/TextInput";
import Button from "@/src/components/form/Button";
import { useTranslation } from "react-i18next";

const RenameItem = () => {
    const { t } = useTranslation()
    const {
        renameItem,
        isOpenRename,
        itemEdit,
        setIsOpenRename
    } = useDriveContext();

    const [itemName, setItemName] = useState("")


    const handleRenameItem = async () => {
        await renameItem(itemName)
        setItemName("")
    }

    const handleChangeFolderName = (e) => {
        setItemName(e.target.value)
    }

    useEffect(() => {
        setItemName(itemEdit?.name)
    }, [itemEdit])

    return (
        <Dialog open={isOpenRename} as="div" className="relative z-10 focus:outline-none" onClose={() => setIsOpenRename(false)}>
            <DialogBackdrop className="fixed inset-0 bg-black/30" />
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className="w-full max-w-md rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                    >
                        <DialogTitle as="h3" className="text-base font-medium">
                            {`Renombrar ${t(`tools:drive:${itemEdit?.type}`)} (${itemEdit?.name})`}
                        </DialogTitle>
                        <form className="py-10 px-2 bg-[#F2F6F7] mt-4" onSubmit={e => e.preventDefault()}>
                            <TextInput
                                type="text"
                                label={`Nombre de ${t(`tools:drive:${itemEdit?.type}`)}`}
                                name="responsible"
                                value={itemName}
                                onChangeCustom={handleChangeFolderName}
                            />
                        </form>
                        <div className="mt-4 flex justify-center gap-4">
                            <Button
                                buttonStyle="primary"
                                className="inline-flex items-center gap-2 rounded-md py-1.5 px-3 text-sm/6 font-semibold "
                                onclick={handleRenameItem}
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
    );
}

export default RenameItem