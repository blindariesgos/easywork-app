import { clsx } from "clsx";
import { connectionsStage } from "../../conections/common";
import { Fragment, useMemo, useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { updateAgentConnection, updateAgentRecruitment } from "@/src/lib/apis";
import { toast } from "react-toastify";
import { useSWRConfig } from "swr";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import useConnectionsContext from "@/src/context/connections";

const ConnectionStages = ({ stageId, agentId }) => {
  const [loading, setLoading] = useState(false);
  const { mutate } = useSWRConfig();
  const { mutate: mutateAgents } = useConnectionsContext();
  const currentIndexStage = useMemo(() => {
    return connectionsStage.map((x) => x.id).findIndex((id) => id == stageId);
  }, [stageId]);

  const updateState = async (id) => {
    setLoading(true);
    const body = {
      agentConnectionStageId: id,
    };
    const response = await updateAgentConnection(body, agentId);
    console.log({ response });
    if (response.hasError) {
      let message = response.message;
      if (response.errors) {
        message = response.errors.join(", ");
      }
      toast.error(message ?? "Etapa actualizada con éxito");
      setLoading(false);
      return;
    }
    toast.success("Etapa actualizada con éxito");
    mutate(`/agent-management/agents/${agentId}`);
    mutateAgents();
    setLoading(false);
  };

  return (
    <Fragment>
      {loading && <LoaderSpinner />}
      <div className="overflow-x-hidden hover:overflow-x-auto py-1">
        <div className=" flex gap-2 w-max">
          {connectionsStage.map((stage, index) => (
            <div key={stage.id} className="relative group">
              <div
                className={clsx(
                  "text-blue-800 flex h-7 w-7 bg-white rounded-full justify-center items-center absolute -right-4 group-last:hidden z-10 top-[5px]"
                )}
              >
                <MdKeyboardArrowRight className="h-6 w-6 text-easy-600" />
              </div>
              <div
                className={clsx(
                  "w-[200px] px-4 py-3 text-center cursor-pointer text-white text-xs rounded overflow-hidden whitespace-nowrap text-ellipsis hover:opacity-100",
                  {
                    "opacity-50": index > currentIndexStage,
                  }
                )}
                style={{ background: stage.color }}
                title={stage.name}
                onClick={() => updateState(stage.id)}
              >
                {stage.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
};

export default ConnectionStages;
