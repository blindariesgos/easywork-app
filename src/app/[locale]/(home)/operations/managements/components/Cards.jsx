"use client";
import React, { Suspense, useState, Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Radio, RadioGroup } from "@headlessui/react";
import Button from "@/src/components/form/Button";
import { getAddListLeads, getManagementReport } from "@/src/lib/apis";
import { formatToCurrency } from "@/src/utils/formatters";
import { useRouter } from "next/navigation";
import useManagementContext from "@/src/context/managements";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { handleFrontError } from "@/src/utils/api/errors";

const Cards = () => {
  const { t } = useTranslation();
  const [cards, setCards] = useState([]);
  const [cardSelected, setCardSelected] = useState();
  const { filters } = useManagementContext();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const getManagementInfo = async () => {
    setIsLoading(true);
    const response = await getManagementReport({ filters });

    if (response.hasError) {
      handleFrontError(response);
      setIsLoading(false);
      return;
    }

    setCards([
      {
        name: `${t("operations:policies:title")}`,
        id: 2,
        color: "#e4e7ea",
        amounts: response.polizas,
        value: Object.keys(response.polizas).reduce(
          (acc, key) => acc + (response.polizas[key].cantidad_total ?? 0),
          0
        ),
        url: "/operations/policies",
      },
      {
        name: t("operations:programations:title"),
        id: 7,
        color: "#FFEB04",
        value: response.programaciones,
        url: "/operations/programations",
      },
      {
        name: `${t("operations:refunds:title")}`,
        id: 1,
        color: "#86BEDF",
        value: response.reembolsos,
        url: "/operations/refunds",
      },
      {
        name: t("operations:renovations:title"),
        id: 4,
        color: "#ACEA4B",
        amounts: response.renovaciones,
        value: Object.keys(response.renovaciones).reduce(
          (acc, key) => acc + (response.renovaciones[key].cantidad_total ?? 0),
          0
        ),
        url: "/operations/renovations",
      },
      {
        name: t("operations:fundrecovery:title"),
        id: 6,
        color: "#8D9194",
        amount: "$0,00",
        value: "0",
        url: "/operations/fundrecoveries",
      },
      {
        name: `${t("operations:claims:title")}`,
        id: 3,
        color: "#58AED2",
        amount: "$0,00",
        value: "0",
        url: "/operations/claims",
      },
    ]);
    setIsLoading(false);
  };

  useEffect(() => {
    getManagementInfo();
  }, [filters]);

  return (
    // <RadioGroup
    // by="name"
    // value={cardSelected}
    // onChange={setCardSelected}
    <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-2">
      {isLoading && <LoaderSpinner />}
      {cards.map((card) => (
        <div
          // <Radio
          key={card.id}
          // value={card}
          className="group px-2 pb-2 pt-4 relative select-none flex flex-col w-full justify-between gap-6 transition focus:outline-none rounded-lg overflow-hidden border-[0.5px] border-primary"
        >
          <div
            className={`absolute w-full h-[7px] top-0 left-0`}
            style={{ background: card.color }}
          />
          <div className="w-full">
            <p className="text-sm pb-2">{card.name}</p>
            <div className="min-h-[60px]">
              {card.amounts && (
                <Fragment>
                  <p className="text-sm text-gray-50 text-right">
                    {`USD ${formatToCurrency(card.amounts.currency_dolar.monto_total)} | ${card.amounts.currency_dolar.cantidad_total}`}
                  </p>
                  <p className="text-sm text-gray-50 text-right">
                    {`$ ${formatToCurrency(card.amounts.currency_pesos.monto_total)} | ${
                      card.amounts.currency_pesos.cantidad_total
                    }`}
                  </p>
                  <p className="text-sm text-gray-50 text-right">
                    {`UDIS ${formatToCurrency(card.amounts.currency_udis.monto_total)} | ${card.amounts.currency_udis.cantidad_total}`}
                  </p>
                </Fragment>
              )}
            </div>

            <div className="pt-2 flex justify-between items-center">
              <Button
                buttonStyle="primary"
                label="Ver Todos"
                className="px-3 py-2"
                onclick={() => router.push(card.url)}
              />
              <p className="text-4xl text-right">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
      {/* </RadioGroup> */}
    </div>
  );
};

export default Cards;
