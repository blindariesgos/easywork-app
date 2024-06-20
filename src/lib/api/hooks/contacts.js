"use client";
import useSWR from "swr";
import fetcher from "../fetcher";

export const useContacts = ({page = 1})=>{
  const { data, error, isLoading} = useSWR(`/sales/crm/contacts?limit=10&page=${page}`, fetcher);
  console.log(data, error);

  return {
      contacts: data,
      isLoading,
      isError: error
    };
}

export const useContact = (id) => {
  const { data, error, isLoading } = useSWR(`/sales/crm/contacts/${id}`, fetcher);

  return {
    task: data,
    isLoading,
    isError: error,
  };
};