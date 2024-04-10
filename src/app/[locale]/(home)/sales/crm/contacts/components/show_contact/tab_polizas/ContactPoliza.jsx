import React from "react";
import PolizasHeader from "./PolizasHeader";
import PolizasTab from "./PolizasTab";

export default function ContactPoliza({contactID}) {
  return (
    <div className="w-full h-screen flex flex-col flex-1 bg-gray-600 opacity-100 shadow-xl text-black overflow-hidden rounded-tl-[35px] rounded-bl-[35px] p-4">
      <div className="flex flex-col flex-1 text-black overflow-hidden rounded-t-2xl rounded-bl-2xl relative p-4">
          <div className="flex items-start flex-col justify-between space-y-3">
            <h1 className="text-xl">{contactID}</h1>
              <PolizasHeader contactID={contactID} selected="general"/>
          </div>
        <PolizasTab contactID={contactID} />
      </div>
    </div>
  );
}
