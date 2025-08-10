import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { instagramApi } from "@/lib/instagram";
import { generateAiResponse } from "@/lib/ai";

// Handle incoming webhook events
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log("Received webhook event:", JSON.stringify(data, null, 2));
    const id = data.entry[0].id;

    // Handle different types of webhook events
    if (data.object === "instagram") {
      for (const entry of data.entry) {
        // Handle messages
        if (entry.messaging) {
          for (const message of entry.messaging) {
            await handleMessageEvent(message);
          }
        }

        // Handle comments
        if (entry.changes) {
          for (const change of entry.changes) {
            if (change.field === "comments") {
              await handleCommentEvent(change.value, id);
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in webhook handler:", error);
    return NextResponse.json(
      { error: "Failed to process webhook event" },
      { status: 500 }
    );
  }
}

// Handle Instagram message events
async function handleMessageEvent(event: any) {
  try {
    const { sender, recipient, message } = event;
    // sender.id: IG user ID of the user who sent the message (recipient for auto-reply)
    // recipient.id: IG business user ID (your business account)

    // Skip if message is from the page itself
    if (message.is_echo) return;

    // Get your IG business user from DB using recipient.id
    const businessUser = await prisma.user.findFirst({
      where: { instaUserId: recipient.id },
      select: { instaUserId: true, accessToken: true, instagramId: true },
    });

    if (!businessUser?.accessToken || !businessUser?.instaUserId) {
      console.error(
        "No access token or IG user ID found for business account:",
        recipient.id
      );
      return;
    }

    // Find automation rule for this business user, triggerType 'message', and matching triggerWord
    const automation = await prisma.automationRule.findFirst({
      where: {
        instaUserId: recipient.id,
        triggerType: "message",
        isActive: true,
        triggerWord: { mode: "insensitive", contains: message.text || "" },
      },
      orderBy: { createdAt: "desc" },
    });

    const reply =
      automation?.replyText ||
      (await generateAiResponse(
        message.text || "",
        process.env.AI_ASSISTANT_PERSONA
      ));

    // Send auto-reply using your IG business user ID as sender, sender.id as recipient
    await instagramApi.sendMessage({
      instaAccountId: businessUser.instagramId,
      recipientId: sender.id,
      message: reply,
      accessToken: businessUser.accessToken,
    });

    console.log("Sent auto-reply to message from:", sender.id);
  } catch (error) {
    console.error("Error handling message event:", error);
  }
}

// Handle Instagram comment events
async function handleCommentEvent(commentData: any, id: string) {
  try {
    const { from, id: commentId } = commentData;

    // Get the page access token from database
    // Note: You'll need to store the page access token for your Instagram account
    const user = await prisma.user.findFirst({
      where: { instaUserId: id },
      select: { accessToken: true, instaUserId: true, instagramId: true },
    });

    // Skip if comment is from the page itself
    if (from.id === user?.instaUserId) return;

    if (!user?.accessToken) {
      console.error("No access token found for comment from:", from.id);
      return;
    }

    // Find automation rule for this business user, triggerType 'comment', postId match, and matching triggerWord
    const automation = await prisma.automationRule.findFirst({
      where: {
        instaUserId: id,
        postId: commentData.media?.id || commentData.media_id || "",
        isActive: true,
        triggerWord: { mode: "insensitive", contains: commentData.text || "" },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!automation) {
      // fallback: check for rule without specific postId (global comment rule)
      const globalRule = await prisma.automationRule.findFirst({
        where: {
          instaUserId: id,
          postId: null, // null treated as global
          isActive: true,
          triggerWord: {
            mode: "insensitive",
            contains: commentData.text || "",
          },
        },
        orderBy: { createdAt: "desc" },
      });

      if (!globalRule) return;

      // Send public comment reply for global rule
      if (globalRule.triggerType === "comment") {
        await instagramApi.replyToComment({
          commentId,
          message: globalRule.replyText,
          accessToken: user.accessToken,
        });
      }
      if (globalRule.triggerType === "pvtreply") {
        await instagramApi.sendPrivateReply({
          instaAccountId: user.instagramId,
          commentId: commentData.id,
          message: globalRule.replyText,
          accessToken: user.accessToken,
          linkText: globalRule.linkText || undefined,
          linkUrl: globalRule.linkUrl || undefined,
        });
      }

      return;
    }

    const { replyText, linkText, linkUrl, triggerType } = automation;

    if (triggerType === "pvtreply") {
      await instagramApi.sendPrivateReply({
        instaAccountId: user.instagramId,
        commentId,
        message: replyText,
        linkText: linkText || undefined,
        linkUrl: linkUrl || undefined,
        accessToken: user.accessToken,
      });
    }
    if (triggerType === "comment") {
      await instagramApi.replyToComment({
        commentId,
        message: replyText,
        accessToken: user.accessToken,
      });
    }

    console.log("Sent auto-reply to comment from:", from.username);
  } catch (error) {
    console.error("Error handling comment event:", error);
  }
}

// Webhook verification endpoint
export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get("hub.mode");
  const token = req.nextUrl.searchParams.get("hub.verify_token");
  const challenge = req.nextUrl.searchParams.get("hub.challenge");

  if (mode && token) {
    if (mode === "subscribe" && token === "secret") {
      console.log("Webhook verified successfully");
      return new Response(challenge, { status: 200 });
    }
  }

  console.error("Webhook verification failed");
  return new Response("Verification failed", { status: 403 });
}
