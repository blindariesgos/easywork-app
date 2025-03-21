import Button from "@/src/components/form/Button";
import Image from "next/image";
import { Fragment, useState } from "react";
import { LoadingSpinnerSmall } from "@/src/components/LoaderSpinner";

const Actions = ({ handleBack, handleEnd, handleOpenManual, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleClickEnd = () => {
    setLoading(true);
    setTimeout(() => {
      handleEnd();
    }, 10000);
  };

  return (
    <div className="rounded-lg bg-[#F9F9F9] max-h-[calc(100vh_-_100px)] h-full flex justify-center items-center gap-6 flex-col">
      <Fragment>
        <h1 className="text-2xl pb-4">Duplicados encontrados: 490</h1>
        <h2 className="text-xl pb-4">
          Coincidencias en los campos seleccionados: 217
        </h2>
        <Image
          className="h-[230px] w-[230px] rounded-full"
          width={230}
          height={230}
          src={"/img/restart-duplicates.svg"}
          alt=""
        />
        <Button
          label={"Reanudar el escaneo"}
          buttonStyle="text"
          onclick={handleBack}
          fontSize="text-base"
        />
        {loading && (
          <div className="h-[60px]">
            <LoadingSpinnerSmall />
          </div>
        )}
        {!loading && (
          <div className="flex justify-center items-center gap-2 flex-col">
            <Button
              className="max-w-[324px] w-full py-2 px-3"
              buttonStyle="primary"
              label={"Cambiar duplicados automaticamente"}
              onclick={handleClickEnd}
            />
            <Button
              className="max-w-[324px] w-full py-2 px-3"
              buttonStyle="outlined"
              label={"Fusionar duplicados manualmente"}
              onclick={() => {
                onClose();
                handleOpenManual();
              }}
            />
          </div>
        )}

        <p className="text-center text-sm max-w-[612px]">
          Los duplicados sin conflictos se combinarán automáticamente. Los
          duplicados restantes tendrán que combinarse manualmente o puede
          omitirlos
        </p>
      </Fragment>
    </div>
  );
};

export default Actions;
