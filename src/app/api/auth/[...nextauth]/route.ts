import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // <-- از فایل جدید وارد می‌کنیم

const handler = NextAuth(authOptions); // <-- از authOptions استفاده می‌کنیم

export { handler as GET, handler as POST, authOptions };