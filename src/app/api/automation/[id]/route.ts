import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import authOptions from '../../auth/[...nextauth]/authOptions';

// GET: Get a single automation rule by ID
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const automation = await prisma.automationRule.findUnique({
    where: { id },
  });
  if (!automation) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(automation);
}

// PUT: Update an automation rule by ID
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const automation = await prisma.automationRule.update({
    where: { id },
    data: body,
  });
  return NextResponse.json(automation);
}

// DELETE: Delete an automation rule by ID
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await prisma.automationRule.delete({
    where: { id },
  });
  return NextResponse.json({ success: true });
}
