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
import { useMemo, Fragment, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import DeleteModal from "@/src/components/modals/DeleteItem";
import { deleteRefundById } from "@/src/lib/apis";
import { toast } from "react-toastify";
import { handleApiError } from "@/src/utils/api/errors";
import { formatToCurrency } from "@/src/utils/formatters";
import "moment/locale/es.js";
import useCrmContext from "@/src/context/crm";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import useRefundContext from "@/src/context/refunds";

const Card = ({ data, minWidthClass, stageId, updateList }) => {
  const { t } = useTranslation();
  const [deleteId, setDeleteId] = useState();
  const [loading, setLoading] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const { mutate } = useRefundContext();
  const router = useRouter();

  const { selectedContacts: selectedReceipts } = useCrmContext();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: data?.id,
    data: {
      stageId,
    },
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const deleteRefund = async (id) => {
    try {
      setLoading(true);
      const response = await deleteRefundById(id);
      if (response.hasError) {
        let message = response.message;
        if (Array.isArray(response.message)) {
          message = response.message.join(", ");
        }
        toast.error(message);
        setLoading(false);
        return;
      }
      toast.success(t("common:alert:delete-success"));
      mutate();
      updateList();
      setLoading(false);
      setIsOpenDelete(false);
    } catch (err) {
      setLoading(false);
      handleApiError(err.message);
    }
  };

  const actions = [
    {
      name: "Ver",
      handleClick: (id) =>
        router.push(`/operations/refunds/refund/${id}?show=true`),
    },
    {
      name: "Editar",
      handleClick: (id) =>
        router.push(`/operations/refunds/refund/${id}?show=true&edit=true`),
    },
    {
      name: "Eliminar",
      handleClick: (id) => {
        setDeleteId(id);
        setIsOpenDelete(true);
      },
    },
    {
      name: "Planificar",
      options: [
        {
          name: "Tarea",
          handleClick: (id) =>
            router.push(
              `/tools/tasks/task?show=true&prev=poliza_reimbursement&prev_id=${id}`
            ),
        },
        {
          name: "Cita",
          handleClick: (id) =>
            router.push(
              `/tools/calendar/addEvent?show=true&prev=poliza_reimbursement&prev_id=${id}`
            ),
        },
        {
          name: "Comentario",
          disabled: true,
        },
        {
          name: "Correo",
          disabled: true,
        },
      ],
    },
  ];

  const handleClick = (id) =>
    router.push(`/operations/refunds/refund/${id}?show=true`);

  const handleClickContact = (id) =>
    router.push(`/sales/crm/contacts/contact/${id}?show=true`);

  const { role, ...otherAttributes } = attributes;
  const { onPointerDown } = listeners;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...otherAttributes}
      onPointerDown={(event) => {
        if (event?.target?.onclick) {
          event?.target?.onclick(event);
          return;
        }
        onPointerDown && onPointerDown(event);
      }}
    >
      <div
        className={clsx("bg-white rounded-md p-3 grid border ", {
          "shadow-md border-[0.5px] border-primary": selectedReceipts.includes(
            data?.id
          ),
        })}
        style={{
          minWidth: minWidthClass ?? "auto",
        }}
      >
        <div className="flex gap-1">
          <div className="flex flex-col gap-2 justify-start">
            <p
              className="font-bold cursor-pointer text-sm"
              onClick={() => handleClick(data.id)}
            >
              {`Reembolso - ${data?.poliza?.name ?? ""}`}
            </p>
            <p
              className="text-start text-easy-400 cursor-pointer text-sm"
              onClick={() => handleClickContact(data?.contact?.id)}
            >
              {data?.contact?.fullName}
            </p>

            <p className="text-sm">{`Nro de Siniestro: ${data?.ot}`}</p>
            <p className="text-sm">{`SIGRE: ${data?.sigre}`}</p>

            {data?.medicalCondition && (
              <p className="text-sm">{data?.medicalCondition}</p>
            )}
          </div>
          <div className="col-span-1 flex flex-col items-end gap-1">
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
        </div>
        <div className="flex gap-2 items-end pt-4 justify-between">
          <Menu as="div" className="relative">
            <MenuButton className="flex items-center text-xs text-nowrap">
              + Actividades
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
                anchor="right start"
                className=" z-50 mt-2.5  rounded-md bg-white py-2 shadow-lg focus:outline-none"
              >
                {actions.map((item) =>
                  !item.options ? (
                    <MenuItem
                      key={item.name}
                      disabled={item.disabled}
                      onClick={() => {
                        item.handleClick && item.handleClick(data.id);
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
                                option.handleClick &&
                                  option.handleClick(data.id);
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
          <div className="flex gap-1 flex-row-reverse flex-wrap-reverse">
            {[
              data?.createdBy,
              data?.observer,
              data?.assignedBy,
              data?.agenteRelacionado,
              data?.agenteIntermediario,
              data?.modifiedBy,
            ]
              .filter((x) => x?.id)
              .filter(
                (user, index, arr) =>
                  arr.findLastIndex((x) => x.id == user.id) == index
              )
              .map((user) => (
                <Image
                  key={user.id}
                  className="h-6 w-6 rounded-full bg-zinc-200"
                  width={30}
                  height={30}
                  src={user.avatar || "/img/avatar.svg"}
                  alt=""
                  title={user?.name ?? user?.username ?? "No disponible"}
                />
              ))}
          </div>
        </div>
      </div>
      <DeleteModal
        isOpen={isOpenDelete}
        setIsOpen={setIsOpenDelete}
        handleClick={() => deleteRefund(deleteId)}
        loading={loading}
      />
    </div>
  );
};

export default Card;
