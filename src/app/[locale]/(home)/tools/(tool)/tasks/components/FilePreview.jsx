import { useEffect, useState } from "react";
import { LoadingSpinnerSmall } from "../../../../../../../components/LoaderSpinner";
const FilePreview = ({ info, handleDeleteFile }) => {
  const [data, setData] = useState();

  useEffect(() => {
    const reader = new FileReader();
    const file = info.file;

    reader.onloadend = () => {
      const result = {
        name: file.name,
        url: URL.createObjectURL(file),
      };

      setData(result);
    };
    reader.readAsDataURL(file);
  }, [info]);

  return !data ? (
    <LoadingSpinnerSmall />
  ) : (
    <div
      className="p-2 bg-gray-200 text-xs rounded-full cursor-pointer flex gap-1 items-center"
      title={data?.name}
    >
      <p
        onClick={() =>
          window.open(
            data.url,
            "self",
            "status=yes,scrollbars=yes,toolbar=yes,resizable=yes,width=850,height=500"
          )
        }
      >
        {data?.name?.length > 16
          ? `${data?.name?.slice(0, 7)}...${data?.name?.slice(-6)}`
          : data?.name}
      </p>
      <p className="text-xs" onClick={handleDeleteFile}>
        x
      </p>
    </div>
  );
};

export default FilePreview;
