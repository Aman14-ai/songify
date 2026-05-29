import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { connectDB } from "@/lib/db";
import User from "@/models/User";

function getRoleByEmail(email?: string | null) {
  if (!email) return "user";

  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((item) =>
    item.trim().toLowerCase()
  );

  if (adminEmails?.includes(email.toLowerCase())) {
    return "admin";
  }

  return "user";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      try {
        await connectDB();

        if (!user.email) {
          return false;
        }

        const role = getRoleByEmail(user.email);

        await User.findOneAndUpdate(
          { email: user.email.toLowerCase() },
          {
            name: user.name || "",
            email: user.email.toLowerCase(),
            image: user.image || "",
            role,
            provider: "google",
          },
          {
            upsert: true,
            new: true,
          }
        );

        return true;
      } catch (error) {
        console.error("Google sign in error:", error);
        return false;
      }
    },

    async jwt({ token }) {
      if (token.email) {
        await connectDB();

        const dbUser = await User.findOne({
          email: token.email.toLowerCase(),
        });

        if (dbUser) {
          token.id = String(dbUser._id);
          token.role = dbUser.role;
          token.picture = dbUser.image;
        } else {
          token.role = getRoleByEmail(token.email);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "admin" | "user";
      }

      return session;
    },
  },
});