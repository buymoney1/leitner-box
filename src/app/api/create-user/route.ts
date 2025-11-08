// src/app/api/create-user/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEFAULT_USER_ID } from '@/lib/user'; // <-- وارد کردن

export async function POST() {
  try {
    // ابتدا بررسی کن که آیا کاربر از قبل وجود دارد
    const existingUser = await prisma.user.findUnique({
      where: { id: DEFAULT_USER_ID },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists.', user: existingUser });
    }

    const user = await prisma.user.create({
      data: {
        id: DEFAULT_USER_ID, // id را به صورت دستی تنظیم می‌کنیم
        email: 'default@leitner-app.com',
      },
    });

    return NextResponse.json({ message: 'User created successfully.', user });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}