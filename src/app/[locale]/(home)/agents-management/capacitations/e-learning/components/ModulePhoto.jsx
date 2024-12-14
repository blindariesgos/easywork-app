import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Button from '@/src/components/form/Button';

function ModulePhoto({ onChange, loading }) {
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);

  return (
    <div className="flex items-start justify-start gap-2 p-4">
      <label htmlFor="modulePhoto" type="button" className="cursor-pointer text-sm text-black">
        <div className="h-48 w-80 flex rounded text-gray-400 fill-white bg-zinc-200 object-cover items-center justify-center">
          {preview ? <Image width={96} height={96} src={preview} alt="Module photo" className="h-full w-full" loading="eager" /> : <p>Subir</p>}
        </div>
      </label>

      <div className="flex flex-col items-start ">
        <p>Portada</p>
        <p className="mb-4">1440 x 980</p>
        <Button
          type="button"
          label="Cambiar"
          buttonStyle="primary"
          className="px-2 py-1 text-lg"
          onclick={() => {
            fileRef.current?.click();
          }}
        />
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
          onChange(files);
        }}
        accept="image/jpg,image/jpeg,image/png,image/gif,image/svg"
        disabled={loading}
      />
    </div>
  );
}

export default ModulePhoto;
