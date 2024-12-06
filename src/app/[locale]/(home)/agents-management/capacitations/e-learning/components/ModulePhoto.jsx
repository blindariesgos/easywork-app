// ProfileImageInput.js
import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import Button from '@/src/components/form/Button';

function ModulePhoto({ selectedProfileImage, onChange, disabled, label }) {
  const { t } = useTranslation();
  return (
    <div className="text-center">
      <label htmlFor="modulePhoto" type="button" className="cursor-pointer text-sm text-black">
        <div className="col-span-full flex items-center gap-x-4 mt-8 rounded-lg p-3">
          {selectedProfileImage?.base64 ? (
            <Image
              width={96}
              height={96}
              src={selectedProfileImage?.base64 || '/img/avatar.svg'}
              alt="Module photo"
              className="h-48 w-80 flex-none rounded text-white fill-white bg-zinc-200 object-cover items-center justify-center"
              objectFit="fill"
            />
          ) : (
            <div className="h-48 w-80 flex rounded text-gray-400 fill-white bg-zinc-200 object-cover items-center justify-center">
              <p>Subir</p>
            </div>
          )}

          <div className="relative flex-none">
            <input
              id="modulePhoto"
              name="modulePhoto"
              type="file"
              className="peer hidden inset-0 h-full w-full  rounded-md opacity-0"
              onChange={onChange}
              accept="image/jpg,image/jpeg,image/png,image/gif,image/svg"
              disabled={disabled}
            />
          </div>
          <div className="flex flex-col items-start ">
            <p>Portada</p>
            <p className="mb-4">1440 x 980</p>
            <Button label="Cambiar" buttonStyle="primary" className="px-2 py-1 text-lg" />
          </div>
        </div>
      </label>
    </div>
  );
}

export default ModulePhoto;
