import { XMarkIcon } from '@heroicons/react/20/solid'
import Image from 'next/image';
import React from 'react'
import { BsFiletypeDoc, BsFiletypePdf, BsFiletypeXls } from 'react-icons/bs';
import { FaRegFileLines, FaRegFilePdf } from 'react-icons/fa6';

export default function CardFile({ data, onClick }) {
  const getShowFile = (type) => {
    switch (type) {
      case 'image':
        return <Image src={data.base64} alt={data.name} height={168} width={360} className='h-14 w-full rounded'/>;
      case 'video':
        return <video controls={false}><source src={data.base64} type="video/mp4" className='h-14 w-full rounded'/></video>;
      case 'pdf':
        return <BsFiletypePdf className='h-14 w-10 text-red-600'/>;
      case 'excel':
        return <BsFiletypeXls className='h-14 w-10 text-red-600'/>;
      case 'doc':
        return <BsFiletypeDoc className='h-14 w-10 text-red-600'/>;
      default:
        return <FaRegFileLines className='h-14 w-10 text-gray-200'/>;
    }
  }

  const getCutLetters = (text) => {
    if (text.length > 15) return `${text.slice(0, 8)}...${text.slice(-7)}`; 
    return text;
  }
  return (
    <div className='cursor-pointer flex flex-col h-28 w-[100px] relative bg-white shadow rounded-md p-1 hover:drop-shadow-md hover:bg-gray-100 hover:opacity-55'>
      <div className='flex justify-end' onClick={onClick}>
        <XMarkIcon className='w-4 h-4 text-gray-200 hover:text-red-500 transition ease-in duration-75' />
      </div>
      <div className='mt-1 flex justify-center'>{getShowFile(data.type)}</div>
      <div>
        <div className='absolute bottom-2 ml-1 '>
          <p className='text-center text-[10px] text-gray-400'>{getCutLetters(data.name)}</p>
        </div>
      </div>
    </div>
  )
}
