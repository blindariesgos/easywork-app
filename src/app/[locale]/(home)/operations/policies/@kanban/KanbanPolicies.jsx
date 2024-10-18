import usePolicyContext from "@/src/context/policies";
import { useEffect, useMemo, useState } from "react";
import FooterTable from "@/src/components/FooterTable";
import Column from "./components/Column";
import { putPoliza } from "@/src/lib/apis";
import { toast } from "react-toastify";
import { DndContext } from "@dnd-kit/core";
import LoaderSpinner from "@/src/components/LoaderSpinner";
const KanbanPolicies = () => {
  const { data, limit, setLimit, page, setPage, mutate } = usePolicyContext();
  const [isLoading, setLoading] = useState(false);
  const columnOrder = ["en_proceso", "activa", "cancelada"];
  const [isDragging, setIsDragging] = useState(false);
  const [activeId, setActiveId] = useState(null);

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
    setActiveId(null);
    setIsDragging(false);
    setLoading(true);

    const body = {
      status: result?.over?.id,
    };

    putPoliza(result?.active?.id, body)
      .then((response) => {
        if (response.hasError) {
          console.log(response);
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
              policies={policies[column]}
              isDragging={isDragging}
              activeId={activeId}
            />
          ))}
        </div>
      </div>
    </DndContext>
  );
};

export default KanbanPolicies;
