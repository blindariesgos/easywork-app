"use client"
import clsx from "clsx"
import { twMerge } from "tailwind-merge"
import { useEffect, useRef } from "react"
export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export default function Loading() {
  // const dialogRef = useRef<React.ElementRef<"dialog">>(null)

  // useEffect(() => {
  //   dialogRef.current?.showModal()
  // }, [])
console.log("entre aqui")
  return (
    <div className="fixed inset-0 ">
        <div
    className={cn("animate-pulse rounded-md bg-muted", "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-32")}/>
    cvxvxbv x
      {/* <Skeleton className="" /> */}

    </div>
    // <dialog ref={dialogRef}>
    //   <Skeleton className="p-32" />
    // </dialog>
  )
}
