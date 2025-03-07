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
import PolicySelectAsync from "@/src/components/form/PolicySelectAsync";
import { useTranslation } from "react-i18next";
import SelectInput from "@/src/components/form/SelectInput";
import TextInput from "@/src/components/form/TextInput";
import { closeLeadManualSale } from "@/src/lib/apis";
import { handleFrontError } from "@/src/utils/api/errors";
import LoaderSpinner from "@/src/components/LoaderSpinner";

const ConnectToPolicy = ({ isOpen, setIsOpen, leadId }) => {
  const { t } = useTranslation();
  const { mutate: mutateLeads } = useLeadContext();
  const { mutate } = useSWRConfig();
  const [contact, setContact] = useState();
  const [loading, setLoading] = useState();
  const [type, setType] = useState("policy");
  const [body, setBody] = useState();

  const handleChangePolicy = (policy) => {
    setContact(policy.contact);
    setBody({
      polizaId: policy?.id,
      contactId: policy?.contact?.id,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const response = await closeLeadManualSale(leadId, body);

    if (response.hasError) {
      handleFrontError(response);
      setLoading(false);
      return;
    }

    toast.success("Prospecto convertido con éxito");
    setIsOpen(false);
    mutateLeads();
    mutate(`/sales/crm/leads/${leadId}/activities`);
    mutate(`/sales/crm/leads/${leadId}`);
    setLoading(false);
  };

  return (
    <Fragment>
      {loading && <LoaderSpinner />}
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
            {/* <div className="flex justify-center">
              <TiWarning className="w-16 h-16 text-yellow-500" />
            </div> */}
            <div className="py-4">
              <p>
                Seleccionar póliza y valide que el cliente relacionado sea el
                correcto
              </p>
            </div>
            <SelectInput
              label={"Seleccionar tipo de documento"}
              name="type"
              options={[
                {
                  name: "Póliza nueva",
                  id: "policy",
                },
                {
                  name: "Renovacion",
                  id: "renewal",
                },
              ]}
              setSelectedOption={(e) => setType(e.id)}
            />
            <PolicySelectAsync
              label={t("operations:managements:add:fundrescue:poliza")}
              name={"policyId"}
              setSelectedOption={handleChangePolicy}
              isRenewal={type == "renewal"}
            />
            {contact && (
              <TextInput
                label={"Cliente relacionado"}
                disabled
                value={contact.fullName}
                border
              />
            )}
            <div className="flex gap-4 justify-end">
              <Button
                label={"Cancelar"}
                buttonStyle="secondary"
                className="px-4 py-2"
                type="button"
                onclick={() => setIsOpen(false)}
              />
              <Button
                label={"Continuar"}
                buttonStyle="primary"
                className="px-4 py-2"
                type="button"
                disabled={!contact}
                onclick={handleSubmit}
              />
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </Fragment>
  );
};

export default ConnectToPolicy;
