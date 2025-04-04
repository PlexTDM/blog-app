"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export const GoogleSignInButton = () => {
  return (
    <button
      onClick={() => signIn("google")}
      className="w-full cursor-pointer flex items-center justify-center gap-2 text-gray-300 font-medium py-2 px-4 border border-gray-400 rounded-md shadow-sm hover:brightness-125 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <FcGoogle className="w-5 h-5" />
      Continue with Google
    </button>
  );
};

export default GoogleSignInButton;
