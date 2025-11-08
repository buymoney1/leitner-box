// src/app/layout.tsx

import { Vazirmatn } from 'next/font/google'
import "./globals.css"; // این خط باید حتما وجود داشته باشد
import Providers from "@/components/providers";

// تعریف فونت وزیرمتن با تنظیمات کامل
const vazirmatn = Vazirmatn({
  subsets: ['arabic'], // برای زبان‌های فارسی و عربی
  weight: ['400', '500', '700'], // وزن‌های مورد نیاز
  variable: '--font-vazirmatn', // متغیر CSS
  display: 'swap', // برای بهینه‌سازی بارگذاری
});

export const metadata = {
  title: "جعبه لایتنر",
  description: "یادگیری لغات با سیستم جعبه لایتنر",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable}`}>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}