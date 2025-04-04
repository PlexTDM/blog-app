import { Mail, Phone, User } from "lucide-react";
import { Session } from "next-auth";
import Image from "next/image";
import React from "react";

const Profile = ({ session }: { session: Session | null }) => {
  return (
    <div className="p-6 space-y-6">
      <div className="relative flex flex-col items-center space-y-4">
        <Image
          src={session?.user?.image || "/pfp.png"}
          className="rounded-full overflow-hidden"
          alt="Profile Picture"
          width={100}
          height={100}
          sizes="100%"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <User className="h-5 w-5 text-gray-100" />
          <div>
            <p className="text-sm font-medium text-gray-300">Name</p>
            <p className="text-sm text-gray-100">
              {session?.user?.firstName}{" "}
              {session?.user?.lastName && session?.user?.lastName}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Mail className="h-5 w-5 text-gray-100" />
          <div>
            <p className="text-sm font-medium text-gray-300">Email</p>
            <p className="text-sm text-gray-100">{session?.user?.email}</p>
          </div>
        </div>

        {session?.user?.phone && (
          <div className="flex items-center space-x-4">
            <Phone className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-300">Phone</p>
              <p className="text-sm text-gray-100">{session?.user?.phone}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
