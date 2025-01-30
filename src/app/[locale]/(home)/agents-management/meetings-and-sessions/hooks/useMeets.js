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

  return {
    loading,
    setLoading,
    deleteMeet,
  };
};

export default useMeets;
