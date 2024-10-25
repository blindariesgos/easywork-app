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
import "moment/locale/es.js";

const Card = ({ receipt, minWidthClass, stageId }) => {
  const [deleteId, setDeleteId] = useState();
  const [loading, setLoading] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const route = useRouter();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: receipt.id,
    data: {
      stageId,
    },
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const options = [
    {
      name: "Ver",
      handleClick: (id) =>
        route.push(`/control/portafolio/receipts/receipt/${id}?show=true`),
    },
    {
      name: "Planificar",
      options: [
        {
          name: "Tarea",
          handleClick: (id) =>
            route.push(
              `/tools/tasks/task?show=true&prev=contact&prev_id=${id}`
            ),
        },
        {
          name: "Envío masivo SMS",
          disabled: true,
        },
        {
          name: "Correo electrónico",
          disabled: true,
        },
      ],
    },
  ];

  // const deletePolicy = async (id) => {
  //   try {
  //     setLoading(true);
  //     const response = await deletePolicyById(id);
  //     toast.success(t("common:alert:delete-success"));
  //     setIsOpenDelete(false);
  //     setLoading(false);
  //   } catch (err) {
  //     handleApiError(err.message);
  //     setLoading(false);
  //   }
  // };

  const handleClickContact = (id) =>
    route.push(`/sales/crm/contacts/contact/${id}?show=true`);

  const handleClickPolicy = (id) =>
    route.push(`/operations/policies/policy/${id}?show=true`);

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
        onPointerDown && onPointerDown(event);
      }}
    >
      <div
        className="bg-white rounded-md p-3 grid grid-cols-12"
        style={{
          minWidth: minWidthClass ?? "auto",
        }}
      >
        <div className="col-span-11 flex flex-col gap-2 justify-start">
          <p
            className="font-bold cursor-pointer text-sm"
            onClick={() => handleClickPolicy(receipt.id)}
          >
            {`${receipt?.poliza?.company?.name ?? ""} ${receipt?.poliza?.poliza} ${receipt?.poliza?.type?.name}`}
          </p>

          <p className="text-sm text-[#9A9A9A]">{`${receipt?.currency?.symbol ?? ""} ${formatToCurrency(+receipt?.paymentAmount ?? 0)}`}</p>
          <p
            className="text-start cursor-pointer text-sm text-[#9A9A9A]"
            onClick={() => handleClickContact(receipt?.poliza?.contact?.id)}
          >
            {receipt?.poliza?.contact?.fullName}
          </p>
          <div className="flex items-center gap-2">
            <Image
              className="h-8 w-8 rounded-full bg-zinc-200"
              width={30}
              height={30}
              src={receipt?.responsible?.avatar || "/img/avatar.svg"}
              alt=""
            />
            <div>
              <p className="text-xs text-[#9A9A9A] font-bold">
                {receipt?.responsible?.profile
                  ? `${receipt?.responsible?.profile?.firstName} ${receipt?.responsible?.profile?.lastName}`
                  : ""}
              </p>
              <p className="text-[8px] text-[#9A9A9A]">
                {receipt?.responsible?.bio ?? ""}
              </p>
            </div>
          </div>
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
        <div className="col-span-12 flex justify-between items-end pt-4">
          <Menu
            as="div"
            className="relative hover:bg-slate-50/30 w-10 md:w-auto  rounded-lg"
          >
            <MenuButton className="flex items-center text-xs">
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
                {options.map((item) =>
                  !item.options ? (
                    <MenuItem
                      key={item.name}
                      disabled={item.disabled}
                      onClick={() => {
                        item.handleClick && item.handleClick(receipt.id);
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
                                  option.handleClick(receipt.id);
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
          <p className="text-xs text-[#9A9A9A]">
            {moment(
              receipt.status == "pagado"
                ? receipt?.paymentDate
                : receipt?.dueDate
            )
              .locale("es")
              .fromNow()}
          </p>
        </div>
      </div>
      <DeleteModal
        isOpen={isOpenDelete}
        setIsOpen={setIsOpenDelete}
        handleClick={() => deletePolicy(deleteId)}
        loading={loading}
      />
    </div>
  );
};

export default Card;
