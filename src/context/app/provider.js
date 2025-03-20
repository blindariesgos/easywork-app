"use client";
import React, { useEffect, useMemo, useState } from "react";
import { AppContext } from "..";
import { driveViews } from "../../lib/common";
import { useCommon } from "../../hooks/useCommon";
import {
  getAddListConnections,
  getAddListContacts,
  getAddListLeads,
  getAddListPolicies,
  getAddListReceipts,
  getAddListRecruitments,
  getAllRoles,
  getPoliciesCanceledReazons,
  getRelatedUsers,
} from "../../lib/apis";
import { useSession } from "next-auth/react";
import { encodeToModal } from "@/src/utils/formatters";

export default function AppContextProvider({ children }) {
  const { calendarViews } = useCommon();
  const { data: session } = useSession();

  // Estados iniciales agrupados por categoría
  // UI states
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarOpenDesktop1, setSidebarOpenDesktop1] = useState(true);
  const [sidebarOpenDesktop2, setSidebarOpenDesktop2] = useState(true);
  const [sidebarOpenEmail, setSidebarOpenEmail] = useState(false);
  const [openModalFolders, setOpenModalFolders] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  // User data states
  const [userGoogle, setUserGoogle] = useState(null);
  const [userData, setUserData] = useState(null);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectOauth, setSelectOauth] = useState(null);

  // App view states
  const [calendarView, setCalendarView] = useState(calendarViews[0]);
  const [driveView, setDriveView] = useState(driveViews[0]);
  const [filter, setFilter] = useState(null);

  // Data states
  const [lists, setLists] = useState(null);
  const [loading, setLoading] = useState(false);

  // Función para manejar errores de API de manera consistente
  const handleApiResponse = (response, errorSource) => {
    if (response.hasError) {
      console.error(errorSource);
      return [];
    }
    return response.items ? response.items : response;
  };

  // Funciones de fetching de datos refactorizadas
  const fetchData = async (apiFunction, errorSource) => {
    try {
      const response = await apiFunction();
      return handleApiResponse(response, errorSource);
    } catch (error) {
      console.error(`Error in ${errorSource}:`, error);
      return [];
    }
  };

  //Apertura de modales de detalles o submodulos
  const openGlobalModal = (data) => {
    const token = encodeToModal(data);
    console.log({ token });
  };

  // Efecto para cargar todos los datos necesarios
  useEffect(() => {
    const fetchAllData = async () => {
      // Solo cargamos datos si existe la sesión, no hay error y no hay datos ya cargados
      if (!session?.user?.access_token || session?.error || lists) return;

      setLoading(true);

      try {
        const [
          users,
          listContact,
          roles,
          policies,
          listLead,
          receipts,
          recruitments,
          connections,
          policyCanceledReazons,
        ] = await Promise.all([
          fetchData(getRelatedUsers, "getRelatedUsers"),
          fetchData(getAddListContacts, "getAddListContacts"),
          fetchData(getAllRoles, "getAllRoles"),
          fetchData(getAddListPolicies, "getAddListPolicies"),
          fetchData(getAddListLeads, "getAddListLeads"),
          fetchData(getAddListReceipts, "getAddListReceipts"),
          fetchData(getAddListRecruitments, "getAddListRecruitments"),
          fetchData(getAddListConnections, "getAddListConnections"),
          fetchData(getPoliciesCanceledReazons, "getPoliciesCanceledReazons"),
        ]);

        setLists({
          users,
          listContact,
          roles,
          policies: {
            ...policies,
            canceledReazons: policyCanceledReazons,
          },
          listLead,
          receipts,
          recruitments,
          connections,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [session, lists]);

  // Memoizamos el valor del contexto para evitar re-renders innecesarios
  const values = useMemo(
    () => ({
      // UI states
      sidebarOpen,
      setSidebarOpen,
      sidebarOpenDesktop1,
      setSidebarOpenDesktop1,
      sidebarOpenDesktop2,
      setSidebarOpenDesktop2,
      sidebarOpenEmail,
      setSidebarOpenEmail,
      openModalFolders,
      setOpenModalFolders,
      openModal,
      setOpenModal,
      openGlobalModal,

      // User data states
      userGoogle,
      setUserGoogle,
      userData,
      setUserData,
      selectedEmails,
      setSelectedEmails,
      selectOauth,
      setSelectOauth,

      // App view states
      calendarView,
      setCalendarView,
      driveView,
      setDriveView,
      filter,
      setFilter,

      // Data states
      lists,
      setLists,
      loading,
    }),
    [
      sidebarOpen,
      sidebarOpenDesktop1,
      sidebarOpenDesktop2,
      sidebarOpenEmail,
      openModalFolders,
      openModal,
      userGoogle,
      userData,
      selectedEmails,
      selectOauth,
      calendarView,
      driveView,
      filter,
      lists,
      loading,
    ]
  );

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
}
