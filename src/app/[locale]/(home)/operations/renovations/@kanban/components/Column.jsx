import Card from "./Card";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useDroppable } from "@dnd-kit/core";
import clsx from "clsx";
import { getAllPolicies, getAllRefunds } from "@/src/lib/apis";
import InfiniteScroll from "react-infinite-scroll-component";
import useCrmContext from "@/src/context/crm";
import useRefundContext from "@/src/context/refunds";
import useRenovationContext from "@/src/context/renovations";

const Column = ({
  id,
  color,
  name,
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
  const { filters } = useRenovationContext();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const checkbox = useRef();
  const {
    selectedContacts: selectedReceipts,
    setSelectedContacts: setSelectedReceipts,
  } = useCrmContext();

  const getPolicies = async (defaultPage) => {
    try {
      const params = {
        filters: {
          ...filters,
          renewalStageId: id,
          renewal: "true",
        },
        config: {
          page: (typeof defaultPage !== "undefined" ? defaultPage : page) + 1,
          limit: 10,
          orderBy: "deadline",
          order: "ASC",
        },
      };
      const response = await getAllPolicies(params);

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
        className={`w-ful text-white font-semibold px-2 py-1 h-[50px] rounded-md text-sm flex justify-between items-center`}
        style={{ background: color }}
      >
        <p>
          {name} ({totalItems ?? 0})
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
        next={getPolicies}
        hasMore={hasMore}
        loader={<h4>Cargando...</h4>}
        height="60vh"
      >
        <div className={clsx("grid grid-cols-1 gap-2 py-2")}>
          {items.map((renew, index) => (
            <Card
              data={renew}
              index={index}
              key={renew.id}
              stageId={id}
              updateList={() => getPolicies(0)}
            />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Column;
