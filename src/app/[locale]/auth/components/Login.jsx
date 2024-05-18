'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { LockClosedIcon, UserIcon } from '@heroicons/react/24/solid';
import ModalVideo from './ModalVideo';
import { useDataContext } from '../context';
import { login } from '../../../../lib/apis';
import { toast } from 'react-toastify';
import LoaderSpinner from '../../../../components/LoaderSpinner';
import { setCookie } from 'cookies-next'

export default function Login() {
	const { contextData, setContextData } = useDataContext();
	const [ email, setEmail ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ isLoading, setIsLoading ] = useState(false);

	useEffect(() => {
		setCookie('rememberSession', false)
	}, []);

	const sendData = async () => {
		try {
			setIsLoading(true);
			await login({ email: email.trim(), password, redirectTo: '/home'});
		} catch (error) {
            toast.error("Credential didn't match");
			setIsLoading(false);
		}
	};

	const rememberSessionCookie = (state) => {
		setCookie('rememberSession', state)
	}

	if (contextData === 0) {
		return (
			<div className="flex flex-col items-center justify-center">
                {isLoading && <LoaderSpinner/>}
				{/* Logo */}
				<div className="mb-2">
					<Image width={156.75} height={118.84} src={'/img/logo.svg'} alt="easywork" />
				</div>
				{/* Email */}
				<div className="relative text-gray-600 focus-within:text-gray-400">
					<span className="absolute inset-y-0 left-0 flex items-center pl-2">
						<button type="submit" className="p-1 focus:outline-none focus:shadow-outline">
							<UserIcon className="h-5 w-5 text-easywork-main" />
						</button>
					</span>
					<input
						style={{ border: 'none' }}
						type="text"
						name="q"
						className="py-2 text-sm rounded-md pl-10 focus:text-gray-900 placeholder-slate-600"
						placeholder="Email"
						autoComplete="off"
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				{/* Contraseña */}
				<div className="relative text-gray-600 focus-within:text-gray-400 mt-2">
					<span className="absolute inset-y-0 left-0 flex items-center pl-2">
						<button type="submit" className="p-1 focus:outline-none focus:shadow-outline">
							<LockClosedIcon className="h-5 w-5 text-easywork-main" />
						</button>
					</span>
					<input
						style={{ border: 'none' }}
						type="password"
						name="q"
						className="py-2 text-sm rounded-md pl-10 focus:text-gray-900 placeholder-slate-600"
						placeholder="Contraseña"
						autoComplete="off"
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				{/* Recordar contraseña */}
				<div className="flex justify-between my-4 text-sm">
					<input type="checkbox" onChange={(e) => {rememberSessionCookie(e.target.checked)}} />
					<p className="ml-1">Recordar en esta computadora</p>
				</div>
				{/* Ingresar */}
				<div className="my-2">
					<button
						onClick={() => sendData()}
						className="hover:bg-primaryhover bg-primary text-white font-bold py-2 px-4 rounded-md"
                        disabled={isLoading}
					>
						Inicio de sesión
					</button>
				</div>
				{/* Recuperar */}
				<div className="text-primary hover:text-primaryhover text-xs w-full my-4 underline">
					<a className="cursor-pointer" onClick={() => setContextData(1)}>
						¿Olvidó su contraseña?
					</a>
					<a className="cursor-pointer ml-7" onClick={() => setContextData(3)}>
						Recordar todos mis datos
					</a>
				</div>
				{/* Video guia */}
				<div>
					<ModalVideo
						buttonOpen={
							<button
								type="button"
								onClick={() => setIsOpen(true)}
								className="hover:bg-primaryhover bg-primary text-white font-bold py-2 px-4 rounded-md"
							>
								¿Cómo ingresar?
							</button>
						}
					/>
				</div>
			</div>
		);
	}
}
