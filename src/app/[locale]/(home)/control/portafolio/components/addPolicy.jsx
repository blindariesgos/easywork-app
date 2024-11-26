"use client";

import { useTranslation } from "react-i18next";
import SliderOverShord from "@/src/components/SliderOverShort";
import Button from "@/src/components/form/Button";
import Tag from "@/src/components/Tag";
import SelectInput from "@/src/components/form/SelectInput";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiFileText } from "react-icons/fi";
import useAppContext from "@/src/context/app";
import SelectSubAgent from "@/src/components/form/SelectSubAgent/SelectSubAgent";
import ContactSelectAsync from "@/src/components/form/ContactSelectAsync";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { addLeadDocument, addPolicyByPdf } from "@/src/lib/apis";
import LoaderSpinner from "@/src/components/LoaderSpinner";

const AddPolicy = ({ isOpen, setIsOpen }) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [policy, setPolicy] = useState();
  const MAX_FILE_SIZE = 5000000; //5MB
  const { lists } = useAppContext();

  const schema = yup.object().shape({
    contact: yup.object().shape({}).required(t("common:validations:required")),
    // typePerson: yup.string().required(t("common:validations:required")),
    aseguradora: yup.string().required(t("common:validations:required")),
    tipo: yup.string().required(t("common:validations:required")),
    responsibleId: yup.string().required(t("common:validations:required")),
    subAgente: yup.object().shape({}),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

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
        file: file,
        size: file.size,
        name: file.name,
        result: reader.result,
      };

      setPolicy(result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data) => {
    const { contact, subAgente, ...otherData } = data;
    const body = {
      ...otherData,
      poliza: policy.file,
      contactId: contact.id,
      subAgenteId: subAgente.id,
    };
    const formData = new FormData();
    for (const key in body) {
      if (body[key] === null || body[key] === undefined || body[key] === "") {
        continue;
      }
      if (body[key] instanceof File || body[key] instanceof Blob) {
        formData.append(key, body[key]);
      } else if (Array.isArray(body[key])) {
        formData.append(key, JSON.stringify(body[key]));
      } else {
        formData.append(key, body[key]?.toString() || "");
      }
    }

    console.log({ data, body });
    try {
      const response = await addPolicyByPdf(formData);
      if (response?.hasError) {
        toast.error(
          response?.error?.message ??
            "Se ha producido un error cargar la poliza, inténtelo de nuevo mas tarde."
        );
        setLoading(false);

        return;
      }
    } catch (error) {}
    setIsOpen(false);
  };

  const handleReset = () => {
    reset({
      contact: "",
      aseguradora: "",
      tipo: "",
      typePerson: "",
      subAgente: "",
      responsibleId: "",
    });
    reset();
  };

  return (
    <Fragment>
      {loading && <LoaderSpinner />}
      <SliderOverShord openModal={isOpen}>
        <Tag
          onclick={() => {
            handleReset();
            setIsOpen(false);
          }}
          className="bg-easywork-main"
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className=" bg-gray-600 px-6 py-8 h-screen rounded-l-[35px] w-[567px] shadow-[-3px_1px_15px_4px_#0000003d]">
            <div className="bg-gray-100 rounded-md p-2">
              <h4 className="text-2xl pb-4">Crear póliza</h4>
              <div className="bg-white rounded-md p-4 flex justify-between items-center">
                <p>Datos de la póliza</p>
                {/* <RiPencilFill className="w-4 h-4 text-primary" /> */}
              </div>
              <div className="px-8 pt-4 grid grid-cols-1 gap-4">
                {/* <SelectInput
                label={t("control:portafolio:control:form:typePerson")}
                options={[
                  {
                    name: "Física",
                    id: "fisica",
                  },
                  {
                    name: "Moral",
                    id: "moral",
                  },
                ]}
                name="typePerson"
                error={errors?.typePerson}
              /> */}
                <ContactSelectAsync
                  label={t("control:portafolio:control:form:contact")}
                  name={"contact"}
                  setValue={setValue}
                  watch={watch}
                  error={errors?.contact}
                />
                <SelectInput
                  label={t("control:portafolio:control:form:insurance-company")}
                  options={[
                    {
                      id: "gnp",
                      name: "GNP",
                    },
                  ]}
                  name="aseguradora"
                  error={errors?.aseguradora}
                  setValue={setValue}
                />

                <SelectInput
                  label={t("control:portafolio:control:form:branch")}
                  options={[
                    {
                      id: "vehiculos",
                      name: "VEHICULO",
                    },
                  ]}
                  error={errors?.branch}
                  name="tipo"
                  setValue={setValue}
                />
                <SelectSubAgent
                  label={t("control:portafolio:control:form:subAgente")}
                  name="subAgente"
                  register={register}
                  setValue={setValue}
                  watch={watch}
                  error={errors?.subAgente}
                />
                <SelectInput
                  label={t("control:portafolio:control:form:responsible")}
                  options={lists?.users ?? []}
                  name="responsibleId"
                  error={errors?.responsibleId}
                  setValue={setValue}
                />

                <div className="w-full">
                  <label
                    className={`block text-sm font-medium leading-6 text-gray-900`}
                  >
                    Póliza emitida pagada
                  </label>
                  <label
                    htmlFor="policy-file"
                    className="bg-primary rounded-md group cursor-pointer w-full p-2 mt-1 text-white block text-center hover:bg-easy-500 shadow-sm text-sm"
                  >
                    <p>Selecciona un PDF: GNP</p>
                    {policy && (
                      <div className="flex flex-col gap-2 justify-center items-center pt-2">
                        <div className="p-2 group-hover:bg-primary bg-easy-500 rounded-md">
                          <FiFileText className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-center text-xs text-white">
                          {policy.name}
                        </p>
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
                  <p className="text-xs italic text-center pt-2 text-gray-700">
                    próximamente:{" "}
                    <span className="font-bold">
                      Beta solo Chubb/Quálitas/AXA - Autos
                    </span>
                  </p>
                </div>
                <div className="w-full flex justify-center gap-4 py-4">
                  <Button
                    className="px-4 py-2"
                    buttonStyle="primary"
                    label="Guardar"
                    type="submit"
                  />
                  <Button
                    className="px-4 py-2"
                    buttonStyle="secondary"
                    label="Cancelar"
                    onclick={() => {
                      handleReset();
                      setIsOpen(false);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </SliderOverShord>
    </Fragment>
  );
};

export default AddPolicy;
