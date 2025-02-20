import Card from "./Card";
import { useDroppable, DragOverlay } from "@dnd-kit/core";
import clsx from "clsx";
import { useEffect, useState } from "react";
import usePoliciesContext from "@/src/context/policies";
import InfiniteScroll from "react-infinite-scroll-component";
import { formatToCurrency } from "@/src/utils/formatters";
import {
  getAllPolicies,
  getContactId,
  getReceiptKanbanByStateId,
} from "@/src/lib/apis";
const Column = ({
  id,
  color,
  title,
  activeId,
  filter,
  setItemDrag,
  updateStages,
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState();
  const [totalAmount, setTotalAmount] = useState(0);
  const { filters } = usePoliciesContext();

  const getPolicies = async (defaultPage) => {
    try {
      const params = {
        filters: {
          ...filters,
          ...filter,
        },
        config: {
          page: (typeof defaultPage !== "undefined" ? defaultPage : page) + 1,
          limit: 10,
        },
      };
      const response = await getAllPolicies(params);

      const auxItems =
        page == 0 || defaultPage == 0
          ? response.items
          : [...items, ...response.items];
      setItems(auxItems);
      if (page == 0 || defaultPage == 0) {
        setTotalItems(response?.meta?.totalItems);
        // setTotalAmount(response[0].totalAmount);
      }
      if (auxItems?.length >= response?.meta?.totalItems) {
        setHasMore(false);
      }

      setPage((typeof defaultPage !== "undefined" ? defaultPage : page) + 1);
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    getPolicies();
  }, []);

  useEffect(() => {
    if (updateStages.includes(id)) {
      getPolicies(0);
    }
  }, [updateStages]);

  useEffect(() => {
    getPolicies(0);
  }, [filters]);

  useEffect(() => {
    if (activeId) {
      const item = items.find((x) => x.id == activeId);
      item && setItemDrag(item);
    }
  }, [activeId]);

  return (
    <div
      ref={setNodeRef}
      className={clsx("p-1", {
        "bg-easy-100": isOver,
      })}
    >
      <p
        className={`w-full text-white font-semibold px-2 py-3 rounded-md text-sm`}
        style={{ background: color }}
      >
        {title} ({totalItems ?? 0})
      </p>

      <InfiniteScroll
        dataLength={items.length}
        next={getPolicies}
        hasMore={hasMore}
        loader={<h4>Cargando...</h4>}
        height="60vh"
        // endMessage={
        //   <p style={{ textAlign: "center" }}>
        //     <b>Yay! You have seen it all</b>
        //   </p>
        // }
      >
        <div className={clsx("grid grid-cols-1 gap-2 pt-2")}>
          {items.map((policy, index) => (
            <Card policy={policy} index={index} key={policy.id} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Column;
