import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Button from '@/src/components/form/Button';

import FilePreview from './FilePreview';
export const FileUpload = ({ onChange, loading, inputRef }) => {
  const [filesToPreview, setFilesToPreview] = useState([]);
  const showFiles = filesToPreview.length > 0;

  const onDeleteFile = index => setFilesToPreview(prev => prev.filter((_, i) => i !== index));

  return (
    <div className={`${showFiles && 'p-3'}`}>
      {showFiles && <p className="font-bold mb-2">Archivos</p>}
      <div className={`flex items-start justify-start gap-2 flex-wrap`}>
        {/* <label htmlFor="modulePhoto" type="button" className="cursor-pointer text-sm text-black">
        <div className="h-48 w-80 flex rounded text-gray-400 fill-white bg-zinc-200 object-cover items-center justify-center"> */}
        {filesToPreview.map((file, i) => (
          <FilePreview key={`file-${i}`} data={file} onClick={() => onDeleteFile(i)} />
        ))}
        {/* </div>
      </label> */}
      </div>

      <input
        ref={inputRef}
        id="modulePhoto"
        name="modulePhoto"
        type="file"
        className="peer hidden inset-0 h-full w-full  rounded-md opacity-0"
        multiple
        onChange={e => {
          const files = Array.from(e.target.files).map(file => {
            const blob = new Blob([file], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            return { url, file };
          });

          setFilesToPreview(prev => [...prev, ...files]);
          if (onChange) onChange(files);
        }}
        disabled={loading}
      />
    </div>
  );
};
