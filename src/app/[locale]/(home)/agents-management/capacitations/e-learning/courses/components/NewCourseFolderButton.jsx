import React from 'react';

export const NewCourseFolderButton = ({ onClick }) => {
  return (
    <div onClick={onClick} className={`cursor-pointer w-full text-left relative bg-white rounded-xl p-2 mt-1.5 hover:bg-[#fafafa]`} style={{ borderWidth: '1px', borderStyle: 'solid' }}>
      <p className={`text-center text-gray-50`}>Nueva carpeta +</p>
    </div>
  );
};
