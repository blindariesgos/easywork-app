"use server";
import { auth, signIn, signOut } from "@/auth";
import { cookies } from "next/headers";
import { getLogger } from "../utils/logger";
import { logout } from "./apis";

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

export async function clearSession() {
  try {
    logger.info("Clearing session...");
    const response = await signOut({ redirect: true });
    logger.info("Session cleared:", response);
  } catch (error) {
    console.log("Error cerrando cesion", error);
    logger.error("Error clearing session:", error);
    throw error; // Relanza el error para manejarlo en otro lugar
  }
}
