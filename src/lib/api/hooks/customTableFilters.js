import { useTranslation } from "react-i18next";

const useCustomTableFilters = () => {
  const { t } = useTranslation();
  return {
    tasks: [
      {
        id: "1",
        name: t("tools:tasks:filters:custom:completed"),
        filter: {
          status: [
            {
              id: "completed",
              name: "Terminado",
              value: "completed",
              selected: false,
            },
          ],
        },
      },
      //   {
      //     name: t("tools:tasks:filters:custom:completed"),
      //     filters: {
      //       status: "pending",
      //     },
      //   },
      {
        id: "2",
        name: t("tools:tasks:filters:custom:expirated"),
        filter: {
          status: [
            {
              id: "overdue",
              name: "Vencidas",
              value: "overdue",
              selected: false,
            },
          ],
        },
      },
    ],
  };
};

export default useCustomTableFilters;
