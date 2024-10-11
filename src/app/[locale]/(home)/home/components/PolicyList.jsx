import clsx from "clsx";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { getPoliciesNeedAttention } from "@/src/lib/apis";
import moment from "moment";
import { LoadingSpinnerSmall } from "@/src/components/LoaderSpinner";
import Image from "next/image";

const PolicyList = () => {
  const [policies, setPolicies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getPolicies = async () => {
      try {
        const response = await getPoliciesNeedAttention();
        console.log({ response });
        setPolicies(response);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    getPolicies();
  }, []);

  return (
    <div
      className={clsx(
        "bg-white rounded-lg p-2 h-64 flex items-center flex-col",
        {
          "justify-between": !policies?.length,
        }
      )}
    >
      <h1 className="h-1/6 font-medium">Pólizas que requieren atención</h1>
      {isLoading ? (
        <LoadingSpinnerSmall color="primary" />
      ) : policies && policies.length > 0 ? (
        <div className="flex flex-col gap-2 overflow-y-auto w-full pr-1 h-full">
          {policies.map((policy) => (
            <Link
              className="flex flex-col gap-1 cursor-pointer hover:bg-easy-300 rounded-md p-1"
              href={`/sales/crm/contacts/contact/${policy.id}?show=true`}
              key={policy.id}
            >
              <div className="flex gap-2 items-center">
                <Image
                  className="h-12 w-12 rounded-full object-cover"
                  width={36}
                  height={36}
                  src={policy?.contact?.photo || "/img/avatar.svg"}
                  alt=""
                />
                <div>
                  <p className="text-sm">{policy?.contact?.fullName}</p>
                  <p className="text-sm">{`${policy?.company?.name} ${policy.poliza} ${policy?.type?.name}`}</p>
                  <p className="text-sm">
                    {`$${policy?.importeTotal?.toFixed(2) ?? "0.00"} ${moment(policy.vigenciDesde).format("MMM. DD, YYYY")}`}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <Fragment>
          <div className=" flex justify-center items-center bg-slate-200 shadow-lg text-center rounded-lg w-full h-[60px]">
            <h1 className="text-sm p-2 ">
              ¡Buen trabajo! No tienes actividades por atender en tus pólizas
            </h1>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default PolicyList;
