import axios from "axios";
import prisma from "./prisma";

interface SendMessageOptions {
  instaAccountId: string; // IG business user ID (your account)
  recipientId: string; // IG user ID of the recipient
  message: string;
  accessToken: string;
  linkText?: string;
  linkUrl?: string;
}

interface SendCommentOptions {
  commentId: string;
  message: string;
  accessToken: string;
}

export const instagramApi = {
  /**
   * Send a direct message to a user
   */
  /**
   * Send a direct message to a user using the Instagram Graph API
   * See: https://developers.facebook.com/docs/instagram-api/guides/messaging
   */
  async sendMessage({
    instaAccountId,
    recipientId,
    message,
    accessToken,
    linkText,
    linkUrl,
  }: SendMessageOptions) {
    try {
      // Build message payload
      let messagePayload: any;
      if (linkText && linkUrl) {
        // Send a generic template with a CTA button when link info is provided
        messagePayload = {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: [
                {
                  title: message,
                  buttons: [
                    {
                      type: "web_url",
                      url: linkUrl,
                      title: linkText,
                    },
                  ],
                },
              ],
            },
          },
        };
      } else {
        // Fall back to a plain text message when linkText or linkUrl is missing
        messagePayload = { text: message };
      }

      // Instagram Graph API for messaging: senderIgUserId is your business IG user ID
      const response = await axios.post(
        `https://graph.instagram.com/v23.0/${instaAccountId}/messages`,
        null,
        {
          params: {
            domain: "INSTAGRAM",
            message: JSON.stringify(messagePayload),
            recipient: JSON.stringify({ id: recipientId }),
            access_token: accessToken,
          },
        },
      );

      if (response.status !== 200) {
        const error = await response.data;
        throw new Error(`Failed to send IG message: ${JSON.stringify(error)}`);
      }

      return await response.data;
    } catch (error: any) {
      // Log the most relevant axios error info
      if (error.response) {
        console.error(
          "IG API error:",
          JSON.stringify(
            {
              data: error.response.data,
              status: error.response.status,
              headers: error.response.headers,
              config: error.config,
              request:
                error.request && typeof error.request === "object"
                  ? undefined
                  : error.request, // avoid circular
            },
            null,
            2,
          ),
        );
      } else {
        console.error(
          "Error sending IG message:",
          JSON.stringify(error, Object.getOwnPropertyNames(error), 2),
        );
      }
      throw error;
    }
  },

  /**
   * Send a private reply to a commentor (DM)
   * https://developers.facebook.com/docs/instagram-platform/private-replies
   */
  async sendPrivateReply({
    instaAccountId,
    commentId,
    message,
    linkText,
    linkUrl,
    accessToken,
  }: {
    instaAccountId: string;
    commentId: string;
    message: string;
    linkText?: string;
    linkUrl?: string;
    accessToken: string;
  }) {
    try {
      // Build message payload
      let messagePayload: any;
      if (linkText && linkUrl) {
        // Send a generic template with a CTA button when link info is provided
        messagePayload = {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: [
                {
                  title: message,
                  buttons: [
                    {
                      type: "web_url",
                      url: linkUrl,
                      title: linkText,
                    },
                  ],
                },
              ],
            },
          },
        };
      } else {
        // Fall back to a plain text message when linkText or linkUrl is missing
        messagePayload = { text: message };
      }

      const response = await axios.post(
        `https://graph.instagram.com/v23.0/${instaAccountId}/messages`,
        {
          recipient: { comment_id: commentId },
          message: messagePayload,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(
          `Private reply failed: ${JSON.stringify(response.data)}`,
        );
      }
      return response.data;
    } catch (error: any) {
      console.error(
        "Error sending private reply:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  /**
   * Reply to a comment
   */
  async replyToComment({
    commentId,
    message,
    accessToken,
  }: SendCommentOptions) {
    try {
      const response = await axios.post(
        `https://graph.instagram.com/v23.0/${commentId}/replies`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          data: JSON.stringify({
            message: message,
          }),
        },
        {
          params: {
            access_token: accessToken,
            message: message,
          },
        },
      );

      if (response.status !== 200) {
        const error = await response.data;
        throw new Error(
          `Failed to post comment reply: ${JSON.stringify(error)}`,
        );
      }

      return await response.data;
    } catch (error) {
      console.error("Error replying to comment:", error);
      throw error;
    }
  },

  /**
   * Get user's Instagram business account ID
   */
  async getInstagramBusinessAccount(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { accessToken: true, instagramId: true },
    });

    if (!user || !user.accessToken) {
      throw new Error("User not found or missing access token");
    }

    return {
      accessToken: user.accessToken,
      instagramId: user.instagramId,
    };
  },
};
