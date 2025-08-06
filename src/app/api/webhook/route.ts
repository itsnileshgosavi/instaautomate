import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    console.log(body);
    return NextResponse.json({ message: "success" });
}

export async function GET(req: NextRequest) {
    const VERIFY_TOKEN = "secret";
    const mode = req.nextUrl.searchParams.get('hub.mode');
    const token = req.nextUrl.searchParams.get('hub.verify_token');
    const challenge = req.nextUrl.searchParams.get('hub.challenge');
  
    if (mode && token && mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('Webhook verified');
      return NextResponse.json({ challenge });
    }
    return NextResponse.json({ message: "failure" });
}
