import useAppContext from "@/src/context/app";
import usePolicyContext from "@/src/context/policies";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ChatBubbleBottomCenterIcon,
  ChevronDownIcon,
  EnvelopeIcon,
  PhoneIcon,
  Bars3Icon,
  CheckIcon,
  ChevronDoubleDownIcon,
} from "@heroicons/react/20/solid";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { FaWhatsapp } from "react-icons/fa6";
import FooterTable from "@/src/components/FooterTable";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
const KanbanPolicies = () => {
  const { lists } = useAppContext();
  const {
    data,
    limit,
    setLimit,
    setOrderBy,
    order,
    orderBy,
    page,
    setPage,
    mutate,
  } = usePolicyContext();
  const columnOrder = ["en_proceso", "activa", "cancelada"];
  const route = useRouter();
  const [columns, setColumns] = useState({
    en_proceso: {
      id: "en_proceso",
      title: "En trámite",
      color: "#0091CD",
    },
    activa: {
      id: "activa",
      title: "Vigente",
      color: "#0077BF",
    },
    cancelada: {
      id: "cancelada",
      title: "Cancelada",
      color: "#CD1100",
    },
  });

  const [policies, setPolicies] = useState({
    en_proceso: [],
    activa: [],
    cancelada: [],
    expirada: [],
  });

  const options = [
    {
      name: "Tarea",
      onclick: (id) =>
        route.push(`/tools/tasks/task?show=true&prev=policy&prev_id=${id}`),
    },
  ];

  useEffect(() => {
    if (!data || !data?.items || !data?.items?.length === 0) return;
    const auxData = data?.items?.reduce(
      (acc, policy) => ({
        ...acc,
        [policy.status]: [...acc[policy.status], policy],
      }),
      {
        en_proceso: [],
        activa: [],
        cancelada: [],
        expirada: [],
      }
    );
    console.log({ auxData });
    setPolicies(auxData);
  }, [data]);

  const handleDragEnd = (result) => {
    console.log("handleDragEnd", result);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="w-full">
        <div className="grid grid-cols-3 gap-2 pt-2">
          {columnOrder.map((column) => (
            <div key={columns[column].id}>
              <p
                className={`w-full text-white font-semibold px-2 py-2 rounded-md`}
                style={{ background: columns[column].color }}
              >
                {columns[column].title}
              </p>
              <Droppable droppableId={columns[column].id}>
                {(provided) => (
                  <div
                    className="grid grid-cols-1 gap-2 pt-2"
                    {...provided.droppableProps}
                  >
                    {policies[column].map((policy) => (
                      <div
                        key={policy.id}
                        className="bg-white rounded-md p-2 grid grid-cols-12"
                      >
                        <div className="col-span-11">
                          <Link
                            href={`/operations/policies/policy/${policy.id}?show=true`}
                          >
                            <p className="font-semibold">
                              {`${policy?.company?.name ?? ""} ${policy?.poliza} ${policy?.type?.name}`}
                            </p>
                          </Link>

                          <p className="text-sm text-gray-50">{`${lists?.policies?.currencies?.find((x) => x.id == policy?.currency?.id)?.symbol ?? ""} ${(policy?.importePagar ?? 0).toFixed(2)}`}</p>
                          <div className="py-6">
                            <Link
                              href={`/operations/policies/policy/${policy.id}?show=true`}
                            >
                              <p className="text-start text-easy-400">
                                {policy?.contact?.fullName}
                              </p>
                            </Link>
                          </div>
                        </div>
                        <div className="col-span-1 flex flex-col items-end gap-1">
                          <button
                            type="button"
                            className="rounded-full bg-green-100 p-1 text-white shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                          >
                            <FaWhatsapp
                              className="h-3 w-3"
                              aria-hidden="true"
                            />
                          </button>
                          <button
                            type="button"
                            className="rounded-full bg-primary p-1 text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                          >
                            <EnvelopeIcon
                              className="h-3 w-3"
                              aria-hidden="true"
                            />
                          </button>
                          <button
                            type="button"
                            className="rounded-full bg-primary p-1 text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                          >
                            <ChatBubbleBottomCenterIcon
                              className="h-3 w-3"
                              aria-hidden="true"
                            />
                          </button>
                          <button
                            type="button"
                            className="rounded-full bg-primary p-1 text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                          >
                            <PhoneIcon className="h-3 w-3" aria-hidden="true" />
                          </button>
                        </div>
                        <div className="col-span-12 flex justify-between">
                          <Menu>
                            <MenuButton className="text-xs">
                              + Actividades
                            </MenuButton>
                            <MenuItems
                              transition
                              anchor="bottom start"
                              className="rounded-md mt-2 bg-blue-50 shadow-lg ring-1 ring-black/5 focus:outline-none z-50 grid grid-cols-1 gap-2 p-1 "
                            >
                              {options.map((option, index) => (
                                <MenuItem
                                  key={index}
                                  as="div"
                                  onClick={() =>
                                    option.onclick &&
                                    option.onclick(policy?.contact?.id)
                                  }
                                  disabled={option.disabled}
                                  className="p-1 hover:[&:not(data-[disabled])]:bg-gray-100 rounded-md text-xs cursor-pointer data-[disabled]:cursor-auto data-[disabled]:text-gray-50"
                                >
                                  {option.name}
                                </MenuItem>
                              ))}
                            </MenuItems>
                          </Menu>
                          <Image
                            className="h-8 w-8 rounded-full bg-zinc-200"
                            width={30}
                            height={30}
                            src={
                              policy?.assignedBy?.avatar || "/img/avatar.svg"
                            }
                            alt=""
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
        <div className="w-full pt-4 ">
          <FooterTable
            limit={limit}
            setLimit={setLimit}
            page={page}
            setPage={setPage}
            totalPages={data?.meta?.totalPages}
            total={data?.meta?.totalItems ?? 0}
          />
        </div>
      </div>
    </DragDropContext>
  );
};

export default KanbanPolicies;
