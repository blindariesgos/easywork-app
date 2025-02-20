import Card from "./Card";
import { useDroppable } from "@dnd-kit/core";
import clsx from "clsx";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { getAllConnections, getAllRecruitments } from "@/src/lib/apis";
import useRecruitmentsContext from "@/src/context/recruitments";
import useConnectionsContext from "@/src/context/connections";

const Column = ({
  id,
  color,
  activeId,
  filter,
  setItemDrag,
  updateStages,
  name,
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState();
  const { filters } = useConnectionsContext();

  const getConnections = async (defaultPage) => {
    try {
      const params = {
        filters: {
          ...filters,
          agentConnectionStageId: id,
        },
        config: {
          page: (typeof defaultPage !== "undefined" ? defaultPage : page) + 1,
          limit: 10,
        },
      };
      const response = await getAllConnections(params);
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
    getConnections();
  }, []);

  useEffect(() => {
    if (updateStages.includes(id)) {
      getConnections(0);
    }
  }, [updateStages]);

  useEffect(() => {
    getConnections(0);
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

      <InfiniteScroll
        dataLength={items.length}
        next={getConnections}
        hasMore={hasMore}
        loader={<h4>Cargando...</h4>}
        height="60vh"
      >
        <div className={clsx("grid grid-cols-1 gap-2 pt-2")}>
          {items.map((item, index) => (
            <Card data={item} index={index} key={item.id} stageId={id} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Column;
