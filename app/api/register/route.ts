import { connectDB } from "@/app/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { generateAccessToken, generateRefreshToken } from "@/app/lib/auth";
import { stripBody, validateSignup } from "@/app/utils/validators";

// type reqProps = {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   password: string;
//   confirmPassword: string;
// };

export const POST = async (req: NextRequest) => {
  await connectDB();

  const body = await req.json();

  const validationError = validateSignup(body);
  if (validationError) {
    return validationError;
  }

  const { firstName, lastName, email, phone, password } = stripBody(body);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (
      await User.findOne({ email }).select("+password").lean().session(session)
    ) {
      await session.abortTransaction();
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create(
      [
        {
          firstName,
          lastName,
          email,
          phone,
          password: hashedPassword,
          providers: ["credentials"],
        },
      ],
      { session }
    );

    const accessToken = generateAccessToken(newUser[0]);
    const refreshToken = await generateRefreshToken(newUser[0]);

    await session.commitTransaction();

    const res = NextResponse.json(
      {
        message: "User registered successfully",
        data: {
          id: newUser[0].id,
          name: newUser[0].name,
          email: newUser[0].email,
          phone: newUser[0].phone,
          profilePicture: newUser[0].profilePicture,
        },
      },
      { status: 201 }
    );

    res.cookies
      .set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 day
        sameSite: "strict",
        path: "/",
      })
      .set("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 15, // 15 minutes (short-lived)
        sameSite: "strict",
        path: "/",
      });

    return res;
  } catch (err) {
    if (err) {
      await session.abortTransaction();
      console.error("registerError", err);
      return NextResponse.json(
        { error: "Failed to register user" },
        { status: 500 }
      );
    }
  } finally {
    session.endSession();
  }
};
