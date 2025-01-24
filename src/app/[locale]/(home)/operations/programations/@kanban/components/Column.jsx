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
  getAllSchedules,
  getAllTasks,
  getContactId,
  getReceiptKanbanByStateId,
} from "@/src/lib/apis";
import InfiniteScroll from "react-infinite-scroll-component";
import { formatToCurrency } from "@/src/utils/formatters";
import useTasksContext from "@/src/context/tasks";
import useCrmContext from "@/src/context/crm";
import useProgramationContext from "@/src/context/programations";
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
  const { filters } = useProgramationContext();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const checkbox = useRef();
  const {
    selectedContacts: selectedReceipts,
    setSelectedContacts: setSelectedReceipts,
  } = useCrmContext();

  const getSchedules = async (defaultPage) => {
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
      const response = await getAllSchedules(params);
      console.log(title, response, params);
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
    getSchedules();
  }, []);

  useEffect(() => {
    if (updateStages.includes(id)) {
      getSchedules(0);
    }
  }, [updateStages]);

  useEffect(() => {
    getSchedules(0);
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
        background: isOver ? "#DCDAF1" : "",
      }}
    >
      <div
        className={`w-ful font-semibold px-2 py-1 h-[50px] rounded-md text-sm flex justify-between items-center`}
        style={{ background: color }}
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
        next={getSchedules}
        hasMore={hasMore}
        loader={<h4>Cargando...</h4>}
        height="60vh"
      >
        <div className={clsx("grid grid-cols-1 gap-2 py-2")}>
          {items.map((schedule, index) => (
            <Card
              data={schedule}
              index={index}
              key={schedule.id}
              stageId={id}
              updateList={() => getSchedules(0)}
            />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Column;
