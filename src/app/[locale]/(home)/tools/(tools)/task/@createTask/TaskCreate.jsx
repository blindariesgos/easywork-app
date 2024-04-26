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
import AddListSeLectingText from '../components/AddListSeLectingText';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';;

export default function TaskCreate() {
	const { t } = useTranslation();
    const { lists } = useAppContext();
	const { settings } = useTasks();
	const [ loading, setLoading ] = useState(false);
	const [ check, setCheck ] = useState(false);
	const [ openFiles, setOpenFiles ] = useState(false);
	const [ files, setFiles ] = useState([]);
	const [ value, setValueText ] = useState('');
	const [ dropdownVisible, setDropdownVisible ] = useState(false);
	const [ dataUsers, setDataUsers ] = useState();
    const [ userSelected, setUserSelected ] = useState(null);
	const [openList, setOpenList] = useState(false);
	const [selectText, setSelectText] = useState("");
	const quillRef = useRef(null);
	const mentionButtonRef = useRef(null);
	const [arroba, setArroba] = useState(false);
	const [isBlockquoteAdded, setIsBlockquoteAdded] = useState(false);
	
    useEffect(() => {
        if (userSelected) addUserSelected(userSelected.username);
    }, [userSelected])

	const handleTextSelection = (selection, source, editor) => {
		selection && setSelectText(editor.getText(selection.index, selection.length));
	};

	//FUNCTIONS TO CHECKLIST
	const schema = yup.object().shape({
		items: yup.array().of(
			yup.object().shape({
				name: yup.string().required(),
				subItems: yup.array().of(
					yup.object().shape({
						name: yup.string().required()
					})
				)
			})
		)
	});
    
    const { register, handleSubmit, errors, control, getValues, setValue, watch } = useForm({
        defaultValues: {
            // items: [
            //     {
            //         id: "",
            //         name: `${t('tools:tasks:new:verification-list')} #1`,
            //         subItems: [
            //             { name: "", value: false, empty: true }
            //         ]
            //     }
            // ]
        },
        resolver: yupResolver(schema),
    });
  
    const { fields, append, remove } = useFieldArray({
      control,
      name: "items",
    });

	/*-------------------------------------------------------------*/

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

	const handleChange = (newValue, delta, source, editor) => {
		setArroba(false);
        if (delta && delta.ops && delta.ops.length > 0 && typeof delta.ops[0].insert === 'string') {
			const insertText = delta.ops[0].insert.trim();
			if (insertText === '@') {
				return setArroba(true);
			}
        }
		setValueText(newValue);
	};

	// const addQuote = () => {
	// 	if (quillRef.current) {
	// 		const quillEditor = quillRef.current.getEditor();
	// 		if (isBlockquoteAdded) {
	// 		  quillEditor.formatText(0, 1, 'blockquote', false);
	// 		}else{
	// 			quillEditor.format('blockquote', true);
	// 		}
	// 		setIsBlockquoteAdded((prevState) => !prevState);
	// 	}
	// };
  
	const addUserSelected = (name) => {
		if (quillRef.current) {
		  quillRef.current.editor.updateContents([
			{ insert: name, attributes: { color: "#86BEDF", underline: true } },
			{ insert: " " },
		  ]);
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
			onclick: () => setDropdownVisible(!dropdownVisible),
			disabled: arroba
		},
		// {
		// 	id: 4,
		// 	name: t('tools:tasks:new:appointment'),
		// 	icon: RiDoubleQuotesL,
		// 	onclick: () => addQuote()
		// },
		{
			id: 5,
			name: t('tools:tasks:new:verification-list'),
			onclick: () => {
				fields.length === 0 &&
				append({
					name: `${t('tools:tasks:new:verification-list')} #${fields.length + 1}`,
					subItems: [ { name: "", value: false, empty: true } ]
				});
				setOpenList(!openList)
			},
		},
		{
			id: 6,
			name: t('tools:tasks:new:add-list'),
			onclick: () => {},
			menu: true
		}
	];

	const dropdownUsers = (editor) => (
		<DropdownVisibleUsers 
			mentionButtonRef={editor ? null : mentionButtonRef}
			dataUsers={dataUsers} 
			onChangeCustom={onChangeCustom} 
			setUserSelected={setUserSelected} 
			userSelected={userSelected} 
			setDropdownVisible={editor ? setArroba : setDropdownVisible}
		/>
	)

	return (
		<div className="flex flex-col h-screen relative w-full overflow-y-auto">
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
					<div className="bg-white w-full p-2 rounded-lg mt-2 h-48">
						<TextEditor 
							quillRef={quillRef}
							value={value} 
							onChange={handleChange} 
							className="h-36 w-full"
							onChangeSelection={handleTextSelection}
						/>
					</div>
					{arroba && dropdownUsers(true)}
					<div className="flex justify-start mt-4 gap-3 relative">
						{options.map((opt, index) => (
							<div
								key={index}
								className="flex gap-1 flex-wrap items-center cursor-pointer"
								onClick={opt.onclick}
								ref={opt.id === 3 ? mentionButtonRef : null}
							>
								{!opt.menu ? (
									<button className='flex gap-2 items-center focus:ring-0' disabled={opt.disabled}>
										{opt.icon && <opt.icon className="h-4 w-4 text-black" />}
										<p className="text-sm">{opt.name}</p>
									</button>
								) : (
									<div><AddListSeLectingText text={opt.name} fields={fields} append={append} setValue={setValue} value={selectText} getValues={getValues} watch={watch} setOpenList={setOpenList}/></div>
								)}
							</div>
						))}
						{(dropdownVisible && mentionButtonRef.current) && dropdownUsers()}
					</div>
					{openFiles && <UploadDocuments files={files} deleteFiles={deleteFiles} setFiles={setFiles} />}
					{openList && (
						<CheckList
							handleSubmit={handleSubmit}
							fields={fields}
							append={append}
							remove={remove}
							setValue={setValue}
							watch={watch}
							getValues={getValues}
							control={control}
							register={register}
						/>
					)}
					{/* {openAddList && } */}
				</div>
			</div>
		</div>
	);
}
