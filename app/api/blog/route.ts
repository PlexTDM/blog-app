import connectDB from "@/app/lib/mongodb";
import Blogs from "@/models/blog";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const body = await req.json();
    await Blogs.create(body);
    return NextResponse.json(
      { message: "Blogs added successfully" },
      { status: 201 }
    );
  } catch (err) {
    console.log("add Blogs", err);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 }
    );
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const id = req.nextUrl.searchParams.get("id");
    await connectDB();
    if (id) {
      const blogs = await Blogs.findByIdAndUpdate(
        id,
        { $inc: { views: 1 } },
        {
          new: true,
        }
      );
      if (!blogs) {
        return NextResponse.json({ error: "Blogs not found" }, { status: 404 });
      }

      return NextResponse.json({ blogs }, { status: 200 });
    }
    const blogs = await Blogs.find();
    return NextResponse.json({ blogs }, { status: 200 });
  } catch (err) {
    console.log("get Blogs", err);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 }
    );
  }
};
