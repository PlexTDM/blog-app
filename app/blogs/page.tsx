import React, { Suspense } from "react";
import { getBlogs } from "../lib/data";
import { IBlog } from "@/models/blog";
import { Typography } from "@mui/material";
import Link from "next/link";

const BlogsWrapper = async () => {
  const blogs = await getBlogs();
  console.log(blogs);
  if (blogs.length === 0) {
    return <div>no blogs</div>;
  }
  return (
    <div>
      {blogs.map((blog: IBlog) => {
        return (
          <Link
            href={`/blogs/${blog._id}`}
            key={blog._id.toString()}
            className="cursor-pointer"
          >
            <h1 className="text-lg text-slate-100">{blog.title}</h1>
            <p className="text-gray-300">{blog.views} Views</p>
            {/* <p className="truncate">{blog.description.slice(0, 100)}</p> */}
          </Link>
        );
      })}
    </div>
  );
};

const Blogs = () => {
  return (
    <div className="container mx-auto my-10 px-4 flex items-center flex-col gap-4">
      <Typography variant="h4">Blogs</Typography>
      <Suspense fallback={<div>Loading...</div>}>
        <BlogsWrapper />
      </Suspense>
    </div>
  );
};

export default Blogs;
