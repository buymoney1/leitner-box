// src/app/api/set-card-box/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEFAULT_USER_ID } from '@/lib/user'; // <-- وارد کردن

export async function POST(request: NextRequest) {
  try {
    const { cardId, targetBox } = await request.json();

    // یک بررسی امنیتی اضافه کنید
    const cardExists = await prisma.word.findFirst({
      where: {
        id: cardId,
        userId: DEFAULT_USER_ID, // <-- اضافه کردن فیلد userId
      },
    });

    if (!cardExists) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    const updatedCard = await prisma.word.update({
      where: { id: cardId },
      data: { boxNumber: targetBox },
    });

    return NextResponse.json(updatedCard);

  } catch (error) {
    console.error('Error setting card box:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}