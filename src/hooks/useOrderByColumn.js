import { useEffect, useState } from "react";
import { orderBy, } from "lodash";

export const useOrderByColumn = (sortFieltByColumn, data) => {    
  const [ fieldClicked, setFieldClicked ] = useState({ field: "name", sortDirection: "asc" });
  const [orderItems, setOrderItems] = useState([]);
  
  const handleSorting = (fieldToSort) => {
    if (fieldClicked.sortDirection === "asc") {
        setFieldClicked({ field: fieldToSort, sortDirection: "desc" });
    }
    if (fieldClicked.sortDirection === "desc") {
        setFieldClicked({ field: fieldToSort, sortDirection: "asc" });
    }
  };
    const sortHardwares = () => {
      const field = sortFieltByColumn[fieldClicked.field] ?? [ fieldClicked.field ];
      const order = field.map(() => {
          return fieldClicked.sortDirection;
      });
      const newItems = orderBy(data, field, order);
      setOrderItems(newItems);
  };

  useEffect(() => {
      sortHardwares();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ fieldClicked ]);

  return {
    handleSorting,
    fieldClicked,
    orderItems
  }

}