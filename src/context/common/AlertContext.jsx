'use client'
import { createContext, useContext, useState } from "react";

const AlertContext = createContext(undefined);

export function AlertContextProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [stateAlert, setStateAlert] = useState({
      isOpen: false,
      title: "",
      title1: "",
      description: "",
      buttonAccept: false,
      buttonCancel: false,
      buttonAcceptLabel: "",
      buttonCancelLabel: "",        
      onButtonAcceptClicked: () => {},
      onButtonCancelClicked: () => {},  
      route: "",
  })
  
  const onDisabled = (bool) => {
    setDisabled(bool);
  }
  const onCloseAlertDialog = () => {
      setIsOpen(false);
  }

  
  const onOpenAlertDialog = (alertDetails) => {
    setIsOpen(true);
    setStateAlert(alertDetails);
  }

  const value = {
    stateAlert,
    isOpen,
    setIsOpen,
    onOpenAlertDialog,
    onCloseAlertDialog,
    onDisabled,
    disabled
  }

  return (
    <AlertContext.Provider value={value}>
      {children}  
    </AlertContext.Provider>
  );
}

export function useAlertContext() {
  return useContext(AlertContext);
}
