
import React, { Suspense } from "react";
import LayoutContact from "./LayoutContact";
import LoaderSpinner from "@/components/LoaderSpinner";


export default async function ContactLayout({ children, table }) {
  return (
    <div className="bg-gray-100 h-full p-2 rounded-xl relative">
      <LayoutContact>
        <Suspense
          fallback={
            <LoaderSpinner/>
          }
        >
            {table}
            {children}  
        </Suspense>
      </LayoutContact> 
    </div>
  );
}
