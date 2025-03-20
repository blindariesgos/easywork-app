"use client";
import Button from "@/src/components/form/Button";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { linkPolicyToContact } from "@/src/lib/apis";
import { handleFrontError } from "@/src/utils/api/errors";
import { toast } from "react-toastify";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import ContactSelectAsync from "@/src/components/form/ContactSelectAsync";

const VinculateContact = ({ isOpen, setIsOpen, onUpdate, policyId }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [contactId, setContactId] = useState();

  const handleSubmit = async () => {
    setIsLoading(true);
    console.log({ policyId, contactId });
    const response = await linkPolicyToContact(policyId, contactId);

    if (response.hasError) {
      handleFrontError(response);
      setIsLoading(false);
      return;
    }
    toast.success(t("operations:policies:update"));
    setIsOpen(false);
    setIsLoading(false);
    onUpdate();
  };

  return (
    <Fragment>
      {isLoading && <LoaderSpinner />}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-[10000]"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/30" />

        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg w-full bg-white p-8 rounded-2xl shadow-lg">
            <p className="textsm text-black font-medium">
              {"Vincular un cliente a la póliza"}
            </p>
            <div className="relative grid gap-2 bg-white px-2 sm:px-4 grid-cols-1 mt-4 py-4">
              <ContactSelectAsync
                label={"Seleccionar contacto a vincular"}
                name="contactId"
                setSelectedOption={(contact) =>
                  setContactId(contact?.id ?? null)
                }
              />
            </div>
            <div className="flex justify-center gap-4 sticky bottom-0 pt-4 pb-2">
              <Button
                type="button"
                label={t("common:buttons:cancel")}
                buttonStyle="secondary"
                onclick={() => {
                  setIsOpen(false);
                }}
                className="px-3 py-2"
              />
              <Button
                onclick={handleSubmit}
                type="button"
                label={t("common:buttons:save")}
                buttonStyle="primary"
                className="px-3 py-2"
                disabled={!contactId}
              />
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </Fragment>
  );
};

export default VinculateContact;
