import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import axios from "axios";
import { getServerAuthSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerAuthSession();
        
        if (!session?.user?.instagramId) {
            return NextResponse.json(
                { error: "User insta id not found" },
                { status: 401 }
            );
        }

        // You can access the user's access token like this:
        const user = await prisma.user.findUnique({
            where: {
                instagramId: session?.user?.instagramId,
            },
        });
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }
        
        const body = await req.json();
        const subscribe = await axios.post(`htpps://graph.instagram.com/v23.0/${user.instagramId}/subscribed_apps?subscribed_fields=comments&access_token=${user.accessToken}`)
        
        // Process the webhook payload here
        // For now, we'll just return a success response
        return NextResponse.json({ 
            success: true,
            message: "Subscribed to comments successfully"
        });
    } catch (error) {
        console.error("Error in webhook handler:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
