import NextAuth, { DefaultSession, JWT } from "next-auth";
import InstagramProvider from "next-auth/providers/instagram";
import prisma from "@/lib/prisma";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
  interface JWT {
    accessToken?: string;
  }
}

const handler = NextAuth({
  providers: [
    InstagramProvider({
      clientId: process.env.INSTAGRAM_CLIENT_ID!,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "instagram_business_basic",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "instagram") {
        //search user in db by instagram id
        const dbUser = await prisma.user.findUnique({
          where: {
            instagramId: user.id,
          },
        });
        if (!dbUser) {
          await prisma.user.create({
            data: {
              instagramId: user.id,
              name: user.name,
              email: user.email,
            },
          });
        }
        return true;
      }
      return false;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
