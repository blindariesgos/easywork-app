import { useEffect, useMemo, useState } from "react";
import Column from "./components/Column";
import { toast } from "react-toastify";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import Card from "./components/Card";
import { createPortal } from "react-dom";
import useAppContext from "@/src/context/app";

const KanbanReceipts = () => {
  const [isLoading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const { lists } = useAppContext();

  const handleDragEnd = (result) => {
    setActiveId(null);
    setIsDragging(false);
    setLoading(true);

    const body = {
      status: result?.over?.id,
    };
  };

  function handleDragStart(event) {
    setActiveId(event.active.id);
    setIsDragging(true);
  }

  const colors = {
    Vigente: {
      primary: "#241F61",
      secondary: "#EDECFF",
    },
    "Por vencer en 5 días": {
      primary: "#0F8BBF",
      secondary: "#E3F7FF",
    },
    "Por vencer en 7 días": {
      primary: "#E96200",
      secondary: "#FFEEE2",
    },
    "Vencido 15 días": {
      primary: "#EF4800",
      secondary: "#FFEEE2",
    },
    "Vencidos 30 días": {
      primary: "#EF4800",
      secondary: "#FFEEE2",
    },
    "Vencido 45 días": {
      primary: "#EF4800",
      secondary: "#FFEEE2",
    },
    "Vencido 60 días": {
      primary: "#EF4800",
      secondary: "#FFEEE2",
    },
    Anulado: {
      primary: "#A3A3A3",
      secondary: "#FFFFFF",
    },
    Pagado: {
      primary: "#70B900",
      secondary: "#F7FFEB",
    },
  };

  useEffect(() => {
    console.log("receiptStages", lists?.receipts?.receiptStages);
  }, [lists]);

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      {isLoading && <LoaderSpinner />}
      <div className="w-full">
        <div className="overflow-x-scroll">
          <div className="pt-2 flex ">
            {lists?.receipts?.receiptStages?.map((column) => (
              <Column
                key={column.id}
                id={column.id}
                color={colors[column.name]}
                title={column.name}
              />
            ))}
          </div>
        </div>
      </div>
      {/* {createPortal(
        <DragOverlay>
          {activeId && data?.items?.find((x) => x.id == activeId)?.id ? (
            <Card policy={data?.items?.find((x) => x.id == activeId)} />
          ) : null}
        </DragOverlay>,
        document.body
      )} */}
    </DndContext>
  );
};

export default KanbanReceipts;
