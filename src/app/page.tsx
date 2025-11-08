'use client';

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 text-center p-8">
      <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-2xl max-w-2xl w-full">
        <h1 className="text-6xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
          جعبه لایتنر
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          با سیستم هوشمند تکرار فاصله‌دار، لغات جدید را به صورت ماندگار و عمیق یاد بگیرید.
        </p>
        
        {session ? (
          <p className="text-lg text-green-600 font-semibold">در حال انتقال به داشبورد...</p>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => signIn()}
              className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              ورود به حساب کاربری
            </button>
            <Link
              href="/register"
              className="block w-full px-8 py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              ساخت حساب جدید
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}