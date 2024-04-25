'use client';
import LoaderSpinner from '@/components/LoaderSpinner';
import IconDropdown from '@/components/SettingsButton';
import { useTasks } from '@/hooks/useCommon';
import { ArrowUpTrayIcon, AtSymbolIcon, Cog8ToothIcon, FireIcon, PaperClipIcon } from '@heroicons/react/20/solid';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RiDoubleQuotesL } from 'react-icons/ri';
import CardFile from '../components/CardFile';
import UploadDocuments from '../components/UploadDocuments';
import TextEditor from '../components/TextEditor';
import DropdownVisibleUsers from '../components/DropdownVisibleUsers';
import useAppContext from '@/context/app';
import CheckList from '../components/CheckList';

export default function TaskCreate() {
	const { t } = useTranslation();
    const { lists } = useAppContext();
	const { settings } = useTasks();
	const [ loading, setLoading ] = useState(false);
	const [ check, setCheck ] = useState(false);
	const [ openFiles, setOpenFiles ] = useState(false);
	const [ files, setFiles ] = useState([]);
	const [ value, setValue ] = useState('');
	const [ dropdownVisible, setDropdownVisible ] = useState(false);
	const [ dataUsers, setDataUsers ] = useState();
    const [ userSelected, setUserSelected ] = useState(null);
	const [openList, setOpenList] = useState(false);

    useEffect(() => {
        if (lists?.users) setDataUsers(lists?.users);
    }, [lists])

	const onChangeCustom = (event) => {
        const { value } = event.target;
        const filterData = lists?.users.filter((user) => {
            return user.username.toLowerCase().includes(value.toLowerCase());
          });
        setDataUsers(filterData);        
	};
	// const [ users, setUsers ] = useState([]);

	const handleChange = (newValue, delta, source, editor) => {
		console.log('newValue', newValue, delta, source, editor,userSelected);  
        if (delta && delta.ops && delta.ops.length > 0 && typeof delta.ops[0].insert === 'string') {
          const insertText = delta.ops[0].insert.trim();
          if (insertText === '@') {
            const selection = editor.getSelection();
            const newContent = `<p>@${userSelected?.username}</p>`;
            setValue(newContent);
            if (editor && editor.clipboard && editor.clipboard.dangerouslyPasteHTML) {
              editor.clipboard.dangerouslyPasteHTML(selection.index, newContent, 'user');
              editor.setSelection(selection.index + newContent.length);
            }
          }
        }
	};

	const deleteFiles = (indexToDelete) => {
		const documents = files.filter((item, index) => index !== indexToDelete);
		setFiles(documents);
	};

	const options = [
		{
			id: 1,
			name: t('tools:tasks:new:file'),
			icon: PaperClipIcon,
			onclick: () => setOpenFiles(!openFiles)
		},
		{
			id: 2,
			name: t('tools:tasks:new:document'),
			icon: DocumentTextIcon,
		},
		{
			id: 3,
			name: t('tools:tasks:new:mention'),
			icon: AtSymbolIcon,
			onclick: () => {}
		},
		{
			id: 4,
			name: t('tools:tasks:new:appointment'),
			icon: RiDoubleQuotesL,
			onclick: () => {}
		},
		{
			id: 5,
			name: t('tools:tasks:new:verification-list'),
			onclick: () => setOpenList(!openList),
		},
		{
			id: 6,
			name: t('tools:tasks:new:add-list'),
			onclick: () => {}
		}
	];

	const handleKeyDown = (event) => {
		console.log('entre even', event);
		if (event.key === '@') {
			// Fetch the list of users from an API or a mock list of users
			const mockUsers = [ 'John Doe', 'Jane Smith', 'Michael Johnson' ];
            
			// setUsers(mockUsers);
			setDropdownVisible(true);
		}
	};

    // useEffect(() => {
    //     console.log("userSelected", userSelected)
    //     if (userSelected) handleChange(`${value}${userSelected?.username}`);
    // }, [userSelected])

	return (
		<div className="flex flex-col h-screen relative w-full">
			{loading && <LoaderSpinner />}
			<div className="flex flex-col flex-1 bg-gray-600 opacity-100 shadow-xl text-black rounded-tl-[35px] rounded-bl-[35px] p-4">
				<div className="flex justify-between items-center py-2">
					<h1 className="text-xl font-medium">{t('tools:tasks:new:title')}</h1>
					<IconDropdown
						icon={<Cog8ToothIcon className="h-8 w-8 text-primary" aria-hidden="true" />}
						options={settings}
						width="w-44"
					/>
				</div>
				<div className="flex flex-col flex-1 bg-gray-100 text-black rounded-lg relative p-2 sm:p-4">
					<div className="flex justify-between gap-2 items-center">
						<input
							placeholder={t('tools:tasks:new:description')}
							className="bg-transparent border-none focus:ring-0 w-full placeholder:text-black"
						/>
						<div className="flex gap-2 items-center w-48">
							<input
								type="checkbox"
								className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-0"
								value={check}
								checked={check}
								onChange={(e) => setCheck(e.target.checked)}
							/>
							<p className="text-sm">{t('tools:tasks:new:high')}</p>
							<FireIcon className={`h-5 w-5 ${check ? 'text-orange-400' : 'text-gray-200'}`} />
						</div>
					</div>
					<div className="bg-white w-full p-2 rounded-lg mt-2 h-48" onKeyDown={handleKeyDown}>
						<TextEditor value={value} onChange={handleChange} className="h-36 w-full" />
					</div>
					{dropdownVisible && (
                        <DropdownVisibleUsers dataUsers={dataUsers} onChangeCustom={onChangeCustom} setUserSelected={setUserSelected} userSelected={userSelected} setDropdownVisible={setDropdownVisible}/>
					)}
					<div className="flex justify-end mt-4 gap-3">
						{options.map((opt, index) => (
							<div
								key={index}
								className="flex gap-1 flex-wrap items-center cursor-pointer"
								onClick={opt.onclick}
							>
								{opt.icon && <opt.icon className="h-4 w-4 text-black" />}
								<p className="text-sm">{opt.name}</p>
							</div>
						))}
					</div>
					{openFiles && <UploadDocuments files={files} deleteFiles={deleteFiles} setFiles={setFiles} />}
					{openList && <CheckList/>}
				</div>
			</div>
		</div>
	);
}
