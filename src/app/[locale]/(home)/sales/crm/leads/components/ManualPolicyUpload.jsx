import Button from "@/src/components/form/Button";
import {
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Fragment, useState } from "react";
import { TiWarning } from "react-icons/ti";
import AddPolicyManual from "@/src/components/AddPolicyManual";
import { toast } from "react-toastify";
import useLeadContext from "@/src/context/leads";
import { useSWRConfig } from "swr";
import ConnectToPolicy from "./ConnectToPolicy";

const ManualPolicyUpload = ({ isOpen, setIsOpen, leadId }) => {
  const [isOpenUpload, setIsOpenUpload] = useState(false);
  const [isOpenConnect, setIsOpenConnect] = useState(false);
  const { mutate: mutateLeads } = useLeadContext();
  const { mutate } = useSWRConfig();

  const handleClosed = () => {
    toast.success("Prospecto convertido con éxito");
    setIsOpenUpload(false);
    mutateLeads();
    mutate(`/sales/crm/leads/${leadId}/activities`);
    mutate(`/sales/crm/leads/${leadId}`);
  };

  return (
    <Fragment>
      <AddPolicyManual
        isOpen={isOpenUpload}
        setIsOpen={setIsOpenUpload}
        module="lead"
        id={leadId}
        onClosed={handleClosed}
      />
      <ConnectToPolicy
        isOpen={isOpenConnect}
        setIsOpen={setIsOpenConnect}
        leadId={leadId}
      />
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-[1000000000]"
      >
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <DialogBackdrop className="fixed inset-0 bg-black/30" />

        {/* Full-screen container to center the panel */}
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          {/* The actual dialog panel  */}
          <DialogPanel className="max-w-lg w-full rounded-2xl space-y-4 bg-white p-4">
            <div className="flex justify-center">
              <TiWarning className="w-16 h-16 text-yellow-500" />
            </div>
            <div className="py-4">
              <p>No tenemos registro de la carga del documento de la póliza.</p>
              <p>¿Desea cargarla manualmente?</p>
            </div>
            <div className="flex gap-4 justify-end">
              <Button
                label={"Sí, cargar manualmente"}
                buttonStyle="primary"
                className="px-4 py-2"
                type="button"
                onclick={() => {
                  setIsOpen(false);
                  setIsOpenUpload(true);
                }}
              />
            </div>
            <div className="py-4">
              <p>
                ¿Ya tiene una póliza cargada y necesita hacer una conversión
                simbólica para vincular con el contacto?
              </p>
            </div>
            <div className="flex gap-4 justify-end">
              <Button
                label={"Sí, ya existe contacto con póliza cargada"}
                buttonStyle="primary"
                className="px-4 py-2"
                type="button"
                onclick={() => {
                  setIsOpen(false);
                  setIsOpenConnect(true);
                }}
              />
            </div>
            <div className="py-4">
              <p>
                Si no se encuentra en ninguno de los casos anteriores, proceda a
                cancelar
              </p>
            </div>
            <div className="flex gap-4 justify-end">
              <Button
                label={"Cancelar"}
                buttonStyle="secondary"
                className="px-4 py-2"
                type="button"
                onclick={() => setIsOpen(false)}
              />
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </Fragment>
  );
};

export default ManualPolicyUpload;
