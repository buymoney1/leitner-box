// src/app/api/get-cards-for-review/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEFAULT_USER_ID } from '@/lib/user'; // <-- وارد کردن

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0, 0);

    const cardsToReview = await prisma.word.findMany({
      where: {
        userId: DEFAULT_USER_ID, // <-- استفاده از متغیر
        nextReview: {
          lte: today,
        },
      },
      orderBy: [
        { boxNumber: 'asc' },
        { id: 'asc' },
      ],
    });

    return NextResponse.json(cardsToReview);

  } catch (error) {
    console.error('!!! Error in /api/get-cards-for-review !!!', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}