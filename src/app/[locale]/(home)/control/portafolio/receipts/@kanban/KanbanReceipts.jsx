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
  const [itemDrag, setItemDrag] = useState();
  const handleDragEnd = (result) => {
    setActiveId(null);
    setIsDragging(false);
    setLoading(true);
    setItemDrag(null);
    const body = {
      status: result?.over?.id,
    };
    setLoading(false);
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

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      {isLoading && <LoaderSpinner />}
      <div className="overflow-x-auto">
        <div className="grid grid-cols-9 min-w-full w-max gap-2">
          {lists?.receipts?.receiptStages?.reverse()?.map((column) => (
            <Column
              key={column.id}
              id={column.id}
              color={colors[column.name]}
              title={column.name}
              activeId={activeId}
              setItemDrag={setItemDrag}
            />
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeId && itemDrag ? (
          <Card receipt={itemDrag} minWidthClass="240px" />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanReceipts;
