import NextAuth, { DefaultSession, JWT, type AuthOptions } from "next-auth";
import authOptions from "./authOptions";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    refreshToken?: string;
    user: {
      id: string;
      instagramId: string;
    } & DefaultSession["user"];
  }
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    instagramId?: string;
  }
  interface User {
    instagramId: string;
  }
}



const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };