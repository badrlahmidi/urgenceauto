import type { NextAuthConfig } from "next-auth";

export default {
  providers: [],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.phone = user.phone;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user && token.role) {
        session.user.role = token.role;
        session.user.phone = token.phone;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;