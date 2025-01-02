import { useState } from 'react';

import FilePreview from './FilePreview';
export const FileUpload = ({ onChange, onDelete, loading, inputRef, files = [], disabled }) => {
  const [filesToPreview, setFilesToPreview] = useState(files);
  const showFiles = filesToPreview.length > 0;

  const onDeleteFile = index => {
    setFilesToPreview(prev => prev.filter((_, i) => i !== index));
    onDelete(filesToPreview[index]);
  };

  return (
    <div className={`${showFiles && 'px-4 mt-4'} ${showFiles && loading && 'hidden'}`}>
      <div className={`flex items-start justify-start gap-2 flex-wrap`}>
        {filesToPreview.map((file, i) => (
          <FilePreview key={`file-${i}`} file={file} onClick={() => onDeleteFile(i)} disabled={disabled} />
        ))}
      </div>

      <input
        ref={inputRef}
        id="modulePhoto"
        name="modulePhoto"
        type="file"
        className="peer hidden inset-0 h-full w-full  rounded-md opacity-0"
        multiple
        onChange={e => {
          const files = Array.from(e.target.files);

          setFilesToPreview(prev => [...prev, ...files]);
          if (onChange) onChange(files);
        }}
        disabled={loading}
      />
    </div>
  );
};
