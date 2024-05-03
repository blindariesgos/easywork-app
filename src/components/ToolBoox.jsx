'use client';
import { useSidebar } from '../hooks/useCommon'
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Link from "next/link";
import Image from "next/image";

const ToolBox = () => {
  const { sidebarNavigation } = useSidebar();
  const pathname = usePathname();
  // const [options, setOptions] = useState(null);
  // useEffect(() => {
  //   sidebarNavigation && sidebarNavigation.map((side) => {
  //     if ( side.children ) {
  //       const foundInChildren = side.children.find( child => child.href === pathname );
  //       if ( foundInChildren ) return setOptions(foundInChildren);
  //     }
  //     if (side.href === pathname) return setOptions(side);
  //   })    
  // }, [sidebarNavigation])
  const options = sidebarNavigation.flatMap((side) => {
    if (side.children) {
      const foundInChildren = side.children.find((child) => child.href === pathname);
      if (foundInChildren) return foundInChildren;
    }
    if (side.href === pathname) return side;
    return [];
  }).filter(Boolean)[0];
  
  return (
    <div className="bg-center bg-cover h-full rounded-2xl px-2" style={{backgroundImage: "url('/img/fondo-home.png')"}}>
      <div className='flex justify-center items-center h-full'>
        <div className='sm:w-1/2 w-full bg-white rounded-xl drop-shadow-md px-8 py-10 flex items-center flex-col gap-4'>
          <h1 className='text-4xl font-bold text-primary uppercase mb-4'>{options?.name}</h1>
          <ul className={`grid grid-cols-1 gap-6 ${options?.children?.length <= 4 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
            {options && options?.children && options?.children?.map((opt, index) => (
              <div className="col-span-1 rounded-lg bg-white text-center shadow relative w-full" key={index}>
                <Link href={opt.href} className="relative h-full w-full overflow-hidden rounded-lg">
                  <Image
                    width={200}
                    height={200}
                    src={opt.image}
                    alt={opt.name}
                    className="h-full w-full object-cover object-center"
                  />
                </Link>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ToolBox