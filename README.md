# Automation for Instagram creator/Business accounts

This is a web application that allows users to automate their Instagram accounts by setting up rules for automatic replies to messages and comments.

## Features

- Automatic replies to messages and comments
- User-configurable trigger words and responses
- Real-time updates to the UI
- Support for both messages and comments

## Installation

```bash
npm install
```

## Usage

1. Create a .env file in the root directory of the project
2. Add the following variables to the .env file

```env
DATABASE_URL="postgres://username:password@host:port/database"
NEXTAUTH_SECRET='SECRET' //use base64 secret string
INSTAGRAM_CLIENT_ID=''  //get this from meta developers portal (https://www.youtube.com/watch?v=IBs-yJOhTto)
INSTAGRAM_CLIENT_SECRET='' //get this from meta developers portal (https://www.youtube.com/watch?v=IBs-yJOhTto)
NEXT_PUBLIC_BASE_URL='http://localhost:3000' //your app url
```

3. Add callback URL in meta developers portal - https://yourappurl/api/auth/callback/instagram  //THis must be https url http is not supported

4. Add a webhook in meta developers portal - https://yourappurl/api/webhook //This must be https url http is not supported

5. Run the application
```bash
npm run dev
```

6. Login with instagram account and add automation rules ps - for production you will have to get advanced access which can be only requested after business verification. For developer or self use you can add your instagram account as a test/developer account in meta business manager portal and use it with no verification required.

## License

MIT

### Future Improvements

- Build comment to pvt reply - https://developers.facebook.com/docs/instagram-platform/private-replies
