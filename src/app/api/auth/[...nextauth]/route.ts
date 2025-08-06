import NextAuth, { DefaultSession, JWT, type AuthOptions } from "next-auth";
import authOptions from "./authOptions";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    refreshToken?: string;
    user: {
      id: string;
      instagramId: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
  
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    instagramId?: string;
    id?: string;
    name?: string | null;
    email?: string | null;
  }
  
  interface User {
    id: string;
    instagramId: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}



const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };