"use client";
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

export const PaginationV2 = ({ totalPages, bgColor, currentPage, setPage }) => {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    const handlePathnamePage = (page) => {
      setPage(page);
    };
    const getPages = (i) => {
      return (
        <div
          key={i}
          className={clsx(
            "px-2 cursor-pointer font-medium text-xs flex items-center justify-center rounded-full w-6 h-6",
            currentPage === i
              ? " bg-primary text-white "
              : "text-black bg-gray-200"
          )}
          onClick={() => {
            handlePathnamePage(i);
          }}
        >
          {i}
        </div>
      );
    };
    const buildPagination = () => {
      const pagination = [];
      const total = Number(totalPages);
      pagination.push(getPages(1));

      if (currentPage > 3 && total > 4 && currentPage <= total - 3) {
        pagination.push(<div>...</div>);
        const numberPage = currentPage - 1;
        for (let i = numberPage; i < numberPage + 3; i++) {
          pagination.push(getPages(i));
        }
      } else if ((currentPage <= total - 3 && total > 4) || total > 1) {
        for (let i = 1; i < total; i++) {
          i <= 2 && pagination.push(getPages(i + 1));
        }
      }

      if (total > 3) {
        pagination.push(<div>...</div>);
        if (currentPage <= total - 3) {
          pagination.push(getPages(total));
        } else {
          for (let i = total - 3; i < total; i++) {
            pagination.push(getPages(i + 1));
          }
        }
      }
      setPages(pagination);
    };

    buildPagination();
  }, [totalPages, currentPage]);

  const handlePathname = (page) => {
    setPage(page);
  };

  return (
    <div>
      {totalPages >= 1 && (
        <div className="items-center w-fit">
          <div
            className={`flex flex-row justify-start p-2 border-none rounded-md gap-x-2 ${bgColor}`}
          >
            <div
              className={clsx(
                "h-8 w-7 flex justify-center items-center rounded-md text-white cursor-pointer",
                {
                  "cursor-pointer font-bold bg-gray-200":
                    Number(currentPage) === 1,
                  "cursor-default font-bold bg-easy-1100":
                    Number(currentPage) > 1,
                }
              )}
              onClick={() => {
                if (Number(currentPage) > 1) {
                  handlePathname(Number(currentPage) - 1);
                }
              }}
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </div>
            <div className="flex gap-x-2 items-center">
              {pages.map((pag, index) => (
                <div key={index}>{pag}</div>
              ))}
            </div>
            <div
              className={clsx(
                "h-8 w-7 flex justify-center items-center rounded-md text-white",
                {
                  "cursor-pointer font-bold bg-easy-1100":
                    Number(currentPage) < totalPages,
                },
                {
                  "cursor-default font-bold bg-gray-200":
                    Number(currentPage) == totalPages,
                }
              )}
              onClick={() => {
                if (Number(currentPage) < totalPages) {
                  handlePathname(Number(currentPage) + 1);
                }
              }}
            >
              <ChevronRightIcon className="h-6 w-6" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
