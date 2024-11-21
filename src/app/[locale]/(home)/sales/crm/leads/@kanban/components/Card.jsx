import useAppContext from "@/src/context/app";
import Link from "next/link";
import {
  ChatBubbleBottomCenterIcon,
  ChevronRightIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/20/solid";
import { FaWhatsapp } from "react-icons/fa6";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import moment from "moment";
import { useMemo, Fragment, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import DeleteModal from "@/src/components/modals/DeleteItem";
import { deletePolicyById } from "@/src/lib/apis";
import { toast } from "react-toastify";
import { handleApiError } from "@/src/utils/api/errors";
import { formatToCurrency } from "@/src/utils/formatters";

const Card = ({ lead, minWidthClass, stageId }) => {
  const { lists } = useAppContext();
  const [deleteId, setDeleteId] = useState();
  const [loading, setLoading] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const route = useRouter();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: lead.id,
    data: {
      stageId,
    },
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        position: "fixed",
      }
    : undefined;

  const deleteLead = async (id) => {
    try {
      setLoading(true);
      const response = await deleteLeadById(id);
      toast.success("Prospecto(s) eliminado(s) con exito");
      mutate();
      setLoading(false);
      setIsOpenDelete(false);
    } catch (err) {
      setLoading(false);
      handleApiError(err.message);
    }
  };

  const options = [
    {
      name: "Ver",
      handleClick: () =>
        route.push(`/sales/crm/leads/lead/${lead.id}?show=true`),
    },
    {
      name: "Editar",
      handleClick: () =>
        route.push(`/sales/crm/leads/lead/${lead.id}?show=true&edit=true`),
      disabled: lead?.cancelled || /Positivo/gi.test(lead?.stage?.name),
    },
    {
      name: "Copiar",
      handleClick: () =>
        route.push(`/sales/crm/leads/lead?show=true&copy=${lead.id}`),
    },
    {
      name: "Eliminar",
      handleClick: () => {
        setDeleteId(lead.id);
        setIsOpenDelete(true);
      },
    },
    {
      name: "Planificar",
      options: [
        {
          name: "Tarea",
          handleClick: () =>
            route.push(
              `/tools/tasks/task?show=true&prev=leads&prev_id=${lead.id}`
            ),
        },
        {
          name: "Whatsapp",
          disabled: true,
        },
        {
          name: "Cita",
          disabled: true,
        },
        {
          name: "Comentario",
          disabled: true,
        },
        {
          name: "Llamada",
          disabled: true,
        },
      ],
    },
  ];

  const handleClickContact = () =>
    route.push(`/sales/crm/contacts/contact/${lead.id}?show=true`);

  const handleClickLead = () =>
    route.push(`/sales/crm/leads/lead/${lead.id}?show=true`);

  const { role, ...otherAttributes } = attributes;
  const { onPointerDown } = listeners;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...otherAttributes}
      onPointerDown={(event) => {
        if (event?.target?.onclick) {
          event?.target?.onclick();
          return;
        }
        onPointerDown(event);
      }}
    >
      <div
        className="bg-white rounded-md p-3 grid grid-cols-12"
        style={{
          minWidth: minWidthClass ?? "auto",
        }}
      >
        <div className="col-span-10">
          <p
            className="font-semibold cursor-pointer text-sm"
            onClick={() => handleClickLead(lead.id)}
          >
            {lead?.fullName}
          </p>

          {lead?.source?.name && (
            <p className="text-xs text-gray-50">{lead?.source?.name}</p>
          )}
          <p className="text-sm text-primary">{`${lead?.quoteCurrency?.symbol ?? "$"} ${formatToCurrency(lead?.quoteAmount ?? 0)}`}</p>
          {/* <div className="py-6">
            <p
              className="text-start text-easy-400 cursor-pointer text-sm"
              onClick={() => handleClickContact(lead?.contact?.id)}
            >
              {lead?.contact?.fullName}
            </p>

            <p className="text-sm text-gray-50">
              {moment(lead?.vigenciaDesde).format("DD MMMM yyyy")}
            </p>
          </div> */}
        </div>
        <div className="col-span-2 flex flex-col items-end gap-1">
          <button
            type="button"
            className="rounded-full bg-green-100 p-1 text-white shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <FaWhatsapp className="h-3 w-3" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="rounded-full bg-primary p-1 text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <EnvelopeIcon className="h-3 w-3" aria-hidden="true" />
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
        <div className="col-span-12 flex justify-between items-center pt-2">
          <Menu as="div" className="relative hover:bg-slate-50/30 md:w-auto ">
            <MenuButton className="text-xs">+ Actividades</MenuButton>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems
                anchor="right start"
                className=" z-50 mt-2.5  rounded-md bg-white py-2 shadow-lg focus:outline-none"
              >
                {options.map((item) =>
                  !item.options ? (
                    <MenuItem
                      key={item.name}
                      disabled={item.disabled}
                      onClick={() => {
                        item.handleClick && item.handleClick();
                      }}
                    >
                      <div className="block data-[focus]:bg-gray-50 px-3 data-[disabled]:opacity-50 py-1 leading-6 text-xs text-black cursor-pointer">
                        {item.name}
                      </div>
                    </MenuItem>
                  ) : (
                    <Menu key={item.name}>
                      <MenuButton
                        className="flex items-center hover:bg-gray-50"
                        onClick={() => {}}
                      >
                        <div
                          className="w-full flex items-center justify-between px-3 py-1 text-xs"
                          onClick={() => {}}
                        >
                          {item.name}
                          <ChevronRightIcon className="h-6 w-6 ml-2" />
                        </div>
                      </MenuButton>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <MenuItems
                          anchor={{
                            to: "right start",
                            gap: "4px",
                          }}
                          className="rounded-md bg-white py-2 shadow-lg focus:outline-none"
                        >
                          {item.options.map((option) => (
                            <MenuItem
                              key={option.name}
                              disabled={option.disabled}
                              onClick={() => {
                                option.handleClick && option.handleClick();
                              }}
                            >
                              <div className="block px-3 py-1 text-xs leading-6 text-black cursor-pointer data-[focus]:bg-gray-50 data-[disabled]:opacity-50">
                                {option.name}
                              </div>
                            </MenuItem>
                          ))}
                        </MenuItems>
                      </Transition>
                    </Menu>
                  )
                )}
              </MenuItems>
            </Transition>
          </Menu>
          {lead?.assignedBy && (
            <Image
              className="h-6 w-6 rounded-full bg-zinc-200"
              width={30}
              height={30}
              src={lead?.assignedBy?.avatar || "/img/avatar.svg"}
              alt=""
            />
          )}
        </div>
      </div>
      <DeleteModal
        isOpen={isOpenDelete}
        setIsOpen={setIsOpenDelete}
        handleClick={() => deleteLead(deleteId)}
        loading={loading}
      />
    </div>
  );
};

export default Card;
