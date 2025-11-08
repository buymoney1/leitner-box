'use client';

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError("ایمیل یا رمز عبور اشتباه است.");
    } else {
      router.push(callbackUrl);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg w-96">
        <h3 className="text-2xl font-bold text-center text-gray-800">ورود به حساب کاربری</h3>
        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
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
            <button type="submit" className="w-full px-4 py-2 mt-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-900">
              ورود
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-gray-600">
          حساب کاربری ندارید؟ <a href="/register" className="text-indigo-600 hover:underline">ثبت‌نام کنید</a>
        </p>
      </div>
    </div>
  );
}