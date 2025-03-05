"use client";

import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import React, { useLayoutEffect, useRef, useState } from "react";
import AddColumnsTable from "@/src/components/AddColumnsTable";

const Table = ({
  children,
  selectedRows,
  setSelectedRows,
  data,
  order,
  orderBy,
  setOrderBy,
  selectedColumns,
  setSelectedColumns,
  columnTable,
}) => {
  const checkbox = useRef();

  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);

  useLayoutEffect(() => {
    if (!selectedRows) return;
    if (selectedRows.length > 0) {
      const isIndeterminate =
        selectedRows.length > 0 && selectedRows.length < data?.items.length;
      setChecked(selectedRows.length === data?.items.length);
      setIndeterminate(isIndeterminate);
      checkbox.current.indeterminate = isIndeterminate;
    }
  }, [selectedRows, data]);

  const toggleAll = () => {
    const items = checked || indeterminate ? [] : data?.items?.map((x) => x.id);
    setSelectedRows && setSelectedRows(items);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  };

  return (
    <div className="overflow-x-auto">
      <div className=" min-h-[60vh] h-full">
        <table className="min-w-full rounded-md bg-gray-100 table-auto relative ">
          <thead className="text-sm bg-white drop-shadow-sm sticky top-0 z-10">
            <tr>
              <th
                scope="col"
                className="relative pl-4 pr-7 sm:w-12 rounded-s-xl py-5"
              >
                <div className="flex gap-2 items-center">
                  {setSelectedRows && (
                    <input
                      type="checkbox"
                      className=" h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      ref={checkbox}
                      checked={checked}
                      onChange={toggleAll}
                    />
                  )}

                  <AddColumnsTable
                    columns={columnTable.map((x) => ({
                      ...x,
                      check: selectedColumns.map((s) => s.id).includes(x.id),
                    }))}
                    setSelectedColumns={setSelectedColumns}
                  />
                </div>
              </th>
              {selectedColumns.length > 0 &&
                selectedColumns.map((column, index) => (
                  <th
                    key={index}
                    scope="col"
                    className={`min-w-[12rem] py-3.5 pr-3 text-sm font-medium text-primary cursor-pointer  ${
                      index === selectedColumns.length - 1 && "rounded-e-xl"
                    }`}
                    onClick={() => {
                      setOrderBy(column.row);
                    }}
                  >
                    <div
                      className={clsx("flex justify-left items-center gap-2", {
                        "font-bold": orderBy === column.row,
                      })}
                    >
                      {column.name}
                      {column?.order && (
                        <div>
                          <ChevronDownIcon
                            className={`h-6 w-6 text-primary ${
                              orderBy === column.row && order !== "DESC"
                                ? "transform rotate-180"
                                : ""
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="bg-gray-100">{children}</tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
