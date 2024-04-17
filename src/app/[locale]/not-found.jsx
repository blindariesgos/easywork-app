import Link from 'next/link';
import { headers } from 'next/headers';

export default async function NotFound() {
  const headersList = headers();

  return (
    <div className='fixed bg-gray-400 top-0 left-0 z-50'>
      <div className='h-screen w-screen flex justify-center items-center flex-col'>
      <h1 className='text-xl font-semibold'>Not Found:</h1>
      <p className='text-xl'>Could not find requested resource</p>
      </div>
    </div>
  );
}