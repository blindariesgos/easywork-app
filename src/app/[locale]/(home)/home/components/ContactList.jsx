"use client";
import clsx from "clsx";
import Link from "next/link";
import { Fragment } from "react";
import Image from "next/image";
import { LoadingSpinnerSmall } from "@/src/components/LoaderSpinner";
import { useContactsNeedAttention } from "@/src/lib/api/hooks/home";

const ContactList = () => {
  const { contacts, isLoading } = useContactsNeedAttention();

  return (
    <div
      className={clsx(
        "col-span-1 md:col-span-2 bg-white rounded-lg p-2 h-72 flex items-center flex-col",
        {
          "justify-between": !contacts?.length,
        }
      )}
    >
      <h1 className="h-1/6 font-medium w-full">
        Clientes que requieren atención
      </h1>
      {isLoading ? (
        <LoadingSpinnerSmall color="primary" />
      ) : contacts && contacts.length > 0 ? (
        <div className="flex flex-col gap-2 overflow-y-auto w-full pr-1 h-full">
          {contacts.map((contact) => (
            <Link
              className="flex flex-col gap-1 cursor-pointer hover:bg-easy-300 rounded-md p-1"
              href={`/sales/crm/contacts/contact/${contact.id}?show=true`}
              key={contact.id}
            >
              <div className="flex gap-2 items-center">
                <Image
                  className="h-12 w-12 rounded-full object-cover"
                  width={36}
                  height={36}
                  src={contact?.photo || "/img/avatar.svg"}
                  alt=""
                />
                <div>
                  <p className="text-sm">{contact.fullName}</p>
                  {contact?.emails?.length > 0 && (
                    <p className="text-xs text-gray-50">
                      {contact?.emails[0]?.email?.email}
                    </p>
                  )}
                  {contact?.phones?.length > 0 && (
                    <p className="text-xs text-gray-50">
                      {contact?.phones[0]?.phone?.number}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <Fragment>
          <div className="flex justify-center items-center bg-slate-200 shadow-lg text-center rounded-lg w-full h-[60px]">
            <h1 className="text-sm p-2">
              ¡Buen trabajo! tus clientes están al día
            </h1>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default ContactList;
