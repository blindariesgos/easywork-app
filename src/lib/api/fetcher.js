import { getLogger } from "@/src/utils/logger";

const BASE_URL = "/api/data"

const logger = getLogger("Fetcher")

const fetcher = async (endpoint, options = {}) => {
    let response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
    });

    if (!response.ok) {
        const error = new Error('An error occurred while fetching the data.');
      logger.error(error)
        throw error;
    }
    return response.json(); 
}

export default fetcher;