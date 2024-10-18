import Card from "./Card";
import { Fragment, useEffect, useMemo } from "react";
import { useDroppable, DragOverlay } from "@dnd-kit/core";
import clsx from "clsx";
const Column = ({ id, color, title, policies, activeId }) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });
  useEffect(() => {
    console.log({ activeId });
    if (activeId) {
      const policy = policies.find((x) => x.id == activeId);
      console.log({ policy, policies });
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
        {title} ({policies.length})
      </p>
      <p className="pt-1 text-sm text-center">{`$ ${policies.reduce((acc, policy) => acc + policy.importePagar, 0).toFixed(2)}`}</p>
      <div
        className={clsx(
          "grid grid-cols-1 gap-2 pt-2 max-h-[60vh] overflow-y-auto"
        )}
      >
        {policies.map((policy, index) => (
          <Card policy={policy} index={index} key={policy.id} />
        ))}
      </div>
      {/* <DragOverlay>
        {activeId && policies.find((x) => x.id == activeId)?.id ? (
          <Card policy={policies.find((x) => x.id == activeId)} />
        ) : null}
      </DragOverlay> */}
    </div>
  );
};

export default Column;
