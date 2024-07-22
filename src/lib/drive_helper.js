import {
  BsFiletypeDoc,
  BsFileEarmark,
  BsFiletypePdf,
  BsFillFolderFill,
  BsFiletypePng,
  BsFiletypeJpg
} from "react-icons/bs";

import { MdFolderShared } from "react-icons/md";

import Image from "next/image";

export const getFileIcon = (file, className) => {
  if (file.type === "folder") return <BsFillFolderFill className={className} />;

  // Verificar si es una imagen
  const fileType = getFileType(file.mimetype);

  switch (fileType) {
    case "pdf":
      return <BsFiletypePdf className={className} />;
    case "document":
      return <BsFiletypeDoc className={className} />;
    case "folder":
      return <BsFillFolderFill className={className} />;
    case "image/png":
      return <BsFiletypePng className={className} />;
    case "image/jpeg":
      return <BsFiletypeJpg className={className} />;
    case "image":
      return (
        <Image
          src={file.url}
          alt={file.name}
          width={36}
          height={36}
          quality={30}
        />
      );
    default:
      return <BsFileEarmark className={className} />;
  }
};

export const getFileSize = (bytes) => {
  if (!bytes) return "-";
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const getFileType = (mimetype) => {
  if (mimetype.includes("image")) {
    return "image";
  } else if (mimetype.includes("pdf")) {
    return "pdf";
  } else if (mimetype.includes("document")) {
    return "document";
  } else {
    return "other";
  }
};
