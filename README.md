# Automation for Instagram creator/Business accounts

This is a web application that allows users to automate their Instagram accounts by setting up rules for automatic replies to messages and comments. Automate your business/creators instagram accounts using free and open source automation app.

## Features

- Automatic replies to messages and comments
- User-configurable trigger words and responses
- AI-powered automatic replies using Google Gemini (with OpenAI fallback)
- Real-time updates to the UI
- Support for both messages and comments

## Installation

```bash
git clone https://github.com/nileshgosavi/insta-automate.git
```

```bash
cd insta-automate
```

```bash
npm install
```

Add environment variables as in .env.example file.
create meta app in meta developer console to get client id and client secret.
[![Watch the video](https://img.youtube.com/vi/sPjlyDSNYQs/0.jpg)](https://www.youtube.com/watch?v=sPjlyDSNYQs)

Add the webhook in the meta app - https://yourappurl/api/webhook and enable messages and comments webhook fields. //This must be https url http is not supported. Webhook won't work on localhost. Use `secret` field to verify webhook. update this in production from webhook route.

**Note** - For developer/testing purpose you can add your instagram account as a test/developer account in meta business manager portal and use it with no verification required. For production you will have to get advanced access which can be only requested after business verification.

then sync db

```bash
npx prisma db push
```

note - the app wont work on localhost so use ngrok or cloudflare tunnel to expose your local server to the internet for testing.

## Usage

1. Create a .env file in the root directory of the project
2. Add the following variables to the .env file

```env
DATABASE_URL="postgres://username:password@host:port/database"
NEXTAUTH_SECRET='SECRET' //use base64 secret string
INSTAGRAM_CLIENT_ID=''  //get this from meta developers portal (https://www.youtube.com/watch?v=IBs-yJOhTto)
INSTAGRAM_CLIENT_SECRET='' //get this from meta developers portal (https://www.youtube.com/watch?v=IBs-yJOhTto)
NEXT_PUBLIC_BASE_URL='http://localhost:3000' //your app url
GOOGLE_GEMINI_API_KEY='your_gemini_key' //optional, preferred
OPENAI_API_KEY='your_openai_key' //fallback if no Gemini key
AI_ASSISTANT_PERSONA="You are the personal assistant of XYZ creator/business." //optional custom persona
CRON_SECRET="yoursupersecretstring"
```

3. Add callback URL in meta developers portal - https://yourappurl/api/auth/callback/instagram //THis must be https url http is not supported

4. Add a webhook in meta developers portal - https://yourappurl/api/webhook and enable messages and comments webhook fields. //This must be https url http is not supported. Webhook won't work on localhost.

5. Run the application

```bash
npm run dev
```

6. Login with instagram account and add automation rules ps - for production you will have to get advanced access which can be only requested after business verification. For developer or self use you can add your instagram account as a test/developer account in meta business manager portal and use it with no verification required.

## License

MIT

## Support

If you find this project helpful, you can support me on **Buy&nbsp;Me&nbsp;a&nbsp;Coffee** ☕

<a href="https://www.buymeacoffee.com/nileshgosavi" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="60" />
</a>

### Future Improvements

- Build comment to pvt reply - https://developers.facebook.com/docs/instagram-platform/private-replies

## Deployment

Deploy on vercel - https://vercel.com/docs/deploy-platforms/deploy-nextjs

## Important

For production you will have to get advanced access which can be only requested after business verification. For developer or self use you can add your instagram account as a test/developer account in meta business manager portal and use it with no verification required.
