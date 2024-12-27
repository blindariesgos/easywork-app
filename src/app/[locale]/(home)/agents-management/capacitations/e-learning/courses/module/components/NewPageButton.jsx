import React from 'react';

export const NewPageButton = ({ onClick }) => {
  return (
    <div onClick={onClick} className={`cursor-pointer w-full text-left relative bg-white rounded-xl p-2 hover:bg-[#fafafa]`} style={{ borderWidth: '1px', borderStyle: 'solid' }}>
      <p className={`text-center text-gray-50`}>Nueva página +</p>
    </div>
  );
};
