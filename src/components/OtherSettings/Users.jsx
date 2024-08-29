"use client";
import { Dialog, Transition, Switch } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";

export function Users() {
  const [enabled, setEnabled] = useState(false);
  return (
    <>
      <div className="bg-white rounded-lg p-5">
        <div className="mr-3 w-full">
          <h1 className="pb-2 w-full">
            Configure el perfil de usuario de acuerdo con los estándares de su empresa
          </h1>

        </div>
      </div>
    </>
  );
}
