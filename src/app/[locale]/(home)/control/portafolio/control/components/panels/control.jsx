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
    name: t("tools:portafolio:control:cards:by-overcoming"),
    id: 1,
    color: "#DFE3E6",
    value: "23412",
  },
  {
    name: t("tools:portafolio:control:cards:overdue"),
    id: 2,
    color: "#FFEB04",
    value: "324",
  },
  {
    name: t("tools:portafolio:control:cards:urgent"),
    id: 3,
    color: "#86BEDF",
    value: "23",
  },
  {
    name: t("tools:portafolio:control:cards:delay"),
    id: 4,
    color: "#A9EA44",
    value: "212",
  },
  {
    name: t("tools:portafolio:control:cards:on-time"),
    id: 5,
    color: "#8D9194",
    value: "43",
  },
  {
    name: t("tools:portafolio:control:cards:trash"),
    id: 6,
    color: "#AF8764",
    value: "2",
  },
  {
    name: t("tools:portafolio:control:cards:cancelled"),
    id: 7,
    color: "#0F8BBF",
    value: "24",
  },
];

const Control = () => {
  const { t } = useTranslation();
  const [type, setType] = useState();
  const [currencySelected, setCurrendySelected] = useState(currencies[0]);
  const [cardSelected, setCardSelected] = useState(cards(t)[0]);
  const [isSearch, setIsSearch] = useState(false);

  return (
    <Fragment>
      <div className="bg-white rounded-md shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 gap-6 py-4 px-4 ">
          <SelectInput
            label={t("tools:portafolio:control:form:agent")}
            options={[
              {
                name: "Soporte It",
                id: "physical",
              },
              {
                name: "Soporte DE",
                id: "moral",
              },
            ]}
            placeholder="- Seleccionar -"
            setSelectedOption={(e) => setType(e.id)}
          />
          <RadioGroup
            by="name"
            value={currencySelected}
            onChange={setCurrendySelected}
            aria-label="Server size"
            className="py-2 grid grid-cols-1 gap-2"
          >
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
          <div className="flex items-center justify-center md:justify-start col-span-1 sm:col-span-2 md:col-span-1">
            <Button
              label="Buscar"
              className="py-2 px-4"
              buttonStyle="primary"
              onclick={() => setIsSearch(true)}
            />
          </div>
        </div>
      </div>
      {isSearch && type && (
        <div className="bg-white rounded-md shadow-sm">
          <div className="flex gap-6 py-4 px-4">
            <div className="flex min-h-screen w-full px-4">
              <div className="w-full ">
                <div className="py-4 grid grid-cols-1 gap-4">
                  <Fragment>
                    <RadioGroup
                      by="name"
                      value={cardSelected}
                      onChange={setCardSelected}
                      className="hidden py-2 md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-4"
                    >
                      {cards(t).map((card) => (
                        <Radio
                          key={card.type}
                          value={card}
                          className="group px-2 pb-2 pt-4 relative opacity-20 select-none grid grid-cols-1 gap-6 data-[checked]:opacity-100 cursor-pointer transition focus:outline-none rounded-lg overflow-hidden border-[0.5px] border-primary"
                        >
                          <div
                            className={`absolute w-full h-[7px] top-0 left-0`}
                            style={{ background: card.color }}
                          />
                          <p className="text-sm">{card.name}</p>
                          <p className="text-4xl text-right">{card.value}</p>
                        </Radio>
                      ))}
                    </RadioGroup>
                    <div className="md:hidden flex flex-col gap-4">
                      <SelectInput
                        // label={t("tools:portafolio:control:form:agent")}
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
      )}
    </Fragment>
  );
};

export default Control;
