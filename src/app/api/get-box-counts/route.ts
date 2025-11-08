// src/app/api/get-box-counts/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEFAULT_USER_ID } from '@/lib/user'; // <-- وارد کردن

export async function GET() {
  try {
    const counts = await prisma.word.groupBy({
      by: ['boxNumber'],
      where: { userId: DEFAULT_USER_ID }, // <-- استفاده از متغیر
      _count: {
        id: true,
      },
    });

    const result = counts.reduce((acc, item) => {
      acc[item.boxNumber] = item._count.id;
      return acc;
    }, { 1: 0, 2: 0, 3: 0, 4: 0 });

    return NextResponse.json(result);

  } catch (error) {
    console.error('!!! Error in /api/get-box-counts !!!', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}