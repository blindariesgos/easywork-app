import React, { useRef, useState } from 'react';
import Image from 'next/image';

import Button from '@/src/components/form/Button';

export const CourseCover = ({ onChange, onDeleteImage, loading, coverPhoto }) => {
  const [preview, setPreview] = useState(coverPhoto || '');
  const fileRef = useRef(null);

  return (
    <div className="flex items-start justify-start gap-2 p-4">
      <label htmlFor="modulePhoto" type="button" className="cursor-pointer text-sm text-black">
        <div className="h-48 w-80 flex rounded text-gray-400 fill-white bg-zinc-200 object-cover items-center justify-center">
          {preview ? <Image width={96} height={96} src={typeof preview === 'string' ? preview : preview} alt="Module photo" className="h-full w-full" loading="eager" /> : <p>Subir</p>}
        </div>
      </label>

      <div className="flex flex-col items-start ">
        <p className="text-xs">Portada</p>
        <p className="mb-4 text-xs">1440 x 980</p>
        <Button
          type="button"
          label="Cambiar"
          buttonStyle="primary"
          className="px-2 py-1 text-lg"
          onclick={() => {
            fileRef.current?.click();
          }}
        />
        {preview && (
          <Button
            type="button"
            label="Borrar"
            buttonStyle="error"
            className="px-4 py-1 text-lg mt-1"
            onclick={() => {
              fileRef.current.value = '';
              setPreview(null);
              onChange(null);
              if (onDeleteImage && coverPhoto) onDeleteImage();
            }}
          />
        )}
      </div>

      <input
        ref={fileRef}
        id="modulePhoto"
        name="modulePhoto"
        type="file"
        className="peer hidden inset-0 h-full w-full  rounded-md opacity-0"
        onChange={e => {
          const files = e.target.files;

          if (files[0]) setPreview(URL.createObjectURL(files[0]));
          onChange(files[0]);
        }}
        accept="image/jpg,image/jpeg,image/png,image/gif,image/svg"
        disabled={loading}
      />
    </div>
  );
};
