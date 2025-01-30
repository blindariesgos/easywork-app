import { LoadingSpinnerSmall } from "@/src/components/LoaderSpinner";
import { getAllTasks } from "@/src/lib/apis";
import clsx from "clsx";
import { is } from "date-fns/locale";
import { useEffect, useState, Fragment } from "react";
import {
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import Button from "@/src/components/form/Button";
import { useTranslation } from "react-i18next";

const Assignments = ({ tasks, isLoading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const status = {
    pending: "Pendiente",
    completed: "Hecho",
    "not-completed": "No realizado",
  };
  if (isLoading) return <LoadingSpinnerSmall />;
  if (tasks.length == 0) return "No tiene asignaciones";

  return (
    <div className="flex justify-center">
      {tasks.length == 1 ? (
        <button
          className={clsx("px-3 py-2 rounded-md", {
            "bg-[#B5B5B5] text-white":
              tasks[0]?.metadata?.gddStatus == "pending" ||
              !tasks[0]?.metadata?.gddStatus,
            "bg-[#A9EA44] text-primary":
              tasks[0]?.metadata?.gddStatus == "completed",
            "bg-[#C30000] text-white":
              tasks[0]?.metadata?.gddStatus == "not-completed",
          })}
        >
          {tasks[0]?.metadata?.gddStatus
            ? status[tasks[0]?.metadata?.gddStatus]
            : status.pending}
        </button>
      ) : (
        <Fragment>
          <button
            className="bg-[#B5B5B5] px-3 py-2 rounded-md"
            onClick={() => setIsOpen(true)}
          >
            +1
          </button>
          <Dialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
            className="relative z-50"
          >
            {/* The backdrop, rendered as a fixed sibling to the panel container */}
            <DialogBackdrop className="fixed inset-0 bg-black/30" />

            {/* Full-screen container to center the panel */}
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
              {/* The actual dialog panel  */}
              <DialogPanel className="max-w-lg w-full rounded-xl space-y-4 bg-white p-4">
                <DialogTitle className="font-bold">
                  Revision de Gerente de Desarrollo
                </DialogTitle>
                <Description className="grid grid-cols-1 gap-2">
                  {tasks.map((task) => {
                    const taskStatus = task?.metadata?.gddStatus ?? "pending";
                    return (
                      <div
                        key={task.id}
                        className={clsx(
                          "p-2 rounded-lg flex justify-between items-center gap-4",
                          {
                            "bg-[#B5B5B5] text-white": taskStatus == "pending",
                            "bg-[#A9EA44] text-primary":
                              taskStatus == "completed",
                            "bg-[#C30000] text-white":
                              taskStatus == "not-completed",
                          }
                        )}
                      >
                        <p className="text-xs">{task.name}</p>
                        <p className="text-xs">{status[taskStatus]}</p>
                      </div>
                    );
                  })}
                </Description>
                <div className="flex justify-center gap-4">
                  <Button
                    buttonStyle="primary"
                    label={t("common:buttons:close")}
                    onclick={() => setIsOpen(false)}
                    className="px-2 py-1"
                  />
                </div>
              </DialogPanel>
            </div>
          </Dialog>
        </Fragment>
      )}
    </div>
  );
};

export default Assignments;
