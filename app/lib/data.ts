import { toast } from "react-toastify";
import { User } from "next-auth";

declare module "next-auth" {
  interface Session {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    role?: string;
    image?: string;
  }
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
  confirmPassword?: string;
  image: string;
  profilePicture: File | null;
}

export const UpdateProfile = async (formData: FormData) => {
  try {
    console.log("niiggaa", formData.profilePicture);
    const newData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      image: formData.profilePicture
        ? await convertFileToBase64(formData.profilePicture)
        : null,
    };

    const res = await fetch("/api/user/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newData),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error);
    }
    toast.success("Profile updated successfully");
    return (await res.json()) as User;
  } catch (err) {
    toast.error("Error updating profile");
    console.log(err);
  }
};

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const getBlogs = async (id?: string) => {
  try {
    const url = id
      ? `${process.env.URL}/api/blog?id=${id}`
      : `${process.env.URL}/api/blog`;
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error);
    }
    const { blogs } = await res.json();
    return blogs;
  } catch (err) {
    console.log(err);
  }
};

export const getComments = async (id: string) => {
  try {
    const res = await fetch(`${process.env.URL}/api/comments?blogId=${id}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error);
    }
    const comments = await res.json();
    return comments;
  } catch (err) {
    console.log(err);
  }
};

export const addComment = async (blogId: string, newComment: string) => {
  try {
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: newComment,
        // author: session?.user?.id,
        blogId,
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error);
    }
    // const { comment } = await res.json();
    toast.success("Comment added successfully");
  } catch (err) {
    console.log(err);
    toast.error("Error adding comment");
  }
};
