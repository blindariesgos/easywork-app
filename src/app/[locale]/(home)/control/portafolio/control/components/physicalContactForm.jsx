import TextInput from "@/src/components/form/TextInput";
import SelectInput from "@/src/components/form/SelectInput"
import InputPhone from "@/src/components/form/InputPhone"
import Button from "@/src/components/form/Button";
import { useTranslation } from "react-i18next";

const PhysicalContactForm = () => {
    const {t} = useTranslation()
    return (
        <div className="py-4">

            <div className="bg-gray-100 p-4 grid gap-4">
                <h3 className="pb-4 text-2xl">{t("tools:portafolio:control:form:contact-data")}</h3>
                <div className="grid grid-cols-2 gap-4 ">
                    <TextInput
                        label={t("tools:portafolio:control:form:rfc")}
                    />
                    <TextInput
                        label={t("tools:portafolio:control:form:curp")}
                    />
                    <SelectInput
                        label={t("tools:portafolio:control:form:agent")}
                        options={[
                            {
                                name: "Soporte Principal",
                                id: 0
                            },
                            {
                                name: "Soporte S21",
                                id: 1
                            }
                        ]}
                        placeholder="- Seleccionar -"
                    />
                    <TextInput
                        label={t("tools:portafolio:control:form:names")}
                    />
                    <TextInput
                        label={t("tools:portafolio:control:form:lastnames")}
                    />
                    <TextInput
                        label={t("tools:portafolio:control:form:birthday")}
                    />
                    <SelectInput
                        label={t("tools:portafolio:control:form:gender")}
                        options={[
                            {
                                name: "Femenino",
                                id: 0
                            },
                            {
                                name: "Masculino",
                                id: 1
                            },
                            {
                                name: "No Indica",
                                id: 1
                            }
                        ]}
                        placeholder="- Seleccionar -"
                    />
                    <TextInput
                        label={t("tools:portafolio:control:form:postal-code")}
                    />
                </div>
                <TextInput
                    label={t("tools:portafolio:control:form:address")}
                />
                <div className="grid grid-cols-2 gap-4">
                    <SelectInput
                        label={t("tools:portafolio:control:form:state")}
                        options={[
                            {
                                name: "estado 1",
                                id: 0
                            },
                            {
                                name: "estado 2",
                                id: 1
                            }
                        ]}
                        placeholder="- Seleccionar -"
                    />
                    <SelectInput
                        label={t("tools:portafolio:control:form:city")}
                        options={[
                            {
                                name: "ciudad 1",
                                id: 0
                            },
                            {
                                name: "ciudad 2",
                                id: 1
                            }
                        ]}
                        placeholder="- Seleccionar -"
                    />
                    <SelectInput
                        label={t("tools:portafolio:control:form:municipality")}
                        options={[
                            {
                                name: "municipio 1",
                                id: 0
                            },
                            {
                                name: "municipio 2",
                                id: 1
                            }
                        ]}
                        placeholder="- Seleccionar -"
                    />
                    <InputPhone label={t("tools:portafolio:control:form:phone")} />
                </div>
                <div className="grid grid-cols-3 gap-4 ">
                    <SelectInput
                        label={t("tools:portafolio:control:form:email")}
                        options={[
                            {
                                name: "Personal",
                                id: 0
                            },
                            {
                                name: "Trabajo",
                                id: 1
                            }
                        ]}
                        placeholder="- Seleccionar -"
                    />
                    <div className="col-span-2 flex items-end">
                        <TextInput
                        />
                    </div>
                </div>
                <TextInput
                    label={t("tools:portafolio:control:form:comment")}
                    multiple
                />
                <div>
                    <Button label="Buscar" buttonStyle="primary" className="px-4 py-2" />

                </div>
            </div>
        </div>
    );
}

export default PhysicalContactForm;