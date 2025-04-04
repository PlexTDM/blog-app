import Comment, { IComment } from "@/models/comment";
import { connectDB } from "@/app/lib/mongodb";
import Blog from "@/models/blog";
import { NextRequest, NextResponse } from "next/server";
import User, { IUser } from "@/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export const POST = async (req: NextRequest) => {
  try {
    const { content, blogId } = await req.json();

    if (!content || !blogId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "You must be logged in to comment" },
        { status: 401 }
      );
    }
    const comment = new Comment({
      content,
      author: session.user.id,
      blogId,
    });

    await comment.save();

    // Add comment to blog's comments array
    await Blog.findByIdAndUpdate(blogId, {
      $push: { comments: comment._id },
    });

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
      .sort({
        createdAt: -1,
      })
      .lean()) as unknown as IComment[] | null;

    if (!comments) {
      return NextResponse.json([], { status: 404 });
    }

    const commentsWithAuthor = await Promise.all(
      comments.map(async (comment) => {
        const author = (await User.findById(
          comment.author
        ).lean()) as IUser | null;
        if (!author) {
          return {
            ...comment,
            authorDetails: {
              firstName: "anonymous",
            },
          };
        }
        return {
          ...comment,
          authorDetails: {
            firstName: author.firstName,
            lastName: author.lastName,
            profilePicture: author.profilePicture,
          },
        };
      })
    );

    return NextResponse.json(commentsWithAuthor, { status: 200 });
  } catch (err) {
    console.log("get comments", err);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 }
    );
  }
};
export interface ICommentWithAuthor extends IComment {
  authorDetails: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture: string;
  };
}
