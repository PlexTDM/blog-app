import { Skeleton } from "@mui/material";
import React from "react";

const BlogsSkeleton = () => {
  return (
    <div className="py-4 w-full">
      <Skeleton
        variant="rectangular"
        width="100%"
        height={300}
        sx={{ mb: 3 }}
      />
      <Skeleton variant="text" width="80%" height={60} sx={{ mb: 2 }} />
      <Skeleton variant="text" width="60%" height={30} sx={{ mb: 4 }} />
      {[...Array(5)].map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width="100%"
          height={20}
          sx={{ mb: 1 }}
        />
      ))}
    </div>
  );
};

export default BlogsSkeleton;
