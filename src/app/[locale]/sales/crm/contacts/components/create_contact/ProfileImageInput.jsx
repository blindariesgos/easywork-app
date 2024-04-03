// ProfileImageInput.js
import React from "react";
import Image from "next/image";

function ProfileImageInput({ selectedProfileImage, onChange }) {
  return (
    <div className="col-span-full flex items-center gap-x-8 mt-2">
      <Image
        width={96}
        height={96}
        src={selectedProfileImage || "/img/avatar.svg"}
        alt="Profile picture"
        className="h-24 w-24 flex-none rounded-lg text-white fill-white bg-zinc-200 object-cover items-center justify-center"
        objectFit="fill"
      />
      <div>
        <div className="relative flex">
          <input
            id="profilePhoto"
            name="profilePhoto"
            type="file"
            className="peer absolute inset-0 h-full w-full  rounded-md opacity-0 cursor-pointer"
            onChange={onChange}
            accept="image/*"
          />
          <label
            htmlFor="profilePhoto"
            type="button"
            className="rounded-md block cursor-pointer pointer-events-none bg-zinc-800/80 px-3 py-2 peer-focus:ring-2 peer-focus:ring-blue-600 text-sm font-semibold text-white shadow-sm peer-hover:bg-zinc-700/70"
          >
            Cambiar foto
          </label>
        </div>
        <p className="mt-2 text-xs leading-5 text-gray-400">
          JPG, GIF or PNG. 1MB max.
        </p>
      </div>
    </div>
  );
}

export default ProfileImageInput;
