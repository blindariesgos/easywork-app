import SelectInput from "../../../../../../../../components/form/SelectInput";
import { Fragment, useState } from "react";
import { Radio, RadioGroup } from "@headlessui/react";
import { ImCheckmark } from "react-icons/im";
import Button from "@/src/components/form/Button";
import ControlTable from "../controlTable";
import { useTranslation } from "react-i18next";
import { FaChevronDown } from "react-icons/fa";

const currencies = [
  { name: "Todas las monedas", value: "ALL" },
  { name: "Peso", value: "PESO" },
  { name: "Dolar", value: "DOLLAR" },
];

const cards = (t) => [
  {
    name: t("control:portafolio:control:cards:overdue"),
    id: 2,
    color: "#FFEB04",
    color: "#b60f0f",
    amount: "$0,00",
    value: "0",
  },
  {
    name: t("control:portafolio:control:cards:delay"),
    id: 4,
    color: "#A9EA44",
    color: "#b60f0f",
    amount: "$0,00",
    value: "0",
  },
  {
    name: t("control:portafolio:control:cards:urgent"),
    id: 3,
    color: "#86BEDF",
    color: "#b60f0f",
    amount: "$0,00",
    value: "0",
  },
  {
    name: t("control:portafolio:control:cards:by-overcoming"),
    id: 1,
    color: "#6b6c6d",
    color: "#86BEDF",
    amount: "$0,00",
    value: "0",
  },
  {
    name: t("control:portafolio:control:cards:on-time"),
    id: 5,
    color: "#8D9194",
    color: "#86BEDF",
    amount: "$0,00",
    value: "0",
  },
  {
    name: t("control:portafolio:control:cards:charged"),
    id: 9,
    color: "#DFE3E6",
    color: "#A9EA44",
    amount: "$0,00",
    value: "0",
  },
  {
    name: t("control:portafolio:control:cards:cancelled"),
    id: 7,
    color: "#0F8BBF",
    color: "#8D9194",
    amount: "$0,00",
    value: "0",
  },
  {
    name: t("control:portafolio:control:cards:trash"),
    id: 6,
    color: "#AF8764",
    color: "#8D9194",
    amount: "$0,00",
    value: "0",
  },
  {
    name: t("control:portafolio:control:cards:trash-more"),
    id: 8,
    color: "#b60f0f",
    color: "#8D9194",
    amount: "$0,00",
    value: "0",
  },
];

const Control = () => {
  const { t } = useTranslation();
  const [cardSelected, setCardSelected] = useState(cards(t)[0]);

  return (
    <Fragment>
      <div className="bg-white rounded-md shadow-sm">
        <div className="flex gap-6">
          <div className="flex min-h-screen w-full px-4">
            <div className="w-full ">
              <div className="py-4 grid grid-cols-1 gap-4">
                <Fragment>
                  <RadioGroup
                    by="name"
                    value={cardSelected}
                    onChange={setCardSelected}
                    className="hidden py-2 md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4"
                  >
                    {cards(t).map((card) => (
                      <Radio
                        key={card.id}
                        value={card}
                        className="group px-2 pb-2 pt-4 relative opacity-20 select-none flex flex-col w-full justify-between gap-6 data-[checked]:opacity-100 hover:opacity-100 cursor-pointer transition focus:outline-none rounded-lg overflow-hidden border-[0.5px] border-primary"
                      >
                        <div
                          className={`absolute w-full h-[7px] top-0 left-0`}
                          style={{ background: card.color }}
                        />
                        <p className="text-sm">{card.name}</p>
                        <div className="w-full">
                          <p className="text-4xl text-right">{card.value}</p>
                          <p className="text-sm text-right">{card.amount}</p>
                        </div>
                      </Radio>
                    ))}
                  </RadioGroup>
                  <div className="md:hidden flex flex-col gap-4">
                    <SelectInput
                      // label={t("control:portafolio:control:form:agent")}
                      options={cards(t)}
                      placeholder="- Seleccionar -"
                      setSelectedOption={setCardSelected}
                    />
                    <div className="group px-2 pb-2 pt-4 relative select-none grid grid-cols-1 gap-6  cursor-pointer transition focus:outline-none rounded-lg overflow-hidden border-[0.5px] border-primary">
                      <div
                        className={`absolute w-full h-[7px] top-0 left-0`}
                        style={{ background: cardSelected.color }}
                      />
                      <p className="text-sm">{cardSelected.name}</p>
                      <p className="text-4xl text-right">
                        {cardSelected.value}
                      </p>
                    </div>
                  </div>

                  {cardSelected && <ControlTable name={cardSelected.name} />}
                </Fragment>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Control;
