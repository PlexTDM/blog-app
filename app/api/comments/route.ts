import Comment, { IComment } from "@/models/comment";
import { connectDB } from "@/app/lib/mongodb";
import Blog from "@/models/blog";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export const POST = async (req: NextRequest) => {
  try {
    const { content, blogId } = await req.json();

    if (!content?.trim() || !blogId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to comment" },
        { status: 401 }
      );
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: "User account not found" },
        { status: 404 }
      );
    }
    const blogExists = await Blog.exists({ _id: blogId });
    if (!blogExists) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const comment = await Comment.create({
      content,
      blogId,
      author: user._id,
    });

    await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { comments: comment._id },
      },
      { new: true }
    );

    revalidatePath(`/blogs/${blogId}`);
    revalidatePath(`/blogs`);

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const blogId = req.nextUrl.searchParams.get("blogId");
    if (!blogId) {
      return NextResponse.json({ error: "Specify blog id" }, { status: 400 });
    }
    await connectDB();
    const comments = (await Comment.find({ blogId: blogId })
      .populate({
        path: "author",
        select: "firstName lastName profilePicture",
        options: {
          lean: true,
          limit: 10,
        },
      })
      .sort({
        createdAt: -1,
      })
      .lean()) as unknown as IComment[] | null;

    if (!comments) {
      return NextResponse.json([], { status: 404 });
    }

    return NextResponse.json(comments, { status: 200 });
  } catch (err) {
    console.log("get comments", err);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 }
    );
  }
};
export interface ICommentWithAuthor {
  _id: string;
  content: string;
  edited: boolean;
  blogId: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    firstName: string;
    lastName: string;
    profilePicture: string;
  };
}
