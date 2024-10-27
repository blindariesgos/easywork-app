import SelectInput from "@/src/components/form/SelectInput";
import { useTranslation } from "react-i18next";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import TextInput from "@/src/components/form/TextInput";
import CheckboxInput from "@/src/components/form/CheckboxInput";

const Configurations = () => {
  const { t } = useTranslation();

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
      <p className="text-sm font-bold">{t("import:contacts:config:title")}</p>
      <div className="grid grid-cols-4 gap-2">
        <div className="text-sm flex items-center justify-end">
          {t("import:contacts:config:file")}
        </div>
        <div className="col-span-3">
          <div className="grid grid-cols-3">
            <div className="col-span-3 md:col-span-2 xl:col-span-3"></div>
          </div>
        </div>
        <div className="text-sm flex items-center justify-end">
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
        <div className="text-sm flex items-center justify-end">
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
        <div className="text-sm flex items-center justify-end">
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
        <div className="text-sm flex items-center justify-end">
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
        <div className="text-sm flex items-center justify-end">
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
        <div className="text-sm flex items-center justify-end">
          {t("import:contacts:config:available")}
        </div>
        <div className="col-span-3">
          <CheckboxInput name="avaible" setValue={setValue} />
        </div>
        <div className="text-sm flex items-center justify-end">
          {t("import:contacts:config:included")}
        </div>
        <div className="col-span-3">
          <CheckboxInput name="included" setValue={setValue} />
        </div>
        <div className="text-sm flex items-center justify-end">
          {t("import:contacts:config:responsible")}
        </div>
        <div className="col-span-3">
          <div className="grid grid-cols-3">
            <div className="col-span-3 md:col-span-2 xl:col-span-3"></div>
          </div>
        </div>
        <div className="text-sm flex items-center justify-end">
          {t("import:contacts:config:name-format")}
        </div>
        <div className="col-span-3">
          <div className="grid grid-cols-3">
            <div className="col-span-3 md:col-span-2 xl:col-span-3"></div>
          </div>
        </div>
        <div className="text-sm flex items-center justify-end">
          {t("import:contacts:config:file-example")}
        </div>
        <div className="col-span-3">
          <div className="grid grid-cols-3">
            <div className="col-span-3 md:col-span-2 xl:col-span-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configurations;
