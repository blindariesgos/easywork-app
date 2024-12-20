import { useState } from 'react';
import Image from 'next/image';

function ContentViewCoverPhoto({ onChange, loading = false, coverPhoto }) {
  const [preview, setPreview] = useState(coverPhoto);

  return (
    <>
      <label htmlFor="modulePhoto" type="button" className="cursor-pointer text-sm text-black">
        <div className="h-96 w-full bg-white relative flex items-center justify-center rounded-xl">
          {preview ? (
            <Image fill src={typeof preview === 'string' ? preview : preview} alt="Module photo" className="h-full w-full object-fill rounded-xl" loading="eager" />
          ) : (
            <p className="text-gray-[#e0e0e0] ">Subir portada</p>
          )}
        </div>
      </label>

      <input
        id="modulePhoto"
        name="modulePhoto"
        type="file"
        className="peer hidden inset-0 h-full w-full rounded-md opacity-0"
        onChange={e => {
          const files = e.target.files;

          if (files[0]) setPreview(URL.createObjectURL(files[0]));
          if (onChange) onChange(files);
        }}
        accept="image/jpg,image/jpeg,image/png,image/gif,image/svg"
        disabled={loading}
      />
    </>
  );
}

export default ContentViewCoverPhoto;
