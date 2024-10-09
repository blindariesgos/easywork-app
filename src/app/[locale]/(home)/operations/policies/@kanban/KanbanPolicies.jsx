import usePolicyContext from "@/src/context/policies";
import { useEffect, useMemo, useState } from "react";
import { DragDropContext, resetServerContext } from "react-beautiful-dnd";
import FooterTable from "@/src/components/FooterTable";
import Column from "./components/Column";
import { putPoliza } from "@/src/lib/apis";
import { toast } from "react-toastify";

const KanbanPolicies = () => {
  const { data, limit, setLimit, page, setPage, mutate, isLoading } =
    usePolicyContext();
  const columnOrder = ["en_proceso", "activa", "cancelada"];
  const columns = {
    en_proceso: {
      id: "en_proceso",
      title: "En trámite",
      color: "#0091CD",
    },
    activa: {
      id: "activa",
      title: "Vigente",
      color: "#0077BF",
    },
    cancelada: {
      id: "cancelada",
      title: "Cancelada",
      color: "#CD1100",
    },
  };

  const [policies, setPolicies] = useState({
    en_proceso: [],
    activa: [],
    cancelada: [],
  });

  useEffect(() => {
    if (!data || !data?.items || !data?.items?.length === 0) return;
    const auxData = data?.items?.reduce(
      (acc, policy) => ({
        ...acc,
        [policy.status]: [...acc[policy.status], policy],
      }),
      {
        en_proceso: [],
        activa: [],
        cancelada: [],
        expirada: [],
      }
    );
    const { cancelada, expirada, ...others } = auxData;
    setPolicies({
      ...others,
      cancelada: [...expirada, ...cancelada],
    });
  }, [data]);

  const handleDragEnd = (result) => {
    console.log("handleDragEnd", result);
    const body = {
      status: result?.destination?.droppableId,
    };
    putPoliza(result?.draggableId, body)
      .then((response) => {
        if (response.hasError) {
          console.log(response);
          toast.error(
            "Se ha producido un error al actualizar la poliza, inténtelo de nuevo."
          );
          return;
        }
        toast.success("Poliza actualizada correctamente.");
        mutate();
      })
      .catch((error) => {
        toast.error(
          "Se ha producido un error al actualizar la poliza, inténtelo de nuevo."
        );
      });
  };

  useEffect(() => {
    resetServerContext();
  }, [policies]);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="w-full">
        <div className="grid grid-cols-3 gap-2 pt-2">
          {columnOrder.map((column) => (
            <Column
              key={columns[column].id}
              {...columns[column]}
              policies={policies[column]}
            />
          ))}
        </div>
        <div className="w-full pt-8">
          <FooterTable
            limit={limit}
            setLimit={setLimit}
            page={page}
            setPage={setPage}
            totalPages={data?.meta?.totalPages}
            total={data?.meta?.totalItems ?? 0}
          />
        </div>
      </div>
    </DragDropContext>
  );
};

export default KanbanPolicies;
