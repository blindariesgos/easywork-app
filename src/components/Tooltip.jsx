import { useTooltip } from "../hooks/useCommon";
import React from "react";

const Tooltip = ({
    text,
    children,
    position
}) => {
    const { handleMouseEnter, handleMouseLeave, getTooltipStyle, showTooltip, tooltipRef} = useTooltip();
    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={tooltipRef}
        >
            {children}
            {showTooltip && (
                <div
                    className="p-2 bg-gray-200 text-black text-xs rounded-md absolute z-10 w-full"
                    style={getTooltipStyle(position)}
                >
                    {text}
                </div>
            )}
        </div>
    );
};

export default Tooltip;