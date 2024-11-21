import Card from "./Card";
import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDroppable, DragOverlay } from "@dnd-kit/core";
import clsx from "clsx";
import { getContactId, getReceiptKanbanByStateId } from "@/src/lib/apis";
import InfiniteScroll from "react-infinite-scroll-component";
import { formatToCurrency } from "@/src/utils/formatters";
import useReceiptContext from "@/src/context/receipts";
import { UsersContext } from "@/src/context";
import useCrmContext from "@/src/context/crm";
const Column = ({
  id,
  color,
  title,
  activeId,
  setItemDrag,
  status,
  updateStages,
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
    data: {
      status,
    },
  });
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState();
  const [totalAmount, setTotalAmount] = useState(0);
  const { filters } = useReceiptContext();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const checkbox = useRef();
  const {
    selectedContacts: selectedReceipts,
    setSelectedContacts: setSelectedReceipts,
  } = useCrmContext();

  const getReceipts = async (defaultPage) => {
    try {
      const params = {
        "pagination[0][stageId]": id,
        "pagination[0][limit]": 10,
        "pagination[0][page]":
          (typeof defaultPage !== "undefined" ? defaultPage : page) + 1,
        stageIds: id,
        ...filters,
      };
      const response = await getReceiptKanbanByStateId(params);
      console.log(title, response, params);
      const auxItems =
        page == 0 || defaultPage == 0
          ? response[0].receipts
          : [...items, ...response[0].receipts];
      setItems(auxItems);
      if (page == 0 || defaultPage == 0) {
        setTotalItems(response[0].totalReceipts);
        setTotalAmount(response[0].totalAmount);
      }
      if (auxItems.length >= response[0].totalReceipts) {
        setHasMore(false);
      }

      setPage((typeof defaultPage !== "undefined" ? defaultPage : page) + 1);
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    getReceipts();
  }, []);

  useEffect(() => {
    if (updateStages.includes(id)) {
      getReceipts(0);
    }
  }, [updateStages]);

  useEffect(() => {
    getReceipts(0);
  }, [filters]);

  useEffect(() => {
    if (activeId) {
      const item = items.find((x) => x.id == activeId);
      item && setItemDrag(item);
    }
  }, [activeId]);

  const toggleAll = useCallback(() => {
    setSelectedReceipts(
      checked || indeterminate
        ? []
        : [...selectedReceipts, ...items.map(({ id }) => id)]
    );
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }, [checked, indeterminate, items, setSelectedReceipts]);

  useLayoutEffect(() => {
    if (checkbox.current) {
      const isIndeterminate =
        selectedReceipts &&
        selectedReceipts.length > 0 &&
        !items.every((item) => selectedReceipts.includes(item.id));
      setChecked(items.every((item) => selectedReceipts.includes(item.id)));
      setIndeterminate(isIndeterminate);
      checkbox.current.indeterminate = isIndeterminate;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedReceipts, checkbox]);
  return (
    <div
      ref={setNodeRef}
      className={clsx("w-[250px] p-1 rounded-md")}
      style={{
        background: isOver ? "#DCDAF1" : color.secondary,
      }}
    >
      <div
        className={`w-full text-white font-semibold px-2 py-3 rounded-md text-sm flex justify-between items-center`}
        style={{ background: color.primary }}
      >
        <p>
          {title} ({totalItems ?? 0})
        </p>
        {items.some((item) => selectedReceipts.includes(item.id)) && (
          <input
            type="checkbox"
            className=" h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            ref={checkbox}
            checked={checked}
            onClick={toggleAll}
          />
        )}
      </div>
      <p className="text-center py-2">{`$ ${formatToCurrency(totalAmount)}`}</p>
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
        <div className={clsx("grid grid-cols-1 gap-2 pb-2")}>
          {items.map((receipt, index) => (
            <Card
              receipt={receipt}
              index={index}
              key={receipt.id}
              stageId={id}
            />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Column;
