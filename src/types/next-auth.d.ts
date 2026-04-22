import { DefaultSession } from "next-auth";
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      phone: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
    phone: string;
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role: Role;
    phone: string;
  }
}
