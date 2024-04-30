'use client';
import React from 'react';
import Login from './components/Login';
import GetPassword from './components/GetPassword';
import ChangePassword from './components/ChangePassword';
import DontRememberDetails from './components/DontRememberDetails';
import CheckUser from './components/CheckUser';

export default function Page() {
	return (
		<div className="w-auto py-7 px-6" style={{ backgroundColor: '#DFE3E6', borderRadius: '20px' }}>
			<Login />
			<GetPassword />
			<ChangePassword />
			<DontRememberDetails />
			<CheckUser />
		</div>
	);
}
