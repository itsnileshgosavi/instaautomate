import axios from "axios";

/**
 * Subscribes an Instagram user to webhook events (comments + messages).
 * Called server-side during sign-in so the subscription is always up-to-date.
 */
export async function subscribeToInstagram(
  instagramUserId: string,
  accessToken: string,
): Promise<void> {
  try {
    await axios.post(
      `https://graph.instagram.com/v23.0/${instagramUserId}/subscribed_apps`,
      new URLSearchParams({
        access_token: accessToken,
        subscribed_fields: "comments,messages",
      }),
    );
  } catch (error: any) {
    // Log but don't throw — a failed subscription shouldn't block sign-in
    console.error(
      "Failed to subscribe to Instagram webhook during sign-in:",
      error?.response?.data ?? error?.message,
    );
  }
}
