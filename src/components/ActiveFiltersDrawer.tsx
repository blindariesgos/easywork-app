import { Fragment } from "react";
import clsx from "clsx";
import moment from "moment";

const ActiveFiltersDrawer = ({ displayFilters, removeFilter, notRemove }) => {
  const getFilterValue = (item) => {
    if (["date", "date-short"].includes(item.type)) {
      return moment(item.value).utc().format("DD/MM/yyyy");
    }

    if (item.type == "select" || item.type == "dropdown") {
      return item.options.find((option) => option.id == item.value)?.name;
    }

    if (item.type == "tags" || item.type == "multipleSelect") {
      return item.value.map((x) => x.name).join(", ");
    }

    if (item.type == "select-contact" || item.type == "select-lead") {
      return item.value.fullName;
    }

    if (item.type == "select-agent") {
      return item.value.name;
    }

    if (item.type == "select-policy") {
      return `${item?.value?.company?.name ?? ""} ${item?.value?.poliza ?? ""} ${item?.value?.type?.name ?? ""}`;
    }

    if (item.type == "daterange") {
      if (["lastNDays", "nextNDays"].includes(item.value.id)) {
        return item.value.name.replace("N", item.range)
      }
      if (item.value.id == "month") {
        return `${item.value.name} ${moment(item.range).utc().format("MM/YYYY")}`
      }
      if (item.value.id == "quarter") {
        return `${item.value.name} ${moment(item.range).utc().format("[Q]Q YYYY")}`
      }
      if (item.value.id == "year") {
        return `${item.value.name} ${moment(item.range).utc().format("YYYY")}`
      }
      if (item.value.id == "exactDate") {
        return moment(item.range).utc().format("DD/MM/YYYY")
      }
      if (item.value.id == "dateRange") {
        return `${moment(item.range[0]).utc().format("DD/MM/YYYY")} - ${moment(item.range[1]).utc().format("DD/MM/YYYY")}`
      }
      return item.value.name
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
                  className={clsx(
                    "pl-3 py-2 pr-3 bg-easy-200 text-xs relative rounded-2xl",
                    {
                      "pr-6": !notRemove,
                    }
                  )}
                  key={item.id}
                >
                  {`${item.name}: `}
                  <span className="font-semibold">{getFilterValue(item)}</span>
                  {!notRemove && (
                    <p
                      className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-primary font-semibold"
                      onClick={() => removeFilter(item.code)}
                    >
                      x
                    </p>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </Fragment>
  );
};

export default ActiveFiltersDrawer;
