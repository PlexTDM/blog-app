import { backendClient } from "@/app/lib/edgestore-server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    console.log("image upload req get wtf");
    const formData = await req.formData();
    const image = formData.get("image") as File;
    const extension = formData.get("extension") as string;
    if (!image || !extension) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const uploadedFile = await backendClient.publicImages.upload({
      content: {
        blob: image,
        extension: extension,
      },
    });
    console.log(uploadedFile.url);
    return NextResponse.json({ url: uploadedFile.url });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 }
    );
  }
};
