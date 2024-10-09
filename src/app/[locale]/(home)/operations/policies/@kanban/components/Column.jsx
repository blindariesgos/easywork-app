import { Droppable, Draggable } from "react-beautiful-dnd";
import Card from "./Card";
import { useMemo } from "react";

const Column = ({ id, color, title, policies }) => {
  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          <p
            className={`w-full text-white font-semibold px-2 py-2 rounded-md`}
            style={{ background: color }}
          >
            {title} ({policies.length})
          </p>
          <div className="grid grid-cols-1 gap-2 pt-2 max-h-[60vh] overflow-y-auto">
            {policies.map((policy, index) => (
              <Card policy={policy} index={index} key={policy.id} />
            ))}
          </div>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default Column;
