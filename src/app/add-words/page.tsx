'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AddWordsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [term, setTerm] = useState("");
  const [definition, setDefinition] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // اگر کاربر لاگین نکرده، به صفحه ورود بفرست
  if (status === "loading") return <p>Loading...</p>;
  if (!session) {
    router.push("/login");
    return null;
  }

  // تابع برای افزودن یک لغت جدید
  const handleAddWord = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const res = await fetch("/api/words", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ term, definition }),
    });

    if (res.ok) {
      setMessage("لغت با موفقیت اضافه شد!");
      setTerm("");
      setDefinition("");
    } else {
      setMessage("خطایی در افزودن لغت رخ داد.");
    }
    setIsLoading(false);
  };

  // تابع برای افزودن کتاب پیش‌فرض
  const handleLoadDefaultWords = async () => {
    setIsLoading(true);
    setMessage("");

    const res = await fetch("/api/load-default-words", {
      method: "POST",
    });

    const data = await res.json();

    if (res.ok) {
      setMessage(`${data.count} لغت از کتاب پیش‌فرض اضافه شد!`);
    } else {
      setMessage(data.error || "خطایی در افزودن لغات پیش‌فرض رخ داد.");
    }
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">افزودن لغات جدید</h1>

        {/* بخش افزودن کتاب پیش‌فرض */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">افزودن کتاب پیش‌فرض</h2>
          <p className="text-gray-600 mb-4">
            با کلیک روی دکمه زیر، ۱۰ لغت پایه به جعبه لایتنر شما اضافه می‌شود.
          </p>
          <button
            onClick={handleLoadDefaultWords}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300 disabled:bg-gray-400"
          >
            {isLoading ? "در حال انجام..." : "افزودن لغات پیش‌فرض"}
          </button>
        </div>

        <div className="text-center text-gray-500 text-2xl my-6">یا</div>

        {/* بخش افزودن لغت دستی */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">افزودن لغت دستی</h2>
          <form onSubmit={handleAddWord} className="space-y-4">
            <div>
              <label htmlFor="term" className="block text-sm font-medium text-gray-700">لغت (مثلاً: Apple)</label>
              <input
                type="text"
                id="term"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="definition" className="block text-sm font-medium text-gray-700">معنی (مثلاً: سیب)</label>
              <textarea
                id="definition"
                value={definition}
                onChange={(e) => setDefinition(e.target.value)}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 disabled:bg-gray-400"
            >
              {isLoading ? "در حال افزودن..." : "افزودن لغت"}
            </button>
          </form>
        </div>

        {/* نمایش پیام به کاربر */}
        {message && (
          <div className={`mt-6 p-4 rounded-lg text-center ${message.includes("خطا") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {message}
          </div>
        )}

        <div className="mt-8 text-center">
          <a href="/dashboard" className="text-indigo-600 hover:underline">
            بازگشت به داشبورد
          </a>
        </div>
      </div>
    </main>
  );
}