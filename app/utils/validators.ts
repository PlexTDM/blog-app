import { NextResponse } from "next/server";

interface SignupData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

export const validateSignup = (data: SignupData) => {
  const { firstName, email, password, confirmPassword } = data;

  if (
    !firstName?.trim() ||
    !email?.trim() ||
    !password?.trim() ||
    !confirmPassword?.trim()
  ) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  if (password !== confirmPassword) {
    return NextResponse.json(
      { error: "Passwords do not match" },
      { status: 400 }
    );
  }

  return null;
};

export const stripBody = <T extends Record<string, unknown>>(body: T): T => {
  const stripped: Partial<T> = {};

  for (const key in body) {
    const value = body[key];
    stripped[key] = (
      typeof value === "string" ? value.trim() : value
    ) as T[typeof key];
  }

  return stripped as T;
};
