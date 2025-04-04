"use client";
import { Avatar, Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { addComment } from "@/app/lib/data";

const AddComment = ({ blogId }: { blogId: string }) => {
  const { data: session } = useSession();
  const [newComment, setNewComment] = useState("");
  const [sending, setSending] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await addComment(blogId, newComment);
    setNewComment("");
    setSending(false);
  };
  if (!session) {
    return (
      <div>
        <p className="text-red-500">You must be logged in to comment</p>
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <div className="flex items-start mb-4 gap-4">
        <Avatar
          src={session?.user?.image as string}
          alt={session?.user?.firstName}
          sx={{ width: 50, height: 50 }}
          className="mt-1"
        />
        <TextField
          label="Leave a comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          fullWidth
          multiline
          maxRows={5}
          margin="normal"
          required
          sx={{ my: 0 }}
        />
        <Button
          disabled={sending}
          type="submit"
          variant="contained"
          size="large"
          sx={{ mt: 1 }}
        >
          Post
        </Button>
      </div>
    </form>
  );
};

export default AddComment;
