import { getLogin } from "@/lib/apis";
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        token: {},
      },
      authorize: async (credentials) => {
        const {
        email,
        password,
      } = credentials;
        const data  = await getLogin(
          email,
          password,
        );
        return data;
      },
    }),
  ],
  session: {
    strategy: 'jwt', // 1 hora
    // maxAge: 60, // 1 minuto
  },
  pages: {
    signIn: "/auth",
    // signOut: "/login",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      const decoded = jwtDecode(user ? user?.accessToken : token?.accessToken);
      const data = {
        ...decoded,
        ...token,
        ...user,
      }    
      return data;
    },
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...token,
        },
      }
    },
  }
})