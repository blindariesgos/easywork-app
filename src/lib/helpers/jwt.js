import { jwtDecode } from "jwt-decode";

export async function isValidToken(token) {
  try {
    const decodedToken = jwtDecode(token);

    if (decodedToken.exp && decodedToken.exp > Date.now() / 1000) {
      return true;
    }
  } catch (error) {
    throw error;
  }

  return null;
}
