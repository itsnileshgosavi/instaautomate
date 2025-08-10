import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "../../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";
import { getUserPosts } from "@/services/getUserPosts";

// GET /api/instagram/posts - list recent posts of current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.instagramId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await prisma.user.findUnique({
      where: { instagramId: session.user.instagramId },
      select: { instaUserId: true, accessToken: true },
    });
    if (!dbUser?.instaUserId || !dbUser?.accessToken)
      return NextResponse.json({ error: "Missing IG credentials" }, { status: 400 });

    const posts = await getUserPosts(dbUser.instaUserId, dbUser.accessToken);
    return NextResponse.json(posts);
  } catch (e: any) {
    console.error("Error fetching posts:", e);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
