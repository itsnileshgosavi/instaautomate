import axios from "axios";
import prisma from "@/lib/prisma";

/**
 * Refreshes an Instagram long-lived access token and persists the new one.
 *
 * Instagram long-lived tokens can be refreshed using the current long-lived
 * token (or the stored refreshToken). The endpoint accepts whichever valid
 * long-lived token you pass.
 *
 * Reference:
 * https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/refresh-access-tokens
 *
 * @param instaUserId - The user's instaUserId (used to look up and update the DB record)
 * @returns The new access token
 */
export async function refreshInstagramToken(
  instaUserId: string,
): Promise<string> {
  const user = await prisma.user.findFirst({
    where: { instaUserId },
    select: { id: true, accessToken: true, refreshToken: true },
  });

  if (!user) {
    throw new Error(`No user found for instaUserId: ${instaUserId}`);
  }

  // Prefer the stored refreshToken; fall back to the (expired) accessToken.
  // Both are long-lived tokens — Instagram uses the same endpoint for both.
  const tokenToUse = user.refreshToken || user.accessToken;

  if (!tokenToUse) {
    throw new Error(
      `No token available to refresh for instaUserId: ${instaUserId}`,
    );
  }

  const response = await axios.get(
    "https://graph.instagram.com/refresh_access_token",
    {
      params: {
        grant_type: "ig_refresh_token",
        access_token: tokenToUse,
      },
    },
  );

  const newAccessToken: string = response.data.access_token;

  // update in db
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      accessToken: newAccessToken,
      // Keep refreshToken in sync so we always have a fresh copy
      refreshToken: newAccessToken,
    },
  });

  if (!newAccessToken) {
    throw new Error("Token refresh response did not contain an access_token");
  }

  // Persist the new token in the database
  await prisma.user.update({
    where: { id: user.id },
    data: {
      accessToken: newAccessToken,
      // Keep refreshToken in sync so we always have a fresh copy
      refreshToken: newAccessToken,
    },
  });

  console.log(
    `[TokenRefresh] Successfully refreshed token for instaUserId: ${instaUserId}`,
  );
  return newAccessToken;
}

export async function refreshAllInstagramTokens() {
  const users = await prisma.user.findMany({
    where: {
      accessToken: {
        not: null,
      },
    },
  });

  for (const user of users) {
    try {
      await refreshInstagramToken(user.instaUserId!);
    } catch (error) {
      console.error(
        `[TokenRefresh] Failed to refresh token for instaUserId: ${user.instaUserId}`,
        error,
      );
    }
  }
}

/**
 * Checks whether an API error response is an expired-token (OAuthException code 190).
 */
export function isTokenExpiredError(error: any): boolean {
  const data = error?.response?.data;
  // Instagram wraps the error under data.error
  const igError = data?.error ?? data;
  return igError?.type === "OAuthException" && igError?.code === 190;
}
