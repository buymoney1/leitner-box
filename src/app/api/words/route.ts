import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // مطمئن شوید از این مسیر استفاده می‌کنید
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { term, definition } = await req.json();

    if (!term || !definition) {
      return NextResponse.json({ error: "Term and definition are required." }, { status: 400 });
    }

    const newWord = await prisma.word.create({
      data: {
        term,
        definition,
        userId: session.user.id, // حالا این مقدار باید به درستی پر شود
      },
    });

    return NextResponse.json(newWord, { status: 201 });

  } catch (error: any) {
    console.error("Error creating word:", error); // خطای واقعی در ترمینال شما نمایش داده می‌شود
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// ... تابع GET اگر نیاز دارید ...