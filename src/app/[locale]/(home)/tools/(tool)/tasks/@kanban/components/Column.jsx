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
import {
  getAllTasks,
  getContactId,
  getReceiptKanbanByStateId,
} from "@/src/lib/apis";
import InfiniteScroll from "react-infinite-scroll-component";
import { formatToCurrency } from "@/src/utils/formatters";
import useTasksContext from "@/src/context/tasks";
import useCrmContext from "@/src/context/crm";
const Column = ({
  id,
  color,
  title,
  activeId,
  setItemDrag,
  updateStages,
  filter,
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState();
  const { filters } = useTasksContext();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const checkbox = useRef();
  const {
    selectedContacts: selectedReceipts,
    setSelectedContacts: setSelectedReceipts,
  } = useCrmContext();

  const getTasks = async (defaultPage) => {
    try {
      const params = {
        filters: {
          ...filters,
          ...filter,
        },
        config: {
          page: (typeof defaultPage !== "undefined" ? defaultPage : page) + 1,
          limit: 10,
          orderBy: "deadline",
          order: "ASC",
        },
      };
      const response = await getAllTasks(params);
      // console.log(title, response, params);
      const auxItems =
        page == 0 || defaultPage == 0
          ? (response?.items ?? [])
          : [...items, ...response?.items];
      setItems(auxItems);
      if (page == 0 || defaultPage == 0) {
        setTotalItems(response?.meta?.totalItems ?? 0);
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
    getTasks();
  }, []);

  useEffect(() => {
    if (updateStages.includes(id)) {
      getTasks(0);
    }
  }, [updateStages]);

  useEffect(() => {
    getTasks(0);
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
      <InfiniteScroll
        dataLength={items.length}
        next={getTasks}
        hasMore={hasMore}
        loader={<h4>Cargando...</h4>}
        height="60vh"
        // endMessage={
        //   <p style={{ textAlign: "center" }}>
        //     <b>Yay! You have seen it all</b>
        //   </p>
        // }
      >
        <div className={clsx("grid grid-cols-1 gap-2 py-2")}>
          {items.map((task, index) => (
            <Card task={task} index={index} key={task.id} stageId={id} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Column;
