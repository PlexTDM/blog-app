import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/app/lib/mongodb";
import User from "@/models/user";
import { backendClient } from "@/app/lib/edgestore-server";

export async function PUT(req: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { image, ...rest } = body;

  const updateFields = Object.fromEntries(
    Object.entries(rest).filter(
      ([, value]) => value !== undefined && value !== null
    )
  );

  try {
    if (image) {
      const uploadedFile = await backendClient.publicImages.upload({
        content: {
          blob: new Blob([Buffer.from(image.split(",")[1], "base64")], {
            type: "image/png",
          }),
          extension: "png",
        },
        options: { replaceTargetUrl: session.user.image as string },
      });
      updateFields.profilePicture = uploadedFile.url;
    }
    console.log(updateFields);

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        $set: updateFields,
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}
