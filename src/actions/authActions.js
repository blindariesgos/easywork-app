"use server";

import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";

export async function serverSignOut() {
  try {
    await signOut({ redirect: false });
    redirect("/auth");
  } catch (error) {
    console.error("Server sign out error:", error);
    throw error;
  }
}
