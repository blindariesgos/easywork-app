"use server";
import { auth, signIn } from "@/auth";
import { cookies } from "next/headers";
import { getLogger } from "../utils/logger";

const logger = getLogger("Session Updater");

export const updateSession = async (newAccessToken) => {
  const currentSession = await auth();

  if (!currentSession) return;

  const updatedSession = {
    ...currentSession,
    user: {
      ...currentSession.user,
      accessToken: newAccessToken,
    },
  };

  await signIn("credentials", {
    prevSession: JSON.stringify(updatedSession),
    redirect: false,
  });
};

export const clearSession = async () => {
  try {
    const cookieJar = cookies();
    cookieJar.delete("authjs.session-token");
    cookieJar.delete("refreshToken");
  } catch (error) {
    logger.warn(error);
  }
};
