import NextAuth, { DefaultSession, JWT } from "next-auth";
import InstagramProvider from "next-auth/providers/instagram";
import prisma from "@/lib/prisma";
import { getLongLIvedToken } from "@/services/getLongLIvedToken";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
  }
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
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
        if (!dbUser && account.access_token) {
          const longLivedToken = await getLongLIvedToken(account.access_token);
          await prisma.user.create({
            data: {
              instagramId: user.id,
              name: user.name,
              email: user.email,
              accessToken: longLivedToken,
              refreshToken: account.refresh_token,
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
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
