'use client';
import LoaderSpinner from '../../../../../../../components/LoaderSpinner';
import IconDropdown from '../../../../../../../components/SettingsButton';
import { useTasks } from '../../../../../../../hooks/useCommon';
import { ArrowUpTrayIcon, AtSymbolIcon, Cog8ToothIcon, FireIcon, PaperClipIcon } from '@heroicons/react/20/solid';
import { ChevronDownIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RiDoubleQuotesL } from 'react-icons/ri';
import CardFile from '../components/CardFile';
import UploadDocuments from '../components/UploadDocuments';
import TextEditor from '../components/TextEditor';
import DropdownVisibleUsers from '../components/DropdownVisibleUsers';
import useAppContext from '../../../../../../../context/app';
import CheckList from '../components/CheckList';
import AddListSeLectingText from '../components/AddListSeLectingText';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import MultipleSelect from '../../../../../../../components/form/MultipleSelect';
import InputDate from '../../../../../../../components/form/InputDate';
import { FaCalendarDays } from 'react-icons/fa6';
import TextInput from '../../../../../../../components/form/TextInput';
import DateTimeCalculator from '../components/DateTimeCalculator';
import CkeckBoxMultiple from '../../../../../../../components/form/CkeckBoxMultiple';
import InputCheckBox from '../../../../../../../components/form/InputCheckBox';
import Button from '../../../../../../../components/form/Button';
import { useRouter } from 'next/navigation';
import OptionsTask from '../components/OptionsTask';
import { useSession } from 'next-auth/react';
import MultiSelectTags from '../components/MultiSelectTags';
import { postTask } from '@/lib/apis';
import { getApiError } from '@/utils/getApiErrors';
import { getFormatDate } from '@/utils/getFormatDate';
import moment from 'moment';
;

export default function TaskCreate() {
	const { data: session } = useSession();
	const { t } = useTranslation();
	const router = useRouter();
    const { lists } = useAppContext();
	const { settings } = useTasks();
	const [ loading, setLoading ] = useState(false);
	const [ check, setCheck ] = useState(false);
	const [ value, setValueText ] = useState('');
	// const [ openFiles, setOpenFiles ] = useState(false);
	// const [ files, setFiles ] = useState([]);
	// const [ value, setValueText ] = useState('');
	// const [ dropdownVisible, setDropdownVisible ] = useState(false);
	// const [ dataUsers, setDataUsers ] = useState();
    // const [ userSelected, setUserSelected ] = useState(null);
	// const [openList, setOpenList] = useState(false);
	// const [selectText, setSelectText] = useState("");
	// const quillRef = useRef(null);
	// const mentionButtonRef = useRef(null);
	// const [arroba, setArroba] = useState(false);
	const [ selectedOptions, setSelectedOptions ] = useState([]);
	const [checkedTime, setCheckedTime] = useState(false);
	const [checkedTask, setCheckedTask] = useState(false);
	const [openOptions, setOpenOptions] = useState({
		created: false,
		participants: false,
		obserbers: false,
		time: false,
		options: false,
		more: false
	})
	// const [isBlockquoteAdded, setIsBlockquoteAdded] = useState(false);

	const optionsTime = [
		{
			id: 1,
			name: t('tools:tasks:new:person-responsible')
		},
		{
			id: 2,
			name: t('tools:tasks:new:review-task')
		},
		{
			id: 3,
			name: t('tools:tasks:new:add-favorites')
		},
		{
			id: 4,
			name: t('tools:tasks:new:add-plan')
		},
	]
	
    // useEffect(() => {
    //     if (userSelected) addUserSelected(userSelected.username);
    // }, [userSelected])

	// const handleTextSelection = (selection, source, editor) => {
	// 	selection && setSelectText(editor.getText(selection.index, selection.length));
	// };

	
	const schemaInputs = yup.object().shape({
		name: yup.string(),
		responsible: yup.array(),
		createdBy: yup.array(),
		participants: yup.array(),
		obserbers: yup.array(),
		limitDate: yup.string(),
		startDate: yup.string(),
		duration: yup.string(),
		endDate: yup.string(),
		crm: yup.array(),
		tags: yup.array(),
	});

	const { 
		register, 
		handleSubmit, 
        formState: { isValid, errors },
		control, 
		getValues, 
		watch,
		reset,
		setValue } = useForm({
        defaultValues: {
        },
        resolver: yupResolver(schemaInputs),
    });

	//FUNCTIONS TO CHECKLIST
	// const schema = yup.object().shape({
	// 	items: yup.array().of(
	// 		yup.object().shape({
	// 			name: yup.string().required(),
	// 			subItems: yup.array().of(
	// 				yup.object().shape({
	// 					name: yup.string().required()
	// 				})
	// 			)
	// 		})
	// 	)
	// });
    
    // const { register, handleSubmit, control, getValues, setValue, watch } = useForm({
    //     defaultValues: {
    //         // items: [
    //         //     {
    //         //         id: "",
    //         //         name: `${t('tools:tasks:new:verification-list')} #1`,
    //         //         subItems: [
    //         //             { name: "", value: false, empty: true }
    //         //         ]
    //         //     }
    //         // ]
    //     },
    //     resolver: yupResolver(schema),
    // });
  
    // const { fields, append, remove } = useFieldArray({
    //   control,
    //   name: "items",
    // });

	/*-------------------------------------------------------------*/

    // useEffect(() => {
    //     if (lists?.users) setDataUsers(lists?.users);
    // }, [lists])

	// const onChangeCustom = (event) => {
    //     const { value } = event.target;
    //     const filterData = lists?.users.filter((user) => {
    //         return user.username.toLowerCase().includes(value.toLowerCase());
    //       });
    //     setDataUsers(filterData); 
	// };

	// const handleChange = (newValue, delta, source, editor) => {
	// 	setArroba(false);
    //     if (delta && delta.ops && delta.ops.length > 0 && typeof delta.ops[0].insert === 'string') {
	// 		const insertText = delta.ops[0].insert.trim();
	// 		if (insertText === '@') {
	// 			return setArroba(true);
	// 		}
    //     }
	// 	setValueText(newValue);
	// };

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
  
	// const addUserSelected = (name) => {
	// 	if (quillRef.current) {
	// 	  quillRef.current.editor.updateContents([
	// 		{ insert: name, attributes: { color: "#86BEDF", underline: true } },
	// 		{ insert: " " },
	// 	  ]);
	// 	}
	// };

	// const deleteFiles = (indexToDelete) => {
	// 	const documents = files.filter((item, index) => index !== indexToDelete);
	// 	setFiles(documents);
	// };

	// const options = [
	// 	{
	// 		id: 1,
	// 		name: t('tools:tasks:new:file'),
	// 		icon: PaperClipIcon,
	// 		onclick: () => setOpenFiles(!openFiles)
	// 	},
	// 	{
	// 		id: 2,
	// 		name: t('tools:tasks:new:document'),
	// 		icon: DocumentTextIcon,
	// 	},
	// 	{
	// 		id: 3,
	// 		name: t('tools:tasks:new:mention'),
	// 		icon: AtSymbolIcon,
	// 		onclick: () => setDropdownVisible(!dropdownVisible),
	// 		disabled: arroba
	// 	},
	// 	// {
	// 	// 	id: 4,
	// 	// 	name: t('tools:tasks:new:appointment'),
	// 	// 	icon: RiDoubleQuotesL,
	// 	// 	onclick: () => addQuote()
	// 	// },
	// 	{
	// 		id: 5,
	// 		name: t('tools:tasks:new:verification-list'),
	// 		onclick: () => {
	// 			fields.length === 0 &&
	// 			append({
	// 				name: `${t('tools:tasks:new:verification-list')} #${fields.length + 1}`,
	// 				subItems: [ { name: "", value: false, empty: true } ]
	// 			});
	// 			setOpenList(!openList)
	// 		},
	// 	},
	// 	{
	// 		id: 6,
	// 		name: t('tools:tasks:new:add-list'),
	// 		onclick: () => {},
	// 		menu: true
	// 	}
	// ];

	// const dropdownUsers = (editor) => (
	// 	<DropdownVisibleUsers 
	// 		mentionButtonRef={editor ? null : mentionButtonRef}
	// 		dataUsers={dataUsers} 
	// 		onChangeCustom={onChangeCustom} 
	// 		setUserSelected={setUserSelected} 
	// 		userSelected={userSelected} 
	// 		setDropdownVisible={editor ? setArroba : setDropdownVisible}
	// 	/>
	// )

	const createTask = async(data) => {
		if (value === "") return toast.error(t('tools:tasks:description'));
		if (data.name === "") return toast.error(t('tools:tasks:name-msg'));
		const body ={
			"name": data.name,
			"description": value,
			"requireRevision": selectedOptions.filter(sel => sel.id === 2).length > 0 ? true :  false,
			"requireSummary": checkedTime,
			"responsibleCanChangeDate": selectedOptions.filter(sel => sel.id === 1).length > 0 ? true :  false,
			// "tagsIds": [],
			"createdById": session.user.user?.id,
			// "participantsIds": [],
			// "observersIds": []
		}
		if (data.obserbers && data.obserbers.length > 0){
			const observersIds = data.obserbers.map(obs => {
				return  obs.id;
			})
			body.observersIds = observersIds || [];
		}
		if ( data.participants && data.participants.length > 0 ){
			const participantsIds = data.participants.map(part => {
				return  part.id;
			})
			body.participantsIds = participantsIds || [];
		}
		if (data.tags && data.tags.length > 0 ){
			const tagsIds = data.tags.map(tag => {
				return  tag.id;
			})
			body.tagsIds = tagsIds || [];
		}
		if (data?.limitDate || data?.endDate) body.deadline = getFormatDate(data?.limitDate) || getFormatDate(data?.endDate);
		console.log("new Date(data?.endDate)", getFormatDate(data?.endDate));
		if (data?.startDate) body.startTime = getFormatDate(data?.startDate);
		// console.log("createTask", data, body, selectedOptions, selectedOptions.filter(sel => sel.id === 1));

		try {
			const task = await postTask(body);
			toast.success(task);
			router.push("/tools/tool/tasks?page=1");
		} catch (error) {
			getApiError(error.message);			
		}
	}

	

	return (
		<div className="flex flex-col h-screen relative w-full overflow-y-auto">
			{loading && <LoaderSpinner />}
			<div className="flex flex-col flex-1 bg-gray-600 opacity-100 shadow-xl text-black rounded-tl-[35px] rounded-bl-[35px] p-2 sm:p-4">
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
						<div className='flex flex-col w-full'>
							<input
								{...register("name")} 
								placeholder={t('tools:tasks:new:description')}
								className="bg-transparent border-none focus:ring-0 w-full placeholder:text-black"
							/>
						</div>
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
					<OptionsTask setValueText={setValueText} value={value}/>
					<div className='mt-6 flex flex-col gap-3'>
						<div className=''>
							<div className='flex gap-2 sm:flex-row flex-col sm:items-center'>
								<p className='text-sm text-left w-full md:w-36'>{t("tools:tasks:new:responsible")}</p>		
								<div className='w-full md:w-[40%]'>						
									<Controller
										name="responsible"
										control={control}
										defaultValue={[]}
										render={({ field }) => (
											<MultipleSelect
												{...field}
												options={lists?.users || []}
												getValues={getValues}
												setValue={setValue}
												name="responsible"
												error={errors.responsible}
											/>
										)}
									/>
								</div>
								<div className='flex gap-2 sm:gap-6 flex-wrap items-center sm:ml-6'>
									<div className='cursor-pointer hover:text-primary hover:border-b hover:border-dashed' onClick={() => setOpenOptions({...openOptions, created: !openOptions.created})}>
										<p className='text-sm'>{t("tools:tasks:new:created-by")}</p>	
									</div>
									<div className='cursor-pointer hover:text-primary hover:border-b hover:border-dashed' onClick={() => setOpenOptions({...openOptions, participants: !openOptions.participants})}>
										<p className='text-sm'>{t("tools:tasks:new:participants")}</p>	
									</div>
									<div className='cursor-pointer hover:text-primary hover:border-b hover:border-dashed' onClick={() => setOpenOptions({...openOptions, obserbers: !openOptions.obserbers})}>
										<p className='text-sm'>{t("tools:tasks:new:obserbers")}</p>	
									</div>
								</div>
							</div>
						</div>
						{openOptions.created && (
							<div className='flex gap-2 sm:flex-row flex-col sm:items-center'>
								<p className='text-sm text-left w-full md:w-36'>{t("tools:tasks:new:created-by")}</p>		
								<div className='w-full md:w-[40%]'>						
									<Controller
										name="createdBy"
										control={control}
										defaultValue={[]}
										render={({ field }) => (
											<MultipleSelect
												{...field}
												options={lists?.users || []}
												getValues={getValues}
												setValue={setValue}
												name="createdBy"
												error={errors.createdBy}
											/>
										)}
									/>
								</div>
							</div>
						)}
						{openOptions.participants && (
							<div className='flex gap-2 sm:flex-row flex-col sm:items-center'>
								<p className='text-sm text-left w-full md:w-36'>{t("tools:tasks:new:participants")}</p>		
								<div className='w-full md:w-[40%]'>						
									<Controller
										name="participants"
										control={control}
										defaultValue={[]}
										render={({ field }) => (
											<MultipleSelect
												{...field}
												options={lists?.users || []}
												getValues={getValues}
												setValue={setValue}
												name="participants"
												error={errors.participants}
											/>
										)}
									/>
								</div>
							</div>
						)}
						{openOptions.obserbers && (
							<div className='flex gap-2 sm:flex-row flex-col sm:items-center'>
								<p className='text-sm text-left w-full md:w-36'>{t("tools:tasks:new:obserbers")}</p>		
								<div className='w-full md:w-[40%]'>						
									<Controller
										name="obserbers"
										control={control}
										defaultValue={[]}
										render={({ field }) => (
											<MultipleSelect
												{...field}
												options={lists?.users || []}
												getValues={getValues}
												setValue={setValue}
												name="obserbers"
												error={errors.obserbers}
											/>
										)}
									/>
								</div>
							</div>
						)}
						<div className=''>
							<div className='flex gap-2 sm:flex-row flex-col sm:items-center'>
								<p className='text-sm text-left w-full md:w-36'>{t("tools:tasks:new:limit-date")}</p>		
								<div className='w-full md:w-[40%]'>				
									<Controller
										render={({ field: { value, onChange, ref, onBlur } }) => {
											return (
												<InputDate
													value={value}
													onChange={onChange}
													onBlur={onBlur}
													icon={<FaCalendarDays className='h-3 w-3 text-primary pr-4'/>}
													time
												/>
											);
										}}
										name="limitDate"
										control={control}
										defaultValue=""
									/>
								</div>
								<div className='flex gap-2 sm:gap-6 flex-wrap items-center sm:ml-6'>
									<div className='cursor-pointer hover:text-primary hover:border-b hover:border-dashed' onClick={() => {setValue("endDate", "");setValue("duration", 0);setValue("startDate", "");setOpenOptions({...openOptions, time: !openOptions.time})}}>
										<p className='text-sm'>{t("tools:tasks:new:time")}</p>	
									</div>
									<div className='cursor-pointer hover:text-primary hover:border-b hover:border-dashed' onClick={() => setOpenOptions({...openOptions, options: !openOptions.options})}>
										<p className='text-sm'>{t("tools:tasks:new:options")}</p>	
									</div>
								</div>
							</div>
						</div>
						{openOptions.time && (
							<DateTimeCalculator
								control={control}
								watch={watch}
								setValue={setValue}
							/>
						)}
						{openOptions.options && (
							<div className='flex gap-2 flex-col w-full mt-4 md:pl-36'>							
								{optionsTime.map((opt, index) => (
									<CkeckBoxMultiple
										key={index}
										item={opt}
										setSelectedCheckbox={setSelectedOptions}
										selectedCheckbox={selectedOptions}
										label={opt.name}
									/>
								))}
							</div>
						)}
						<div>
							<div className='flex gap-2 sm:flex-row flex-col sm:items-center'>
								<p className='text-sm text-left w-full md:w-36'>{t("tools:tasks:new:summary")}</p>		
								<div className='w-full md:w-[40%]'>
									<InputCheckBox
										label={t("tools:tasks:new:status")}
										setChecked={setCheckedTime}
										checked={checkedTime}
									/>	
								</div>
							</div>
						</div>
						<div className='flex gap-2 flex-wrap cursor-pointer mt-4 items-center' onClick={() => setOpenOptions({...openOptions, more: !openOptions.more})}>
							<div>
								<ChevronDownIcon className={`w-4 h-4 ${openOptions.more && "rotate-180"} text-primary`}/>
							</div>
							<div className='flex gap-2 text-sm'>
								<p className='font-medium'>{t("tools:tasks:new:more")}</p>
								<p>({t("tools:tasks:new:tracking")},</p>
								<p>{t("tools:tasks:new:crm")},</p>
								<p>{t("tools:tasks:new:tags")})</p>
							</div>
						</div>
						{openOptions.more && (
							<div className='flex flex-col gap-4'>
								<div className='flex gap-2 sm:flex-row flex-col sm:items-center'>
									<p className='text-sm text-left w-full md:w-36'>{t("tools:tasks:new:tracking")}</p>		
									<div className='w-full md:w-[40%]'>
										<InputCheckBox
											label={t("tools:tasks:new:time-task")}
											setChecked={setCheckedTask}
											checked={checkedTask}
										/>	
									</div>
								</div>
								<div className='flex gap-2 sm:flex-row flex-col sm:items-center'>
									<p className='text-sm text-left w-full md:w-36'>{t("tools:tasks:new:crm")}</p>		
									<div className='w-full md:w-[40%]'>						
										<Controller
											name="crm"
											control={control}
											defaultValue={[]}
											render={({ field }) => (
												<MultipleSelect
													{...field}
													options={lists?.users || []}
													getValues={getValues}
													setValue={setValue}
													name="crm"
													error={errors.crm}
												/>
											)}
										/>
									</div>
								</div>
								<div className='flex gap-2 sm:flex-row flex-col sm:items-center'>
									<p className='text-sm text-left w-full md:w-36'>{t("tools:tasks:new:tags")}</p>		
									<div className='w-full md:w-[40%]'>						
										<Controller
											name="tags"
											control={control}
											defaultValue={[]}
											render={({ field }) => (
												<MultiSelectTags
													{...field}
													getValues={getValues}
													setValue={setValue}
													name="tags"
													error={errors.tags}
												/>
											)}
										/>
									</div>
								</div>
							</div>
						)}

					</div>
				</div>	
				<div className='flex gap-4 flex-wrap mt-4'>
					<Button
						label={t("tools:tasks:new:add-task")}
						buttonStyle="primary"
						className="px-3 py-2 drop-shadow-lg"
						onclick={handleSubmit(createTask)}
					/>
					<Button
						label={t("tools:tasks:new:add-create")}
						buttonStyle="secondary"
						className="px-3 py-2 drop-shadow-lg"
						onclick={() => router.push(`/tools/tool/tasks?page=1`)}
					/>
					<Button
						label={t("common:buttons:cancel")}
						buttonStyle="secondary"
						className="px-3 py-2 drop-shadow-lg"
						onclick={() => router.push(`/tools/tool/tasks?page=1`)}
					/>						
				</div>		
			</div>
		</div>
	);
}
