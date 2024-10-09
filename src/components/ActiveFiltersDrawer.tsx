import { Fragment } from "react";
import { formatDate } from "../utils/getFormatDate";
import clsx from "clsx";

const ActiveFiltersDrawer = ({ displayFilters, removeFilter, notRemove }) => {
    const getFilterValue = (item) => {
        if (item.type == "date") {
            return formatDate(item.value, "yyyy-MM-dd");
        }

        if (item.type == "select" || item.type == "dropdown") {
            return item.options.find((option) => option.id == item.value)?.name;
        }

        if (item.type == "tags" || item.type == "multipleSelect") {
            return item.value.map((x) => x.name).join(", ");
        }


        return item.value;
    };

    return (
        <Fragment>
            {Object.keys(displayFilters).length > 0 && (
                <div className="flex flex-wrap gap-2 items-center p-2 rounded-md w-full bg-gray-300 shadow-inner">
                    <p className="text-sm">Filtros activos:</p>
                    {displayFilters.length > 0 &&
                        displayFilters?.map((item) => {
                            return (
                                <div
                                    className={clsx("pl-3 py-2 pr-3 bg-easy-200 text-xs relative rounded-2xl", {
                                        "pr-6": !notRemove
                                    })}
                                    key={item.id}
                                >
                                    {`${item.name}: `}
                                    <span className="font-semibold">{getFilterValue(item)}</span>
                                    {
                                        !notRemove && (
                                            <p
                                                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-primary font-semibold"
                                                onClick={() => removeFilter(item.code)}
                                            >
                                                x
                                            </p>
                                        )
                                    }
                                </div>
                            );
                        })}
                </div>
            )}
        </Fragment>
    );
};

export default ActiveFiltersDrawer;
