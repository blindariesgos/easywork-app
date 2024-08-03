import TextInput from "@/src/components/form/TextInput";
import SelectInput from "@/src/components/form/SelectInput"
import InputPhone from "@/src/components/form/InputPhone"
import Button from "@/src/components/form/Button";

const PhysicalContactForm = () => {
    return (
        <div className="py-4">

            <div className="bg-gray-100 p-4 grid gap-4">
                <h3 className="pb-4 text-2xl">Datos de Contacto</h3>
                <div className="grid grid-cols-2 gap-4 ">
                    <TextInput
                        label="RFC"
                    />
                    <TextInput
                        label="RFC"
                    />
                    <SelectInput
                        label="Tipo de persona"
                        options={[
                            {
                                name: "Fisica",
                                id: 0
                            },
                            {
                                name: "Moral",
                                id: 1
                            }
                        ]}
                        placeholder="- Seleccionar -"
                    />
                    <TextInput
                        label="RFC"
                    />
                    <TextInput
                        label="RFC"
                    />
                    <TextInput
                        label="RFC"
                    />
                    <SelectInput
                        label="Tipo de persona"
                        options={[
                            {
                                name: "Fisica",
                                id: 0
                            },
                            {
                                name: "Moral",
                                id: 1
                            }
                        ]}
                        placeholder="- Seleccionar -"
                    />
                    <TextInput
                        label="RFC"
                    />
                </div>
                <TextInput
                    label="RFC"
                />
                <div className="grid grid-cols-2 gap-4">
                    <SelectInput
                        label="Tipo de persona"
                        options={[
                            {
                                name: "Fisica",
                                id: 0
                            },
                            {
                                name: "Moral",
                                id: 1
                            }
                        ]}
                        placeholder="- Seleccionar -"
                    />
                    <SelectInput
                        label="Tipo de persona"
                        options={[
                            {
                                name: "Fisica",
                                id: 0
                            },
                            {
                                name: "Moral",
                                id: 1
                            }
                        ]}
                        placeholder="- Seleccionar -"
                    />
                    <SelectInput
                        label="Tipo de persona"
                        options={[
                            {
                                name: "Fisica",
                                id: 0
                            },
                            {
                                name: "Moral",
                                id: 1
                            }
                        ]}
                        placeholder="- Seleccionar -"
                    />
                    <InputPhone label="Telefono" />
                </div>
                <div className="grid grid-cols-3 gap-4 ">
                    <SelectInput
                        label="Tipo de persona"
                        options={[
                            {
                                name: "Fisica",
                                id: 0
                            },
                            {
                                name: "Moral",
                                id: 1
                            }
                        ]}
                        placeholder="- Seleccionar -"
                    />
                    <div className="col-span-2">
                        <TextInput
                            label="RFC"
                        />
                    </div>
                </div>
                <TextInput
                    label="RFC"
                />
                <div>
                    <Button label="Buscar" buttonStyle="primary" className="px-4 py-2" />

                </div>
            </div>
        </div>
    );
}

export default PhysicalContactForm;