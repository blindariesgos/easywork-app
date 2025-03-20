'use client';
import React, { useEffect } from 'react';
import Login from './components/Login';
import GetPassword from './components/GetPassword';
import ChangePassword from './components/ChangePassword';
import DontRememberDetails from './components/DontRememberDetails';
import CheckUser from './components/CheckUser';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const router = useRouter();
  useEffect(() => {
    // console.log(params.get("loginState"));
    if (!params.get('loginState') || params.get('loginState') === null) router.push(`${window.location.pathname}?loginState=${0}`);
  }, []);
  return (
    <div className="w-auto py-7 px-6" style={{ backgroundColor: '#DFE3E6', borderRadius: '20px' }}>
      {params.get('loginState') === '0' ? (
        <Login />
      ) : params.get('loginState') === '1' ? (
        <GetPassword />
      ) : params.get('loginState') === '3' ? (
        <DontRememberDetails />
      ) : params.get('loginState') === '2' ? (
        <ChangePassword />
      ) : params.get('loginState') === '4' ? (
        <CheckUser />
      ) : (
        ''
      )}
    </div>
  );
}
