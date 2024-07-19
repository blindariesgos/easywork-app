import { AiFillFolder } from "react-icons/ai";
import {
  BsFiletypeDoc,
  BsFileEarmark,
  BsFiletypePdf,
  BsFillFolderFill,
  BsFiletypePng,
  BsFiletypeJpg
} from "react-icons/bs";

export const getFileIcon = (fileType, className) => {
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
    default:
      return <BsFileEarmark className={className} />;
  }
};
