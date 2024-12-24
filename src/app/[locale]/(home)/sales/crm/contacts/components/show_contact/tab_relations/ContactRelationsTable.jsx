"use client";
import { useTranslation } from "react-i18next";
import Link from "next/link";

export default function ContactRelationsTable({ contact }) {
  const { t } = useTranslation();

  return (
    <div className="h-full relative px-4 lg:px-8">
      <div className="relative overflow-x-auto shadow-md rounded-xl">
        <table className="min-w-full rounded-md bg-gray-100 table-auto">
          <thead className="text-sm bg-white drop-shadow-sm">
            <tr className="">
              <th
                scope="col"
                className="py-3.5 flex px-2 pr-3 text-sm font-medium text-gray-400 cursor-pointer "
              >
                <div className="group inline-flex ">
                  {t("contacts:create:name-2")}
                </div>
              </th>
              <th
                scope="col"
                className="px-3  py-3.5 text-sm font-medium text-gray-400 cursor-pointer"
              >
                <div className="group inline-flex ">
                  {t("contacts:create:email")}
                </div>
              </th>
              <th
                scope="col"
                className={`px-3 py-3.5  text-sm font-medium text-gray-400 cursor-pointer rounded-e-xl`}
              >
                <div className="group inline-flex">
                  {t("contacts:create:phone")}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-100">
            {contact &&
              contact?.relations &&
              contact?.relations?.map((relation, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-black sm:pl-0 text-center cursor-pointer">
                    <Link
                      href={`/sales/crm/contacts/contact/${relation.id}?show=true`}
                    >
                      <div className="flex gap-2 px-2 hover:text-primary">
                        {contact.typePerson === "moral"
                          ? relation.fullName
                          : relation.name}
                      </div>
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
                    {relation?.emails[0]?.email?.email ?? "S/N"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
                    {relation?.phones[0]?.phone?.number ?? "S/N"}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
