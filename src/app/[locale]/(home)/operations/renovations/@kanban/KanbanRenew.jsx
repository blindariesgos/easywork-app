import { Fragment, useState } from "react";
import Column from "./components/Column";
import { toast } from "react-toastify";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import Card from "./components/Card";
import { putPoliza } from "@/src/lib/apis";
import SelectedOptionsTable from "@/src/components/SelectedOptionsTable";
import useCrmContext from "@/src/context/crm";
import {
  deleteTask as apiDeleteTask,
  putTaskCompleted,
  putTaskId,
  putTaskIdRelations,
} from "@/src/lib/apis";
import { useTranslation } from "react-i18next";
import { renovationStages } from "@/src/utils/stages";
import useRenovationContext from "@/src/context/renovations";

const KanbanProgramations = () => {
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [itemDrag, setItemDrag] = useState();
  const [updateStages, setUpdateStages] = useState([]);
  const { selectedContacts: selectedReceipts } = useCrmContext();
  const { mutate } = useRenovationContext();

  const handleDragEnd = async (result) => {
    setActiveId(null);
    setIsDragging(false);
    setLoading(true);
    setItemDrag(null);
    console.log({ result });

    const body = {
      renewalStageId: result?.over?.id,
    };

    try {
      const response = await putPoliza(result?.active?.id, body);
      console.log({ response });
      if (response.hasError) {
        toast.error(
          "Se ha producido un error al actualizar, inténtelo de nuevo."
        );
        setLoading(false);
        return;
      }
      toast.success(t("operations:refunds:update"));
      setUpdateStages([
        result?.active?.data?.current?.stageId,
        result?.over?.id,
      ]);
      mutate();
    } catch (error) {
      console.log({ error });
      toast.error(
        "Se ha producido un error al actualizar, inténtelo de nuevo."
      );
    }
    setLoading(false);
  };

  function handleDragStart(event) {
    setActiveId(event.active.id);
    setIsDragging(true);
  }

  return (
    <Fragment>
      {isLoading && <LoaderSpinner />}
      {selectedReceipts.length > 0 && (
        <div className="flex flex-col justify-start gap-2 items-start pb-2">
          <SelectedOptionsTable options={masiveActions} />
        </div>
      )}
      <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <div className="overflow-x-auto">
          <div className="flex min-w-full w-max gap-2 min-h-[60vh]">
            {renovationStages &&
              renovationStages.map((column) => (
                <Column
                  key={column.id}
                  {...column}
                  isDragging={isDragging}
                  activeId={activeId}
                  setItemDrag={setItemDrag}
                  updateStages={updateStages}
                  setUpdateStages={setUpdateStages}
                />
              ))}
          </div>
        </div>

        <DragOverlay>
          {activeId && itemDrag ? (
            <Card data={itemDrag} minWidthClass="240px" />
          ) : null}
        </DragOverlay>
      </DndContext>
    </Fragment>
  );
};

export default KanbanProgramations;
