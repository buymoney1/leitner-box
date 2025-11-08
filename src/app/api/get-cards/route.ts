// src/app/api/get-cards/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  console.log('API /api/get-cards was called.');
  try {
    // خواندن پارامترهای URL (مثلاً ?box=2)
    const { searchParams } = new URL(request.url);
    const boxParam = searchParams.get('box');
    const targetBox = boxParam ? parseInt(boxParam, 10) : null; // اگر box وجود نداشت، null است

    const userId = 'cmhq9n7l00000someotherid';
    
    // شرط where را پویا می‌کنیم
    const whereCondition: any = { userId };
    if (targetBox && targetBox >= 1 && targetBox <= 4) {
      whereCondition.boxNumber = targetBox;
    }

    console.log('Searching for words with condition:', whereCondition);

    const words = await prisma.word.findMany({
      where: whereCondition,
      orderBy: [
        { boxNumber: 'asc' },
        { id: 'asc' },
      ],
    });

    console.log('Found words:', words.length);
    return NextResponse.json(words);

  } catch (error) {
    console.error('!!! Error in /api/get-cards !!!', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}