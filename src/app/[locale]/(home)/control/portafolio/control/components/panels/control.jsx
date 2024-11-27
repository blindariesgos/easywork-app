import SelectInput from "../../../../../../../../components/form/SelectInput";
import { Fragment, useEffect, useState } from "react";
import { Radio, RadioGroup } from "@headlessui/react";
import { ImCheckmark } from "react-icons/im";
import Button from "@/src/components/form/Button";
import ControlTable from "../controlTable";
import { useTranslation } from "react-i18next";
import { FaChevronDown } from "react-icons/fa";
import useControlContext from "@/src/context/control";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { formatToCurrency } from "@/src/utils/formatters";
import useAppContext from "@/src/context/app";

const cards = (t) => [
  {
    name: t("control:portafolio:control:cards:overdue"),
    id: "urgente_30",
    key: "urgente_30_dias",
    color: "#FFEB04",
    color: "#b60f0f",
    amount: "$0,00",
    value: "0",
  },
  {
    name: t("control:portafolio:control:cards:delay"),
    id: "urgente_15",
    key: "urgente_15_dias",
    color: "#A9EA44",
    color: "#b60f0f",
    amount: "$0,00",
    value: "0",
  },
  {
    name: t("control:portafolio:control:cards:urgent"),
    id: "urgente_7",
    key: "urgente_7_dias",
    color: "#86BEDF",
    color: "#b60f0f",
    amount: "$0,00",
    value: "0",
  },
  {
    name: t("control:portafolio:control:cards:by-overcoming"),
    id: "atencion_media",
    color: "#6b6c6d",
    color: "#86BEDF",
    amount: "$0,00",
    value: "0",
  },
  {
    name: t("control:portafolio:control:cards:on-time"),
    id: "a_tiempo",
    color: "#8D9194",
    color: "#86BEDF",
    amount: "$0,00",
    value: "0",
  },
  {
    name: t("control:portafolio:control:cards:charged"),
    id: "cobrados",
    color: "#DFE3E6",
    color: "#A9EA44",
    amount: "$0,00",
    value: "0",
  },
  // {
  //   name: t("control:portafolio:control:cards:cancelled"),
  //   id: 7,
  //   color: "#0F8BBF",
  //   color: "#8D9194",
  //   amount: "$0,00",
  //   value: "0",
  // },
  {
    name: t("control:portafolio:control:cards:trash"),
    id: "basura_45",
    key: "basura_45_dias",
    color: "#AF8764",
    color: "#8D9194",
    amount: "$0,00",
    value: "0",
  },
  {
    name: t("control:portafolio:control:cards:trash-more"),
    id: "basura_60",
    key: "basura_60_dias",
    color: "#b60f0f",
    color: "#8D9194",
    amount: "$0,00",
    value: "0",
  },
];

const Control = () => {
  const { setGroupKey, isLoading, totalsByStage, filters } =
    useControlContext();
  const { t } = useTranslation();
  const [cardSelected, setCardSelected] = useState(cards(t)[0]);
  const { lists } = useAppContext();
  useEffect(() => {
    setGroupKey(cardSelected.id);
  }, [cardSelected]);

  return (
    <Fragment>
      {(!cardSelected || isLoading) && <LoaderSpinner />}
      <div className="bg-white rounded-md shadow-sm">
        <div className="flex gap-6">
          <div className="flex min-h-screen w-full px-4">
            <div className="w-full ">
              <div className="py-4 grid grid-cols-1 gap-4">
                {cardSelected && (
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
                            <p className="text-4xl text-right">
                              {totalsByStage[card.key ?? card.id]?.count ?? 0}
                            </p>
                            <p className="text-sm text-right">
                              {`${lists?.policies?.currencies?.find((c) => c.id == filters?.currencyId)?.symbol ?? "$"} ${formatToCurrency(
                                totalsByStage[card.key ?? card.id]?.amount ?? 0
                              )}`}
                            </p>
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Control;
