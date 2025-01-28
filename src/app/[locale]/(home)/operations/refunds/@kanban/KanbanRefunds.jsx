import { Fragment, useState } from "react";
import Column from "./components/Column";
import { toast } from "react-toastify";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import Card from "./components/Card";
import { putRefund } from "@/src/lib/apis";
import SelectedOptionsTable from "@/src/components/SelectedOptionsTable";
import useCrmContext from "@/src/context/crm";
import { useTranslation } from "react-i18next";
import {
  polizaReimbursementStatus,
  polizaReimbursementStatusColor,
} from "@/src/utils/stages";
import useRefundContext from "@/src/context/refunds";

const KanbanProgramations = () => {
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [itemDrag, setItemDrag] = useState();
  const [updateStages, setUpdateStages] = useState([]);
  const { selectedContacts: selectedReceipts } = useCrmContext();
  const { mutate } = useRefundContext();

  const handleDragEnd = async (result) => {
    setActiveId(null);
    setIsDragging(false);
    setLoading(true);
    setItemDrag(null);
    console.log({ result });

    const body = {
      status: result?.over?.id,
    };

    try {
      const response = await putRefund(result?.active?.id, body);
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

  const items = Object.keys(polizaReimbursementStatus).map((key) => ({
    id: key,
    filter: {
      status: key,
    },
    title: polizaReimbursementStatus[key],
    primary: polizaReimbursementStatusColor[key],
  }));

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
          <div className="grid grid-cols-7 min-w-full w-max gap-2">
            {items?.map((column) => (
              <Column
                {...column}
                color={column.primary}
                key={column.id}
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
