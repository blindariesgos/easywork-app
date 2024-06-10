"use server";
import { auth } from "@/auth";
import { encrypt } from "../../helpers/encrypt";
import { cookies } from "next/headers";
import axios from "../../axios";

export const login = async (formdata) => {
  return await signIn("credentials", formdata);
};

export const logout = async () => {
  return await signOut({
    redirectTo: "/auth",
  });
};

export const isLoggedIn = async () => {
  const session = await auth();
  return !!session?.user?.accessToken;
};

export const getLogin = async (email, password) => {
  const response = await axios().post(`/auth/login`, {
    email,
    password,
  });

  if (response && response.refreshToken) {
    const encryptedSessionData = await encrypt(response.refreshToken);

    cookies().set("refreshToken", encryptedSessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
  }

  return response;
};

export const getDataPassword = async (email) => {
  const response = await axios().put(`/auth/forgot-password`, {
    email,
  });
  return response.data;
};

export const sendOtpPhone = async (phone) => {
  try {
    console.log("Validando numero", phone);
    const response = await axios().post(`/auth/send-otp-phone`, { phone });
    return response.data;
  } catch (error) {
    // Customize based on your API error format
    if (error.statusCode === 400) {
      // Invalid phone number
      throw new Error("Invalid phone number");
    } else if (error.response?.status === 500) {
      // Internal server error
      throw new Error("Something went wrong on the server");
    } else {
      console.log(error);
      // Other Axios errors
      throw new Error("Failed to send OTP. Please try again later.");
    }
  }
};

export const sendOtpEmail = async (email) => {
  const response = await axios().post(`/auth/send-otp`, {
    email,
  });
  return response.data;
};

export const validateOTP = async (otpCode) => {
  const response = await axios().post(`/auth/validate-otp`, {
    otpCode,
  });
  return response;
};

export const changePassword = async (data) => {
  const response = await axios().post(`/auth/reset-password`, data);
  return response;
};
