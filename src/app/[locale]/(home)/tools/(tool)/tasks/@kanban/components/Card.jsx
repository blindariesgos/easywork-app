import useAppContext from "@/src/context/app";
import Link from "next/link";
import {
  ChatBubbleBottomCenterIcon,
  ChevronRightIcon,
  EnvelopeIcon,
  FireIcon,
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
import useCrmContext from "@/src/context/crm";
import clsx from "clsx";
import { deleteTask as apiDeleteTask } from "@/src/lib/apis"; // Ajusta el path según sea necesario
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import {
  formatDate,
  getTaskOverdueTimeDelta,
  isDateOverdue,
  isDateTomorrowOverdue,
  isDateTodayOverdue,
  isDateMoreFiveDayOverdue,
  isDateMoreTenDayOverdue,
} from "@/src/utils/getFormatDate";
import { useTranslation } from "react-i18next";

const Card = ({ task, minWidthClass, stageId }) => {
  const { t } = useTranslation();
  const [deleteId, setDeleteId] = useState();
  const [loading, setLoading] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const router = useRouter();

  const {
    selectedContacts: selectedReceipts,
    setSelectedContacts: setSelectedReceipts,
  } = useCrmContext();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: {
      stageId,
    },
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const handleDeleteTask = async (id) => {
    try {
      setLoading(true);
      await apiDeleteTask(id);
      toast.success(t("tools:tasks:table:delete-msg"));
    } catch {
      toast.error(t("tools:tasks:table:delete-error"));
    }
    setLoading(false);
  };

  const actions = [
    {
      name: "Ver",
      handleClick: (id) => router.push(`/tools/tasks/task/${id}?show=true`),
    },
    {
      name: "Editar",
      handleClick: (id) =>
        router.push(`/tools/tasks/task/${id}?show=true&action=edit`),
    },
    {
      name: "Copiar",
      handleClick: (id) =>
        router.push(`/tools/tasks/task/${id}?show=true&action=copy`),
    },
    { name: "Eliminar", handleClick: (id) => handleDeleteTask(id) },
  ];

  const handleClickTask = (id) =>
    router.push(`/tools/tasks/task/${id}?show=true`);

  const getDescription = () => {
    if (!task.description) return;

    const parseHTML = new DOMParser().parseFromString(
      task.description,
      "text/html"
    );
    return (
      <p className="text-ellipsis overflow-hidden max-h-[60px] text-sm text-gray-50">
        {parseHTML.body.textContent || ""}
      </p>
    );
  };

  const { role, ...otherAttributes } = attributes;
  const { onPointerDown } = listeners;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...otherAttributes}
      onPointerDown={(event) => {
        console.log({ event });
        if (event?.target?.onclick) {
          event?.target?.onclick(event);
          return;
        }
        onPointerDown && onPointerDown(event);
      }}
    >
      <div
        className={clsx("bg-white rounded-md p-3 grid grid-cols-12 border ", {
          "shadow-md border-[0.5px] border-primary": selectedReceipts.includes(
            task.id
          ),
        })}
        style={{
          minWidth: minWidthClass ?? "auto",
        }}
      >
        <div className="col-span-12 flex flex-col gap-2 justify-start">
          <p
            className="font-bold cursor-pointer text-sm"
            onClick={() => handleClickTask(task.id)}
          >
            {task?.name}{" "}
            <FireIcon
              className={clsx("h-4 w-4 inline", {
                "text-red-500": task.important,
                hidden: !task.important,
              })}
            />
          </p>
          {getDescription()}
          {task?.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {task.tags.map((tag, index) => (
                <div key={index} className="px-2 py-1 rounded-md bg-gray-200">
                  <p className="text-xs">#{tag.name}</p>
                </div>
              ))}
            </div>
          )}

          {task?.listField && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1 p-1 rounded-md border">
                <IoCheckmarkCircleOutline className="w-4 h-4" />
                <p className="text-sm">{`${task?.listField?.reduce((acc, list) => [...acc, ...list.child], []).filter((list) => list.completed)?.length ?? 0}/${task?.listField?.reduce((acc, list) => [...acc, ...list.child], [])?.length}`}</p>
              </div>
            </div>
          )}

          {task.deadline ? (
            <div className="flex">
              <span
                className={clsx("p-1 px-2 rounded-full text-sm w-auto", {
                  "bg-red-200 text-red-900":
                    isDateOverdue(task.deadline) && !task.completedTime,
                  "bg-green-200 text-green-900":
                    isDateTomorrowOverdue(task.deadline) && !task.completedTime,
                  "bg-orange-300 text-orange-900":
                    isDateTodayOverdue(task.deadline) && !task.completedTime,
                  "bg-blue-300 text-blue-900":
                    isDateMoreFiveDayOverdue(task.deadline) &&
                    !task.completedTime,
                  "text-gray-800/45 line-through": task.isCompleted,
                  "bg-gray-300":
                    !task.deadline ||
                    (isDateMoreTenDayOverdue(task.deadline) &&
                      !task.completedTime),
                })}
              >
                {getTaskOverdueTimeDelta(task)}
              </span>
            </div>
          ) : (
            <div className="flex">
              <span
                className={clsx("p-1 px-2  rounded-full text-sm w-auto", {
                  "bg-gray-300": !task.completedTime,
                  "line-through text-gray-800/45": task.completedTime,
                })}
              >
                {t("tools:tasks:table:no-deadline")}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 pt-6">
            {[
              task?.createdBy,
              ...task?.responsible,
              ...task.observers,
              ...task.participants,
            ]
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
                />
              ))}
            {/* {task?.responsible?.length > 0 &&
              task?.responsible?.map((user) => (
                <Image
                  key={user.id}
                  className="h-6 w-6 rounded-full bg-zinc-200"
                  width={30}
                  height={30}
                  src={user.avatar || "/img/avatar.svg"}
                  alt=""
                />
              ))}

            {task.createdBy && (
              <Image
                className="h-6 w-6 rounded-full bg-zinc-200"
                width={30}
                height={30}
                src={task?.createdBy?.avatar || "/img/avatar.svg"}
                alt=""
              />
            )}
            {task.observers?.length > 0 &&
              task?.observers?.map((user) => (
                <Image
                  key={user.id}
                  className="h-6 w-6 rounded-full bg-zinc-200"
                  width={30}
                  height={30}
                  src={user.avatar || "/img/avatar.svg"}
                  alt=""
                />
              ))}
            {task.participants?.length > 0 &&
              task?.participants?.map((user) => (
                <Image
                  key={user.id}
                  className="h-6 w-6 rounded-full bg-zinc-200"
                  width={30}
                  height={30}
                  src={user.avatar || "/img/avatar.svg"}
                  alt=""
                />
              ))} */}
          </div>
        </div>
        {/* <div className="col-span-2 flex flex-col items-end gap-1">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-0 "
            value={task.id}
            checked={selectedReceipts.includes(task.id)}
            onClick={(e) => {
              const elements = e.target.checked
                ? [...selectedReceipts, task.id]
                : selectedReceipts.filter((p) => p !== task.id);
              console.log(elements, e, !e.target.checked);
              setSelectedReceipts(elements);
            }}
          />
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
        </div> */}
        {/* <div className="col-span-12 flex justify-between items-end pt-4">
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
                {actions.map((item) =>
                  !item.options ? (
                    <MenuItem
                      key={item.name}
                      disabled={item.disabled}
                      onClick={() => {
                        item.handleClick && item.handleClick(task.id);
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
                                  option.handleClick(task.id);
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
            {moment(task.status == "pagado" ? task?.paymentDate : task?.dueDate)
              .locale("es")
              .fromNow()}
          </p>
        </div> */}
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
