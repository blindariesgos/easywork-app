import { useUserActivities } from "@/src/lib/api/hooks/users";
import { useEffect, useState, Fragment } from "react";
import Table from "@/src/components/Table";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import FooterTable from "@/src/components/FooterTable";
import { useUserActivitiesTable } from "@/src/hooks/useCommon";
import Link from "next/link";
import {
  Menu,
  MenuButton,
  MenuItem,
  Transition,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, ChevronRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export const Activities = ({ userId }) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const router = useRouter();
  const { data } = useUserActivities({
    config: {
      page,
      limit,
    },
    userId,
  });

  const { columnTable } = useUserActivitiesTable();
  const [loading, setLoading] = useState(false);

  const [selectedColumns, setSelectedColumns] = useState(
    columnTable.filter((c) => c.check)
  );

  useEffect(() => {
    // console.log({ data });
  }, [data]);

  const routes = (id) => ({
    task: `/tools/tasks/task/${id}?show=true`,
    event: `/tools/calendar/event/${id}?show=true`,
  });
  const types = ["task", "event"];

  const handleRedirect = (id, type) => {
    if (types.includes(type)) {
      router.push(routes(id)[type]);
    } else {
      toast.warning(
        "Actividad desconocida, póngase en contacto con el servicio de soporte"
      );
    }
  };

  const itemActions = [
    {
      name: "Ver",
      handleClick: handleRedirect,
    },
  ];

  const getDescription = (description) => {
    if (!description) return;

    const parseHTML = new DOMParser().parseFromString(description, "text/html");
    return parseHTML?.body?.textContent || "";
  };

  return (
    <Fragment>
      {selectedColumns && selectedColumns.length > 0 && (
        <div className="flow-root rounded-xl bg-gray-100">
          {loading && <LoaderSpinner />}
          <div className="min-w-full">
            <Table
              data={data?.items ?? []}
              order={"ASC"}
              orderBy={"name"}
              setOrderBy={() => {}}
              selectedColumns={selectedColumns}
              setSelectedColumns={setSelectedColumns}
              columnTable={columnTable}
            >
              {selectedColumns.length > 0 &&
                data?.items &&
                data?.items.map((activity, index) => {
                  return (
                    <tr
                      key={index}
                      className={clsx("hover:bg-indigo-100/40 cursor-default")}
                    >
                      <td className="pr-7 pl-4 sm:w-12 relative">
                        <div className="flex items-center">
                          <Menu
                            as="div"
                            className="relative hover:bg-slate-50/30 w-10 md:w-auto py-2 px-1 rounded-lg"
                          >
                            <MenuButton className="flex items-center">
                              <Bars3Icon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
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
                                {itemActions.map((item) =>
                                  !item.options ? (
                                    <MenuItem
                                      key={item.name}
                                      disabled={item.disabled}
                                      onClick={() => {
                                        item.handleClick &&
                                          item.handleClick(
                                            activity.id,
                                            activity.type
                                          );
                                      }}
                                    >
                                      <div
                                        className={
                                          "block data-[focus]:bg-gray-50 px-3 data-[disabled]:opacity-50 py-1 text-sm leading-6 text-black cursor-pointer"
                                        }
                                      >
                                        {item.name}
                                      </div>
                                    </MenuItem>
                                  ) : (
                                    <Menu key={item.name}>
                                      <MenuButton className="flex items-center hover:bg-gray-50">
                                        <div className="w-full flex items-center justify-between px-3 py-1 text-sm">
                                          {item.name}
                                          <ChevronRightIcon className="h-4 w-4" />
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
                                                  option.handleClick(
                                                    activity.id
                                                  );
                                              }}
                                            >
                                              <div
                                                className={clsx(
                                                  "block px-3 py-1 text-sm leading-6 text-black cursor-pointer data-[focus]:bg-gray-50 data-[disabled]:opacity-50"
                                                )}
                                              >
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
                        </div>
                      </td>
                      {selectedColumns.length > 0 &&
                        selectedColumns.map((column, index) => (
                          <td className="ml-4 py-4" key={index}>
                            <div
                              className={clsx(
                                "font-medium text-sm  text-black hover:text-primary"
                              )}
                            >
                              {column.row == "name" ? (
                                <div
                                  onClick={() =>
                                    handleRedirect(activity?.id, activity?.type)
                                  }
                                  className="flex gap-3 items-center cursor-pointer"
                                >
                                  {activity.name}
                                </div>
                              ) : column.row === "email" ? (
                                <p className="text-center">
                                  {activity?.user?.email ?? "-"}
                                </p>
                              ) : column.row === "phone" ? (
                                activity?.user?.phone?.length > 0 ? (
                                  <p className="text-center">{`+${activity?.user?.phone}`}</p>
                                ) : (
                                  "-"
                                )
                              ) : column.row === "createdAt" ? (
                                <p className="text-center">
                                  {formatDate(
                                    activity.createdAt,
                                    "dd/MM/yyyy"
                                  ) ?? "-"}
                                </p>
                              ) : column.row === "updatedAt" ? (
                                <p className="text-center">
                                  {moment(activity.updatedAt).format(
                                    "DD/MM/YYYY, hh:mm a"
                                  )}
                                </p>
                              ) : column.row === "type" ? (
                                <p className="">
                                  {t(
                                    `users:activities:types:${types.includes(activity.type) ? activity.type : "unknown"}`
                                  )}
                                </p>
                              ) : column.row === "description" ? (
                                activity?.description ? (
                                  getDescription(activity?.description)
                                ) : (
                                  "No disponible"
                                )
                              ) : (
                                activity[column.row] || "-"
                              )}
                            </div>
                          </td>
                        ))}
                    </tr>
                  );
                })}
            </Table>
          </div>
          <div className="w-full mt-2">
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
      )}
    </Fragment>
  );
};
