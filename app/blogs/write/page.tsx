"use client";
import { Button, TextField, Typography } from "@mui/material";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { Editor as TinyMCEEditor } from "tinymce";
import { useSession } from "next-auth/react";
import { withAuth } from "@/app/utils/adminOnly";
import { toast } from "react-toastify";

const Editor = dynamic(() => import("./editor"), {
  ssr: false,
});

const WriteBlog = () => {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    if (!editorRef.current) return;
    await editorRef.current.uploadImages();

    const res = await fetch("/api/blog", {
      method: "POST",
      body: JSON.stringify({
        title: title,
        author: session?.user.id,

        content: editorRef.current.getContent(),
      }),
    });
    const data = await res.json();
    toast.success("Blog published successfully");
    console.log(data);
  };

  return (
    <div className="container mx-auto mt-20 flex flex-col gap-4">
      <Typography variant="h3" textAlign={"center"}>
        Write a blog
      </Typography>
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        variant="outlined"
        fullWidth
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        variant="outlined"
        fullWidth
      />
      <Editor initialValue="" editorRef={editorRef} />
      <div className="flex justify-end">
        <Button variant="contained" onClick={handleSubmit}>
          Publish
        </Button>
      </div>
    </div>
  );
};

export default withAuth(WriteBlog);
