// src/app/api/move-card/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEFAULT_USER_ID } from '@/lib/user'; // <-- وارد کردن

const reviewIntervals = [0, 1, 2, 4, 8, 16];

export async function POST(request: NextRequest) {
  try {
    const { cardId, isCorrect } = await request.json();

    const currentCard = await prisma.word.findFirst({
      where: {
        id: cardId,
        userId: DEFAULT_USER_ID, // <-- اضافه کردن فیلد userId برای امنیت
      },
    });

    if (!currentCard) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    let nextBox: number;
    if (isCorrect) {
      nextBox = Math.min(currentCard.boxNumber + 1, 5);
    } else {
      nextBox = 1;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0, 0);
    const interval = reviewIntervals[nextBox];
    const nextReviewDate = new Date(today);
    nextReviewDate.setDate(today.getDate() + interval);

    const updatedCard = await prisma.word.update({
      where: { id: cardId },
      data: { boxNumber: nextBox, lastReview: today, nextReview: nextReviewDate },
    });

    return NextResponse.json(updatedCard);

  } catch (error) {
    console.error('Error in /api/move-card !!!', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}