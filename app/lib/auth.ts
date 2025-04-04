import jwt from "jsonwebtoken";
import { config } from "dotenv";
import bcryptjs from "bcryptjs";
import RefreshToken from "@/models/refreshToken";
import { NextRequest, NextResponse } from "next/server.js";

config();

interface IUser {
  id: string;
  role: string;
}

declare module "next/server" {
  interface NextRequest {
    user?: IUser;
  }
}

interface authenticate {
  req: NextRequest;
  res: NextResponse;
  next: () => void;
}

export const generateAccessToken = (user: IUser) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.SECRET_ACCESS_TOKEN as string,
    {
      expiresIn: "1d",
    }
  );
};

export const generateRefreshToken = async (user: IUser) => {
  const refreshToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.SECRET_REFRESH_TOKEN as string,
    { expiresIn: "7d" }
  );
  const hashedToken = await bcryptjs.hash(refreshToken, 10);

  await RefreshToken.create({
    tokenHash: hashedToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
    userId: user.id,
  });

  return refreshToken;
};

export const authenticate = ({ req }: authenticate) => {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.SECRET_ACCESS_TOKEN as string
    );
    req.user = decoded as IUser;
    NextResponse.next();
  } catch (error) {
    console.error(error);
    NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
};

interface authorizeRole {
  role: string;
}

export const authorizeRole = ({ role }: authorizeRole) => {
  return (req: NextRequest) => {
    const userRole = (req as NextRequest).user?.role;

    if (userRole !== role) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.next();
  };
};
