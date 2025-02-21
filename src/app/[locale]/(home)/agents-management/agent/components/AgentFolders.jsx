import LoaderSpinner from "@/src/components/LoaderSpinner";
import { getExplorer, getFoldersByContact } from "@/src/lib/api/drive";
import { getAgentFolders } from "@/src/lib/apis";
import { handleFrontError } from "@/src/utils/api/errors";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PiCheckFatFill } from "react-icons/pi";
import { toast } from "react-toastify";

const AgentFolders = ({ id }) => {
  const [loading, setLoading] = useState(true);
  const [folders, setFolders] = useState([]);

  const getFolders = async () => {
    const response = await getAgentFolders(id);
    if (response.hasError) {
      handleFrontError(response);
      setLoading(false);
      return;
    }
    if (response.items.length == 0) {
      toast.error("El agente no posee carpetas vinculadas");
      setLoading(false);
      return;
    }
    // const responseFolders = await getExplorer(
    //   { limit: 50, page: 1 },
    //   {},
    //   response?.items[0]?.id
    // );
    // if (responseFolders.error) {
    //   toast.error(responseFolders.message);
    //   setLoading(false);
    //   return;
    // }
    // setFolders(responseFolders.items);
    setLoading(false);
  };

  useEffect(() => {
    getFolders();
  }, []);

  return (
    <div className="w-full  text-black  rounded-lg px-4 lg:px-8">
      {loading && <LoaderSpinner />}
      <Disclosure
        as="div"
        className="rounded-lg bg-gray-100"
        defaultOpen={true}
      >
        <DisclosureButton className="group flex w-full items-center justify-between bg-white rounded-lg px-8 py-4">
          <span className="text-sm/6 font-medium ">Drive</span>
          <ChevronDownIcon className="size-5  group-data-[open]:rotate-180" />
        </DisclosureButton>
        <DisclosurePanel className="mt-2 px-8  py-2 overflow-y-auto max-h-[700px]">
          {folders.map((folder) => (
            <Link
              href={`/tools/drive?folder=${folder.id}`}
              key={folder.name}
              className="flex items-center gap-x-3 cursor-pointer"
            >
              <PiCheckFatFill className="text-primary w-4 h-4" />
              <p className="py-3">
                {folder?.metadata?.observableName ?? folder.name}
              </p>
            </Link>
          ))}
        </DisclosurePanel>
      </Disclosure>
    </div>
  );
};

export default AgentFolders;
