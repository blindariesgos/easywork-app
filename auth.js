import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { isValidToken } from "/src/lib/helpers";
import { getLogin } from "@/src/lib/api/hooks/auths";

// Constantes para tipos de errores
const ERROR_TYPES = {
  INVALID_CREDENTIALS: "Credenciales inválidas",
  AUTH_ERROR: "Error de autenticación",
  REFRESH_TOKEN_ERROR: "RefreshTokenError",
  SESSION_EXPIRED: "SessionExpired",
};

// Función para refrescar el token
const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Missing refresh token");
  }

  try {
    const response = await fetch(`${process.env.API_HOST}/auth/token/refresh`, {
      method: "POST",
      body: JSON.stringify({
        refreshToken: refreshToken,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || ERROR_TYPES.REFRESH_TOKEN_ERROR);
    }

    return {
      access_token: data.token,
      expires_at: data.expires_at,
      refresh_token: data.refresh_token || refreshToken,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
};

// Middleware para verificar errores de token y forzar cierre de sesión si es necesario
export const authConfig = {
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        token: {},
        prevSession: {},
      },
      authorize: async (credentials) => {
        // Intentar autenticar con sesión previa
        if (credentials.prevSession) {
          try {
            const prevSession = JSON.parse(credentials.prevSession);
            const validToken = await isValidToken(
              prevSession.user.access_token
            );

            if (!validToken) {
              throw new Error(ERROR_TYPES.INVALID_CREDENTIALS);
            }

            return {
              ...prevSession.user,
            };
          } catch (error) {
            console.error("Error authenticating with previous session:", error);
            throw new Error(ERROR_TYPES.INVALID_CREDENTIALS);
          }
        }

        // Intentar autenticar con email y password
        try {
          const { email, password } = credentials;
          const response = await getLogin(email, password);

          if (!response) {
            throw new Error(ERROR_TYPES.INVALID_CREDENTIALS);
          }

          return {
            ...response.user,
            access_token: response.access_token,
            refresh_token: response.refresh_token,
            expires_at: response.expires_at,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error(error.message || ERROR_TYPES.AUTH_ERROR);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 horas
  },
  pages: {
    signIn: "/auth",
    error: "/auth/error",
    signOut: "/auth/signout",
  },
  callbacks: {
    jwt: async ({ token, user, account }) => {
      // Caso 1: Primera autenticación
      if (user && account) {
        return {
          ...token,
          ...user,
          roles: user.roles,
        };
      }

      // Caso 2: El token actual es válido
      if (token.expires_at && Date.now() < token.expires_at * 1000) {
        return token;
      }

      // Caso 3: Token expirado, intentar refrescar
      try {
        const refreshedTokens = await refreshAccessToken(token.refresh_token);

        return {
          ...token,
          access_token: refreshedTokens.access_token,
          expires_at: refreshedTokens.expires_at,
          refresh_token: refreshedTokens.refresh_token,
          error: null, // Limpiar cualquier error previo
        };
      } catch (error) {
        // Marcar el token como inválido para forzar cierre de sesión
        console.error("Failed to refresh token, marking session for signout");
        return {
          ...token,
          error: ERROR_TYPES.REFRESH_TOKEN_ERROR,
        };
      }
    },

    session: async ({ session, token }) => {
      // Si hay un error en el token, marcarlo en la sesión para manejarlo
      if (token.error) {
        session.error = token.error;
      }

      // Pasar los datos del token a la sesión
      session.user = {
        ...session.user,
        ...token,
      };

      return session;
    },
  },
  events: {
    async signOut({ token }) {
      // Lógica adicional al cerrar sesión si es necesario
      console.log("User signed out");
    },
    async error({ error }) {
      console.error("NextAuth error:", error);
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
