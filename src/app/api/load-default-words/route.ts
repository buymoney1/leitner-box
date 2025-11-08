import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // از فایل جدید auth.ts استفاده می‌کنیم
import { prisma } from "@/lib/prisma";
import fs from 'fs/promises';
import path from 'path';

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // خواندن فایل JSON لغات پیش‌فرض
    const wordsPath = path.join(process.cwd(), 'public', 'default-words.json');
    const fileContent = await fs.readFile(wordsPath, 'utf-8');
    const defaultWords = JSON.parse(fileContent);

    // افزودن لغات به دیتابیس برای کاربر فعلی
    // createMany کارآمدتر از حلقه و create است
    const result = await prisma.word.createMany({
      data: defaultWords.map((word: { term: string; definition: string }) => ({
        term: word.term,
        definition: word.definition,
        userId: session.user.id,
      })),
      skipDuplicates: true, // از افزودن لغات تکراری جلوگیری می‌کند
    });

    return NextResponse.json({ message: "Default words added successfully!", count: result.count });

  } catch (error) {
    console.error("Failed to load default words:", error);
    return NextResponse.json({ error: "Failed to load default words" }, { status: 500 });
  }
}