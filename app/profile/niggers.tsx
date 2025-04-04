import { useSession } from "next-auth/react";
import Image from "next/image";

const ProfilePage = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  if (!session) {
    return (
      <p className="text-center mt-10">
        You must be signed in to view this page.
      </p>
    );
  }

  const { firstName, lastName, email, phone, image } = session.user as {
    firstName: string;
    lastName?: string;
    email: string;
    phone?: string;
    image?: string;
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md">
      <div className="flex flex-col items-center mb-6">
        {image && (
          <Image
            src={image}
            alt="Profile Picture"
            width={100}
            height={100}
            className="rounded-full"
          />
        )}
        <h2 className="text-xl font-semibold mt-4">
          {firstName} {lastName ?? ""}
        </h2>
        <p className="text-gray-500">{email}</p>
      </div>
      <div className="space-y-4">
        <div>
          <strong>First Name:</strong> <span>{firstName}</span>
        </div>
        {lastName && (
          <div>
            <strong>Last Name:</strong> <span>{lastName}</span>
          </div>
        )}
        <div>
          <strong>Email:</strong> <span>{email}</span>
        </div>
        {phone && (
          <div>
            <strong>Phone:</strong> <span>{phone}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
