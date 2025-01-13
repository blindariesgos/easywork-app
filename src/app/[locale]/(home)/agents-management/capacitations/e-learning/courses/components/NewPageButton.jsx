import React from 'react';

export const NewPageButton = ({ onClick }) => {
  return (
    <div onClick={onClick} className={`cursor-pointer w-full text-left relative bg-[#eaeaea] rounded-xl mt-1.5 p-2 hover:bg-[#fafafa]`}>
      <p className={`text-center text-gray-50 text-md`}>Nueva página +</p>
    </div>
  );
};
