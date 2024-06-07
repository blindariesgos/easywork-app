"use client";

import React, { useMemo, useState } from "react";
import { CrmContext } from "..";

export default function CrmContextProvider({ children }) {
  const [contacts, setContacts] = useState([]);
  const [crmUsers, setCrmUsers] = useState([]);
  const [currentContactID, setCurrentContactID] = useState(null);
  const [currentContact, setCurrentContact] = useState({});
  const [lastContactUpdate, setLastContactUpdate] = useState(null);
  const [lastContactsUpdate, setLastContactsUpdate] = useState(null);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [contactEditMode, setContactEditMode] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);

  const values = useMemo(
    () => ({
      contacts,
      setContacts,
      crmUsers,
      setCrmUsers,
      showAddContactModal,
      setShowAddContactModal,
      currentContact,
      setCurrentContact,
      currentContactID,
      setCurrentContactID,
      lastContactUpdate,
      setLastContactUpdate,
      lastContactsUpdate,
      setLastContactsUpdate,
      contactEditMode,
      setContactEditMode,
      selectedContacts,
      setSelectedContacts
    }),
    [
      contacts,
      crmUsers,
      showAddContactModal,
      currentContact,
      currentContactID,
      lastContactUpdate,
      lastContactsUpdate,
      contactEditMode,
      selectedContacts
    ]
  );

  return <CrmContext.Provider value={values}>{children}</CrmContext.Provider>;
}
