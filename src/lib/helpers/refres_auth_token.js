"use server";
import axios from "axios";
import { cookies } from 'next/headers'

/**
 * Función para refrescar el token de autenticación utilizando un token de refresco.
 * @returns {Promise<string>} Promesa que resuelve con el nuevo access token.
 */
async function refreshAuthToken() {
  console.log("Refresh Auth token")
  try {
    // Obtener el token de refresco almacenado de forma segura
    const refreshToken = cookies().get('refreshToken')?.value; // Asumiendo que usas cookies desde 'next/headers'
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    // Configuración del endpoint para la renovación del token
    const url = `${process.env.API_HOST}/auth/token/refresh`; // Ajusta esta URL al endpoint de tu API

    console.log(url)

    console.log("Refresh Token", refreshToken)

    // Realizar la petición para obtener un nuevo token
    const response = await axios.post(url, {
      refreshToken,
    });

    console.log(response.status)

    // Verificar la respuesta y extraer el nuevo token de acceso
    if ((response.status === 200 || response.status === 201) && response.data.token) {
      return response.data.token;
    } else {
      throw new Error("Failed to refresh token");
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
}

export default refreshAuthToken;
