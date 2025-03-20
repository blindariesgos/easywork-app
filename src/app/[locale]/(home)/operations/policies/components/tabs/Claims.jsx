"use client";
import ReceiptEmpty from "../ReceiptEmpty";
import { useState } from "react";
import { LoadingSpinnerSmall } from "@/src/components/LoaderSpinner";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useClaims } from "@/src/lib/api/hooks/claims";
import { polizaClaimStatus } from "@/src/utils/constants";

export default function ClaimsByPolicyId({ policyId }) {
  const [config, setConfig] = useState({
    page: 1,
    limit: 10,
    orderBy: "name",
    order: "DESC",
  });
  const [filters, setFilters] = useState({ polizaId: policyId });

  const { data, isLoading } = useClaims({
    config,
    filters,
  });
  const router = useRouter();

  const handleShowReceipt = (id) => {
    router.push(`/operations/claims/claim/${id}?show=true`);
  };

  if (isLoading) {
    return <LoadingSpinnerSmall />;
  }

  if (!data || data?.items?.length === 0) {
    return <ReceiptEmpty type="Siniestros registrados" />;
  }

  return (
    <div className="h-full px-4 w-full">
      <div className="overflow-x-auto shadow-md rounded-xl">
        <table className="w-full rounded-md bg-gray-100 table-auto table">
          <thead className="text-sm bg-white drop-shadow-sm">
            <tr className="">
              <th
                scope="col"
                className="py-3.5 px-3  text-sm font-medium text-gray-400 cursor-pointer "
              >
                <div className="group items-center text-left">
                  NRO DE SINIESTRO
                </div>
              </th>
              <th
                scope="col"
                className="py-3.5 pr-3  text-sm font-medium text-gray-400 cursor-pointer "
              >
                <div className="group items-center text-left">NRO DE SIGRE</div>
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-center text-sm font-medium text-gray-400 cursor-pointer"
              >
                <div className="group inline-flex items-center">ESTATUS</div>
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-center text-sm font-medium text-gray-400 cursor-pointer"
              >
                <div className="group inline-flex items-center">
                  FECHA DE CREACION
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-100">
            {data &&
              data?.items?.length &&
              data?.items?.map((claim, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-black sm:pl-0 text-center cursor-pointer">
                    <div
                      className="flex gap-2 px-2 hover:text-primary"
                      onClick={() => handleShowReceipt(claim.id)}
                    >
                      {claim.ot ?? "No disponible"}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
                    {claim.sigre ?? "No disponible"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 uppercase text-center">
                    {polizaClaimStatus?.[claim.status] ??
                      polizaClaimStatus?.captura_documentos}
                  </td>

                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 text-center">
                    {moment(claim?.createdAt).format("DD/MM/YYYY")}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
