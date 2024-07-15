"use client";
import React, { useEffect, useMemo, useState } from "react";
import { AppContext } from "..";
import { contactTypes, driveViews } from "../../lib/common";
import { useCommon } from "../../hooks/useCommon";
import { getAddListContacts, getUsersContacts } from "../../lib/apis";
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
  const [sidebarOpenEmail, setSidebarOpenEmail] = useState(false);
  const [selectOauth, setSelectOauth] = useState(null);
  const [calendarView, setCalendarView] = useState(calendarViews[0]);
  const [driveView, setDriveView] = useState(driveViews[0]);
  const [openModal, setOpenModal] = useState(false);
  const [lists, setLists] = useState(null);
  const [filter, setFilter] = useState(null);

  useEffect(() => {
    const appList = {};
    const getLists = async () => {
      const users = await getUsers();
      const listContact = await getListsContact();
      appList.listContact = listContact;
      appList.users = users;
      setLists(appList);
    };
    if (session?.user?.accessToken && !lists) getLists();
  }, [session, lists]);

  const getUsers = async () => {
    try {
      const response = await getUsersContacts();
      return response;
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
    ],
  );

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
}
