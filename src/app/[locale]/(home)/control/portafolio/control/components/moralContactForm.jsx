import TextInput from "@/src/components/form/TextInput";
import SelectInput from "@/src/components/form/SelectInput";
import InputPhone from "@/src/components/form/InputPhone";
import Button from "@/src/components/form/Button";
import { useTranslation } from "react-i18next";

const MoralContactForm = () => {
  const { t } = useTranslation();
  return (
    <div className="py-4">
      <div className="bg-gray-100 p-4 grid gap-4">
        <h3 className="pb-4 text-2xl">
          {t("control:portafolio:control:form:contact-data")}
        </h3>
        <div className="grid grid-cols-2 gap-4 ">
          <TextInput label={t("control:portafolio:control:form:rfc")} />
          <SelectInput
            label={t("control:portafolio:control:form:agent")}
            options={[
              {
                name: "Soporte Principal",
                id: 0,
              },
              {
                name: "Soporte S21",
                id: 1,
              },
            ]}
            placeholder="- Seleccionar -"
          />
          <TextInput label={t("control:portafolio:control:form:names")} />
          <TextInput label={t("control:portafolio:control:form:lastnames")} />
          <InputPhone label={t("control:portafolio:control:form:phone")} />

          <div className="grid grid-cols-3 gap-4 ">
            <SelectInput
              label={t("control:portafolio:control:form:email")}
              options={[
                {
                  name: "Personal",
                  id: 0,
                },
                {
                  name: "Trabajo",
                  id: 1,
                },
              ]}
              placeholder="- Seleccionar -"
            />
            <div className="col-span-2 flex items-end">
              <TextInput />
            </div>
          </div>

          <TextInput label={t("control:portafolio:control:form:website")} />
          <div className="grid grid-cols-3 gap-4 ">
            <SelectInput
              label={t("control:portafolio:control:form:social-network")}
              options={[
                {
                  name: "Facebook",
                  id: 0,
                },
                {
                  name: "Instagram",
                  id: 1,
                },
                {
                  name: "TikTok",
                  id: 2,
                },
                {
                  name: "X",
                  id: 3,
                },
              ]}
              placeholder="- Seleccionar -"
            />
            <div className="col-span-2 flex items-end">
              <TextInput />
            </div>
          </div>
        </div>
        <h3 className="pb-4 text-2xl">
          {t("control:portafolio:control:form:company-data")}
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <TextInput label={t("control:portafolio:control:form:company-rfc")} />
          <TextInput
            label={t("control:portafolio:control:form:company-name")}
          />
          <SelectInput
            label={t("control:portafolio:control:form:company-type")}
            options={[
              {
                name: "Cliente Contratante",
                id: 0,
              },
              {
                name: "Competencia",
                id: 1,
              },
              {
                name: "Pagador",
                id: 2,
              },
              {
                name: "Proveedor",
                id: 3,
              },
              {
                name: "Socio",
                id: 4,
              },
              {
                name: "Direccion Agencia",
                id: 5,
              },
            ]}
            placeholder="- Seleccionar -"
          />
          <SelectInput
            label={t("control:portafolio:control:form:company-activity")}
            options={[
              {
                name: "Física",
                id: 0,
              },
              {
                name: "Moral",
                id: 1,
              },
            ]}
            placeholder="- Seleccionar -"
          />
          <InputPhone label={t("control:portafolio:control:form:phone")} />
          <TextInput label={t("control:portafolio:control:form:email")} />
        </div>

        <div>
          <Button label="Buscar" buttonStyle="primary" className="px-4 py-2" />
        </div>
      </div>
    </div>
  );
};

export default MoralContactForm;
