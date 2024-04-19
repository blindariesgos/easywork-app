// ProfileImageInput.js
import React from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

function ProfileImageInput({ selectedProfileImage, onChange, disabled }) {
  const { t } = useTranslation();
  return (
    <div className="text-center">
      <div className="col-span-full flex items-center gap-x-4 mt-8 bg-white rounded-lg p-3">
        <Image
          width={96}
          height={96}
          src={selectedProfileImage?.base64 || "/img/avatar.svg"}
          alt="Profile picture"
          className="h-16 w-16 flex-none rounded-full text-white fill-white bg-zinc-200 object-cover items-center justify-center"
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
              disabled={disabled}
            />
            <label
              htmlFor="profilePhoto"
              type="button"
              className="cursor-pointer text-sm text-black"
            >
              {t('contacts:create:change-photo')}
            </label>
          </div>
        </div>
      </div>
      <p className="mt-1 text-xs leading-5 text-black">
        {t('contacts:create:jpg')}
      </p>
    </div>
  );
}

export default ProfileImageInput;
