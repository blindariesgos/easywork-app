import SelectInput from "@/src/components/form/SelectInput";
import SelectDropdown from "@/src/components/form/SelectDropdown";
import { useTranslation } from "react-i18next";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import TextInput from "@/src/components/form/TextInput";
import CheckboxInput from "@/src/components/form/CheckboxInput";
import FileInput from "@/src/components/form/FileInput";
import useAppContext from "@/src/context/app";
import Button from "@/src/components/form/Button";

const Configurations = ({ handleNext }) => {
  const { t } = useTranslation();
  const { lists } = useAppContext();
  const schema = yup.object().shape({
    fields: yup.array().of(yup.object().shape({})),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { isValid, errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  return (
    <div className="px-3 py-4">
      <p className="text-sm font-bold pb-4 ">
        {t("import:contacts:config:title")}
      </p>
      <div className="grid grid-cols-4 gap-2">
        <div className="text-sm flex items-center justify-end text-right">
          <span className="text-red-600">*</span>
          {t("import:contacts:config:file")}
        </div>
        <div className="col-span-3">
          <FileInput name="csv-file" />
        </div>
        <div className="text-sm flex items-center justify-end text-right">
          {t("import:contacts:config:data-origin")}
        </div>
        <div className="col-span-3">
          <div className="grid grid-cols-3">
            <div className="col-span-3 md:col-span-2 xl:col-span-1">
              <SelectInput
                options={[
                  { id: "1", name: "Personalizado" },
                  { id: "2", name: "Gmail" },
                  { id: "3", name: "Microsoft Outlook" },
                  { id: "4", name: "Yahoo! Mail" },
                  { id: "5", name: "Correo de Windows Live" },
                ]}
                selectedOption={{ id: "1", name: "Personalizado" }}
                name="origin"
                setValue={setValue}
                border
              />
            </div>
          </div>
        </div>
        <div className="text-sm flex items-center justify-end text-right">
          {t("import:contacts:config:encoding")}
        </div>
        <div className="col-span-3">
          <div className="grid grid-cols-3">
            <div className="col-span-3 md:col-span-2 xl:col-span-1">
              <SelectInput
                options={[
                  { id: "1", name: "Detección Automática" },
                  { id: "4", name: "ASCII" },
                  { id: "2", name: "UTF-8" },
                  { id: "3", name: "UTF-16" },
                ]}
                selectedOption={{ id: "1", name: "Detección Automática" }}
                name="codification"
                setValue={setValue}
                border
              />
            </div>
          </div>
        </div>
        <div className="text-sm flex items-center justify-end text-right">
          {t("import:contacts:config:contact-type")}
        </div>
        <div className="col-span-3">
          <div className="grid grid-cols-3">
            <div className="col-span-3 md:col-span-2 xl:col-span-1">
              <SelectInput
                options={[
                  { id: "1", name: "Clientes" },
                  { id: "4", name: "Proveedores" },
                  { id: "2", name: "Socios" },
                  { id: "3", name: "Otros" },
                ]}
                selectedOption={{ id: "1", name: "Clientes" }}
                name="contact-type"
                setValue={setValue}
                border
              />
            </div>
          </div>
        </div>
        <div className="text-sm flex items-center justify-end text-right">
          {t("import:contacts:config:origin")}
        </div>
        <div className="col-span-3">
          <div className="grid grid-cols-3">
            <div className="col-span-3 md:col-span-2 xl:col-span-1">
              <SelectInput
                options={[
                  { id: "1", name: "Llamada" },
                  { id: "4", name: "Email" },
                  { id: "2", name: "Sitio Web" },
                  { id: "3", name: "Publicidad" },
                  { id: "3", name: "Cliente Existente" },
                  { id: "3", name: "Por Recomendacion" },
                  { id: "3", name: "Mostrar/Exhibicion" },
                ]}
                selectedOption={{ id: "1", name: "Llamada" }}
                name="origin"
                setValue={setValue}
                border
              />
            </div>
          </div>
        </div>
        <div className="text-sm flex items-center justify-end text-right">
          {t("import:contacts:config:description")}
        </div>
        <div className="col-span-3">
          <TextInput
            name="description"
            register={register}
            multiple
            border
            rows={2}
          />
        </div>
        <div className="text-sm flex items-center justify-end text-right">
          {t("import:contacts:config:available")}
        </div>
        <div className="col-span-3 flex items-center">
          <CheckboxInput name="avaible" setValue={setValue} />
        </div>
        <div className="text-sm flex items-center justify-end text-right">
          {t("import:contacts:config:included")}
        </div>
        <div className="col-span-3 flex items-center">
          <CheckboxInput name="included" setValue={setValue} />
        </div>
        <div className="text-sm flex items-center justify-end text-right">
          {t("import:contacts:config:responsible")}
        </div>
        <div className="col-span-3">
          <div className="grid grid-cols-3">
            <div className="col-span-3 md:col-span-2 xl:col-span-1">
              <SelectDropdown
                name="responsibleId"
                options={lists?.users}
                register={register}
                setValue={setValue}
                watch={watch}
                border
              />
            </div>
          </div>
        </div>
        <div className="text-sm flex items-center justify-end text-right">
          {t("import:contacts:config:name-format")}
        </div>
        <div className="col-span-3">
          <div className="grid grid-cols-3">
            <div className="col-span-3 md:col-span-2 xl:col-span-1">
              <SelectInput
                options={[
                  { id: "1", name: "Mr.Smith" },
                  { id: "4", name: "John Smith" },
                  { id: "2", name: "Jhon Abrahm Smith" },
                  { id: "3", name: "Smith Jhon" },
                  { id: "3", name: "Smith Jhon Abraham" },
                ]}
                selectedOption={{ id: "1", name: "Mr.Smith" }}
                name="origin"
                setValue={setValue}
                border
              />
            </div>
          </div>
        </div>
        <div className="text-sm flex items-center justify-end text-right">
          {t("import:contacts:config:file-example")}
        </div>
        <div className="col-span-3">
          <div className="grid grid-cols-3">
            <div className="col-span-3 md:col-span-2 xl:col-span-3">
              <p className="cursor-pointer text-blue-300 underline inline">
                Descargar
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="py-4">
        <p className="text-sm font-bold py-4 rounded-[10px] bg-[#EFEFEF] px-2">
          {t("import:contacts:config:subtitle-format")}
        </p>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <div className="text-sm flex items-center justify-end text-right">
          {t("import:contacts:config:separator")}
        </div>
        <div className="col-span-3">
          <div className="grid grid-cols-3">
            <div className="col-span-3 md:col-span-2 xl:col-span-1">
              <SelectInput
                options={[
                  { id: "1", name: "Punto y coma" },
                  { id: "2", name: "Coma" },
                  { id: "3", name: "Tabulación" },
                  { id: "4", name: "Espacio" },
                ]}
                selectedOption={{ id: "1", name: "Punto y coma" }}
                name="separator"
                setValue={setValue}
                border
              />
            </div>
          </div>
        </div>
        <div className="text-sm flex items-center justify-end text-right">
          {t("import:contacts:config:first-row")}
        </div>
        <div className="col-span-3 flex items-center">
          <CheckboxInput name="first-row" setValue={setValue} />
        </div>
        <div className="text-sm flex items-center justify-end text-right">
          {t("import:contacts:config:omit-column")}
        </div>
        <div className="col-span-3 flex items-center">
          <CheckboxInput name="columns-emply" setValue={setValue} />
        </div>
      </div>
      <div className="py-4">
        <p className="text-sm font-bold py-4 rounded-[10px] bg-[#EFEFEF] px-2">
          {t("import:contacts:config:subtitle-details")}
        </p>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <div className="text-sm flex items-center justify-end text-right">
          {t("import:contacts:config:import-details")}
        </div>
        <div className="col-span-3 flex items-center">
          <CheckboxInput name="import-details" setValue={setValue} />
        </div>
        <div className="text-sm flex items-center justify-end text-right">
          {t("import:contacts:config:template")}
        </div>
        <div className="col-span-3">
          <div className="grid grid-cols-3">
            <div className="col-span-3 md:col-span-2 xl:col-span-1">
              <SelectInput
                options={[
                  { id: "1", name: "Punto y coma" },
                  { id: "2", name: "Coma" },
                  { id: "3", name: "Tabulación" },
                  { id: "4", name: "Espacio" },
                ]}
                selectedOption={{ id: "1", name: "Punto y coma" }}
                name="import-details"
                setValue={setValue}
                border
              />
            </div>
          </div>
        </div>

        <div className="text-sm flex items-center justify-end text-right">
          {t("import:contacts:config:match-templates")}
        </div>
        <div className="col-span-3 flex items-center">
          <CheckboxInput name="match-templates" setValue={setValue} />
        </div>
        <div className="text-sm flex items-center justify-end text-right">
          {t("import:contacts:config:id-template")}
        </div>
        <div className="col-span-3 flex items-center">
          <CheckboxInput name="id-template" setValue={setValue} />
        </div>
        <div className="text-sm flex items-center justify-end text-right">
          {t("import:contacts:config:use-template")}
        </div>
        <div className="col-span-3 flex items-center">
          <CheckboxInput name="use-template" setValue={setValue} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2  xl:grid-cols-4">
        <div className="flex justify-center gap-2 pt-4 xl:col-span-2">
          <Button
            label={t("common:buttons:next")}
            className="px-2 py-1"
            buttonStyle="primary"
            onclick={handleNext}
          />
          <Button
            label={t("common:buttons:cancel")}
            className="px-2 py-1"
            buttonStyle="secondary"
          />
        </div>
      </div>
      <div className="flex">
        <span className="text-red-600">*</span>
        <p>{t("import:contacts:config:field-required")}</p>
      </div>
    </div>
  );
};

export default Configurations;
