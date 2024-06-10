"use client";
import useSWR from "swr";
import fetcher from "../fetcher";

export const useContacts = (page = 1)=>{
    console.log("Cargando contactos");

    const { data, error, isLoading} = useSWR(`/sales/crm/contacts?limit=6&page=${page}`, fetcher);
    console.log(data, error);

    return {
        contact: data,
        isLoading,
        isError: error
      };
}