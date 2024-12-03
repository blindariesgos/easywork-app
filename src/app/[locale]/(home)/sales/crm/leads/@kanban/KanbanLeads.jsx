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
      name: "Contacto Inicial",
      type: "stage",
      filter: {
        stageId: "a233b765-d97b-43b8-8b6a-46727d97c844",
      },
      color: "#0091cd",
    },
    {
      id: "92a2627b-dddc-4eb1-be37-1fb6ca018c89",
      type: "stage",
      filter: {
        stageId: "92a2627b-dddc-4eb1-be37-1fb6ca018c89",
      },
      name: "Presentar Propuesta",
      color: "#005b81",
    },
    {
      id: "0e9f3de8-0455-42ba-801c-d5ccf7358f99",
      type: "stage",
      filter: {
        stageId: "0e9f3de8-0455-42ba-801c-d5ccf7358f99",
      },
      name: "Propuesta en revisión",
      color: "#00374f",
    },
    {
      id: "eb58ffde-8fa6-4ac1-ac1b-3728b46cdc3b",
      type: "stage",
      filter: {
        stageId: "eb58ffde-8fa6-4ac1-ac1b-3728b46cdc3b",
      },
      name: "Trámite para emisión",
      color: "#234ebb",
    },
    {
      id: "38134146-c9a5-48a5-8175-aa2857bfd1a8",
      type: "stage",
      filter: {
        stageId: "38134146-c9a5-48a5-8175-aa2857bfd1a8",
      },
      name: "Emisión de póliza",
      color: "#234ebb",
    },

    {
      id: "d0332445-0863-46cb-89c5-0b1435cf280c",
      type: "cancelled",
      filter: {
        cancelReasonId: "d0332445-0863-46cb-89c5-0b1435cf280c",
      },
      name: "Cancela cita y no reagenda",
      color: "#bb2823",
    },
    {
      id: "eb8ffdd1-b5a4-41ce-ba94-eb5522cbcc64",
      type: "cancelled",
      filter: {
        cancelReasonId: "eb8ffdd1-b5a4-41ce-ba94-eb5522cbcc64",
      },
      name: "Documentos incompletos",
      color: "#bb2823",
    },
    {
      id: "5d44dc64-019c-4e94-9148-87cd5e5d30ba",
      type: "cancelled",
      filter: {
        cancelReasonId: "5d44dc64-019c-4e94-9148-87cd5e5d30ba",
      },
      name: "Lo verá con otra persona (familiar)",
      color: "#bb2823",
    },
    {
      id: "02f438aa-9298-420f-804e-62ee3559b777",
      type: "cancelled",
      filter: {
        cancelReasonId: "02f438aa-9298-420f-804e-62ee3559b777",
      },
      name: "No aprobado por aseguradora",
      color: "#bb2823",
    },
    {
      id: "e304b128-4ba6-4157-b6cb-656a6cdec85b",
      type: "cancelled",
      filter: {
        cancelReasonId: "e304b128-4ba6-4157-b6cb-656a6cdec85b",
      },
      name: "No contesta",
      color: "#bb2823",
    },
    {
      id: "dd3b68cd-4676-4bcc-899c-160e0ef2bbdd",
      type: "cancelled",
      filter: {
        cancelReasonId: "dd3b68cd-4676-4bcc-899c-160e0ef2bbdd",
      },
      name: "No le interesó",
      color: "#bb2823",
    },
    {
      id: "95b06de4-afb5-42c9-8205-fa072e5a1c29",
      type: "cancelled",
      filter: {
        cancelReasonId: "95b06de4-afb5-42c9-8205-fa072e5a1c29",
      },
      name: "No reagendó cita",
      color: "#bb2823",
    },
    {
      id: "d1cf3051-ecb4-41da-864f-c2c01877ad58",
      type: "cancelled",
      filter: {
        cancelReasonId: "d1cf3051-ecb4-41da-864f-c2c01877ad58",
      },
      name: "No tiene recursos",
      color: "#bb2823",
    },
    {
      id: "3ccd0900-ebcc-45d0-a7bf-a3f4aa7b7248",
      type: "cancelled",
      filter: {
        cancelReasonId: "3ccd0900-ebcc-45d0-a7bf-a3f4aa7b7248",
      },
      name: "Otro motivo no específico",
      color: "#bb2823",
    },
    {
      id: "4983f65d-b000-4406-821a-929ba1dca6d7",
      type: "cancelled",
      filter: {
        cancelReasonId: "4983f65d-b000-4406-821a-929ba1dca6d7",
      },
      name: "Pidió retomar en otra fecha",
      color: "#bb2823",
    },
    {
      id: "21ddc533-6c53-42c9-b088-c544222c9fcd",
      type: "cancelled",
      filter: {
        cancelReasonId: "21ddc533-6c53-42c9-b088-c544222c9fcd",
      },
      name: "Precio",
      color: "#bb2823",
    },
    {
      id: "195e1b3d-d2dc-44a8-89c9-12017a9044f7",
      type: "cancelled",
      filter: {
        cancelReasonId: "195e1b3d-d2dc-44a8-89c9-12017a9044f7",
      },
      name: "Póliza emitida - anulada aseguradora",
      color: "#bb2823",
    },
    {
      id: "46b04e7a-3775-4a00-abfa-c195d7e17b81",
      type: "positive",
      filter: {
        stageId: "46b04e7a-3775-4a00-abfa-c195d7e17b81",
      },
      name: "Póliza Generada",
      color: "#a9ea44",
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
