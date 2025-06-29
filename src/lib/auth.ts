import { getServerSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email as string },
        });

        if (!dbUser) {
          const newUser = await prisma.user.create({
            data: {
              email: user.email as string,
              name: user.name as string,
              image: user.image,
            },
          });

          token.id = newUser.id;
        } else {
          token.id = dbUser.id;
        }
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
