import TextInput from "../../../../../../../../components/form/TextInput";
import SelectInput from "../../../../../../../../components/form/SelectInput";
import InputDate from "../../../../../../../../components/form/InputDate";
import InputCheckBox from "../../../../../../../../components/form/InputCheckBox";
import Button from "../../../../../../../../components/form/Button";
import * as yup from 'yup';


import { useState } from "react"
import { Controller, useForm } from "react-hook-form";
import { FaCalendarDays } from "react-icons/fa6";
import { yupResolver } from "@hookform/resolvers/yup";

const Policy = () => {
    const schema = yup.object().shape({
        limitDate: yup.string(),

    });

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        getValues,
        watch,
        formState: { isValid, errors },
    } = useForm({
        defaultValues: {
            range: [null, null],
        },
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    return (
        <form>
            <div className="py-4 grid grid-cols-1 gap-4">
                <div className="p-4 grid grid-cols-2 bg-gray-100 gap-4">
                    <div className=" col-span-2 flex">
                        <div className="bg-white p-4 flex items-center gap-4 w-auto">
                            <InputCheckBox label="primero" />
                            <InputCheckBox label="segundo" />
                        </div>
                    </div>
                    <TextInput
                        label="RFC"
                    />
                    <SelectInput
                        label="Tipo de persona"
                        options={[
                            {
                                name: "Fisica",
                                id: "physical"
                            },
                            {
                                name: "Moral",
                                id: "moral"
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
                                id: "physical"
                            },
                            {
                                name: "Moral",
                                id: "moral"
                            }
                        ]}
                        placeholder="- Seleccionar -"
                    />
                    <TextInput
                        label="RFC"
                    />
                    <SelectInput
                        label="Tipo de persona"
                        options={[
                            {
                                name: "Fisica",
                                id: "physical"
                            },
                            {
                                name: "Moral",
                                id: "moral"
                            }
                        ]}
                        placeholder="- Seleccionar -"
                    />
                </div>
                <div className="p-4 grid grid-cols-2 bg-gray-100 gap-4">
                    <Controller
                        render={({ field: { value, onChange, ref, onBlur } }) => {
                            return (
                                <InputDate
                                    value={value}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    icon={
                                        <FaCalendarDays className="h-3 w-3 text-primary pr-4" />
                                    }
                                    label="fecha"
                                />
                            );
                        }}
                        name="limitDate"
                        control={control}
                        defaultValue=""
                    />
                    <Controller
                        render={({ field: { value, onChange, ref, onBlur } }) => {
                            return (
                                <InputDate
                                    value={value}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    icon={
                                        <FaCalendarDays className="h-3 w-3 text-primary pr-4" />
                                    }
                                    label="fecha"
                                />
                            );
                        }}
                        name="limitDate"
                        control={control}
                        defaultValue=""
                    />
                    <Controller
                        render={({ field: { value, onChange, ref, onBlur } }) => {
                            return (
                                <InputDate
                                    value={value}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    icon={
                                        <FaCalendarDays className="h-3 w-3 text-primary pr-4" />
                                    }
                                    label="fecha"
                                />
                            );
                        }}
                        name="limitDate"
                        control={control}
                        defaultValue=""
                    />
                    <SelectInput
                        label="Tipo de persona"
                        options={[
                            {
                                name: "Fisica",
                                id: "physical"
                            },
                            {
                                name: "Moral",
                                id: "moral"
                            }
                        ]}
                        placeholder="- Seleccionar -"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <SelectInput
                            label="Tipo de persona"
                            options={[
                                {
                                    name: "Fisica",
                                    id: "physical"
                                },
                                {
                                    name: "Moral",
                                    id: "moral"
                                }
                            ]}
                            placeholder="- Seleccionar -"
                        />
                        <TextInput
                            label="RFC"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <SelectInput
                            label="Tipo de persona"
                            options={[
                                {
                                    name: "Fisica",
                                    id: "physical"
                                },
                                {
                                    name: "Moral",
                                    id: "moral"
                                }
                            ]}
                            placeholder="- Seleccionar -"
                        />
                        <TextInput
                            label="RFC"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <SelectInput
                            label="Tipo de persona"
                            options={[
                                {
                                    name: "Fisica",
                                    id: "physical"
                                },
                                {
                                    name: "Moral",
                                    id: "moral"
                                }
                            ]}
                            placeholder="- Seleccionar -"
                        />
                        <TextInput
                            label="RFC"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <SelectInput
                            label="Tipo de persona"
                            options={[
                                {
                                    name: "Fisica",
                                    id: "physical"
                                },
                                {
                                    name: "Moral",
                                    id: "moral"
                                }
                            ]}
                            placeholder="- Seleccionar -"
                        />
                        <TextInput
                            label="RFC"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <SelectInput
                            label="Tipo de persona"
                            options={[
                                {
                                    name: "Fisica",
                                    id: "physical"
                                },
                                {
                                    name: "Moral",
                                    id: "moral"
                                }
                            ]}
                            placeholder="- Seleccionar -"
                        />
                        <TextInput
                            label="RFC"
                        />
                    </div>
                    <SelectInput
                        label="Tipo de persona"
                        options={[
                            {
                                name: "Fisica",
                                id: "physical"
                            },
                            {
                                name: "Moral",
                                id: "moral"
                            }
                        ]}
                        placeholder="- Seleccionar -"
                    />
                    <SelectInput
                        label="Tipo de persona"
                        options={[
                            {
                                name: "Fisica",
                                id: "physical"
                            },
                            {
                                name: "Moral",
                                id: "moral"
                            }
                        ]}
                        placeholder="- Seleccionar -"
                    />

                </div>
                <div>
                    <Button label="Buscar" buttonStyle="primary" className="px-4 py-2" />

                </div>
            </div>
        </form>
    );
}

export default Policy;