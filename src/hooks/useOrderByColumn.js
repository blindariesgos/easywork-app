import { useState, useEffect } from 'react';
import orderBy from 'lodash/orderBy';

export const useOrderByColumn = (sortFieldByColumn, data) => {
  const [fieldClicked, setFieldClicked] = useState({ field: "", sortDirection: "" });
  const [orderItems, setOrderItems] = useState(data);

  const handleSorting = (fieldToSort) => {
    if (fieldClicked.sortDirection === "asc") {
      setFieldClicked({ field: fieldToSort, sortDirection: "desc" });
    } else {
      setFieldClicked({ field: fieldToSort, sortDirection: "asc" });
    }
  };

  const sortItems = () => {
    if (fieldClicked.field === "") {
      setOrderItems(data);
    } else {
      const field = sortFieldByColumn[fieldClicked.field] ?? [fieldClicked.field];
      const order = field.map(() => fieldClicked.sortDirection);
      const newItems = orderBy(data, field, order);
      setOrderItems(newItems);
    }
  };

  useEffect(() => {
    sortItems();
  }, [fieldClicked, data]);

  return {
    handleSorting,
    fieldClicked,
    orderItems
  };
};
