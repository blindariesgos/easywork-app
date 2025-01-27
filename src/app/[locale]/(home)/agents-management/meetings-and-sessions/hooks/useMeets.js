import { deleteMeetById } from "@/src/lib/apis";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const useMeets = ({ type }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const deleteMeet = async (id) => {
    setLoading(true);
    const response = await deleteMeetById(id);
    if (response.hasError) {
      toast.error(response?.error?.message ?? t("common:alert:error-retry"));
      setLoading(false);
      return;
    }
    toast.error(t("common:alert:delete-success"));
    setLoading(false);
  };

  const itemActions = [
    {
      name: "Ver",
      handleClick: (meet) =>
        router.push(
          `/agents-management/meetings-and-sessions/${type}/meet/${meet.id}?show=true`
        ),
    },
    {
      name: "Crear",
      handleClick: (meet) => {
        if (meet?.agents?.length > 0) {
          router.push(
            `/agents-management/meetings-and-sessions/${type}/meet?show=true&prev=agent-meet&prev_id=${meet?.agents?.map((x) => x.id).join("^")}`
          );
        } else {
          toast.warning("La junta no tiene agente asignado");
        }
      },
    },
    {
      name: "Editar",
      handleClick: (meet) =>
        router.push(
          `/agents-management/meetings-and-sessions/${type}/meet/${meet.id}/edit?show=true`
        ),
    },
    {
      name: "Eliminar",
      handleClick: (meet) => deleteMeet(meet.id),
    },
  ];

  return {
    loading,
    setLoading,
    itemActions,
  };
};

export default useMeets;
