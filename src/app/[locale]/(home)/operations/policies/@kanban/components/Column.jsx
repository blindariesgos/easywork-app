import Card from "./Card";
import { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import clsx from "clsx";
const Column = ({ id, color, title, policies, isDragging }) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={clsx("p-1", {
        "bg-easy-100": isOver,
      })}
    >
      <p
        className={`w-full text-white font-semibold px-2 py-2 rounded-md`}
        style={{ background: color }}
      >
        {title} ({policies.length})
      </p>
      <div
        className={clsx("grid grid-cols-1 gap-2 pt-2", {
          "max-h-[60vh] overflow-y-auto": !isDragging,
        })}
      >
        {policies.map((policy, index) => (
          <Card policy={policy} index={index} key={policy.id} />
        ))}
      </div>
      {/* {provided.placeholder} */}
    </div>
  );
};

export default Column;
