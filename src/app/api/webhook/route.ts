import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const data = await req.json();
    console.log(data);
    console.log(data?.entry?.messaging)
    return NextResponse.json({ message: "success" });
}

export async function GET(req: NextRequest) {
    const VERIFY_TOKEN = "secret";
    const mode = req.nextUrl.searchParams.get('hub.mode');
    const token = req.nextUrl.searchParams.get('hub.verify_token');
    const challenge = req.nextUrl.searchParams.get('hub.challenge');
  
    if (mode && token && mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('Webhook verified');
      return new NextResponse(challenge, { status: 200, headers: { 'Content-Type': 'text/plain' } });
    }
    return NextResponse.json({ message: "failure" });
}
