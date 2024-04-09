'use client' // Error components must be Client Components
 
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
 
export default function Error({ error, reset }) {
  const params = useParams();
  const router = useRouter();
  const { id } = params
  useEffect(() => {
    // Log the error to an error reporting service
    const errorData = JSON.parse(error.message);
    const errorMessage = errorData.message || '';
    if ( id ) router.push("/sales/crm/contacts");
    toast.error(errorMessage);
    console.error(error)
  }, [error])
 
  return (
    <div>
    </div>
  )
}