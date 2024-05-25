import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import { getLogin } from "./src/lib/apis";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
  // trustHost: true,
  // trustedHosts: ['localhost', 'your-domain.com'],
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        token: {},
      },
      authorize: async (credentials) => {
        const { email, password, } = credentials;
        const response = await getLogin(email, password);

        if (response){

          return {
            ...response?.user,
            accessToken: response?.accessToken,
            refreshToken: response?.refreshToken
          };
        }
        return null;
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
    jwt: async ({ token, user, account }) => {
     
        if (account && user){
        // Usuario inicio sesion por primera vez, configurar tokens inicialmente
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      if (user){
        const decoded = jwtDecode(user.accessToken);
        token = { ...token, ...decoded, ...user };
      }
      return token;
    },
    session({ session, token }) {
      delete token?.refreshToken;
      return {
        ...session,
        user: {
          ...token,
        },
      }
    },
  }
})