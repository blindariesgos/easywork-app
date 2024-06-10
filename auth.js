import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
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
            return {
              ...response?.user,
              accessToken: response?.accessToken,
              refreshToken: response?.refreshToken,
            };
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
      if (trigger === "update" && session.newToken) {
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
      return token;
    },
    session({ session, token }) {
      delete token?.refreshToken; // Considera cómo almacenar el refreshToken si lo necesitas
      return { ...session, user: { ...token } };
    },
  },
});
