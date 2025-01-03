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

  const columns = [
    {
      id: "a233b765-d97b-43b8-8b6a-46727d97c844",
      name: "Contacto inicial",
      type: "stage",
      filter: {
        stageId: "a233b765-d97b-43b8-8b6a-46727d97c844",
      },
      color: "#241F61",
    },
    {
      id: "92a2627b-dddc-4eb1-be37-1fb6ca018c89",
      type: "stage",
      filter: {
        stageId: "92a2627b-dddc-4eb1-be37-1fb6ca018c89",
      },
      name: "Entrevistados",
      color: "#0F8BBF",
    },
    {
      id: "0e9f3de8-0455-42ba-801c-d5ccf7358f99",
      type: "stage",
      filter: {
        stageId: "0e9f3de8-0455-42ba-801c-d5ccf7358f99",
      },
      name: "Aplicando Evaluaciones",
      color: "#E96200",
    },
    {
      id: "eb58ffde-8fa6-4ac1-ac1b-3728b46cdc3b",
      type: "stage",
      filter: {
        stageId: "eb58ffde-8fa6-4ac1-ac1b-3728b46cdc3b",
      },
      name: "Ingreso Aprobado",
      color: "#00A130",
    },
    {
      id: "38134146-c9a5-48a5-8175-aa2857bfd1a8",
      type: "stage",
      filter: {
        stageId: "38134146-c9a5-48a5-8175-aa2857bfd1a8",
      },
      name: "Ingreso No Aprobado",
      color: "#C30000",
    },

    {
      id: "d0332445-0863-46cb-89c5-0b1435cf280c",
      type: "cancelled",
      filter: {
        cancelReasonId: "d0332445-0863-46cb-89c5-0b1435cf280c",
      },
      name: "Contactar después - no tiene disponibilidad",
      color: "#C30000",
    },
    {
      id: "eb8ffdd1-b5a4-41ce-ba94-eb5522cbcc64",
      type: "cancelled",
      filter: {
        cancelReasonId: "eb8ffdd1-b5a4-41ce-ba94-eb5522cbcc64",
      },
      name: "Contactar después - no cumple FV",
      color: "#C30000",
    },
    {
      id: "5d44dc64-019c-4e94-9148-87cd5e5d30ba",
      type: "cancelled",
      filter: {
        cancelReasonId: "5d44dc64-019c-4e94-9148-87cd5e5d30ba",
      },
      name: "No contactar mas",
      color: "#C30000",
    },
    {
      id: "02f438aa-9298-420f-804e-62ee3559b777",
      type: "cancelled",
      filter: {
        cancelReasonId: "02f438aa-9298-420f-804e-62ee3559b777",
      },
      name: "Observaciones por CNSF",
      color: "#C30000",
    },
  ];

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
