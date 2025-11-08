// src/app/api/load-default-words/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEFAULT_USER_ID } from '@/lib/user'; // <-- وارد کردن

const defaultWords = [
  { term: "Apple", definition: "سیب" },
  { term: "Book", definition: "کتاب" },
  { term: "Computer", definition: "کامپیوتر" },
  { term: "Dream", definition: "رویا" },
  { term: "Freedom", definition: "آزادی" },
  { term: "Garden", definition: "باغ" },
  { term: "Happy", definition: "خوشحال" },
  { term: "Important", definition: "مهم" },
  { term: "Journey", definition: "سفر" },
  { term: "Knowledge", definition: "دانش" },
];

export async function POST() {
  try {
    const result = await prisma.word.createMany({
      data: defaultWords.map(word => ({
        term: word.term,
        definition: word.definition,
        userId: DEFAULT_USER_ID, // <-- استفاده از متغیر
        boxNumber: 1,
        lastReview: new Date(),
        nextReview: new Date(),
      })),
     
    });

    console.log('Default words loaded successfully.');
    return NextResponse.json({ count: result.count });

  } catch (error) {
    console.error('Error loading default words:', error);
    return NextResponse.json({ error: 'Failed to load default words', details: error.message }, { status: 500 });
  }
}