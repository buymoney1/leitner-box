// src/app/api/add-word/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEFAULT_USER_ID } from '@/lib/user';

export async function POST(request: NextRequest) {
  try {
    const { term, definition } = await request.json();

    if (!term || !definition) {
      return NextResponse.json({ error: 'Term and definition are required.' }, { status: 400 });
    }

    // --- منطق جدید: کلمات جدید برای امروز مرور شوند ---
    const today = new Date();
    today.setHours(0, 0, 0, 0, 0); // شروع امروز

    const newWord = await prisma.word.create({
      data: {
        term,
        definition,
        userId: DEFAULT_USER_ID,
        boxNumber: 1,
        lastReview: today,
        nextReview: today, // <-- اینجا تغییر اصلی است
      },
    });

    return NextResponse.json(newWord, { status: 201 });

  } catch (error) {
    console.error('Error adding word:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}