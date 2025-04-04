import { connectDB } from "@/app/lib/mongodb";
import User, { IUser } from "@/models/user";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  await connectDB();

  try {
    const { email, password } = (await req.json()) as {
      email: string;
      password: string;
    };

    if (!email || !password) {
      return NextResponse.json(
        { error: "Please fill in all fields" },
        { status: 400 }
      );
    }

    const user: IUser | null = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.providers?.includes("credentials")) {
      return NextResponse.json(
        { error: "This account was registered with Google. Use Google login." },
        { status: 403 }
      );
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    console.error("loginerror", err);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
