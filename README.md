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
INSTAGRAM_CLIENT_ID=''  //get this from meta developers portal
INSTAGRAM_CLIENT_SECRET='' //get this from meta developers portal
NEXT_PUBLIC_APP_URL='http://localhost:3000' //your app url
```

3. Add callback URL in meta developers portal - https://yourappurl/api/auth/callback/instagram

4. Run the application
```bash
npm run dev
```

## License

MIT

### Future Improvements

- Build comment to pvt reply - https://developers.facebook.com/docs/instagram-platform/private-replies
