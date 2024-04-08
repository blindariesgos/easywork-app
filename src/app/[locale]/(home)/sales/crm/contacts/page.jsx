"use client";
import useCrmContext from "@/context/crm";
import { getContacts } from "@/lib/api";
import React, { useEffect } from "react";

export default function Page() {
  const { setContacts, lastContactsUpdate } = useCrmContext();

  useEffect(() => {
    async function fetchData() {
      const response = await getContacts();
      // setContacts(response);
      setContacts([
        {
          id: 1,
          nombre: "Correo Ventas del mes de agosto",
          activity: "Enero, 28 05:40 pm",
          contact: "No especificado",
          policy: "No especificado",
          limitDate: "26/01/2024",
          createdBy: {
            name: "Rosmer Campos",
            image:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          },
          responsiblePerson: {
            name: "Rosmer Campos",
            image:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          },
        },
        {
          id: 2,
          nombre: "Correo Ventas del mes de septiembre",
          activity: "Enero, 28 10:40 am",
          contact: "No especificado",
          policy: "No especificado",
          limitDate: "28/01/2024",
          createdBy: {
            name: "Rosmer Campos",
            image:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          },
      
          responsiblePerson: {
            name: "Rosmer Campos",
            image:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          },
        },
        {
          id: 3,
          nombre: "Actualizar póliza de seguro",
          activity: "Enero, 29 09:40 am",
          contact: "No especificado",
          policy: "No especificado",
          limitDate: "30/01/2024",
          createdBy: {
            name: "Rosmer Campos",
            image:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          },
          responsiblePerson: {
            name: "Rosmer Campos",
            image:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          },
        },
        // More tasks...
      ])
    }

    fetchData();
  }, [lastContactsUpdate]);

  return <></>;
}
