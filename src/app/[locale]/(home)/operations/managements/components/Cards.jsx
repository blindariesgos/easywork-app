"use client";
import React, { Suspense, useState, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Radio, RadioGroup } from "@headlessui/react";

const Cards = () => {
  const { t } = useTranslation();
  const cards = [
    {
      name: t("operations:policies:title"),
      id: 2,
      color: "#FFEB04",
      amount: "$0,00",
      value: "0",
    },
    {
      name: t("operations:renovations:title"),
      id: 4,
      color: "#A9EA44",
      amount: "$0,00",
      value: "0",
    },
    {
      name: t("operations:claims:title"),
      id: 3,
      color: "#86BEDF",
      amount: "$0,00",
      value: "0",
    },
    {
      name: t("operations:refunds:title"),
      id: 1,
      color: "#6b6c6d",
      amount: "$0,00",
      value: "0",
    },
    {
      name: t("operations:programations:title"),
      id: 7,
      color: "#0F8BBF",
      amount: "$0,00",
      value: "0",
    },
    {
      name: t("operations:fundrecovery:title"),
      id: 6,
      color: "#AF8764",
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
          <p className="text-sm">{card.name}</p>
          <div className="w-full">
            <p className="text-4xl text-right">{card.value}</p>
            {/* <p className="text-sm text-right">{card.amount}</p> */}
          </div>
        </Radio>
      ))}
    </RadioGroup>
  );
};

export default Cards;
