"use server";
import axios from "../axios";

const methods = {
  GET: (endpoint) => axios().get(endpoint),
  PUT: (endpoint) => axios().put(endpoint),
};

const fetcher = async (endpoint, options = {}) => {
  return await methods[options?.method ?? "GET"](endpoint).catch(
    (error) => error
  );
};

export default fetcher;

export const fetcherV2 = async ([baseKey, params]) => {
  const endpoint = `${baseKey}?${params}`;
  return await axios()
    .get(endpoint)
    .catch((error) => error);
};
