import { useState } from 'react';
import Image from 'next/image';

function NewLessonCoverPhoto({ onChange, loading, coverPhoto }) {
  const [preview, setPreview] = useState(coverPhoto);

  const onChangeFile = event => {
    const files = event.target.files;

    if (files && files[0]) {
      setPreview(URL.createObjectURL(files[0]));
      onChange(files[0]);
    }
  };

  return (
    <>
      <label htmlFor="modulePhoto" type="button" className="cursor-pointer text-sm text-black">
        <div className="h-64 w-full bg-zinc-100 text-gray-50 border rounded-xl flex items-center justify-center relative">
          {preview ? <Image fill className="object-contain" src={typeof preview === 'string' ? preview : preview} alt="Module photo" loading="eager" /> : <p>Seleccionar +</p>}
        </div>
      </label>

      <input
        id="modulePhoto"
        name="modulePhoto"
        type="file"
        className="peer hidden inset-0 h-full w-full  rounded-md opacity-0"
        onChange={onChangeFile}
        accept="image/jpg,image/jpeg,image/png,image/gif,image/svg"
        disabled={loading}
      />
    </>
  );
}

export default NewLessonCoverPhoto;
