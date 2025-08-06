import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import axios from "axios";
import { getServerAuthSession } from "@/lib/auth";
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/authOptions";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.instagramId) {
            return NextResponse.json(
                { error: "User not authenticated" },
                { status: 401 }
            );
        }

        // Get user from database
        const user = await prisma.user.findUnique({
            where: {
                instagramId: session.user.instagramId,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found in database" },
                { status: 404 }
            );
        }

        if (!user.accessToken) {
            return NextResponse.json(
                { error: "No access token found for user" },
                { status: 400 }
            );
        }


        // Subscribe to Instagram webhook
        try {
            const response = await axios.post(
                `https://graph.instagram.com/v23.0/${user.instagramId}/subscribed_apps`,
                new URLSearchParams({
                    access_token: user.accessToken,
                    subscribed_fields: 'comments,messages',
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            if (response.status !== 200) {
                throw new Error(`Instagram API returned status ${response.status}`);
            }

            return NextResponse.json({ 
                success: true,
                message: "Successfully subscribed to Instagram webhook",
                data: response.data
            });
            
        } catch (error: any) {
            console.error("Error subscribing to Instagram webhook:", error);
            return NextResponse.json(
                { 
                    error: "Failed to subscribe to Instagram webhook",
                    details: error.response?.data || error.message 
                },
                { status: error.response?.status || 500 }
            );
        }
    } catch (error) {
        console.error("Error in webhook handler:", error);
        return NextResponse.json(
            { 
                error: "Internal server error",
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
