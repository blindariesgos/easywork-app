import { XMarkIcon } from '@heroicons/react/20/solid'
import React from 'react'

const Tag = ({ title, onclick, className, closeIcon, second }) => {
  return (
    <div className={`mt-8 ${second && "sm:block hidden"}`}>
      <div className={`flex gap-2 rounded-tl-md rounded-bl-md items-center px-1 ${className} py-2`}>
        {!closeIcon && (
          <div onClick={onclick}>
            <XMarkIcon className="h-6 w-6 text-white cursor-pointer"/>
          </div>
        )}
        <p className="text-white text-base hidden sm:flex">{title}</p>
      </div>
    </div>
  )
}

export default Tag