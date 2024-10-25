import Card from "./Card";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useDroppable, DragOverlay } from "@dnd-kit/core";
import clsx from "clsx";
import { getContactId, getReceiptKanbanByStateId } from "@/src/lib/apis";
import InfiniteScroll from "react-infinite-scroll-component";
const Column = ({ id, color, title, activeId, setItemDrag }) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState();

  const getReceipts = async () => {
    const response = await getReceiptKanbanByStateId({
      "pagination[0][stageId]": id,
      "pagination[0][limit]": 10,
      "pagination[0][page]": page + 1,
      stageIds: id,
    });
    console.log(title, response);
    const auxItems = [...items, ...response[0].receipts];

    setItems(auxItems);
    if (!totalItems) {
      setTotalItems(response[0].totalReceipts);
    }
    if (auxItems.length >= response[0].totalReceipts) {
      setHasMore(false);
    }

    setPage(page + 1);
  };

  useEffect(() => {
    getReceipts();
  }, []);

  useEffect(() => {
    if (activeId) {
      const item = items.find((x) => x.id == activeId);
      item && setItemDrag(item);
    }
  }, [activeId]);

  return (
    <div
      ref={setNodeRef}
      className={clsx("w-[250px] p-1 rounded-md", {
        "bg-easy-100": isOver,
      })}
      style={{
        background: color.secondary,
      }}
    >
      <p
        className={`w-full text-white font-semibold px-2 py-3 rounded-md text-sm`}
        style={{ background: color.primary }}
      >
        {title} ({totalItems ?? 0})
      </p>
      <InfiniteScroll
        dataLength={items.length}
        next={getReceipts}
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
          {items.map((receipt, index) => (
            <Card receipt={receipt} index={index} key={receipt.id} />
          ))}
        </div>
      </InfiniteScroll>
      {/* <p className="pt-1 text-sm text-center">{`$ ${policies.reduce((acc, policy) => acc + policy.importePagar, 0).toFixed(2)}`}</p>
      <div
        className={clsx(
          "grid grid-cols-1 gap-2 pt-2 max-h-[60vh] overflow-y-auto"
        )}
      >
        {items.map((policy, index) => (
          <Card policy={policy} index={index} key={policy.id} />
        ))}
      </div> */}
    </div>
  );
};

export default Column;
