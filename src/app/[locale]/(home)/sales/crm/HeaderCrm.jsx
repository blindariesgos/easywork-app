import React from 'react'

const HeaderCrm = ({ options }) => {
  return (
    <div className='bg-white mb-4 rounded-xl'> 
        <div className='flex gap-6 py-4 sm:px-8 px-4'>
            {options.map((opt, index) => (
                <div key={index} className='cursor-pointer'>
                    <p className='text-gray-400 font-medium hover:text-primary'>{opt.name}</p>
                </div>
            ))}
        </div>
    </div>
  )
}

export default HeaderCrm