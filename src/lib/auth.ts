import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";
import bcrypt from "bcrypt";
import { Role, ProfessionalStatus } from "@prisma/client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Téléphone", type: "text", placeholder: "0600000000" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { phone: credentials.phone as string },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!passwordsMatch) {
          return null;
        }

        if (user.role === Role.PRO) {
          const proProfile = await db.professional.findFirst({
            where: { whatsapp: user.phone as string }
          });

          if (!proProfile || proProfile.status !== ProfessionalStatus.APPROVED) {
            throw new Error("PRO_NOT_APPROVED");
          }
        }

        return { id: user.id, phone: user.phone as string, role: user.role };
      },
    }),
  ],
});