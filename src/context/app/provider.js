"use client";
import React, { useEffect, useMemo, useState } from "react";
import { AppContext } from "..";
import { driveViews } from "../../lib/common";
import { useCommon } from "../../hooks/useCommon";
import { getAddListContacts, getUsersContacts } from "../../lib/apis";
import { getApiError } from "../../utils/getApiErrors";

export default function AppContextProvider({ children }) {
  const { calendarViews } = useCommon()
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarOpenEmail, setSidebarOpenEmail] = useState(false);
  const [calendarView, setCalendarView] = useState(calendarViews[0]);
  const [driveView, setDriveView] = useState(driveViews[0]);
  const [openModal, setOpenModal] = useState(false);
  const [lists, setLists] = useState(null);

  useEffect(() => {
    const getLists = async() => {
      if ( !lists ){
        const appList = {};
        const users = await getUsers();
        const listContact = await getListsContact();
        appList.listContact = listContact;
        appList.users = users;
        setLists(appList);
      }
    };
    getLists();
  }, [lists])

  const getUsers = async() => {
    try {
      const response = await getUsersContacts();   
      return response; 
    } catch (error) {
      getApiError(error, null, true);
    }
  }

  const getListsContact = async() => {
    try {
      const response =  await getAddListContacts();    
      return response;
    } catch (error) {
      getApiError(error, null, true);
    }
  }
  

  const values = useMemo(
    () => ({
      sidebarOpen,
      setSidebarOpen,
      sidebarOpenEmail,
      setSidebarOpenEmail,
      calendarView,
      setCalendarView,
      driveView,
      setDriveView,
      openModal,
      setOpenModal,
      setLists,
      lists

    }),
    [
      sidebarOpen,
      calendarView,
      driveView,
      openModal,
      sidebarOpenEmail,
      lists
    ]
  );

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
}
