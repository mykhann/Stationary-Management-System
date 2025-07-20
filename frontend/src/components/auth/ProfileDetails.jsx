import React, { useState } from "react";
import { useSelector } from "react-redux";
import { PencilIcon } from "@heroicons/react/24/outline";
import ProfileEditForm from "./ProfileEditForm";

const ProfileDetails = () => {
  const { user } = useSelector((store) => store.auth);
  const [isEditing, setIsEditing] = useState(false);

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 py-16 px-4">
      <section className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="relative">
          <button
            onClick={() => setIsEditing(true)}
            aria-label="Edit Profile"
            className="absolute top-4 right-4 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 p-3 rounded-full shadow-md"
          >
            <PencilIcon className="h-6 w-6" />
          </button>

          <div className="flex flex-col sm:flex-row items-center p-8 gap-8">
            {/* <img
              src={user.avatar || "/default-avatar.png"}
              alt="Profile Avatar"
              className="w-36 h-36 sm:w-40 sm:h-40 rounded-full border-4 border-indigo-300 shadow-md"
            /> */}
            {isEditing ? (
              <ProfileEditForm user={user} setIsEditing={setIsEditing} />
            ) : (
              <div className="space-y-4 text-center font-bold sm:text-left w-full">
                <p>
                  <span className="font-semibold ">Name:</span>{" "}
                  {user.name || "No name provided"}
                </p>

                <p className="text-indigo-600">
                  <span className="font-semibold text-black">Email:</span>{" "}
                  <a href={`mailto:${user.email}`}>
                    {user.email || "No email provided"}
                  </a>
                </p>

                <p className="text-indigo-600">
                  <span className="font-semibold text-black">Phone:</span>{" "}
                  <a href={`tel:${user.phone}`}>
                    {user.phone || "Phone no not provided"}
                  </a>
                </p>

                <p>
                  <span className="font-semibold">Address:</span>{" "}
                  {user.address || "No address added"}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProfileDetails;
