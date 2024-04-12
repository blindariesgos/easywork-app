import { XMarkIcon } from '@heroicons/react/20/solid'
import React from 'react'

const Tag = ({ title, onclick, className, closeIcon }) => {
  return (
    <div className="mt-8">
      <div className={`flex gap-2 h-8 rounded-tl-md rounded-bl-md items-center px-1 ${className}`}>
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