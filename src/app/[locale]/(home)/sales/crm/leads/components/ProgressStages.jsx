"use client";
import { useLeads } from "../../../../../../../hooks/useCommon";
import React, { useEffect, useState } from "react";
import DialogPositiveStage from "./DialogPositiveStage";
import useAppContext from "@/src/context/app";
import { MdKeyboardArrowRight } from "react-icons/md";
import clsx from "clsx";
import {
  postPositiveStagePolicy,
  putLeadCancelled,
  putLeadStage,
} from "@/src/lib/apis";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";

export default function ProgressStages({ stage, leadId, disabled }) {
  const { isOpen, setIsOpen } = useLeads();
  const [selectedReason, setSelectedReason] = useState("");
  const { lists } = useAppContext();
  const [stageIndex, setStageIndex] = useState(0);
  const router = useRouter();
  const { mutate: mutateContext } = useSWRConfig();

  useEffect(() => {
    let index = lists?.listLead?.leadStages?.findIndex(
      (x) => x.name == stage?.name
    );
    setStageIndex(index);
  }, [lists?.listLead?.leadStages, stage]);

  const handleUpdateState = async (stageId) => {
    try {
      const response = await putLeadStage(leadId, stageId);
      if (response.hasError) {
        toast.error("Ocurrio un error al actualizar el estado");
        return;
      }
      mutateContext(`/sales/crm/leads/${leadId}/activities`);
      mutateContext(`/sales/crm/leads/${leadId}`);
      toast.success("Prospecto actualizado con exito");
    } catch {
      toast.error("Ocurrio un error al actualizar el estado");
    }
  };

  const handleAddPolicy = async () => {
    const response = await postPositiveStagePolicy(leadId);
    if (response.hasError) {
      console.log({ response });
      toast.error(
        response?.message ??
          "Se ha producido un error al actualizar el prospecto, inténtelo de nuevo."
      );
      return;
    }
    mutateContext(`/sales/crm/leads/${leadId}/activities`);
    mutateContext(
      "/sales/crm/leads?limit=5&page=1&orderBy=createdAt&order=DESC"
    );
    toast.success("Prospecto actualizado con exito");
    router.back();
  };

  const handleSubmitNegativeStage = async () => {
    try {
      const response = await putLeadCancelled(leadId, {
        cancelReasonId: selectedReason,
      });
      if (response.hasError) {
        toast.error("Ocurrio un error al actualizar el estado");
        return;
      }
      router.back();
      mutateContext(
        "/sales/crm/leads?limit=5&page=1&orderBy=createdAt&order=DESC"
      );
      toast.success("Prospecto actualizado con exito");
    } catch {
      toast.error("Ocurrio un error al actualizar el estado");
    }
  };

  return (
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
                    stageIndex == -1 && /Positivo/gi.test(stage?.name) && stage,
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
            if (disabled) return;
            setIsOpen(true);
          }}
        >
          <p
            className="whitespace-nowrap text-ellipsis overflow-hidden"
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
      <DialogPositiveStage
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setSelectedReason={setSelectedReason}
        selectedReason={selectedReason}
        handleSubmitCancel={handleSubmitNegativeStage}
        handleAddPolicy={handleAddPolicy}
      />
    </div>
  );
}
