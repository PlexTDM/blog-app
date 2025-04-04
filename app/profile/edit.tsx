"use client";
import { TextField } from "@mui/material";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { UpdateProfile } from "../lib/data";
import EditProfilePicture from "../ui/editPFP";

const Edit = () => {
  const { data: session, update } = useSession();
  const [isUpdating, setIsUpdating] = useState(false);
  const [canUpdate, setCanUpdate] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  const initialState = {
    firstName: session?.user?.firstName || "",
    lastName: session?.user?.lastName || "",
    email: session?.user?.email || "",
    phone: session?.user?.phone || "",
    image: session?.user?.image || "",
    profilePicture: null as File | null,
  };
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    image: string;
    profilePicture: File | null;
  }>(initialState);

  useEffect(() => {
    setFormData({
      firstName: session?.user?.firstName || "",
      lastName: session?.user?.lastName || "",
      email: session?.user?.email || "",
      phone: session?.user?.phone || "",
      image: session?.user?.image || "",
      profilePicture: null,
    });
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      setSelectedImage(URL.createObjectURL(files[0]));
      setShowCropper(true);
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (formData === initialState) {
      setCanUpdate(false);
    } else {
      setCanUpdate(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    const updatedUser = await UpdateProfile(formData);

    if (updatedUser) {
      await update({
        ...session?.user,
        ...updatedUser,
      });
    }

    setIsUpdating(false);
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
        <EditProfilePicture
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          formData={formData}
          setFormData={setFormData}
          showCropper={showCropper}
          setShowCropper={setShowCropper}
          handleChange={handleChange}
        />
        <div className="space-y-4 flex flex-col gap-6">
          <TextField
            type="text"
            id="firstName"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          <TextField
            type="text"
            id="lastName"
            label="Last Name"
            name="lastName"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={formData.lastName}
            onChange={handleChange}
          />
          <TextField
            type="email"
            id="email"
            label="Email"
            name="email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            type="tel"
            id="phone"
            label="Phone"
            name="phone"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          disabled={isUpdating || !canUpdate}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isUpdating ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default Edit;
