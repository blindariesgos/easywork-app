"use client";
import { useLeads } from "../../../../../../../hooks/useCommon";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import React, { useEffect, useState } from "react";
import DialogPositiveStage from "./DialogPositiveStage";
import DialogNegativeStage from "./DialogNegativeStage";
import useAppContext from "@/src/context/app";
import { MdKeyboardArrowRight } from "react-icons/md";
import clsx from "clsx";
import {
  postComment,
  putLeadCancelled,
  putLeadStage,
  updateLead,
} from "@/src/lib/apis";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function ProgressStages({ stage, leadId, mutate, disabled }) {
  const { isOpen, setIsOpen } = useLeads();
  const [selectedReason, setSelectedReason] = useState("");
  const { lists } = useAppContext();
  const [stageIndex, setStageIndex] = useState(0);
  const [isOpenNegative, setIsOpenNegative] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let index = lists?.listLead?.leadStages?.findIndex(
      (x) => x.name == stage?.name
    );
    setStageIndex(index);
  }, [lists?.listLead?.leadStages]);

  const handleUpdateState = async (stageId) => {
    try {
      const response = await putLeadStage(leadId, stageId);
      if (response.hasError) {
        toast.error("Ocurrio un error al actualizar el estado");
        return;
      }
      mutate();
      toast.success("Prospecto actualizado con exito");
    } catch {
      toast.error("Ocurrio un error al actualizar el estado");
    }
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
      mutate();
      toast.success("Prospecto actualizado con exito");
    } catch {
      toast.error("Ocurrio un error al actualizar el estado");
    }
  };

  return (
    <div className="flex md:flex-row items-center md:justify-center gap-2 md:gap-3 flex-wrap">
      {lists?.listLead?.leadStages?.map((stage, index, arr) => {
        return (
          <div key={stage?.id} className="flex flex-row items-center relative">
            {index !== 0 && (
              <div className="text-blue-800 flex h-7 w-7 bg-white rounded-full justify-center items-center absolute -left-5">
                <MdKeyboardArrowRight className="h-6 w-6 text-easy-600" />
              </div>
            )}
            <div
              className={clsx(
                "px-3 py-2 rounded-lg text-sm text-white hover:opacity-100",
                {
                  "opacity-60": index > stageIndex,
                  "bg-easy-600":
                    index < lists?.listLead?.leadStages.length - 2 &&
                    stageIndex < lists?.listLead?.leadStages.length - 2,
                  "bg-green-500":
                    index === lists?.listLead?.leadStages.length - 2,
                  "bg-red-500":
                    index === lists?.listLead?.leadStages.length - 1 ||
                    stageIndex == lists?.listLead?.leadStages.length - 1,
                  "cursor-pointer": !disabled,
                }
              )}
              onClick={() => {
                if (disabled) return;
                if (index < arr.length - 2) {
                  handleUpdateState(stage?.id);
                }
                if (index == arr.length - 2) {
                  setIsOpen(true);
                }
                if (index == arr.length - 1) {
                  setIsOpenNegative(true);
                }
              }}
            >
              {stage?.name}
            </div>
          </div>
        );
      })}
      <DialogPositiveStage
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setSelectedReason={setSelectedReason}
        selectedReason={selectedReason}
      />

      <DialogNegativeStage
        isOpen={isOpenNegative}
        setIsOpen={setIsOpenNegative}
        setSelectedReason={setSelectedReason}
        selectedReason={selectedReason}
        handleSubmit={handleSubmitNegativeStage}
      />
    </div>
  );
}
