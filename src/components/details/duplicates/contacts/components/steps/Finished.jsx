import Button from "@/src/components/form/Button";
import Image from "next/image";
import { Fragment, useState } from "react";

const Finished = ({ onClose }) => {
  return (
    <div className="rounded-lg bg-[#F9F9F9] max-h-[calc(100vh_-_100px)] h-full flex justify-center items-center gap-6 flex-col py-10">
      <Fragment>
        <h1 className="text-2xl pb-4">Resultado de la fusion</h1>
        <h2 className="text-xl pb-4">Exitoso</h2>
        <Image
          className="h-[230px] w-[230px] rounded-full"
          width={230}
          height={230}
          src={"/img/check-duplicates.svg"}
          alt=""
        />
        <Button
          className="max-w-[324px] w-full py-2 px-3"
          buttonStyle="primary"
          label={"Salir"}
          onclick={onClose}
        />
      </Fragment>
    </div>
  );
};

export default Finished;
