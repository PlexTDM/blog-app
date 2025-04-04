"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Edit from "./edit";
import Profile from "./profile";
import { withLoggedIn } from "../utils/loggedIn";

const ProfilePage = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("profile");

  const Tab = ({ name }: { name: string }) => {
    return (
      <button
        className={`px-6 font-bold py-3 text-sm capitalize duration-100 border-b-2 ${
          activeTab === name
            ? "border-blue-500 text-blue-600"
            : "text-gray-500 hover:text-gray-400 border-transparent"
        }`}
        onClick={() => setActiveTab(name)}
      >
        {name}
      </button>
    );
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto rounded-lg shadow">
        <div className="flex border-b">
          <Tab name="profile" />
          <Tab name="edit" />
        </div>

        {activeTab === "profile" ? (
          <Profile session={session} />
        ) : activeTab === "edit" ? (
          <Edit />
        ) : null}
      </div>
    </div>
  );
};

export default withLoggedIn(ProfilePage);
