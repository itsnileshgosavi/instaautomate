import InstagramProvider from "next-auth/providers/instagram";
import prisma from "@/lib/prisma";
import { getLongLIvedToken } from "@/services/getLongLIvedToken";
import { AuthOptions } from "next-auth";
import { getInstagramBusinessAccount } from "@/services/getInstaAccount";
const authOptions: AuthOptions = {
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
        // update the access token with each new login
        if (dbUser && account.access_token) {
          const longLivedToken = await getLongLIvedToken(account.access_token);
          const { instaUserId, username, name, profilePictureUrl } =
            await getInstagramBusinessAccount(
              account.access_token || longLivedToken,
            );
          await prisma.user.update({
            where: {
              id: dbUser.id,
            },
            data: {
              accessToken: longLivedToken,
              refreshToken: account.refresh_token,
              image: profilePictureUrl,
              instagramUsername: username,
              name: name,
            },
          });
        }
        // create new user if not found
        if (!dbUser && account.access_token) {
          const longLivedToken = await getLongLIvedToken(account.access_token);
          const { instaUserId, username, name, profilePictureUrl } =
            await getInstagramBusinessAccount(account.access_token);
          await prisma.user.create({
            data: {
              instagramId: user.id,
              name: name,
              email: user.email,
              accessToken: longLivedToken,
              refreshToken: account.refresh_token,
              instaUserId: instaUserId,
              instagramUsername: username,
              image: profilePictureUrl,
            },
          });
        }
        return true;
      }
      return false;
    },
    async jwt({ token, account, user }) {
      // Initial sign in
      if (account && user) {
        return {
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          id: account.providerAccountId,
          instagramId: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          ...token,
        };
      }

      // Return previous token if the current token has not expired
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token) {
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
        if (session.user) {
          session.user.id = token.id as string;
          session.user.instagramId = token.instagramId as string;
          session.user.name = token.name as string;
          session.user.email = token.email as string;
          session.user.image = token.image as string;
        }
      }
      return session;
    },
  },
};

export default authOptions;
