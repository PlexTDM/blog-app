import NextAuth, { NextAuthOptions } from "next-auth";
import Users, { IUser } from "@/models/user";

declare module "next-auth" {
  interface User {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string | null;
    phone?: string;
    role?: string;
    profilePicture?: string | null;
  }
}
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/app/lib/mongodb";

declare module "next-auth" {
  interface Session {
    user: {
      email?: string | null;
      image?: string | null;
      id?: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
      role?: string;
    };
  }
}

type GoogleProfile = {
  email: string;
  given_name: string;
  family_name?: string;
  picture?: string;
};

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = credentials as {
            email: string;
            password: string;
          };

          if (!email || !password) {
            throw new Error("Please fill in all fields");
          }

          const res = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          if (!res.ok) {
            const temp = await res.json();
            throw new Error(temp.error || "An unknown error occurred");
          }

          const user = await res.json();

          if (!user) {
            throw new Error("User not found");
          }
          return user;
        } catch (err) {
          throw new Error(
            err instanceof Error ? err.message : "An unknown error occurred"
          );
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET as string,
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      const callbackUrl = new URLSearchParams(new URL(url, baseUrl).search).get(
        "callbackUrl"
      );

      if (callbackUrl) {
        return callbackUrl;
      }
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string | undefined;
        session.user.firstName = token.firstName as string | undefined;
        session.user.lastName = token.lastName as string | undefined;
        session.user.email = token.email as string | undefined;
        session.user.phone = token.phone as string | undefined;
        session.user.role = token.role as string | undefined;
        session.user.image = token.image as string | undefined;
      }
      return session;
    },
    async jwt({ token, user, account, profile, trigger, session }) {
      // 1. Initial sign-in (user just logged in)
      if (user && account) {
        if (account.provider === "google" && profile) {
          const googleProfile = profile as GoogleProfile;
          await connectDB();
          const existingUser = await Users.findOne({ email: profile.email });

          if (!existingUser) {
            console.log("creating user via google");
            const newUser: IUser = await Users.create({
              email: googleProfile.email,
              firstName: googleProfile.given_name,
              lastName: googleProfile.family_name,
              profilePicture: googleProfile.picture,
              providers: ["google"],
            });

            token.id = newUser._id;
            token.email = googleProfile.email;
            token.firstName = newUser.firstName;
            token.lastName = newUser.lastName;
            token.phone = newUser.phone;
            token.role = newUser.role;
            token.image = newUser.profilePicture;
          } else {
            if (!existingUser.providers.includes("google")) {
              existingUser.providers.push("google");
              await existingUser.save();
            }
            token.id = existingUser._id;
            token.email = existingUser.email;
            token.firstName = existingUser.firstName;
            token.lastName = existingUser.lastName;
            token.phone = existingUser.phone;
            token.image = existingUser.profilePicture;
          }
        }
        if (account.provider === "credentials" && user) {
          token.id = user._id;
          token.firstName = user.firstName;
          token.lastName = user.lastName;
          token.email = user.email;
          token.phone = user.phone;
          token.role = user.role;
          token.image = user.profilePicture;
        }
      }

      if (trigger === "update" && session) {
        token.id = session.user._id;
        token.email = session.user.email;
        token.image = session.user.profilePicture;
        token.firstName = session.user.firstName;
        token.lastName = session.user.lastName;
        token.phone = session.user.phone;
        token.role = session.user.role;
      }

      return token;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
    updateAge: 60 * 60, // 1 hour
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
