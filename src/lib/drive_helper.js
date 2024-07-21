import {
  BsFiletypeDoc,
  BsFileEarmark,
  BsFiletypePdf,
  BsFillFolderFill,
} from "react-icons/bs";
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
