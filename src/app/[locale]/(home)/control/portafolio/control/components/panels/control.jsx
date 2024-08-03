import SelectInput from "../../../../../../../../components/form/SelectInput"
import { useState } from "react"
import { Radio, RadioGroup } from '@headlessui/react'
import { ImCheckmark } from "react-icons/im";
import Button from "@/src/components/form/Button"
import ControlTable from "../controlTable"

const currencies = [
    { name: 'Todas las monedas', value: "ALL" },
    { name: 'Peso', value: "PESO" },
    { name: 'Dolar', value: "DOLLAR" },
]

const cards = [
    { name: "Por Vencer 5 Días", type: 1, color: "#DFE3E6", value: "23412" },
    { name: "Vencido 30 Días", type: 2, color: "#FFEB04", value: "324" },
    { name: "Urgente 7 Días", type: 3, color: "#86BEDF", value: "23" },
    { name: "Retrasado 15 Días", type: 4, color: "#A9EA44", value: "212" },
    { name: "A Tiempo", type: 5, color: "#8D9194", value: "43" },
    { name: "Basura", type: 6, color: "#AF8764", value: "2" },
    { name: "Anuladas", type: 7, color: "#0F8BBF", value: "24" },
]

const Control = () => {
    const [type, setType] = useState()
    const [currencySelected, setCurrendySelected] = useState(currencies[0])
    const [cardSelected, setCardSelected] = useState(cards[0])

    return (
        <div className="py-4 grid grid-cols-1 gap-4">
            <div className="grid grid-cols-3">
                <div className="bg-gray-100 p-4 grid grid-cols-1 gap-4">
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
                        setSelectedOption={(e) => setType(e.id)}
                    />
                    <RadioGroup by="name" value={currencySelected} onChange={setCurrendySelected} aria-label="Server size" className="py-2 grid grid-cols-1 gap-2">
                        {currencies.map((currency) => (
                            <Radio
                                key={currency.name}
                                value={currency}
                                className="group relative flex cursor-pointer transition focus:outline-none  "
                            >
                                <div className="flex items-center gap-x-2">
                                    <ImCheckmark className="size-4 fill-primary opacity-0 transition group-data-[checked]:opacity-100" />
                                    <p className="text-sm">{currency.name}</p>
                                </div>
                            </Radio>
                        ))}
                    </RadioGroup>
                </div>
            </div>
            <div className="flex justify-start">
                <Button label="Buscar" className="py-2 px-4" buttonStyle="primary" />
            </div>
            <RadioGroup by="name" value={cardSelected} onChange={setCardSelected} className="py-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-4">
                {cards.map((card) => (
                    <Radio
                        key={card.type}
                        value={card}
                        className="group px-2 pb-2 pt-4 relative opacity-20 select-none grid grid-cols-1 gap-6 data-[checked]:opacity-100 cursor-pointer transition focus:outline-none rounded-lg overflow-hidden border-[0.5px] border-primary"
                    >
                        <div className={`absolute w-full h-[7px] top-0 left-0`} style={{ background: card.color }} />
                        <p className="text-sm">
                            {card.name}
                        </p>
                        <p className="text-4xl text-right">
                            {card.value}
                        </p>
                    </Radio>
                ))}
            </RadioGroup>

            {
                cardSelected && (
                    <div>
                        <h2 className="text-xl font-bold">{cardSelected.name}</h2>
                        <ControlTable />
                    </div>
                )
            }
        </div>
    );
}

export default Control;