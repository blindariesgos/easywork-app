import { useEffect, useMemo, useState } from "react";
import Column from "./components/Column";
import {
  getLeadCancelReazon,
  putLeadStage,
  putPoliza,
  updateLead,
} from "@/src/lib/apis";
import { toast } from "react-toastify";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import Card from "./components/Card";
import useAppContext from "@/src/context/app";

const KanbanLeads = () => {
  const [isLoading, setLoading] = useState(false);
  const { lists } = useAppContext();
  const [isDragging, setIsDragging] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [itemDrag, setItemDrag] = useState();
  const [updateStages, setUpdateStages] = useState([]);

  const [columns, setColumns] = useState();

  const getItems = async () => {
    setLoading(true);
    const reazons = await getLeadCancelReazon().then((resp) =>
      resp.data ? resp.data : []
    );
    const stages = lists?.listLead?.leadStages?.map((stage) => ({
      id: stage.id,
      name: stage.name,
      type: "stage",
      filter: {
        stageId: stage.id,
      },
    }));
    setColumns([...stages]);
    setLoading(false);
  };

  useEffect(() => {
    if (!lists?.listLead?.leadStages) return;

    getItems();
  }, [lists?.listLead?.leadStages]);

  const handleDragEnd = async (result) => {
    setActiveId(null);
    setIsDragging(false);
    setLoading(true);

    const type = result?.over?.data?.current?.type;

    if (type === "stage") {
      const response = await putLeadStage(result?.active?.id, result?.over?.id);
      if (response.hasError) {
        console.log(response);
        toast.error(
          "Se ha producido un error al actualizar el prospecto, inténtelo de nuevo."
        );
        return;
      }
      setLoading(false);
      toast.success("Prospecto actualizado correctamente.");
    }

    setUpdateStages([result?.active?.data?.current?.stageId, result?.over?.id]);

    console.log({ result });

    // putPoliza(result?.active?.id, body)
    //   .then((response) => {
    //     if (response.hasError) {
    //       console.log(response);
    //       toast.error(
    //         "Se ha producido un error al actualizar la poliza, inténtelo de nuevo."
    //       );
    //       return;
    //     }
    //     setLoading(false);
    //     toast.success("Poliza actualizada correctamente.");
    //   })
    //   .catch((error) => {
    //     setLoading(false);
    //     toast.error(
    //       "Se ha producido un error al actualizar la poliza, inténtelo de nuevo."
    //     );
    //   });
    setLoading(false);
  };

  function handleDragStart(event) {
    setActiveId(event.active.id);
    setIsDragging(true);
  }

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      {(isLoading || !columns) && <LoaderSpinner />}
      <div className="overflow-x-auto">
        <div className="flex gap-2 pt-2 w-max min-h-[60vh]">
          {columns &&
            columns.map((column) => (
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
          <Card lead={itemDrag} minWidthClass="240px" />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanLeads;
