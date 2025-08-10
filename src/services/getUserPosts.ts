import axios from "axios";

interface InstagramPost {
  id: string;
  caption?: string;
  media_type: string;
  media_url: string;
  permalink: string;
  thumbnail_url?: string;
  timestamp: string;
}

/**
 * Fetch recent posts for an Instagram Business/Creator account.
 * Graph API ref: https://developers.facebook.com/docs/instagram-api/reference/user/media
 */
export const getUserPosts = async (igUserId: string, accessToken: string): Promise<InstagramPost[]> => {
  const res = await axios.get(`https://graph.instagram.com/v23.0/${igUserId}/media`, {
    params: {
      fields: "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp",
      access_token: accessToken,
      limit: 50,
    },
  });
  return res.data.data as InstagramPost[];
};

export type { InstagramPost };
