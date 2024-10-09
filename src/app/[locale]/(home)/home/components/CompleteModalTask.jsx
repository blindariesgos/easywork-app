import Button from "@/src/components/form/Button";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
  Field,
  Label,
  Radio,
  RadioGroup,
} from "@headlessui/react";
import { Fragment, useRef, useState } from "react";
import TextEditor from "../../tools/(tool)/tasks/components/TextEditor";
import { postComment, putTaskCompleted } from "../../../../../lib/apis";
import { toast } from "react-toastify";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { useTranslation } from "react-i18next";

const CompleteModalTask = ({ isOpen, setIsOpen, taskId, mutate }) => {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(false);
  const [comments, setComments] = useState("");
  const { t } = useTranslation();
  const quillRef = useRef();
  const options = [
    {
      label: "Si",
      value: true,
    },
    {
      label: "No",
      value: false,
    },
  ];

  const handleCompleteTask = async () => {
    setLoading(true);
    try {
      await putTaskCompleted(taskId);
      if (comments.length) {
        const body = {
          comment: comments,
          isSummary: false,
          taskId: taskId,
        };
        await postComment(body, taskId);
        console.log("comentario realizado");
      }
      toast.success(t("tools:tasks:completed-success"));
      mutate();
      setIsOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Ocurrio un error al actualizar la tarea intente mas tarde");
    }
    setLoading(false);
  };
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      {loading && <LoaderSpinner />}
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        {/* The actual dialog panel  */}
        <DialogPanel className="max-w-lg space-y-4 bg-white rounded-md w-full">
          <DialogTitle className="font-bold bg-primary text-white py-4 px-6 rounded-tr-md rounded-tl-md">
            Cerrar tarea
          </DialogTitle>
          <Description className="px-6 py-4 grid grid-cols-1 gap-2">
            <p>¿Confirma que desea terminar la tarea?</p>
            <RadioGroup
              value={selected}
              onChange={setSelected}
              aria-label="Server size"
              className="py-1"
            >
              {options.map((option) => (
                <Field key={option} className="flex items-center gap-2">
                  <Radio
                    value={option.value}
                    className="group flex size-5 items-center justify-center rounded-full border bg-white data-[checked]:bg-primary"
                  >
                    <span className="invisible size-2 rounded-full bg-white group-data-[checked]:visible" />
                  </Radio>
                  <Label>{option.label}</Label>
                </Field>
              ))}
            </RadioGroup>
            {selected && (
              <Fragment>
                <label htmlFor="">Comentario (Opcional)</label>
                <div className="border border-gray-600 rounded-md">
                  <TextEditor
                    quillRef={quillRef}
                    className="w-full"
                    setValue={setComments}
                    value={comments}
                  />
                </div>
              </Fragment>
            )}
          </Description>

          <div className="flex gap-4 p-4 justify-end">
            <Button
              label={"Cancelar"}
              buttonStyle="secondary"
              className="px-2 py-1"
              onclick={() => setIsOpen(false)}
            />
            <Button
              label={"Guardar"}
              buttonStyle="primary"
              className="px-2 py-1"
              disabled={!selected}
              onclick={handleCompleteTask}
            />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default CompleteModalTask;
