import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import authOptions from '../auth/[...nextauth]/authOptions';

// GET: List all automations for the current user
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.instagramId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const automations = await prisma.automationRule.findMany({
    where: { instaUserId: session.user.instagramId },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(automations);
}

// POST: Create a new automation rule
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { triggerType, triggerWord, replyText, isActive } = body;
  if ( !triggerType || !triggerWord || !replyText) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  const user = await prisma.user.findUnique({
    where: { instagramId: session.user.instagramId },
    select: { instaUserId: true, id:true },
  });
  if (!user?.instaUserId) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  
  const automation = await prisma.automationRule.create({
    data: {
      userId: user.id,
      instaUserId: user.instaUserId,
      triggerType,
      triggerWord,
      replyText,
      isActive: isActive !== false,
    },
  });
  return NextResponse.json(automation, { status: 201 });
}
