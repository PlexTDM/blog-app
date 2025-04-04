"use client";
import React from "react";
import { withAuth } from "@/app/utils/adminOnly";

const ProfileAdmin = () => {
  return <div>Admin only panel</div>;
};

export default withAuth(ProfileAdmin);
