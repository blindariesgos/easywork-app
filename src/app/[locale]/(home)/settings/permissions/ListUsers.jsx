'use client';
import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import Tag from "../../../../../components/Tag";
import { useRouter, useSearchParams } from "next/navigation";
// import TextEditor from "../../tasks/components/TextEditor";
// import SelectDropdown from "./SelectDropdown";
import useAppContext from "../../../../../context/app";
import { toast } from "react-toastify";
import * as yup from "yup";
import axios from "axios";


export default function ListUsers({
  previousModalPadding,
}) {
  const { t } = useTranslation();
  const session = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const { lists, setFilter } = useAppContext();

  const schema = yup.object().shape({
    responsible: yup.string(),
  });

  useEffect(() => {

  }, [params.get("listusers")]);

  return (
    <Transition.Root show={params.get("listusers")} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        <div className="fixed inset-0" />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-0 2xl:pl-52">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel
                  className={`pointer-events-auto w-screen drop-shadow-lg ${previousModalPadding}`}
                >
                  <div className="flex justify-end h-screen">
                  
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
