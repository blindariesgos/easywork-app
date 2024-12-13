"use client";
import React, { Suspense, useState, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Radio, RadioGroup } from "@headlessui/react";
import Button from "@/src/components/form/Button";

const Cards = () => {
  const { t } = useTranslation();
  const cards = [
    {
      name: `${t("operations:policies:title")}`,
      id: 2,
      color: "#e4e7ea",
      amount: "$0,00",
      value: "0",
    },
    {
      name: t("operations:programations:title"),
      id: 7,
      color: "#FFEB04",
      amount: "$0,00",
      value: "0",
    },
    {
      name: `${t("operations:refunds:title")}`,
      id: 1,
      color: "#86BEDF",
      amount: "$0,00",
      value: "0",
    },
    {
      name: t("operations:renovations:title"),
      id: 4,
      color: "#ACEA4B",
      amount: "$0,00",
      value: "0",
    },
    {
      name: t("operations:fundrecovery:title"),
      id: 6,
      color: "#8D9194",
      amount: "$0,00",
      value: "0",
    },
    {
      name: `${t("operations:claims:title")}`,
      id: 3,
      color: "#58AED2",
      amount: "$0,00",
      value: "0",
    },
  ];
  const [cardSelected, setCardSelected] = useState(cards[0]);

  return (
    <RadioGroup
      by="name"
      value={cardSelected}
      onChange={setCardSelected}
      className="py-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4"
    >
      {cards.map((card) => (
        <Radio
          key={card.id}
          value={card}
          className="group px-2 pb-2 pt-4 relative opacity-20 select-none flex flex-col w-full justify-between gap-6 data-[checked]:opacity-100 hover:opacity-100 cursor-pointer transition focus:outline-none rounded-lg overflow-hidden border-[0.5px] border-primary"
        >
          <div
            className={`absolute w-full h-[7px] top-0 left-0`}
            style={{ background: card.color }}
          />
          <div className="w-full">
            <p className="text-sm pb-2">{card.name}</p>
            <p className="text-sm text-gray-50 text-right">USD 0,00 | 0</p>
            <p className="text-sm text-gray-50 text-right">$ 0,00 | 0</p>
            <p className="text-sm text-gray-50 text-right">UDIS 0,00 | 0</p>
            <div className="pt-2 flex justify-between items-center">
              <Button
                buttonStyle="primary"
                label="Ver Todos"
                className="px-3 py-2"
              />
              <p className="text-4xl text-right">{card.value}</p>
            </div>
          </div>
        </Radio>
      ))}
    </RadioGroup>
  );
};

export default Cards;
