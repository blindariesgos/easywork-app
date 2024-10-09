"use client";
import useSWR from "swr";
import fetcher from "../fetcher";

const getQueries = (filters) => {
  const getRepitKeys = (key, arr) => arr.map(item => `${key}=${item.id}`).join('&')
  if (Object.keys(filters).length == 0) return ""

  const getValue = (key) => {
    switch (key) {
      default:
        return `${key}=${filters[key]}`
    }
  }

  return Object.keys(filters).map(key =>
    Array.isArray(filters[key])
      ? getRepitKeys(key, filters[key])
      : getValue(key)).join('&')
}

export const useReceipts = ({ config = {}, filters = {} }) => {
  const queries = getQueries(filters)
  const configParams = Object.keys(config).map(key => `${key}=${config[key]}`).join('&')
  const url = `/sales/crm/polizas/receipts?${configParams}${queries.length > 0 ? `&${queries}` : ""}`
  console.log({ url })
  const { data, error, isLoading, mutate } = useSWR(
    url,
    fetcher,
  );
  console.log({ data, error })
  return {
    data,
    isLoading,
    isError: error,
    mutate
  };
};

export const useReceipt = (receiptId) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/sales/crm/polizas/receipts/${receiptId}`,
    fetcher,
  );

  return {
    data,
    isLoading,
    isError: error,
    mutate
  };
};

export const useReceiptsByPolicyId = (policyId) => {

  const { data, error, isLoading } = useSWR(
    `/sales/crm/polizas/receipts/poliza/${policyId}`,
    fetcher,
  );

  return {
    data,
    isLoading,
    isError: error,
  };
}

export const useSubAgents = ({ filters }) => {
  const params = Object.keys(filters).filter(key => filters[key]).map(key => `${key}=${filters[key]}`).join("&")
  const { data, error, isLoading, mutate } = useSWR(
    `/sales/crm/polizas/receipts/sub-agents?${params}`,
    fetcher,
  );

  return {
    data,
    isLoading,
    isError: error,
    mutate
  };
}



