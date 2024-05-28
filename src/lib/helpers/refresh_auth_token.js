"use server";
import axios from "axios";
import { cookies } from "next/headers";
import { decrypt } from "./encrypt";

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
    const errorMessage = error.response
      ? `Error refreshing token: ${error.response.status} ${error.response.data}`
      : "Error refreshing token: Network or other error";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
}

export default refreshAuthToken;
