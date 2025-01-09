import useSWR from "swr";
import fetcher from "../fetcher";

export const usePoliciesNeedAttention = () => {
  const url = `/tools/tasks/home/lists/polizas`;
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  return {
    policies: data,
    isLoading,
    isError: !!error,
    mutate,
  };
};

export const useContactsNeedAttention = () => {
  const url = `/tools/tasks/home/lists/contacts`;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  return {
    contacts: data,
    isLoading,
    isError: !!error,
    mutate,
  };
};
