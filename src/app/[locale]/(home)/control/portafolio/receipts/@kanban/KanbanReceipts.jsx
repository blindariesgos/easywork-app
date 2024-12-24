import { Fragment, useEffect, useMemo, useState } from "react";
import Column from "./components/Column";
import { toast } from "react-toastify";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import Card from "./components/Card";
import { createPortal } from "react-dom";
import useAppContext from "@/src/context/app";
import { putReceipt } from "@/src/lib/apis";
import moment from "moment";
import SelectedOptionsTable from "@/src/components/SelectedOptionsTable";
import useCrmContext from "@/src/context/crm";

const KanbanReceipts = () => {
  const [isLoading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const { lists } = useAppContext();
  const [itemDrag, setItemDrag] = useState();
  const [updateStages, setUpdateStages] = useState([]);
  const { selectedContacts: selectedReceipts } = useCrmContext();

  const handleDragEnd = async (result) => {
    setActiveId(null);
    setIsDragging(false);
    setLoading(true);
    setItemDrag(null);
    console.log({ result });
    if (result?.over?.data?.current?.status !== "pagado") {
      toast.warn("Solo puede mover los recibos a la columna de Pagado");
      setLoading(false);
      return;
    }
    const body = {
      status: "pagado",
      stageId: result?.over?.id,
      paymentDate: moment().format(),
    };

    try {
      const response = await putReceipt(result?.active?.id, body);
      if (response.hasError) {
        toast.error(
          "Se ha producido un error al actualizar el recibo, inténtelo de nuevo."
        );
        setLoading(false);
        return;
      }
      toast.success("Recibo actualizado correctamente.");
      setUpdateStages([
        result?.active?.data?.current?.stageId,
        result?.over?.id,
      ]);
    } catch (error) {
      console.log({ error });
      toast.error(
        "Se ha producido un error al actualizar el recibo, inténtelo de nuevo."
      );
    }
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

  const masiveActions = [
    // {
    //   id: 1,
    //   name: t("common:buttons:delete"),
    //   onclick: () => deleteReceipts(selectedReceipts),
    // },
    {
      id: 2,
      name: "Crear tarea",
      // onclick: () => deleteReceipts(selectedReceipts),
      disabled: true,
    },
    {
      id: 3,
      name: "Agregar Observador",
      // onclick: () => deleteReceipts(selectedReceipts),
      disabled: true,
    },
  ];

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
          <div className="grid grid-cols-9 min-w-full w-max gap-2">
            {lists?.receipts?.receiptStages?.map((column) => (
              <Column
                key={column.id}
                id={column.id}
                color={colors[column.name]}
                title={column.name}
                activeId={activeId}
                setItemDrag={setItemDrag}
                status={column.status}
                updateStages={updateStages}
                setUpdateStages={setUpdateStages}
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
    </Fragment>
  );
};

export default KanbanReceipts;
