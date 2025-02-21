import { useState } from "react";
import Column from "./components/Column";
import { updateAgentConnection } from "@/src/lib/apis";
import { toast } from "react-toastify";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import Card from "./components/Card";
import { connectionsStage } from "@/src/utils/constants";

const KanbanLeads = () => {
  const [isLoading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [itemDrag, setItemDrag] = useState();
  const [updateStages, setUpdateStages] = useState([]);

  const handleDragEnd = async (result) => {
    setActiveId(null);
    setIsDragging(false);
    setLoading(true);

    const body = {
      agentConnectionStageId: result?.over?.id,
    };

    const response = await updateAgentConnection(body, result?.active?.id);

    if (response.hasError) {
      const message = Array.isArray(response.message)
        ? response.message?.join(", ")
        : response.message;
      toast.error(
        message ?? "Se ha producido un error al actualizar, inténtelo de nuevo."
      );
      setLoading(false);
      return;
    }

    setLoading(false);
    toast.success("Agente actualizado correctamente.");

    setUpdateStages([result?.active?.data?.current?.stageId, result?.over?.id]);

    setLoading(false);
  };

  function handleDragStart(event) {
    setActiveId(event.active.id);
    setIsDragging(true);
  }

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      {(isLoading || !connectionsStage) && <LoaderSpinner />}
      <div className="overflow-x-auto">
        <div className="flex gap-2 pt-2 w-max min-h-[60vh]">
          {connectionsStage &&
            connectionsStage.map((column) => (
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
  );
};

export default KanbanLeads;
