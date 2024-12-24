import SelectInput from "../../../../../../../../components/form/SelectInput";
import PhysicalContactForm from "../physicalContactForm";
import MoralContactForm from "../moralContactForm";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t } = useTranslation();
  const [type, setType] = useState();
  return (
    <div className="py-4">
      <div className="grid grid-cols-3">
        <div className="bg-gray-100 p-4">
          <SelectInput
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
            placeholder="- Seleccionar -"
            setSelectedOption={(e) => setType(e.id)}
          />
        </div>
      </div>

      {type &&
        (type == "physical" ? <PhysicalContactForm /> : <MoralContactForm />)}
    </div>
  );
};

export default Contact;
