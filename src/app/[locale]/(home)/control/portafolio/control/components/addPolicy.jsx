"use client";

import { useTranslation } from "react-i18next";
import SliderOverShord from "../../../../../../../components/SliderOverShort";
import Button from "../../../../../../../components/form/Button";
import Tag from "@/src/components/Tag";
import { RiPencilFill } from "react-icons/ri";
import SelectInput from "../../../../../../../components/form/SelectInput";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiFileText } from "react-icons/fi";
const AddPolicy = ({ isOpen, setIsOpen }) => {
  const { t } = useTranslation();
  const [file, setFile] = useState();
  const MAX_FILE_SIZE = 5000000; //5MB

  const handleChangeFile = async (e) => {
    const files = e.target.files;

    if (!files) {
      return;
    }

    const file = Array.from(files)[0];

    if (file.size > MAX_FILE_SIZE) {
      toast.error("El archivo debe tener un tamaño menor a 5MB.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const result = {
        file: reader.result,
        size: file.size,
        name: file.name,
      };

      setFile(result);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    console.log({ file });
  }, [file]);

  return (
    <SliderOverShord openModal={isOpen}>
      <Tag onclick={() => setIsOpen(false)} className="bg-easywork-main" />
      <div className=" bg-gray-600 px-6 py-8 h-screen rounded-l-[35px] w-[567px] shadow-[-3px_1px_15px_4px_#0000003d]">
        <div className="bg-gray-100 rounded-md p-2">
          <h4 className="text-2xl pb-4">Datos</h4>
          <div className="bg-white rounded-md p-4 flex justify-between items-center">
            <p>Datos</p>
            <RiPencilFill className="w-4 h-4 text-primary" />
          </div>
          <div className="px-8 pt-4 grid grid-cols-1 gap-4">
            <SelectInput
              label={t("control:portafolio:control:form:typePerson")}
              options={[
                {
                  name: "Fisica",
                  id: "physical",
                },
                {
                  name: "Moral",
                  id: "moral",
                },
              ]}
              placeholder="- Seleccionar -"
            />
            <SelectInput
              label={t("control:portafolio:control:form:insurance-company")}
              options={[
                {
                  name: "GNP",
                  id: "physical",
                },
                {
                  name: "Otro",
                  id: "moral",
                },
                {
                  name: "ALLIANZ",
                  id: "moral1",
                },
                {
                  name: "ARGOS",
                  id: "moral11",
                },
                {
                  name: "ATLAS",
                  id: "moral2",
                },
                {
                  name: "AVANZA",
                  id: "moral3",
                },
                {
                  name: "AXXA",
                  id: "moral4",
                },
                {
                  name: "BANORTE",
                  id: "moral5",
                },
              ]}
              placeholder="- Seleccionar -"
            />
            <SelectInput
              label={t("control:portafolio:control:form:category")}
              options={[
                {
                  name: "AHORRO",
                  id: "physical",
                },
                {
                  name: "ALPHA MEDICAL INTEGRO",
                  id: "moral7",
                },
                {
                  name: "ALTA ASEGURADORA",
                  id: "moral6",
                },
                {
                  name: "ALTA RECIEN NACIDO",
                  id: "moral5",
                },
                {
                  name: "AMPLIA",
                  id: "moral4",
                },
                {
                  name: "C.F.P",
                  id: "moral3",
                },
                {
                  name: "C.F.P A MENSUAL",
                  id: "mora2l",
                },
                {
                  name: "C.F.P A SEMESTRAL",
                  id: "moral1",
                },
              ]}
              placeholder="- Seleccionar -"
            />
            <SelectInput
              label={t("control:portafolio:control:form:branch")}
              options={[
                {
                  name: "001-PARTICULAR",
                  id: "physical",
                },
                {
                  name: "002-COMERCIAL",
                  id: "moral8",
                },
                {
                  name: "003-NACIONAL",
                  id: "moral6",
                },
                {
                  name: "004-INTERNACIONAL",
                  id: "moral5",
                },
                {
                  name: "005-TEMPORAL",
                  id: "moral3",
                },
                {
                  name: "006-RETIRO",
                  id: "moralw",
                },
                {
                  name: "007-AHORRO",
                  id: "moralb",
                },
                {
                  name: "008-INVERSION",
                  id: "moralf",
                },
              ]}
              placeholder="- Seleccionar -"
            />
            <SelectInput
              label={t("control:portafolio:control:form:health-branch")}
              options={[
                {
                  name: "Otros",
                  id: "physical",
                },
                {
                  name: "ACCIDENTES",
                  id: "moral",
                },
                {
                  name: "DENTAL",
                  id: "morale",
                },
                {
                  name: "EJECUTIVOS",
                  id: "moralw",
                },
              ]}
              placeholder="- Seleccionar -"
            />
            <div className="w-full">
              <label
                className={`block text-sm font-medium leading-6 text-gray-900`}
              >
                Póliza emitida
              </label>
              <label
                htmlFor="policy-file"
                className="bg-primary rounded-md cursor-pointer w-full p-2 mt-1 text-white block text-center hover:bg-easy-500 shadow-sm text-sm"
              >
                <p>Cargar Documento</p>
                {file && (
                  <div className="flex flex-col gap-2 justify-center items-center pt-2">
                    <div className="p-10 bg-easy-500 rounded-md">
                      <FiFileText className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-center text-white">{file.name}</p>
                  </div>
                )}
              </label>
              <input
                type="file"
                name="policy-file"
                id="policy-file"
                className="hidden"
                accept=".pdf"
                onChange={handleChangeFile}
              />
            </div>
            <div className="w-full flex justify-center gap-4 py-4">
              <Button
                className="px-4 py-2"
                buttonStyle="primary"
                label="Guardar"
                onclick={() => setIsOpen(false)}
              />
              <Button
                className="px-4 py-2"
                buttonStyle="secondary"
                label="Cancelar"
                onclick={() => setIsOpen(false)}
              />
            </div>
          </div>
        </div>
      </div>
    </SliderOverShord>
  );
};

export default AddPolicy;
