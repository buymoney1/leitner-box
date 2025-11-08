'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddWordsPage() {
  const router = useRouter();
  const [wordList, setWordList] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddWords = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wordList.trim()) {
      setMessage("لطفاً حداقل یک کلمه وارد کنید.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    const lines = wordList.split('\n');
    const wordsToAdd: { term: string; definition: string }[] = [];
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine) {
        const parts = trimmedLine.split(':');
        if (parts.length === 2) {
          wordsToAdd.push({
            term: parts[0].trim(),
            definition: parts[1].trim(),
          });
        }
      }
    }

    if (wordsToAdd.length === 0) {
      setMessage("هیچ کلمه معتبری پیدا نشد. لطفاً از فرمت 'کلمه: معنی' استفاده کنید.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/add-word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ words: wordsToAdd }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`${data.count} لغت با موفقیت اضافه شد!`);
        setWordList("");
      } else {
        setMessage(data.error || "خطایی در افزودن لغات رخ داد.");
      }
    } catch (error) {
      setMessage("خطا در ارتباط با سرور.");
    }
    
    setIsLoading(false);
  };

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

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">افزودن لیست کلمات</h2>
          <p className="text-gray-600 mb-4">
            هر کلمه را در یک خط به فرمت <code className="bg-gray-200 px-1 rounded">کلمه: معنی</code> وارد کنید.
          </p>
          <form onSubmit={handleAddWords} className="space-y-4">
            <div>
              <label htmlFor="wordList" className="block text-sm font-medium text-gray-700">لیست کلمات</label>
              <textarea
                id="wordList"
                value={wordList}
                onChange={(e) => setWordList(e.target.value)}
                rows={10}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                placeholder="Apple: سیب&#10;Book: کتاب&#10;Water: آب"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 disabled:bg-gray-400"
            >
              {isLoading ? "در حال افزودن..." : "افزودن لیست کلمات"}
            </button>
          </form>
        </div>

        {message && (
          <div className={`mt-6 p-4 rounded-lg text-center ${message.includes("خطا") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {message}
          </div>
        )}

        <div className="mt-8 text-center">
          <button onClick={() => router.back()} className="text-indigo-600 hover:underline">
            بازگشت به صفحه قبلی
          </button>
        </div>
      </div>
    </main>
  );
}