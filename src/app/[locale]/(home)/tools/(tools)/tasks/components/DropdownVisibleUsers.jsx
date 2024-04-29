import TextInput from '@/components/form/TextInput';
import { XMarkIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import React from 'react';

export default function DropdownVisibleUsers({ dataUsers, onChangeCustom, setUserSelected, userSelected, setDropdownVisible, mentionButtonRef, modalPosition}) {
	const handleSelected = (user) => {
		setUserSelected(user);
		setDropdownVisible(false);
	};

	return (
		<div 
			className={`absolute rounded-md bg-blue-50 shadow-lg ring-1 ring-black/5 focus:outline-none z-10 w-54 h-min-96 overflow-y-auto`}
			style={{
			  top: mentionButtonRef ? mentionButtonRef.current.offsetTop + mentionButtonRef.current.offsetHeight : modalPosition.y,
			  left: mentionButtonRef ?  mentionButtonRef.current.offsetLeft : modalPosition.x,
			}}
		>
			<div className="p-4">
				<div className="flex justify-end gap-2">
					<div className="cursor-pointer" onClick={() => setDropdownVisible(false)}>
						<XMarkIcon className="h-4 w-4 text-gray-400" />
					</div>
				</div>
				<div className="w-full mt-2">
					<TextInput onChangeCustom={onChangeCustom} border />
				</div>
				<div className="grid grid-cols-1 gap-2 mt-6">
					{dataUsers &&
						dataUsers.map((user, index) => (
							<div
								key={index}
								className={`flex items-center gap-2 w-full cursor-pointer hover:bg-gray-100 p-2 rounded-md ${userSelected?.id ===
								user.id
									? 'bg-easy-600'
									: 'bg-none'}`}
								onClick={() => handleSelected(user)}
							>
								<Image
									src={user.avatar}
									alt=""
									height={300}
									width={300}
									layout="fixed"
									objectFit="cover"
									className="h-6 w-6 rounded-full"
								/>
								<div className={`flex flex-col`}>
									<p
										className={`text-xs font-medium ${userSelected?.id === user.id
											? 'text-white'
											: 'text-black'}`}
									>
										{user.username}
									</p>
								</div>
							</div>
						))}
				</div>
			</div>
		</div>
	);
}
