import { correctSpecialCharacters } from "@/src/utils/formatters";
import { XMarkIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import React from "react";
import { BsFiletypeDoc, BsFiletypePdf, BsFiletypeXls } from "react-icons/bs";
import { FaRegFileLines, FaRegFilePdf } from "react-icons/fa6";

export default function CardFile({ data, onClick }) {
  const getShowFile = (type) => {
    switch (type) {
      case "image/png":
      case "image/jpeg":
      case "image/jpg":
      case "image/svg":
      case "image/gif":
        return (
          <Image
            src={data.url}
            alt={data.name}
            height={168}
            width={360}
            className="h-14 w-full rounded"
          />
        );
      case "video":
        return (
          <video controls={false}>
            <source
              src={data.url}
              type="video/mp4"
              className="h-14 w-full rounded"
            />
          </video>
        );
      case "application/pdf":
        return <BsFiletypePdf className="h-14 w-10 text-red-600" />;
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        return <BsFiletypeXls className="h-14 w-10 text-green-800" />;
      case "doc":
        return <BsFiletypeDoc className="h-14 w-10 text-blue-700" />;
      default:
        return <FaRegFileLines className="h-14 w-10 text-gray-200" />;
    }
  };
  const handleOpen = () => {
    window.open(
      data.url,
      "self",
      "status=yes,scrollbars=yes,toolbar=yes,resizable=yes,width=850,height=500"
    );
  };

  return (
    <div className="cursor-pointer flex flex-col w-[100px] relative bg-white shadow rounded-md pb-1 px-1 pt-4 hover:drop-shadow-md hover:bg-gray-100 hover:opacity-55">
      <div className="absolute top-1 right-1 z-10" onClick={onClick}>
        <XMarkIcon className="w-4 h-4 text-gray-200 hover:text-red-500 transition ease-in duration-75" />
      </div>
      <div className="flex justify-center" onClick={handleOpen}>
        {getShowFile(data.type)}
      </div>
      <p
        className="text-center text-[10px] pt-2 text-gray-400 overflow-hidden whitespace-nowrap text-ellipsis"
        title={correctSpecialCharacters(data.name)}
      >
        {correctSpecialCharacters(data.name)}
      </p>
    </div>
  );
}
