import Card from "./Card";
import { useDroppable } from "@dnd-kit/core";
import clsx from "clsx";
import { useEffect, useState } from "react";
import useLeadsContext from "@/src/context/leads";
import InfiniteScroll from "react-infinite-scroll-component";
import { formatToCurrency } from "@/src/utils/formatters";
import { getKanbanLeads } from "@/src/lib/apis";

const Column = ({
  id,
  color,
  activeId,
  filter,
  setItemDrag,
  updateStages,
  name,
  type,
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
    data: {
      type,
    },
  });
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState();
  const [totalAmount, setTotalAmount] = useState(0);
  const { filters } = useLeadsContext();

  const getLeads = async (defaultPage) => {
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
      const response = await getKanbanLeads(params);
      console.log(name, response, params);
      if (response.hasError) {
        setItems([]);
        setHasMore(false);
        return;
      }
      const auxItems =
        page == 0 || defaultPage == 0
          ? response.items
          : [...items, ...response.items];
      setItems(auxItems);
      if (page == 0 || defaultPage == 0) {
        setTotalItems(response?.meta?.totalItems);
        setTotalAmount(response?.meta?.amount ?? 0);
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
    getLeads();
  }, []);

  useEffect(() => {
    if (updateStages.includes(id)) {
      getLeads(0);
    }
  }, [updateStages]);

  useEffect(() => {
    getLeads(0);
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
      className={clsx("p-1 w-[250px]", {
        "bg-easy-100": isOver,
      })}
    >
      <p
        className={`w-full text-white font-semibold px-2 py-2 rounded-md text-sm bg-primary h-[56px] flex items-center`}
        style={{ background: color }}
      >
        {name} ({totalItems ?? 0})
      </p>
      <p className="text-center py-2">$ {formatToCurrency(totalAmount)}</p>

      <InfiniteScroll
        dataLength={items.length}
        next={getLeads}
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
          {items.map((lead, index) => (
            <Card lead={lead} index={index} key={lead.id} stageId={id} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Column;
