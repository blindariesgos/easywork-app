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

const Card = ({ policy }) => {
  const { lists } = useAppContext();
  const [deleteId, setDeleteId] = useState();
  const [loading, setLoading] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const route = useRouter();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: policy.id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        position: "fixed",
      }
    : undefined;

  const options = [
    {
      name: "Ver",
      handleClick: (id) =>
        route.push(`/operations/policies/policy/${id}?show=true`),
    },
    {
      name: "Editar",
      handleClick: (id) =>
        route.push(`/operations/policies/policy/${id}?show=true&edit=true`),
    },
    {
      name: "Eliminar",
      handleClick: (id) => {
        setDeleteId(id);
        setIsOpenDelete(true);
      },
      disabled: true,
    },
    {
      name: "Planificar",
      options: [
        {
          name: "Tarea",
          handleClick: (id) =>
            route.push(`/tools/tasks/task?show=true&prev=policy&prev_id=${id}`),
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
          name: "Correo",
          disabled: true,
        },
      ],
    },
  ];
  const deletePolicy = async (id) => {
    try {
      setLoading(true);
      const response = await deletePolicyById(id);
      toast.success(t("common:alert:delete-success"));
      setIsOpenDelete(false);
      setLoading(false);
    } catch (err) {
      handleApiError(err.message);
      setLoading(false);
    }
  };

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
        onPointerDown(event);
      }}
    >
      <div className="bg-white rounded-md p-3 grid grid-cols-12">
        <div className="col-span-11">
          <p
            className="font-semibold cursor-pointer text-sm"
            onClick={() => handleClickPolicy(policy.id)}
          >
            {`${policy?.company?.name ?? ""} ${policy?.poliza} ${policy?.type?.name}`}
          </p>

          <p className="text-sm text-gray-50">{`${lists?.policies?.currencies?.find((x) => x.id == policy?.currency?.id)?.symbol ?? ""} ${(policy?.importePagar ?? 0).toFixed(2)}`}</p>
          <div className="py-6">
            <p
              className="text-start text-easy-400 cursor-pointer text-sm"
              onClick={() => handleClickContact(policy?.contact?.id)}
            >
              {policy?.contact?.fullName}
            </p>

            <p className="text-sm text-gray-50">
              {moment(policy?.vigenciaDesde).format("DD MMMM yyyy")}
            </p>
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
        <div className="col-span-12 flex justify-between">
          <Menu
            as="div"
            className="relative hover:bg-slate-50/30 w-10 md:w-auto py-2 px-1 rounded-lg"
          >
            <MenuButton className="-m-1.5 flex items-center p-1.5 text-sm">
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
                        item.handleClick && item.handleClick(policy.id);
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
                                  option.handleClick(policy.id);
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
          <Image
            className="h-8 w-8 rounded-full bg-zinc-200"
            width={30}
            height={30}
            src={policy?.assignedBy?.avatar || "/img/avatar.svg"}
            alt=""
          />
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