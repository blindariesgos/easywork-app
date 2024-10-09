// ProfileImageInput.js
import React from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

function ProfileImageInput({ selectedProfileImage, onChange, disabled }) {
  const { t } = useTranslation();
  return (
    <div className="text-center">
      <label
        htmlFor="profilePhoto"
        type="button"
        className="cursor-pointer text-sm text-black"
      >
        <div className="col-span-full flex items-center gap-x-4 mt-8 bg-white rounded-lg p-3">
          <Image
            width={96}
            height={96}
            src={selectedProfileImage?.base64 || "/img/avatar.svg"}
            alt="Profile picture"
            className="h-16 w-16 flex-none rounded-full text-white fill-white bg-zinc-200 object-cover items-center justify-center"
            objectFit="fill"
          />
          <div className="relative flex">
            <input
              id="profilePhoto"
              name="profilePhoto"
              type="file"
              className="peer hidden inset-0 h-full w-full  rounded-md opacity-0"
              onChange={onChange}
              accept="image/jpg,image/jpeg,image/png,image/gif,image/svg"
              disabled={disabled}
            />
            <p>{t("contacts:create:change-photo")}</p>
          </div>
        </div>
        <p className="mt-1 text-xs leading-5 text-black">
          {t("contacts:create:jpg")}
        </p>
      </label>
    </div>
  );
}

export default ProfileImageInput;
