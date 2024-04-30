'use client';
import { Menu, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { useTranslation } from 'react-i18next';
import TextInput from './form/TextInput';
import useAppContext from '@/context/app';
import Image from 'next/image';

const MenuAddUser = ({ selectedOption }) => {
	const { t } = useTranslation();
	const { lists } = useAppContext();
	const { users } = lists;
	const [ dataUsers, setDataUsers ] = useState(users);
    const [userSelected, setUserSelected] = useState(null);

	const handleSelected = (user) => {
        setUserSelected(user);
	};

    useEffect(() => {
        console.log("selectedOption", selectedOption)
        setUserSelected(null);
    }, [selectedOption])
    

	const onChangeCustom = (event) => {
        const { value } = event.target;
        const filterData = users.filter((user) => {
            return user.username.toLowerCase().includes(value.toLowerCase());
          });
        setDataUsers(filterData);        
	};

	return (
		<Menu as="div" className="relative inline-block">
			<div>
				<Menu.Button className="border border-gray-200 text-black rounded-md w-48 h-[38px] flex justify-center items-center text-sm">
					{userSelected?.username}
				</Menu.Button>
			</div>
			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items
					className={`absolute left-0 bottom-10 mt-2 rounded-md bg-blue-50 shadow-lg ring-1 ring-black/5 focus:outline-none z-50 w-96`}
				>
					<div className="p-4">
						<Menu.Item>
							{({ close }) => (
								<div className="flex justify-end gap-2">
									<div onClick={close} className="cursor-pointer">
										<XMarkIcon className="h-4 w-4 text-gray-400" />
									</div>
								</div>
							)}
						</Menu.Item>
						<div className="w-full mt-2">
							<TextInput onChangeCustom={onChangeCustom} border />
						</div>
						<div className='grid grid-cols-2 gap-4 mt-6'>
							{dataUsers &&
								dataUsers.map((user, index) => (
									<div
										key={index}
										className={`flex items-center gap-2 w-full cursor-pointer hover:bg-gray-100 p-2 rounded-md ${userSelected?.id === user.id ? "bg-easy-600": "bg-none"}`}
                                        onClick={() => handleSelected(user)}
									>
                                        <Image
                                            src={user.avatar}
                                            alt=""
                                            height={500}
                                            width={500}
                                            layout="fixed"
                                            objectFit="cover"
											className="h-9 w-9 rounded-full"
                                        />
										<div className={`flex flex-col`}>
											<p className={`text-sm font-medium ${userSelected?.id === user.id ? "text-white": "text-black"}`}>{user.username}</p>
											{/* <p className={`text-[10px] text-gray-50  flex-wrap`}>{user.email}</p>
											<p className={`text-[10px] text-gray-50 `}>{user.phone}</p> */}
										</div>
									</div>
								))}
						</div>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
};

export default MenuAddUser;
