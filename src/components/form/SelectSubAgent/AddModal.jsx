import React, { Fragment, useEffect, useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import { deleteSubAgent, postSubAgent } from "../../../lib/apis";
import { useSubAgents } from "@/src/lib/api/hooks/receipts";
import { LoadingSpinnerSmall } from "../../LoaderSpinner";
import clsx from "clsx";
import Button from "../Button";
import { toast } from "react-toastify";

const AddModal = ({ isOpen, setIsOpen, handleSelect }) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState({});
  const [filters, setFilters] = useState({
    order: "DESC",
  });
  const [isAdd, setIsAdd] = useState(false);
  const { data, isLoading, mutate } = useSubAgents({ filters });
  const [addInfo, setAddInfo] = useState({});

  const handleChangeFilters = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeAdd = async (e) => {
    setAddInfo({ ...addInfo, [e.target.name]: e.target.value });
  };

  const handleSubmitAdd = async () => {
    if (!addInfo.name || !addInfo.cua) return;
    try {
      const response = await postSubAgent(addInfo);
      if (response?.hasError) {
        return toast.error(
          "Se ha producido un error al crear el SubAgente, inténtelo de nuevo más tarde."
        );
      }
      mutate();
      setIsAdd(false);
      toast.success("Sub Agente creado con exito.");
    } catch (error) {
      toast.error(
        "Se ha producido un error al crear el SubAgente, inténtelo de nuevo más tarde."
      );
    }
  };

  //   const createSubAgent = async () => {
  //     try {
  //       const addTag = await postSubAgent({ name: query });
  //       setOptions([...options, addTag]);
  //       setFilterData([...options, addTag]);
  //       handleSelect(addTag);
  //       setQuery("");
  //     } catch (error) {
  //       handleApiError(error.message);
  //     }
  //   };

  //   const deleteTag = async (e, id) => {
  //     e.preventDefault();
  //     try {
  //       const data = await deleteSubAgent(id);
  //       setOptions(options.filter((tag) => tag.id !== id));
  //       setFilterData(filterData.filter((tag) => tag.id !== id));
  //     } catch (error) {
  //       handleApiError(error.message);
  //     }
  //   };
  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-[10000] focus:outline-none"
      onClose={() => setIsOpen(false)}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md bg-white rounded-xl p-6 backdrop-blur-2xl shadow-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <DialogTitle as="h3" className="text-base font-medium pb-4">
              Seleccionar Sub Agente
            </DialogTitle>
            <table className="table-auto w-full">
              <thead>
                <tr className="border-t-2 border-b-2 border-gray-300 bg-gray-100">
                  <td className="font-semibold p-2">Nombre</td>
                  <td className="font-semibold p-2">Cua</td>
                </tr>
              </thead>
              <tbody>
                <tr className="">
                  <td className="py-2 px-2">
                    <input
                      className="rounded-md border border-gray-200 w-full outline-none focus:outline-none text-sm"
                      name="name"
                      onChange={handleChangeFilters}
                      placeholder="filtrar"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      className="rounded-md border border-gray-200 w-full outline-none focus:outline-none text-sm"
                      name="cua"
                      onChange={handleChangeFilters}
                      placeholder="filtrar"
                    />
                  </td>
                </tr>
                {data &&
                  data?.items?.length > 0 &&
                  data?.items?.map((option) => (
                    <tr
                      key={option.id}
                      className={clsx("hover:bg-gray-200 cursor-pointer", {
                        "bg-primary text-white": option.id == selected.id,
                      })}
                      onClick={() => setSelected(option)}
                    >
                      <td className="py-2 px-2">{option.name}</td>
                      <td className="py-2 px-2">{option.cua}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {((!isLoading && filters?.name?.length) ||
              (!isLoading && filters?.cua?.length)) &&
              data?.items?.length == 0 &&
              !isAdd && (
                <Fragment>
                  <p className="text-xs text-center py-4">
                    No se encontro agente
                  </p>

                  <div
                    className={clsx("bg-blue-100 cursor-pointer")}
                    onClick={() => setIsAdd(true)}
                  >
                    <div className="py-2 px-2 flex items-center gap-1">
                      <PlusCircleIcon className="h-4 w-4 text-primary" />
                      <p className="text-xs ">Crear nuevo Sub-agente</p>
                    </div>
                  </div>
                </Fragment>
              )}
            {isLoading && <LoadingSpinnerSmall />}
            {isAdd && (
              <div className="w-full p-2 border border-gray-200 rounded-md">
                <p className="py-2">Crear SubAgente</p>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="rounded-md border border-gray-200 w-full outline-none focus:outline-none text-sm"
                    name="name"
                    onChange={handleChangeAdd}
                    placeholder="Nombre de Sub-agente"
                    required
                  />

                  <input
                    className="rounded-md border border-gray-200 w-full outline-none focus:outline-none text-sm"
                    name="cua"
                    onChange={handleChangeAdd}
                    placeholder="Cua de Sub-agente"
                    required
                  />
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                    label="Crear"
                    buttonStyle="primary"
                    onclick={handleSubmitAdd}
                  />
                </div>
              </div>
            )}
            {!isAdd && (
              <div className="mt-4 flex justify-end">
                <Button
                  className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                  disabled={!!!selected?.id}
                  label="Seleccionar"
                  buttonStyle="primary"
                  onclick={() => {
                    handleSelect(selected);
                    setIsOpen(false);
                  }}
                />
              </div>
            )}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};
export default AddModal;
