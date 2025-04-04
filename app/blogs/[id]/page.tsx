import LoadingSkeleton from "@/app/ui/skeleton/blogsSkeleton";
import { Divider, Paper, Typography } from "@mui/material";
import { getBlogs } from "@/app/lib/data";
import { IBlog } from "@/models/blog";
import { Box } from "@mui/material";
import React, { Suspense } from "react";
import { format } from "date-fns";
import CommentSection from "@/components/comment";

interface Props {
  params: {
    id: string;
  };
}

const BlowWrapper = async ({ id }: { id: string }) => {
  const blog: IBlog = await getBlogs(id);
  return (
    <div className="container mx-auto w-full h-screen">
      <Paper
        elevation={0}
        className="flex grow flex-col"
        sx={{ p: { xs: 2, md: 4 }, mb: 4, w: "100%", h: "100%" }}
      >
        {/* Title */}
        <Typography
          variant="h3"
          component="h1"
          sx={{
            mb: 2,
            fontWeight: 700,
            fontSize: { xs: "2rem", md: "2.5rem" },
          }}
        >
          {blog.title}
        </Typography>

        {/* Meta Information */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 3,
            flexWrap: "wrap",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            By {blog.author}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {format(new Date(blog.createdAt), "MMMM dd, yyyy")}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {blog.views} views
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Blog Content */}
        <Box
          sx={{
            "& img": {
              maxWidth: "100%",
              height: "auto",
              borderRadius: 1,
              my: 2,
            },
            "& .image-left": {
              float: "left",
              margin: "0 1rem 1rem 0",
              maxWidth: "50%",
            },
            "& .image-right": {
              float: "right",
              margin: "0 0 1rem 1rem",
              maxWidth: "50%",
            },
          }}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </Paper>
    </div>
  );
};

const SingleBlog = async ({ params }: Props) => {
  const { id } = await params;
  return (
    <article className="container mx-auto my-10">
      <Suspense fallback={<LoadingSkeleton />}>
        <BlowWrapper id={id} />
      </Suspense>
      <Suspense>
        <CommentSection blogId={id} />
      </Suspense>
    </article>
  );
};

export default SingleBlog;
