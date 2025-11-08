"use client"; // این خط کلیدی است! این کامپوننت را به یک کلاینت کامپوننت تبدیل می‌کند.

import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}