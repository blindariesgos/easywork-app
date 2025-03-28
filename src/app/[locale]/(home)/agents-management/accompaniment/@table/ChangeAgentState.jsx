import Button from "@/src/components/form/Button";
import SelectInput from "@/src/components/form/SelectInput";
import {
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { updateAgentState } from "@/src/lib/apis";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { toast } from "react-toastify";
import useAccompanimentContext from "@/src/context/accompaniments";
import { useSWRConfig } from "swr";

const ChangeAgentState = ({ isOpen, setIsOpen, id }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: mutateAgents } = useAccompanimentContext();
  const { mutate } = useSWRConfig();
  const schema = Yup.object().shape({
    status: Yup.string().required(t("common:validations:required")),
  });

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const handleChangeState = async (data) => {
    setIsLoading(true);
    const response = await updateAgentState(data, id);
    if (response.hasError) {
      let message = response.message;
      if (Array.isArray(response.message)) {
        message = response.message.join(", ");
      }
      toast.error(message);
      setIsLoading(false);
      return;
    }
    mutateAgents();
    mutate(`/agent-management/agents/${id}`);
    setIsLoading(false);
    setIsOpen();
    toast.success(t("common:update-successfully"));
  };

  return (
    <Fragment>
      {isLoading && <LoaderSpinner />}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen()}
        className="relative z-50"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/30" />

        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-md w-full  bg-white p-8 rounded-2xl">
            <form
              onSubmit={handleSubmit(handleChangeState)}
              className="grid gap-8"
            >
              <DialogTitle className="font-bold">
                Cambiar estado del agente
              </DialogTitle>
              <Description>
                <SelectInput
                  label={t("agentsmanagement:accompaniments:select-state")}
                  name="status"
                  options={[
                    {
                      name: "Seguimiento",
                      id: "Seguimiento",
                    },
                    {
                      name: "Aprobado",
                      id: "Aprobado",
                    },
                    {
                      name: "No aprobado-sin seguimiento",
                      id: "No aprobado-sin seguimiento",
                    },
                    {
                      name: "No volver a contactar",
                      id: "No volver a contactar",
                    },
                  ]}
                  setValue={setValue}
                  error={errors.status}
                />
              </Description>
              <div className="flex justify-center gap-4">
                <Button
                  buttonStyle="secondary"
                  className="p-2"
                  label={t("common:cancel")}
                  onclick={() => setIsOpen()}
                />
                <Button
                  buttonStyle="primary"
                  className="p-2"
                  label={t("common:change")}
                  type="submit"
                />
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </Fragment>
  );
};

export default ChangeAgentState;
