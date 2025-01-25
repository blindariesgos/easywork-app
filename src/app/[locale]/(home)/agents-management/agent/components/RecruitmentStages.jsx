import { clsx } from "clsx";
import { recruitmentStages } from "@/src/utils/stages";
import { Fragment, useMemo, useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { updateAgentRecruitment } from "@/src/lib/apis";
import { toast } from "react-toastify";
import { useSWRConfig } from "swr";
import useRecruitmentsContext from "@/src/context/recruitments";
import LoaderSpinner from "@/src/components/LoaderSpinner";

const RecruitmentStages = ({ stageId, agentId }) => {
  const [loading, setLoading] = useState(false);
  const { mutate } = useSWRConfig();
  const { mutate: mutateAgents } = useRecruitmentsContext();
  const currentIndexStage = useMemo(() => {
    return recruitmentStages.map((x) => x.id).findIndex((id) => id == stageId);
  }, [stageId]);

  const updateState = async (id) => {
    setLoading(true);
    const body = {
      agentRecruitmentStageId: id,
    };
    const response = await updateAgentRecruitment(body, agentId);
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
          {recruitmentStages.map((stage, index) => (
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

export default RecruitmentStages;
