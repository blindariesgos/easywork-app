"use client";
import { useLeads } from "../../../../../../../hooks/useCommon";
import React, { Fragment, useEffect, useState } from "react";
import DialogPositiveStage from "./DialogPositiveStage";
import ValidatePolizaData from "./ValidatePolizaData";
import useAppContext from "@/src/context/app";
import { MdKeyboardArrowRight } from "react-icons/md";
import clsx from "clsx";
import {
  getPolizaLeadData,
  putLeadCancelled,
  putLeadStage,
} from "@/src/lib/apis";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import useLeadContext from "@/src/context/leads";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { handleFrontError } from "@/src/utils/api/errors";
import ManualPolicyUpload from "./ManualPolicyUpload";

export default function ProgressStages({ stage, leadId, disabled, lead }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenUpload, setIsOpenUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const { lists } = useAppContext();
  const [stageIndex, setStageIndex] = useState(0);
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const {
    mutate: mutateLeads,
    setPolicyInfo,
    setIsOpenValidation,
  } = useLeadContext();

  useEffect(() => {
    let index = lists?.listLead?.leadStages?.findIndex(
      (x) => x.name == stage?.name
    );
    setStageIndex(index);
  }, [lists?.listLead?.leadStages, stage]);

  const handleUpdateState = async (stageId) => {
    setLoading(true);
    try {
      const response = await putLeadStage(leadId, stageId);
      if (response.hasError) {
        setLoading(false);
        toast.error("Ocurrio un error al actualizar el estado");
        return;
      }
      mutate(`/sales/crm/leads/${leadId}/activities`);
      mutate(`/sales/crm/leads/${leadId}`);
      mutateLeads();
      toast.success("Prospecto actualizado con éxito");
    } catch {
      toast.error("Ocurrio un error al actualizar el estado");
    }
    setLoading(false);
  };

  const handleAddPolicy = async () => {
    setLoading(true);
    const response = await getPolizaLeadData(leadId);
    if (response.hasError) {
      if (response.statusCode == 404) {
        setIsOpen(false);
        setIsOpenUpload(true);
        setLoading(false);
        return;
      }
      handleFrontError(response);
      setLoading(false);
      return;
    }

    setPolicyInfo(response);
    setIsOpen(false);
    setIsOpenValidation(true);
    setLoading(false);
  };

  const handleSubmitNegativeStage = async () => {
    setLoading(true);
    try {
      const response = await putLeadCancelled(leadId, {
        cancelReasonId: selectedReason,
      });
      if (response.hasError) {
        toast.error("Ocurrio un error al actualizar el estado");
        setLoading(false);
        return;
      }
      router.back();
      mutateContext(
        "/sales/crm/leads?limit=5&page=1&orderBy=createdAt&order=DESC"
      );
      toast.success("Prospecto actualizado con éxito");
    } catch {
      toast.error("Ocurrio un error al actualizar el estado");
    }
    setLoading(false);
  };

  return (
    <Fragment>
      {loading && <LoaderSpinner />}
      <ManualPolicyUpload
        isOpen={isOpenUpload}
        setIsOpen={setIsOpenUpload}
        leadId={leadId}
        lead={lead}
      />
      <DialogPositiveStage
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setSelectedReason={setSelectedReason}
        selectedReason={selectedReason}
        handleSubmitCancel={handleSubmitNegativeStage}
        handleAddPolicy={handleAddPolicy}
      />
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${lists?.listLead?.leadStages ? `lg:grid-cols-${lists?.listLead?.leadStages?.length + 1}` : "lg:grid-cols-6"} gap-1`}
      >
        {lists?.listLead?.leadStages?.map((leadStage, index) => {
          return (
            <div
              key={leadStage?.id}
              className="flex flex-row items-center relative w-full"
            >
              {index !== 0 && (
                <div className="text-blue-800 flex h-7 w-7 bg-white rounded-full justify-center items-center absolute -left-5">
                  <MdKeyboardArrowRight className="h-6 w-6 text-easy-600" />
                </div>
              )}
              <div
                className={clsx(
                  "px-3 py-2 rounded-lg text-sm text-white hover:opacity-100 w-full bg-easy-600 ",
                  {
                    "opacity-60":
                      (index > stageIndex && stageIndex !== -1) || !stage,
                    "bg-green-500":
                      stageIndex == -1 &&
                      /Positivo/gi.test(stage?.name) &&
                      stage,
                    "bg-red-500":
                      stageIndex == -1 &&
                      !/Positivo/gi.test(stage?.name) &&
                      stage,
                    "cursor-pointer": !disabled,
                  }
                )}
                onClick={() => {
                  if (disabled) return;
                  handleUpdateState(leadStage?.id);
                }}
              >
                <p className="whitespace-nowrap text-ellipsis overflow-hidden">
                  {leadStage?.name}
                </p>
              </div>
            </div>
          );
        })}
        <div className="flex flex-row items-center relative w-full">
          <div className="text-blue-800 flex h-7 w-7 bg-white rounded-full justify-center items-center absolute -left-5">
            <MdKeyboardArrowRight className="h-6 w-6 text-easy-600" />
          </div>
          <div
            className={clsx(
              "px-3 py-2 rounded-lg text-sm text-white hover:opacity-100 w-full ",
              {
                "bg-easy-600": stageIndex !== -1 || !stage,
                "opacity-60": stageIndex !== -1 || !stage,
                "bg-green-500":
                  stageIndex == -1 && stage && /Positivo/gi.test(stage?.name),
                "bg-red-500":
                  stageIndex == -1 && stage && !/Positivo/gi.test(stage?.name),
                "cursor-pointer": !disabled,
              }
            )}
            onClick={() => {
              // if (disabled) return;
              setIsOpen(true);
            }}
          >
            <p
              className="whitespace-nowrap text-ellipsis overflow-hidden ..."
              title={
                stageIndex !== -1 || !stage
                  ? "Definir estado del negocio"
                  : stage?.name
              }
            >
              {stageIndex !== -1 || !stage
                ? "Definir estado del negocio"
                : stage?.name}
            </p>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
