import { Fragment, useState } from "react";
import ConnectCRM from "./dialogs/ConnectCRM";
import { FaPlusCircle } from "react-icons/fa";
import useDriveContext from "@/src/context/drive";

const ConnectCRMButton = ({ folder }) => {
  const { setFolderConnect, setIsOpenConnect } = useDriveContext();
  return (
    <FaPlusCircle
      className="text-primary cursor-pointer w-6 h-6"
      onClick={() => {
        setFolderConnect(folder);
        setIsOpenConnect(true);
      }}
    />
  );
};

export default ConnectCRMButton;
