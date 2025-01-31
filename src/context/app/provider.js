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
  getRelatedUsers,
} from "../../lib/apis";
import { handleApiError } from "../../utils/api/errors";
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

      appList.listContact = listContact;
      appList.users = users;
      appList.roles = roles;
      appList.policies = policies;
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
    try {
      const response = await getRelatedUsers();
      return response?.items ?? [];
    } catch (error) {
      handleApiError(error.message);
    }
  };

  const getListsContact = async () => {
    try {
      const response = await getAddListContacts();
      return response;
    } catch (error) {
      handleApiError(error.message);
    }
  };

  const getListsLead = async () => {
    try {
      const response = await getAddListLeads();
      return response;
    } catch (error) {
      handleApiError(error.message);
    }
  };

  const getListsReceipts = async () => {
    try {
      const response = await getAddListReceipts();
      return response;
    } catch (error) {
      handleApiError(error.message);
    }
  };

  const getRoles = async () => {
    try {
      const response = await getAllRoles();
      return response.items;
    } catch (error) {
      handleApiError(error.message);
    }
  };

  const getListsPolicies = async () => {
    try {
      const response = await getAddListPolicies();
      return response;
    } catch (error) {
      handleApiError(error.message);
    }
  };

  const getListsRecruitment = async () => {
    try {
      const response = await getAddListRecruitments();
      return response;
    } catch (error) {
      handleApiError(error.message);
    }
  };

  const getListsConnection = async () => {
    try {
      const response = await getAddListConnections();
      return response;
    } catch (error) {
      handleApiError(error.message);
    }
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
