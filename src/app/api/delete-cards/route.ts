// src/app/api/delete-cards/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEFAULT_USER_ID } from '@/lib/user'; // <-- وارد کردن

export async function POST(request: NextRequest) {
  try {
    const { cardIds } = await request.json();

    if (!cardIds || !Array.isArray(cardIds) || cardIds.length === 0) {
      return NextResponse.json({ error: 'Invalid cardIds provided.' }, { status: 400 });
    }

    // یک بررسی امنیتی اضافه کنید تا فقط کارت‌های همین کاربر حذف شوند
    const result = await prisma.word.deleteMany({
      where: {
        id: { in: cardIds },
        userId: DEFAULT_USER_ID, // <-- اضافه کردن فیلد userId
      },
    });

    console.log(`Deleted ${result.count} cards.`);
    return NextResponse.json({ count: result.count });

  } catch (error) {
    console.error('Error deleting cards:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}