import moment from "moment";

export const getFormatDate = (date) => {
	const dateStr = date;
	return moment.utc(dateStr).toISOString();
};
