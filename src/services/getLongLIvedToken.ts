import axios from "axios";

export const getLongLIvedToken = async (token: string) => {
    const response = await axios.get(`https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&access_token=" + token`);
    const accessToken = response.data.access_token;
    return accessToken;
}
