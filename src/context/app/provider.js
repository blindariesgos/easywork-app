"use client";
import React, { useEffect, useMemo, useState } from "react";
import { AppContext } from "..";
import { contactTypes, driveViews } from "../../lib/common";
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
import { handleApiError, handleFrontError } from "../../utils/api/errors";
import { useSession } from "next-auth/react";

export default function AppContextProvider({ children }) {
  const { calendarViews } = useCommon();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarOpenDesktop1, setSidebarOpenDesktop1] = useState(true);
  const [sidebarOpenDesktop2, setSidebarOpenDesktop2] = useState(true);
  const [openModalFolders, setOpenModalFolders] = useState(false);
  const [userGoogle, setUserGoogle] = useState(null);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [sidebarOpenEmail, setSidebarOpenEmail] = useState(false);
  const [selectOauth, setSelectOauth] = useState(null);
  const [calendarView, setCalendarView] = useState(calendarViews[0]);
  const [driveView, setDriveView] = useState(driveViews[0]);
  const [openModal, setOpenModal] = useState(false);
  const [lists, setLists] = useState(null);
  const [filter, setFilter] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const appList = {};
    const getLists = async () => {
      setLoading(true);
      const users = await getUsers();
      const listContact = await getListsContact();
      const roles = await getRoles();
      const policies = await getListsPolicies();
      const listLead = await getListsLead();
      const receipts = await getListsReceipts();
      const recruitments = await getListsRecruitment();
      const connections = await getListsConnection();
      const policyCanceledReazons = await getPolicyCancelReazon();

      appList.listContact = listContact;
      appList.users = users;
      appList.roles = roles;
      appList.policies = {
        ...policies,
        canceledReazons: policyCanceledReazons,
      };
      appList.listLead = listLead;
      appList.receipts = receipts;
      appList.recruitments = recruitments;
      appList.connections = connections;
      setLists(appList);
      setLoading(false);
    };
    if (session?.user?.access_token && !lists) getLists();
  }, [session, lists]);

  const getUsers = async () => {
    const response = await getRelatedUsers();
    if (response.hasError) {
      console.error("getRelatedUsers");
      handleFrontError(response);
      return [];
    }
    return response?.items ?? [];
  };

  const getListsContact = async () => {
    const response = await getAddListContacts();
    if (response.hasError) {
      console.error("getAddListContacts");
      handleFrontError(response);
      return [];
    }
    return response;
  };

  const getListsLead = async () => {
    const response = await getAddListLeads();
    if (response.hasError) {
      console.error("getAddListLeads");
      handleFrontError(response);
      return [];
    }
    return response;
  };

  const getListsReceipts = async () => {
    const response = await getAddListReceipts();
    if (response.hasError) {
      console.error("getAddListReceipts");
      handleFrontError(response);
      return [];
    }
    return response;
  };

  const getRoles = async () => {
    const response = await getAllRoles();
    if (response.hasError) {
      console.error("getAllRoles");
      handleFrontError(response);
      return [];
    }
    return response.items;
  };

  const getListsPolicies = async () => {
    const response = await getAddListPolicies();
    if (response.hasError) {
      console.error("getAddListPolicies");
      handleFrontError(response);
      return [];
    }
    return response;
  };

  const getPolicyCancelReazon = async () => {
    const response = await getPoliciesCanceledReazons();
    if (response.hasError) {
      console.error("getPolicyCancelReazon");
      handleFrontError(response);
      return [];
    }
    return response;
  };

  const getListsRecruitment = async () => {
    const response = await getAddListRecruitments();
    if (response.hasError) {
      console.error("getAddListRecruitments");
      handleFrontError(response);
      return [];
    }
    return response;
  };

  const getListsConnection = async () => {
    const response = await getAddListConnections();
    if (response.hasError) {
      console.error("getAddListConnections");
      handleFrontError(response);
      return [];
    }
    return response;
  };

  const values = useMemo(
    () => ({
      sidebarOpen,
      setSidebarOpen,
      sidebarOpenDesktop1,
      setSidebarOpenDesktop1,
      sidebarOpenDesktop2,
      setSidebarOpenDesktop2,
      sidebarOpenEmail,
      setSidebarOpenEmail,
      setSelectOauth,
      selectOauth,
      calendarView,
      setCalendarView,
      driveView,
      setDriveView,
      openModal,
      setOpenModal,
      setLists,
      lists,
      setOpenModalFolders,
      openModalFolders,
      setUserGoogle,
      userGoogle,
      setFilter,
      filter,
      setSelectedEmails,
      selectedEmails,
      setUserData,
      userData,
      loading,
    }),
    [
      sidebarOpen,
      calendarView,
      driveView,
      openModal,
      sidebarOpenEmail,
      lists,
      sidebarOpenDesktop1,
      sidebarOpenDesktop2,
      openModalFolders,
      userGoogle,
      filter,
      selectOauth,
      selectedEmails,
      userData,
      loading,
    ]
  );

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
}
