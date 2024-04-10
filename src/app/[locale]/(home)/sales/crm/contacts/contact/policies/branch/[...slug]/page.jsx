import SlideOver from "@/components/SlideOver";
import React, { Suspense } from "react";
import { getContact } from "@/lib/api";
import NotFound from "@/app/[locale]/not-found";
import PolizasHeader from "../../../../components/show_contact/tab_polizas/PolizasHeader";
import PolizasTab from "../../../../components/show_contact/tab_polizas/PolizasTab";

export default async function Page({ params: { slug } }) {
  const [ branch, id ] = slug;
  if  ( !branch || !id ) return <NotFound/>;
  
  if (branch)  return (
    <SlideOver openModal={true} colorTag="bg-green-primary" labelTag={branch}>
      <Suspense
        fallback={
          <div className="flex flex-col h-screen">
            <div className="flex flex-col flex-1 bg-zinc-200 opacity-100 shadow-xl text-zinc-800 overflow-hidden rounded-tl-3xl">
              </div>{" "}
          </div>
        }
      >
        <div className="w-full h-screen flex flex-col flex-1 bg-gray-600 opacity-100 shadow-xl text-black overflow-hidden rounded-tl-[35px] rounded-bl-[35px] p-4">
          <div className="flex flex-col flex-1 text-black overflow-hidden rounded-t-2xl rounded-bl-2xl relative p-4">
              <div className="flex items-start flex-col justify-between space-y-3">
                <h1 className="text-xl">{id}</h1>
                  <PolizasHeader contactID={id} selected="branch"/>
              </div>
            <PolizasTab contactID={id} base={1}/>
          </div>
        </div>
      </Suspense>
    </SlideOver>
  );
}
