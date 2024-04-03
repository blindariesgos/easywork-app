"use client";
import React from "react";
import Login from "./components/Login";
import GetPassword from "./components/GetPassword";
import ChangePassword from "./components/ChangePassword";
import DontRememberDetails from "./components/DontRememberDetails";
import CheckUser from "./components/CheckUser";
import ModalVideo from "./components/ModalVideo";

export default function Page() {
  return (
    <div style={{ backgroundColor: "#DFE3E6", borderRadius: "20px" }} class="w-auto py-7 px-6">
      {/* <Login /> */}
      {/* <GetPassword /> */}
      {/* <ChangePassword /> */}
      {/* <DontRememberDetails /> */}
      <CheckUser />
      <ModalVideo buttonOpen={
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 text-white bg-blue-500 rounded"
        >
          Abrir Modal
        </button>
      } />
    </div >
  )
}
