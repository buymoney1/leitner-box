import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import LeitnerBox from "@/components/LeitnerBox";
import Link from "next/link";

async function updateWordBox(wordId: string, isCorrect: boolean) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session) return;
  const word = await prisma.word.findFirst({ where: { id: wordId, userId: session.user.id } });
  if (!word) return;
  let newBoxNumber = isCorrect ? Math.min(word.boxNumber + 1, 5) : 1;
  await prisma.word.update({ where: { id: wordId }, data: { boxNumber: newBoxNumber, lastReviewed: new Date() } });
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const words = await prisma.word.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "asc" } });

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">داشبورد شما، {session.user?.name}</h1>
          <Link href="/add-words" className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300">
            افزودن لغات جدید
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {words.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-3xl font-bold text-gray-700 dark:text-gray-200 mb-4">هنوز لغتی اضافه نکرده‌اید!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">برای شروع، از کتاب‌های پیش‌فرض استفاده کنید یا لغات جدیدی وارد کنید.</p>
            <Link href="/add-words" className="inline-block px-8 py-3 bg-green-600 text-white font-bold text-lg rounded-full shadow-lg hover:bg-green-700 transition duration-300">
              شروع کنید
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((num) => (
              <LeitnerBox key={num} boxNumber={num} words={words} onAnswer={updateWordBox} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}