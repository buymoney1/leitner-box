import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "ایمیل", type: "email" },
        password: { label: "رمز عبور", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) return null;

        return {
          id: user.id, // مطمئن شوید id کاربر برگردانده می‌شود
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  // --- این بخش کلیدی است ---
  callbacks: {
    async jwt({ token, user }) {
      // هنگام ورود، شیء user موجود است. ما id کاربر را به توکن اضافه می‌کنیم.
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // شیء token حاوی id است. ما آن را به session.user اضافه می‌کنیم.
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  // --- پایان بخش کلیدی ---
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};