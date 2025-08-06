import axios from "axios";

export const getInstagramBusinessAccount = async (token: string) => {
    const response = await axios.get(`https://graph.instagram.com/v23.0/me?fields=id,username,user_id,name&access_token=${token}`);
    const instaUserId = response.data.user_id;
    return {instaUserId, username: response.data.username, name: response.data.name}
}