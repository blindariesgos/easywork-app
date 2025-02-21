import { clsx } from "clsx";
import { recruitmentStages } from "@/src/utils/constants";
import { Fragment, useMemo, useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { updateAgentRecruitment } from "@/src/lib/apis";
import { toast } from "react-toastify";
import { useSWRConfig } from "swr";
import useRecruitmentsContext from "@/src/context/recruitments";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import {
  Dialog,
  TransitionChild,
  DialogPanel,
  DialogTitle,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { useTranslation } from "react-i18next";

const RecruitmentStages = ({ stageId, agentId }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { mutate } = useSWRConfig();
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: mutateAgents } = useRecruitmentsContext();
  const currentIndexStage = useMemo(() => {
    return recruitmentStages.map((x) => x.id).findIndex((id) => id == stageId);
  }, [stageId]);

  const updateState = async (id) => {
    setLoading(true);
    const body = {
      agentRecruitmentStageId: id,
    };
    const response = await updateAgentRecruitment(body, agentId);
    console.log({ response });
    if (response.hasError) {
      let message = response.message;
      if (response.errors) {
        message = response.errors.join(", ");
      }
      toast.error(message ?? "Etapa actualizada con éxito");
      setLoading(false);
      return;
    }
    toast.success("Etapa actualizada con éxito");
    mutate(`/agent-management/agents/${agentId}`);
    mutateAgents();
    setIsOpen(false);
    setLoading(false);
  };

  return (
    <Fragment>
      {loading && <LoaderSpinner />}
      <div className="overflow-x-hidden hover:overflow-x-auto py-1">
        <div className=" grid grid-cols-5 gap-2 w-full">
          {recruitmentStages
            .filter((stage) => stage.type === "state")
            .map((stage, index) => (
              <div key={stage.id} className="relative group">
                <div
                  className={clsx(
                    "flex h-7 w-7 bg-white rounded-full justify-center items-center absolute -right-4 group-last:hidden z-10 top-[5px]"
                  )}
                >
                  <MdKeyboardArrowRight className="h-6 w-6 text-easy-600" />
                </div>
                <div
                  className={clsx(
                    "px-4 py-3 text-center cursor-pointer text-white text-xs rounded overflow-hidden whitespace-nowrap text-ellipsis hover:opacity-100",
                    {
                      "opacity-50": index > currentIndexStage,
                    }
                  )}
                  style={{
                    background:
                      index <= currentIndexStage
                        ? (recruitmentStages.find((x) => x.id == stageId)
                            ?.color ?? recruitmentStages[0].color)
                        : stage.color,
                  }}
                  title={stage.name}
                  onClick={() => updateState(stage.id)}
                >
                  {stage.name}
                </div>
              </div>
            ))}
          <div className="relative group">
            <div
              className={clsx(
                "text-blue-800 flex h-7 w-7 bg-white rounded-full justify-center items-center absolute -right-4 group-last:hidden z-10 top-[5px]"
              )}
            >
              <MdKeyboardArrowRight className="h-6 w-6 text-easy-600" />
            </div>
            <div
              className={clsx(
                " px-4 py-3 text-center cursor-pointer text-white text-xs rounded overflow-hidden whitespace-nowrap text-ellipsis hover:opacity-100",
                {
                  "opacity-50": !recruitmentStages
                    .filter((x) => x.type != "state")
                    .map((x) => x.id)
                    .includes(stageId),
                  "bg-primary": recruitmentStages
                    .filter((x) => x.type == "state")
                    .map((x) => x.id)
                    .includes(stageId),
                }
              )}
              style={{
                background:
                  recruitmentStages
                    .filter((x) => x.type != "state")
                    .find((x) => x.id == stageId)?.color ?? "",
              }}
              onClick={() => setIsOpen(true)}
            >
              {recruitmentStages
                .filter((x) => x.type != "state")
                .map((x) => x.id)
                .includes(stageId)
                ? recruitmentStages.find((x) => x.id == stageId)?.name
                : "Definir estado de reclutamiento"}
            </div>
          </div>
        </div>
      </div>
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-[10000]"
        onClose={() => setIsOpen(false)}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform rounded-2xl bg-gray-100 p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-black"
                >
                  {t("agentsmanagement:recruitment:select-positive")}
                </DialogTitle>
                <div className="flex gap-2 justify-center mt-6">
                  <button
                    className="inline-flex justify-center rounded-md text-sm font-medium text-white bg-green-500 py-2 px-3 focus:outline-none focus:ring-0"
                    onClick={() =>
                      updateState("fd995692-4640-4dc9-a78c-67df037a1fe6")
                    }
                  >
                    {"Ingreso aprobado"}
                  </button>
                  <Menu>
                    <MenuButton className="text-white group inline-flex items-center rounded-md bg-red-500 px-4 py-2 text-sm font-medium hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                      Descartar reclutamiento
                    </MenuButton>

                    <MenuItems
                      transition
                      anchor={{
                        to: "bottom start",
                        gap: 5,
                      }}
                      className=" origin-top-right bg-white rounded-xl border shadow-lg border-white/5 p-1 text-sm/6 transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                    >
                      {recruitmentStages
                        .filter((state) => state.type == "canceled")
                        .map((state) => (
                          <MenuItem
                            key={state.id}
                            as="div"
                            onClick={() => updateState(state.id)}
                            className="py-1 px-2 cursor-pointer hover:bg-primary rounded-md hover:text-white"
                          >
                            {state.name}
                          </MenuItem>
                        ))}
                    </MenuItems>
                  </Menu>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Fragment>
  );
};

export default RecruitmentStages;
