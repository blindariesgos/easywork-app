import usePolicyContext from "@/src/context/policies";
import { useEffect, useMemo, useState } from "react";
import FooterTable from "@/src/components/FooterTable";
import Column from "./components/Column";
import { putPoliza } from "@/src/lib/apis";
import { toast } from "react-toastify";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import Card from "./components/Card";
import { createPortal } from "react-dom";
const KanbanPolicies = () => {
  const { data, limit, setLimit, page, setPage, mutate } = usePolicyContext();
  const [isLoading, setLoading] = useState(false);
  const columnOrder = ["en_proceso", "activa", "cancelada"];
  const [isDragging, setIsDragging] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [itemDrag, setItemDrag] = useState();
  const [updateStages, setUpdateStages] = useState([]);

  const columns = {
    en_proceso: {
      id: "en_proceso",
      title: "En trámite",
      color: "#0091CD",
      filter: {
        status: "en_proceso",
      },
    },
    activa: {
      id: "activa",
      title: "Vigente",
      color: "#0077BF",
      filter: {
        status: "activa",
      },
    },
    cancelada: {
      id: "cancelada",
      title: "No vigente",
      color: "#CD1100",
      filter: {
        status: "expirada",
      },
    },
  };

  const handleDragEnd = (result) => {
    setActiveId(null);
    setIsDragging(false);
    setLoading(true);

    const body = {
      status: result?.over?.id,
    };

    putPoliza(result?.active?.id, body)
      .then((response) => {
        if (response.hasError) {
          toast.error(
            "Se ha producido un error al actualizar la poliza, inténtelo de nuevo."
          );
          return;
        }
        setLoading(false);
        toast.success("Poliza actualizada correctamente.");
        mutate();
      })
      .catch((error) => {
        setLoading(false);
        toast.error(
          "Se ha producido un error al actualizar la poliza, inténtelo de nuevo."
        );
      });
  };

  function handleDragStart(event) {
    setActiveId(event.active.id);
    setIsDragging(true);
  }

  useEffect(() => {
    setLimit(100);
  }, []);

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      {isLoading && <LoaderSpinner />}
      <div className="w-full">
        <div className="grid grid-cols-3 gap-2 pt-2 min-h-[60vh]">
          {columnOrder.map((column) => (
            <Column
              key={columns[column].id}
              {...columns[column]}
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
        {activeId && itemDrag ? <Card policy={itemDrag} /> : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanPolicies;
