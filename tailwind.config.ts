// tailwind.config.js

import type { Config } from "tailwindcss";

const config: Config = {
  // این بخش بسیار مهم است. باید تمام مسیرهای فایل‌های شما را پوشش دهد.
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // اتصال فونت پیش‌فرض به Vazirmatn
      fontFamily: {
        sans: ['var(--font-vazirmatn)', 'sans-serif'],
      },
      // انیمیشن‌های سفارشی شما
      keyframes: {
        "rotate-y": {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(180deg)" },
        },
      },
      animation: {
        "rotate-y-180": "rotate-y 0.6s ease-in-out forwards",
      },
    },
  },
  plugins: [],
  // این خط برای پشتیبانی از راست‌چین است. فعلاً آن را نگه دارید.
  corePlugins: {
    preflight: false,
  },
};

export default config;