"use server";
import axios from "axios";
import { cookies } from "next/headers";
import { decrypt } from "./encrypt";
import { getLogger } from "@/src/utils/logger";

const logger = getLogger("Refresh Token");

async function refreshAuthToken() {
  const url = `${process.env.API_HOST}/auth/token/refresh`;

  try {
    const refreshToken = cookies().get("refreshToken")?.value;
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    let decryptedToken = await decrypt(refreshToken);

    const response = await axios.post(url, { refreshToken: decryptedToken });

    if (
      response.status >= 200 &&
      response.status < 300 &&
      response.data.token
    ) {
      const newAccessToken = response.data.token;
      return newAccessToken;
    } else {
      throw new Error("Failed to refresh token: Invalid response");
    }
  } catch (error) {
      logger.error("Error refresh Token", error);
  }
}

export default refreshAuthToken;
