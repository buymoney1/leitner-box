'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      router.push("/login?message=ثبت‌نام موفق بود. لطفا وارد شوید.");
    } else {
      const data = await res.json();
      setError(data.error || "خطایی در ثبت‌نام رخ داد.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg w-96">
        <h3 className="text-2xl font-bold text-center text-gray-800">ثبت‌نام</h3>
        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block" htmlFor="name">نام</label>
            <input
              type="text"
              id="name"
              placeholder="نام خود را وارد کنید"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-600"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block" htmlFor="email">ایمیل</label>
            <input
              type="email"
              id="email"
              placeholder="ایمیل خود را وارد کنید"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block" htmlFor="password">رمز عبور</label>
            <input
              type="password"
              id="password"
              placeholder="رمز عبور خود را وارد کنید"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button type="submit" className="w-full px-4 py-2 mt-4 text-white bg-green-600 rounded-lg hover:bg-green-700">
              ثبت‌نام
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-gray-600">
          قبلا ثبت‌نام کرده‌اید؟ <a href="/login" className="text-indigo-600 hover:underline">وارد شوید</a>
        </p>
      </div>
    </div>
  );
}