import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { isValidToken } from "/src/lib/helpers";
import { getLogin } from "@/src/lib/api/hooks/auths";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        token: {},
      },
      authorize: async (credentials) => {
        if (credentials.prevSession) {
          try {
            const prevSession = JSON.parse(credentials.prevSession);

            const validToken = await isValidToken(prevSession.user.accessToken);
            if (!validToken) throw new Error("Credenciales inválidas");

            return {
              ...prevSession.user,
            };
          } catch (error) {
            throw new Error("Credenciales inválidas");
          }
        }
        const { email, password } = credentials;
        try {
          const response = await getLogin(email, password);

          if (response) {
            const payload = {
              ...response?.user,
              access_token: response?.access_token,
              refresh_token: response?.refresh_token,
              expires_at: response?.expires_at,
            };

            return payload;
          } else {
            throw new Error("Credenciales inválidas");
          }
        } catch (error) {
          throw new Error("Error de autenticación"); // Lanzar el error para ser manejado externamente
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth",
  },
  callbacks: {
    jwt: async ({ token, user, account, trigger, session }) => {
      if (user) {
        token.roles = user.roles;
      }

      if (account) {
        const response = {
          ...token,
          access_token: user.access_token,
          expires_at: user.expires_at,
          refresh_token: user.refresh_token,
        };

        return response;
      } else if (Date.now() < token.expires_at * 1000) {
        return token;
      } else {
        if (!token.refresh_token) throw new TypeError("Missing refresh_token");

        try {
          const response = await fetch(
            `${process.env.API_HOST}/auth/token/refresh`,
            {
              method: "POST",
              body: JSON.stringify({
                refreshToken: token.refresh_token,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const tokensOrError = await response.json();

          if (!response.ok) throw tokensOrError;

          const newTokens = {
            ...token,
            access_token: tokensOrError.token,
            expires_at: tokensOrError.expires_at,
            refresh_token: tokensOrError.refresh_token
              ? tokensOrError.refresh_token
              : token.refresh_token,
          };
          return newTokens;
        } catch (error) {
          console.error("Error refreshing access_token", error);
          // If we fail to refresh the token, return an error so we can handle it on the page
          token.error = "RefreshTokenError";
          return token;
        }
      }
      /* if (trigger === "update" && session.newToken) {
        token.accessToken = session.newToken;
        return token;
      }
      if (account && user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      if (user && user.accessToken) {
        // Solo decodificar si existe accessToken
        const decoded = jwtDecode(user.accessToken);
        token = { ...token, ...decoded, ...user };
      }
      return token; */
    },
    async session({ session, token }) {
      session.error = token.error;
      return { ...session, user: { ...token } };
    },
  },
});
