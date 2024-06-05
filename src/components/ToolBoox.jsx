'use client';
import { useSidebar } from '../hooks/useCommon'
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Link from "next/link";
import Image from "next/image";
import Header from "./header/Header";

const ToolBox = () => {
  const { sidebarNavigation } = useSidebar();
  const pathname = usePathname();
  const options = sidebarNavigation.flatMap((side) => {
    let parts = pathname.split('/');
    let newPathname
    if (parts[1] === 'en') {
      parts.splice(1, 1);
      newPathname = parts.join('/');
    } else {
      newPathname = pathname
    }
    if (side.children) {
      const foundInChildren = side.children.find((child) => child.href == newPathname);
      if (foundInChildren) return foundInChildren;
    }
    if (side.href == newPathname) return side;
    return [];
  }).filter(Boolean)[0];
  
  return (
    <div className="bg-center bg-cover  rounded-2xl px-2 pt-4" style={{backgroundImage: "url('/img/fondo-home.png')"}}>
      <Header />
      <div className='flex justify-center items-center h-full py-8'>
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