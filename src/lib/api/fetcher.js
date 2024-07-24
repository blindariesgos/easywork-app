"use server"
import { getLogger } from "@/src/utils/logger";
import axios from "../axios";

const logger = getLogger("Fetcher")

const methods = {
    GET: (endpoint) => axios().get(endpoint),
    PUT: (endpoint) => axios().put(endpoint),
}

const fetcher = async (endpoint, options = {}) => {
    return await methods[options?.method ?? "GET"](endpoint).catch(error => error)
}

export default fetcher;