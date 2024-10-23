import Card from "./Card";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useDroppable, DragOverlay } from "@dnd-kit/core";
import clsx from "clsx";
import { getContactId, getReceiptKanbanByStateId } from "@/src/lib/apis";
import InfiniteScroll from "react-infinite-scroll-component";
const Column = ({ id, color, title }) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const getReceipts = async () => {
    const response = await getReceiptKanbanByStateId({
      limit: 10,
      page: page + 1,
      stageId: id,
    });
    console.log(title, response);
    const auxItems = [...items, ...response.receipts];

    setItems(auxItems);
    if (auxItems.length >= response.totalReceipts) {
      setHasMore(false);
    }

    setPage(page + 1);
  };

  useEffect(() => {
    getReceipts();
  }, []);

  return (
    <div
      ref={setNodeRef}
      className={clsx("w-[250px]", {
        "bg-easy-100": isOver,
      })}
    >
      <p
        className={`w-full text-white font-semibold px-2 py-3 rounded-md text-sm`}
        style={{ background: color.primary }}
      >
        {title}
        {/* ({policies.length}) */}
      </p>
      <InfiniteScroll
        dataLength={items.length}
        next={getReceipts}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        height="60vh"
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        {items.map((i, index) => (
          <div style={style} key={index}>
            div - #{index}
          </div>
        ))}
      </InfiniteScroll>
      {/* <p className="pt-1 text-sm text-center">{`$ ${policies.reduce((acc, policy) => acc + policy.importePagar, 0).toFixed(2)}`}</p>
      <div
        className={clsx(
          "grid grid-cols-1 gap-2 pt-2 max-h-[60vh] overflow-y-auto"
        )}
      >
        {policies.map((policy, index) => (
          <Card policy={policy} index={index} key={policy.id} />
        ))}
      </div>

      <DragOverlay>
        {activeId && policies.find((x) => x.id == activeId)?.id ? (
          <Card policy={policies.find((x) => x.id == activeId)} />
        ) : null}
      </DragOverlay> */}
    </div>
  );
};

export default Column;
